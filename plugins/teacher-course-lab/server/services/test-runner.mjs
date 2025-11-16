import { exec as _exec } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(_exec);

function log(...args) {
  console.log(`[TCLab:TestRunner][${new Date().toISOString()}]`, ...args);
}

/**
 * Utility: Safe JSON parse
 */
function safeJsonParse(str) {
  if (!str || !str.trim()) return undefined;
  try {
    return JSON.parse(str);
  } catch {
    return undefined;
  }
}

/**
 * Utility: Build query string from KV array
 */
function buildQuery(list) {
  if (!list || !list.length) return '';
  const pairs = list
    .filter(({ key }) => key && key.trim())
    .map(({ key, value }) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value || ''))}`);
  return pairs.length ? `?${pairs.join('&')}` : '';
}

/**
 * Utility: Interpolate path with path params
 */
function interpolatePath(path, params) {
  if (!params || !params.length) return path;
  let result = path;
  for (const { key, value } of params) {
    if (!key) continue;
    // Support :key and {key} syntax
    result = result.replace(new RegExp(`:${key}\\b`, 'g'), encodeURIComponent(String(value)));
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), encodeURIComponent(String(value)));
  }
  return result;
}

/**
 * Utility: Convert KV array to object
 */
function kvToObject(list) {
  if (!list || !list.length) return {};
  const obj = {};
  for (const { key, value } of list) {
    if (key && key.trim()) {
      obj[key] = String(value || '');
    }
  }
  return obj;
}

/**
 * Utility: JSON subset matching (checks if actual contains all keys from expected)
 */
function jsonSubsetMatch(actual, expected) {
  if (expected == null) return true;
  if (typeof expected !== 'object' || expected === null) {
    return actual === expected;
  }
  if (typeof actual !== 'object' || actual === null) return false;
  
  for (const key of Object.keys(expected)) {
    if (!(key in actual)) return false;
    if (!jsonSubsetMatch(actual[key], expected[key])) return false;
  }
  return true;
}

/**
 * Run a single API test
 */
async function runApiTest(test, baseUrl) {
  log('Running API test:', test.name || test.id);

  // Ensure arrays exist
  const pathParams = test.pathParams || [];
  const query = test.query || [];
  const headers = test.headers || [];
  const auth = test.auth || { type: 'none' };

  // Build URL
  const path = interpolatePath(test.path || '/', pathParams);
  const queryStr = buildQuery(query);
  const url = `${baseUrl}${path}${queryStr}`;

  // Build headers
  const headersObj = kvToObject(headers);
  if (auth.type === 'bearer' && auth.token) {
    headersObj['Authorization'] = `Bearer ${auth.token}`;
  }

  // Build body
  let body = undefined;
  const bodyJson = test.bodyJson || test.body;
  if (bodyJson && bodyJson.trim()) {
    const parsed = safeJsonParse(bodyJson);
    if (parsed !== undefined) {
      body = JSON.stringify(parsed);
      headersObj['Content-Type'] = headersObj['Content-Type'] || 'application/json';
    } else {
      body = bodyJson;
      headersObj['Content-Type'] = headersObj['Content-Type'] || 'text/plain';
    }
  }

  // Expected values
  const expectedStatus = Number(test.expectedStatus || 200);
  const expectText = (test.expectTextLine || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  const expectJson = test.expectJsonStr && test.expectJsonStr.trim()
    ? safeJsonParse(test.expectJsonStr)
    : (test.expectJson || undefined);
  const expectMode = test.expectMode || 'json-subset';

  // Make request
  try {
    const response = await fetch(url, {
      method: (test.method || 'GET').toUpperCase(),
      headers: headersObj,
      body,
      credentials: 'omit'
    });

    const status = response.status;
    const text = await response.text();
    let passed = status === expectedStatus;

    if (passed) {
      if (expectMode === 'contains-text' && expectText.length > 0) {
        passed = expectText.every(snippet => text.includes(snippet));
      } else if (expectMode === 'exact-json' || expectMode === 'json-subset') {
        try {
          const json = JSON.parse(text);
          if (expectMode === 'exact-json') {
            passed = JSON.stringify(json) === JSON.stringify(expectJson || {});
          } else {
            passed = jsonSubsetMatch(json, expectJson || {});
          }
        } catch {
          passed = false;
        }
      }
    }

    return {
      id: test.id,
      name: test.name,
      passed,
      status,
      expectedStatus,
      bodyPreview: text.slice(0, 200),
      error: passed ? undefined : `Expected ${expectedStatus}, got ${status}; or expectations not met`
    };
  } catch (err) {
    return {
      id: test.id,
      name: test.name,
      passed: false,
      error: err.message || 'Network error / CORS blocked'
    };
  }
}

/**
 * Run a single UI test (for Nuxt/Frontend labs)
 */
async function runUiTest(test, baseUrl) {
  log('Running UI test:', test.name || test.id);

  const path = test.path || '/';
  const url = `${baseUrl}${path}`;
  const expectText = (test.expectTextLine || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  try {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'omit'
    });

    if (!response.ok) {
      return {
        id: test.id,
        name: test.name,
        passed: false,
        status: response.status,
        error: `HTTP ${response.status}`
      };
    }

    const html = await response.text();
    const passed = expectText.length === 0 || expectText.every(snippet => html.includes(snippet));

    return {
      id: test.id,
      name: test.name,
      passed,
      status: response.status,
      bodyPreview: html.slice(0, 200),
      error: passed ? undefined : 'Expected text snippets not found in HTML'
    };
  } catch (err) {
    return {
      id: test.id,
      name: test.name,
      passed: false,
      error: err.message || 'Network error'
    };
  }
}

/**
 * Run all tests for a lab
 * 
 * @param {object} labMeta - Lab metadata from lesson.metadata.lab
 * @param {string} baseUrl - Base URL where the lab is running (e.g., http://localhost:3000)
 * @returns {Promise<{passed: boolean, results: Array, summary: object}>}
 */
export async function runLabTests(labMeta, baseUrl) {
  log('runLabTests()', { kind: labMeta?.kind, baseUrl });

  if (!labMeta || !labMeta.kind) {
    throw new Error('Lab metadata missing or invalid');
  }

  const results = [];
  const kind = labMeta.kind;

  if (kind === 'BACKEND_NODE') {
    const apiTests = labMeta.apiTests || [];
    log(`Running ${apiTests.length} API tests...`);

    for (const test of apiTests) {
      const result = await runApiTest(test, baseUrl);
      results.push(result);
      log(`Test ${test.name}: ${result.passed ? '✅ PASS' : '❌ FAIL'}`);
    }
  } else if (kind === 'FRONTEND_NUXT') {
    const uiTests = labMeta.uiTests || [];
    log(`Running ${uiTests.length} UI tests...`);

    for (const test of uiTests) {
      const result = await runUiTest(test, baseUrl);
      results.push(result);
      log(`Test ${test.name}: ${result.passed ? '✅ PASS' : '❌ FAIL'}`);
    }
  } else {
    throw new Error(`Unsupported lab kind: ${kind}`);
  }

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;

  const summary = {
    total,
    passed,
    failed,
    skipped: 0
  };

  log(`Test summary: ${passed}/${total} passed`);

  return {
    passed: failed === 0,
    results,
    summary
  };
}

/**
 * Resolve the base URL for a lab session
 * Priority: traefikHost > http://localhost:devPort
 */
export function resolveLabBaseUrl(labMeta, sessionMeta) {
  const traefikHost = labMeta.traefikHost || sessionMeta?.traefikHost;
  const devPort = labMeta.devPort || 3000;

  if (traefikHost && traefikHost.trim()) {
    return `http://${traefikHost.trim()}`;
  }

  return `http://localhost:${devPort}`;
}

