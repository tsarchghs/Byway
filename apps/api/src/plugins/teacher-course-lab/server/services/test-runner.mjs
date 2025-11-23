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
    const parsed = JSON.parse(str);
    return parsed;
  } catch (err) {
    log('❌ JSON parse failed:', err.message, 'INPUT:', str.slice(0, 200));
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

  log('🔧 Query built:', pairs.join('&'));
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
    result = result.replace(new RegExp(`:${key}\\b`, 'g'), encodeURIComponent(String(value)));
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), encodeURIComponent(String(value)));
  }
  log('🔧 Path interpolated:', result);
  return result;
}

/**
 * Utility: Convert KV to object
 */
function kvToObject(list) {
  if (!list || !list.length) return {};
  const obj = {};
  for (const { key, value } of list) {
    if (key && key.trim()) {
      obj[key] = String(value || '');
    }
  }
  log('🔧 Headers object created:', obj);
  return obj;
}

/**
 * Utility: JSON subset match with logging
 */
function jsonSubsetMatch(actual, expected, path = '') {
  if (expected == null) return true;

  if (typeof expected !== 'object' || expected === null) {
    const ok = actual === expected;
    if (!ok) {
      log(`❌ JSON mismatch at "${path}": expected "${expected}", got "${actual}"`);
    }
    return ok;
  }

  if (typeof actual !== 'object' || actual === null) {
    log(`❌ JSON mismatch at "${path}": actual is not an object`);
    return false;
  }

  for (const key of Object.keys(expected)) {
    const fullPath = path ? `${path}.${key}` : key;
    if (!(key in actual)) {
      log(`❌ JSON missing key "${fullPath}"`);
      return false;
    }
    if (!jsonSubsetMatch(actual[key], expected[key], fullPath)) return false;
  }
  return true;
}

/**
 * Run API test with full logging
 */
