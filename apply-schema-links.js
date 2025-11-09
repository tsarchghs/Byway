// apps/api/apply-schema-links.js
// Adds cross-plugin reference fields to schema.prisma files per your table.
// Safe + idempotent: skips generated folders, makes timestamped backups, supports DRY_RUN=1.
//
// Usage:
//   node apps/api/apply-schema-links.js
//   DRY_RUN=1 node apps/api/apply-schema-links.js   # preview only
//
// Notes:
// - We only add fields listed below. No Prisma relations across DBs; just string refs.
// - We do NOT modify generated copies (anything under /generated/).
// - We do not change existing field nullability unless ENFORCE_STRICT=1.
// - Backups: schema.prisma.bak-YYYYMMDD-HHMMSS

import fs from 'fs';
import path from 'path';

const DRY_RUN = process.env.DRY_RUN === '1';
const ENFORCE_STRICT = process.env.ENFORCE_STRICT === '1'; // if true, converts String? -> String for Student.userId

// --- Find repo root (folder that contains /plugins) ---
function findPluginsRoot(startDir = process.cwd()) {
  let dir = startDir;
  while (true) {
    const candidate = path.join(dir, 'plugins');
    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
      return candidate;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error('Cannot find /plugins folder by walking up from ' + startDir);
}

// --- Walk files ---
function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

// --- Helpers to read/patch a model block ---
function findModelBlock(content, modelName) {
  const re = new RegExp(`\\bmodel\\s+${modelName}\\s*{`, 'g');
  const match = re.exec(content);
  if (!match) return null;

  const start = match.index;
  // Find the opening brace
  const openIdx = content.indexOf('{', match.index);
  if (openIdx === -1) return null;

  // Walk braces to find block end
  let depth = 0;
  for (let i = openIdx; i < content.length; i++) {
    const ch = content[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        const end = i;
        const before = content.slice(0, start);
        const block = content.slice(start, end + 1);
        const after = content.slice(end + 1);
        return { start, end, openIdx, block, before, after };
      }
    }
  }
  return null;
}

function fieldExists(block, fieldName) {
  // crude but reliable: start-of-line field name, ignoring comments/@@ directives
  const re = new RegExp(`^\\s*${fieldName}\\b`, 'm');
  return re.test(block);
}

function replaceFieldType(block, fieldName, newTypeAndAttrs) {
  // Replace the line that starts with fieldName with a new definition
  const re = new RegExp(`^(\\s*)${fieldName}\\b[^\\n]*$`, 'm');
  return block.replace(re, (_, indent) => `${indent}${fieldName} ${newTypeAndAttrs}`);
}

function insertField(block, fieldLine) {
  // Insert right before the final closing brace, keeping indentation
  const lastBrace = block.lastIndexOf('}');
  if (lastBrace === -1) return block;
  const indent = detectIndent(block);
  const insertion = `\n${indent}${fieldLine}\n`;
  return block.slice(0, lastBrace) + insertion + block.slice(lastBrace);
}

function detectIndent(block) {
  // Try to detect normal field indentation from the first non-empty, non-comment field line
  const lines = block.split('\n');
  for (const line of lines) {
    const m = line.match(/^(\s+)\w+\s+\w/);
    if (m) return m[1];
  }
  return '  '; // default 2 spaces
}

// --- Mod plan from your table ---
/**
 * Each entry is:
 *   plugin: folder name under /plugins
 *   model: Prisma model name
 *   fields: [{ name, type, attrs }]
 *   note: we never create cross-relations; only add raw scalar refs
 */
const MODS = [
  {
    plugin: 'authentication',
    model: 'User',
    fields: [
      { name: 'studentId', type: 'String?', attrs: '' },
      { name: 'teacherProfileId', type: 'String?', attrs: '' },
    ],
  },
  {
    plugin: 'teach',
    model: 'TeacherProfile',
    fields: [{ name: 'userId', type: 'String?', attrs: '' }],
  },
  {
    plugin: 'teach-internal',
    model: 'Course',
    fields: [{ name: 'teacherUserId', type: 'String?', attrs: '' }],
  },
  // Students-internal: ensure userId String @unique exists (often already present)
  {
    plugin: 'students-internal',
    model: 'Student',
    fields: [{ name: 'userId', type: 'String', attrs: '@unique' }],
  },
  // Others in your table are already present (no-op here by design)
];

