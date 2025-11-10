// scripts/nexus-namespace-fix.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPO_ROOT = path.resolve(__dirname, '..'); // scripts/* -> repo root
const PLUGINS_DIRS = [
  process.env.BLOGGRS_PLUGINS_DIR,
  path.join(REPO_ROOT, 'plugins'),
  path.join(REPO_ROOT, '..', 'plugins'),
].filter(Boolean).filter(p => fs.existsSync(p));

const PREFIX = process.env.GQL_PREFIX || 'Gql';
const DRY = process.env.DRY_RUN === '1' ? true : false;

/** Simple recursive dir walk returning files that match filter */
function walk(dir, filterFn) {
  /** @type {string[]} */
  const out = [];
  (function rec(d) {
    let ents;
    try { ents = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const ent of ents) {
      const p = path.join(d, ent.name);
      if (ent.isDirectory()) rec(p);
      else if (filterFn(p)) out.push(p);
    }
  })(dir);
  return out;
}

/** Read file safe */
function readFile(p) { try { return fs.readFileSync(p, 'utf8'); } catch { return null; } }

/** Write with .bak backup */
function writeWithBackup(p, content) {
  const bak = p + '.bak';
  try {
    if (!fs.existsSync(bak)) fs.writeFileSync(bak, fs.readFileSync(p));
  } catch {}
  fs.writeFileSync(p, content, 'utf8');
}