async function runApiTest(test, baseUrl) {
  log('────────────────────────────────────────');
  log('▶ Running API test:', test.name || test.id);

  const pathParams = test.pathParams || [];
  const query = test.query || [];
  const headers = test.headers || [];
  const auth = test.auth || { type: 'none' };

  const path = interpolatePath(test.path || '/', pathParams);
  const queryStr = buildQuery(query);
  const url = `${baseUrl}${path}${queryStr}`;

  log('🌐 REQUEST URL:', url);

  const headersObj = kvToObject(headers);
  if (auth.type === 'bearer') {
    log('🔑 Bearer token detected');
    headersObj['Authorization'] = `Bearer ${auth.token}`;
  }

  let body = undefined;
  const bodyJson = test.bodyJson || test.body;
  if (bodyJson && bodyJson.trim()) {
    const parsed = safeJsonParse(bodyJson);
    if (parsed !== undefined) {
      body = JSON.stringify(parsed);
      headersObj['Content-Type'] = headersObj['Content-Type'] || 'application/json';
      log('📦 JSON Body:', parsed);
    } else {
      body = bodyJson;
      headersObj['Content-Type'] = headersObj['Content-Type'] || 'text/plain';
      log('📦 Raw Body:', bodyJson);
    }
  }

  const expectedStatus = Number(test.expectedStatus || 200);
  const expectJson = test.expectJsonStr ? safeJsonParse(test.expectJsonStr) : test.expectJson;
  const expectText = (test.expectTextLine || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  const expectMode = test.expectMode || 'json-subset';

  log('🧪 Expected status:', expectedStatus);
  log('🧪 Expected mode:', expectMode);
  log('🧪 Expected JSON:', expectJson);
  log('🧪 Expected text:', expectText);

  try {
    log('📡 Sending request…');
    const start = Date.now();

    const response = await fetch(url, {
      method: (test.method || 'GET').toUpperCase(),
      headers: headersObj,
      body,
      credentials: 'omit'
    });

    const duration = Date.now() - start;
    const status = response.status;

    log(`📥 Response received in ${duration}ms → Status ${status}`);

    const text = await response.text();

    log('📄 Raw response body preview:', text.slice(0, 200));

    let passed = status === expectedStatus;
    if (!passed) {
      log(`❌ Status mismatch: expected ${expectedStatus}, got ${status}`);
    }

    if (passed) {
      if (expectMode === 'contains-text') {
        for (const snippet of expectText) {
          if (!text.includes(snippet)) {
            log(`❌ Text not found in response: "${snippet}"`);
            passed = false;
          }
        }
      } else {
        let json;
        try {
          json = JSON.parse(text);
        } catch (err) {
          log('❌ Failed to parse JSON:', err.message);
          passed = false;
        }

        if (json) {
          if (expectMode === 'exact-json') {
            const same = JSON.stringify(json) === JSON.stringify(expectJson || {});
            if (!same) log('❌ exact-json mismatch', { json });
            passed = same;
          } else if (!jsonSubsetMatch(json, expectJson || {})) {
            log('❌ json-subset mismatch', { json });
            passed = false;
          }
        }
      }
    }

    log(`🏁 Test completed: ${passed ? '✅ PASS' : '❌ FAIL'}`);

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
    log('💥 Network error:', err.message);
    return {
      id: test.id,
      name: test.name,
      passed: false,
      error: err.message
    };
  }
}

/**
 * UI Test with logging
 */
async function runUiTest(test, baseUrl) {
  log('────────────────────────────────────────');
  log('▶ Running UI test:', test.name || test.id);

  const url = `${baseUrl}${test.path || '/'}`;
  const expectText = (test.expectTextLine || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  log('🌐 UI Request URL:', url);
  log('🧪 Expected UI text snippets:', expectText);

  try {
    const start = Date.now();
    const response = await fetch(url, { method: 'GET', credentials: 'omit' });
    const duration = Date.now() - start;

    log(`📥 UI Response received in ${duration}ms → Status ${response.status}`);

    if (!response.ok) {
      log('❌ UI request failed:', response.status);
      return {
        id: test.id,
        name: test.name,
        passed: false,
        status: response.status,
        error: `HTTP ${response.status}`
      };
    }

    const html = await response.text();
    log('📄 UI HTML preview:', html.slice(0, 200));

    let passed = expectText.every(snippet => html.includes(snippet));

    log(`🏁 UI test finished: ${passed ? '✅ PASS' : '❌ FAIL'}`);

    return {
      id: test.id,
      name: test.name,
      passed,
      status: response.status,
      bodyPreview: html.slice(0, 200),
      error: passed ? undefined : 'Expected text snippets not found in HTML'
    };
  } catch (err) {
    log('💥 UI Network error:', err.message);
    return {
      id: test.id,
      name: test.name,
      passed: false,
      error: err.message
    };
  }
}

/**
 * Main test runner
 */
export async function runLabTests(labMeta, baseUrl) {
  log('========================================');
  log('🏁 runLabTests()', { kind: labMeta?.kind, baseUrl });

  const results = [];
  const kind = labMeta.kind;

  if (kind === 'BACKEND_NODE') {
    const apiTests = labMeta.apiTests || [];
    log(`📦 Total API tests: ${apiTests.length}`);

    for (const test of apiTests) {
      const r = await runApiTest(test, baseUrl);
      results.push(r);
    }
  } else if (kind === 'FRONTEND_NUXT') {
    const uiTests = labMeta.uiTests || [];
    log(`📦 Total UI tests: ${uiTests.length}`);

    for (const test of uiTests) {
      const r = await runUiTest(test, baseUrl);
      results.push(r);
    }
  }

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;

  log('========================================');
  log(`🧮 FINAL SUMMARY: ${passed}/${total} passed (${failed} failed)`);

  return {
    passed: failed === 0,
    results,
    summary: { total, passed, failed, skipped: 0 }
  };
}

/**
 * Resolve base URL
 */
export function resolveLabBaseUrl(labMeta, sessionMeta) {
  const appUrl = sessionMeta?.appUrl;
  const traefikHost = sessionMeta?.traefikHostApp || sessionMeta?.traefikHost || labMeta.traefikHost;
  const devPort = sessionMeta?.appPort || labMeta.devPort || 3000;

  if (appUrl) {
    log('🔍 Using session appUrl:', appUrl);
    return appUrl;
  }

  if (traefikHost) {
    log('🔍 Using traefikHost:', traefikHost);
    return `http://${traefikHost}`;
  }

  const final = `http://localhost:${devPort}`;
  log('🔍 Using fallback base URL:', final);
  return final;
}