// --- Core patcher ---
function applyModsToSchema(schemaPath, modsForPlugin) {
  let content = fs.readFileSync(schemaPath, 'utf8');
  let mutated = false;
  const changes = [];

  for (const mod of modsForPlugin) {
    const blockInfo = findModelBlock(content, mod.model);
    if (!blockInfo) {
      changes.push(`⚠️  Model ${mod.model} not found in ${schemaPath} — skipped.`);
      continue;
    }
    let block = blockInfo.block;
    const indent = detectIndent(block);

    for (const f of mod.fields) {
      const desiredLine = `${f.name} ${f.type}${f.attrs ? ' ' + f.attrs : ''}`;

      if (fieldExists(block, f.name)) {
        // Optionally enforce strict type (only for students-internal Student.userId)
        if (
          ENFORCE_STRICT &&
          mod.plugin === 'students-internal' &&
          mod.model === 'Student' &&
          f.name === 'userId'
        ) {
          const desiredTypeAndAttrs = `${f.type}${f.attrs ? ' ' + f.attrs : ''}`;
          const before = block;
          block = replaceFieldType(block, f.name, desiredTypeAndAttrs);
          if (block !== before) {
            mutated = true;
            changes.push(`✳️  Updated ${mod.model}.${f.name} -> ${desiredTypeAndAttrs}`);
          }
        } else {
          changes.push(`✅ ${mod.model}.${f.name} already exists`);
        }
      } else {
        const before = block;
        block = insertField(block, desiredLine);
        if (block !== before) {
          mutated = true;
          changes.push(`➕ Added ${mod.model}.${f.name} (${f.type}${f.attrs ? ' ' + f.attrs : ''})`);
        }
      }
    }

    // Stitch content back
    content = blockInfo.before + block + blockInfo.after;
  }

  if (mutated) {
    const stamp = new Date()
      .toISOString()
      .replace(/[:.]/g, '')
      .replace('T', '-')
      .slice(0, 15);
    const backup = `${schemaPath}.bak-${stamp}`;
    if (!DRY_RUN) {
      fs.copyFileSync(schemaPath, backup);
      fs.writeFileSync(schemaPath, content);
    }
    return { mutated: true, backup, changes };
  }
  return { mutated: false, changes };
}

// --- Main ---
function main() {
  const pluginsRoot = findPluginsRoot();
  const allFiles = walk(pluginsRoot);
  const targetSchemas = allFiles.filter((p) => {
    if (!p.endsWith(`${path.sep}schema.prisma`)) return false;
    if (p.includes(`${path.sep}generated${path.sep}`)) return false; // skip generated
    return true;
  });

  const byPlugin = (p) => {
    // path: /.../plugins/<plugin>/...
    const parts = p.split(path.sep);
    const idx = parts.lastIndexOf('plugins');
    if (idx === -1 || idx + 1 >= parts.length) return null;
    return parts[idx + 1];
  };

  const modsByPlugin = MODS.reduce((acc, m) => {
    acc[m.plugin] = acc[m.plugin] || [];
    acc[m.plugin].push({ model: m.model, fields: m.fields });
    return acc;
  }, {});

  const report = [];
  for (const schemaPath of targetSchemas) {
    const plugin = byPlugin(schemaPath);
    if (!plugin) continue;
    const modsForPlugin = modsByPlugin[plugin];
    if (!modsForPlugin) continue;

    report.push(`\n📄 ${schemaPath} (plugin: ${plugin})`);
    const result = applyModsToSchema(schemaPath, modsForPlugin);
    for (const line of result.changes) report.push('  ' + line);
    if (result.mutated) {
      report.push(DRY_RUN ? '  [DRY-RUN] Not writing changes.' : `  💾 Wrote changes. Backup: ${result.backup}`);
    } else {
      report.push('  No changes needed.');
    }
  }

  const summary = report.join('\n');
  console.log(summary || 'No matching schema.prisma files found or no changes required.');
}

main();