/** Extract Prisma model names from schema.prisma (quick & robust enough for typical schemas) */
function prismaModelsFromSchema(schemaText) {
  /** Matches lines like: model User { */
  const re = /^\s*model\s+([A-Za-z_][A-Za-z0-9_]*)\s*\{/gm;
  const set = new Set();
  let m;
  while ((m = re.exec(schemaText)) !== null) set.add(m[1]);
  return set;
}

/** Attempt to find models for a plugin (from schema.prisma) */
function collectModelsForPlugin(pluginDir) {
  // typical locations
  const candidates = walk(pluginDir, (p) =>
    /server[\/\\]db[\/\\].*schema\.prisma$/.test(p)
  );

  const models = new Set();
  for (const s of candidates) {
    const txt = readFile(s);
    if (!txt) continue;
    for (const m of prismaModelsFromSchema(txt)) models.add(m);
  }
  return models;
}

/** Regex helpers (string literals of bare identifiers) */
const ID = `([A-Za-z_][A-Za-z0-9_]*)`;
const SQUOTE = `'([^'\\n\\r]+)'`;
const DQUOTE = `"([^"\\n\\r]+)"`;
const QSTR = `(?:${SQUOTE}|${DQUOTE})`; // either 'X' or "X"

/** Replace function with capture */
function replaceAll(text, re, replacer) {
  return text.replace(re, (...args) => replacer(...args));
}

/** Build all replacement steps for a set of Prisma model names */
function buildRewriters(models, prefix) {
  // Skip already-prefixed models
  const shouldPrefix = (name) => !(name.startsWith(prefix));

  // 1) Change GraphQL type declarations: objectType / interfaceType / enumType / inputObjectType / unionType
  // Example: objectType({ name: 'User', ... })
  const declKinds = ['objectType', 'interfaceType', 'enumType', 'inputObjectType', 'unionType'];
  const declRes = declKinds.map(kind =>
    new RegExp(`${kind}\\s*\\(\\s*\\{[^}]*?\\bname\\s*:\\s*(${QSTR})`, 'gms')
  );

  // 2) References: type: 'User'
  const refTypeRe = new RegExp(`\\btype\\s*:\\s*(${QSTR})`, 'g');

  // 3) extendType({ type: 'User' })
  const extendTypeRe = new RegExp(`\\bextendType\\s*\\(\\s*\\{[^}]*?\\btype\\s*:\\s*(${QSTR})`, 'gms');

  // 4) union members: unionType({ name: 'X', definition(t){ t.members('A','B', "C") }})
  // We’ll be conservative: rewrite inside t.members('A', "B" ...) strings
  const unionMembersRe = new RegExp(`\\bt\\.members\\s*\\(([^)]*)\\)`, 'gms');

  // Model lookup
  const isModel = (name) => models.has(name);

  return {
    rewrite(content, filePath, summary) {
      let changed = false;

      function swapName(strLiteral) {
        // strLiteral matches either 'X' or "X" — extract value:
        const raw = strLiteral.trim();
        const q = raw[0];
        const val = raw.slice(1, -1);
        if (isModel(val) && shouldPrefix(val)) {
          return `${q}${prefix}${val}${q}`;
        }
        return strLiteral; // unchanged
      }

      // 1) Declarations
      for (const re of declRes) {
        content = replaceAll(content, re, (match, captured) => {
          const before = captured;
          const after = swapName(before);
          if (before !== after) {
            changed = true;
            summary.declarations.push({ before: before, after: after, file: filePath });
            return match.replace(before, after);
          }
          return match;
        });
      }

      // 2) type: 'User'
      content = replaceAll(content, refTypeRe, (match, captured) => {
        const before = captured;
        const after = swapName(before);
        if (before !== after) {
          changed = true;
          summary.references.push({ before: before, after: after, file: filePath, kind: 'type:' });
          return match.replace(before, after);
        }
        return match;
      });

      // 3) extendType({ type: 'User' })
      content = replaceAll(content, extendTypeRe, (match, captured) => {
        const before = captured;
        const after = swapName(before);
        if (before !== after) {
          changed = true;
          summary.references.push({ before: before, after: after, file: filePath, kind: 'extendType.type' });
          return match.replace(before, after);
        }
        return match;
      });

      // 4) t.members('A', "B")
      content = replaceAll(content, unionMembersRe, (match, argsChunk) => {
        // rewrite any string tokens inside the args list
        const strTokenRe = new RegExp(QSTR, 'g');
        let newChunk = argsChunk.replace(strTokenRe, (s) => swapName(s));
        if (newChunk !== argsChunk) {
          changed = true;
          summary.references.push({ before: `members(${argsChunk})`, after: `members(${newChunk})`, file: filePath, kind: 't.members' });
          return match.replace(argsChunk, newChunk);
        }
        return match;
      });

      return { content, changed };
    }
  };
}

/** Main */
(async function main() {
  if (PLUGINS_DIRS.length === 0) {
    console.error('❌ No plugins directory found.');
    process.exit(1);
  }

  /** Gather plugin roots */
  /** @type {string[]} */
  const pluginRoots = [];
  for (const root of PLUGINS_DIRS) {
    const entries = fs.readdirSync(root, { withFileTypes: true })
      .filter(e => e.isDirectory())
      .map(e => path.join(root, e.name));
    pluginRoots.push(...entries);
  }

  const overall = {
    plugins: [],
    filesTouched: 0,
    declarations: 0,
    references: 0,
  };

  for (const plugin of pluginRoots) {
    const serverDir = path.join(plugin, 'server');
    if (!fs.existsSync(serverDir)) continue;

    // collect Prisma models for this plugin
    const models = collectModelsForPlugin(plugin);
    if (models.size === 0) continue;

    // candidate source files to rewrite
    const files = walk(serverDir, (p) =>
      /(\/|\\)(nexus|graphql)(\/|\\).*\.(ts|js|mjs|cjs)$/.test(p)
    );

    if (files.length === 0) continue;

    const summary = { plugin, declarations: [], references: [], changedFiles: [] };
    const { rewrite } = buildRewriters(models, PREFIX);

    for (const f of files) {
      const before = readFile(f);
      if (before == null) continue;
      const { content, changed } = rewrite(before, f, summary);
      if (changed) {
        overall.filesTouched++;
        if (!DRY) writeWithBackup(f, content);
        summary.changedFiles.push(f);
      }
    }

    overall.declarations += summary.declarations.length;
    overall.references += summary.references.length;
    if (summary.changedFiles.length) overall.plugins.push(summary);
  }

  // REPORT
  console.log(`\n🏁 Nexus GraphQL Namespacing (prefix="${PREFIX}") ${DRY ? '[DRY-RUN]' : ''}`);
  if (overall.plugins.length === 0) {
    console.log('Nothing to change. ✅');
    return;
  }

  for (const s of overall.plugins) {
    console.log(`\n— Plugin: ${s.plugin}`);
    if (s.changedFiles.length) {
      console.log(`   ✍️  Changed files (${s.changedFiles.length}):`);
      for (const f of s.changedFiles) console.log(`      - ${f}`);
    }
    if (s.declarations.length) {
      console.log(`   🧱 Renamed declarations (${s.declarations.length}):`);
      for (const d of s.declarations) {
        console.log(`      - ${path.relative(process.cwd(), d.file)} : ${d.before} → ${d.after}`);
      }
    }
    if (s.references.length) {
      console.log(`   🔁 Updated references (${s.references.length}):`);
      for (const r of s.references) {
        console.log(`      - ${path.relative(process.cwd(), r.file)} [${r.kind}] : ${r.before} → ${r.after}`);
      }
    }
  }

  console.log(`\n✅ Done. Files touched: ${overall.filesTouched}. Decls: ${overall.declarations}, Refs: ${overall.references}.`);
  if (!DRY) console.log('🛟 Backups written as *.bak next to each modified file.');
})();
