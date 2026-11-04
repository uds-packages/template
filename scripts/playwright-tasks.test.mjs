// Copyright #TEMPLATE_COPYRIGHT_YEAR# Defense Unicorns
// SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, delimiter, join } from 'node:path';
import { beforeEach, describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));

function createFixture(t) {
  const directory = mkdtempSync(join(tmpdir(), 'playwright-tasks-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  cpSync(join(root, 'tasks'), join(directory, 'tasks'), { recursive: true });
  cpSync(join(root, 'tests'), join(directory, 'tests'), {
    recursive: true,
    filter: (path) => !['node_modules', '.playwright'].includes(basename(path)),
  });
  writeFileSync(join(directory, 'tasks.yaml'), 'includes:\n  - test: ./tasks/test.yaml\n');
  const bin = join(directory, 'bin');
  mkdirSync(bin);
  const log = join(directory, 'commands.jsonl');
  const stub = `#!${process.execPath}
const { appendFileSync } = require('node:fs');
const { basename } = require('node:path');
appendFileSync(process.env.COMMAND_LOG, JSON.stringify({
  command: basename(process.argv[1]), args: process.argv.slice(2),
  browsers: process.env.PLAYWRIGHT_BROWSERS,
  browserPath: process.env.PLAYWRIGHT_BROWSERS_PATH,
  cwd: process.cwd(),
}) + '\\n');
process.exit(Number(process.env.COMMAND_EXIT_CODE ?? 0));
`;
  for (const command of ['docker', 'npm', 'npx', 'local-playwright']) {
    writeFileSync(join(bin, command), stub, { mode: 0o755 });
  }

  return {
    directory,
    run({ settings = {}, exitCode = 0 } = {}) {
      const env = { ...process.env };
      for (const key of Object.keys(env)) {
        if (key.startsWith('PLAYWRIGHT_')) delete env[key];
      }
      Object.assign(env, {
        PATH: bin + delimiter + env.PATH,
        COMMAND_LOG: log,
        COMMAND_EXIT_CODE: String(exitCode),
        PLAYWRIGHT_BROWSERS_PATH: '/installed/browsers',
      });
      const args = ['run', 'test:ui'];
      for (const [key, value] of Object.entries(settings)) args.push('--set', `${key}=${value}`);
      const result = spawnSync('uds', args, { cwd: directory, env, encoding: 'utf8', timeout: 30_000 });
      assert.ifError(result.error);
      assert.equal(result.signal, null, result.stdout + result.stderr);
      const calls = existsSync(log) ? readFileSync(log, 'utf8').trim().split('\n').map(JSON.parse) : [];
      return { ...result, calls };
    },
  };
}

function assertSuccess(result) {
  assert.equal(result.status, 0, result.stdout + result.stderr);
}

describe('Playwright UDS tasks', () => {
  let fixture;
  beforeEach((t) => { fixture = createFixture(t); });

  it('preserves Docker and both browsers by default', () => {
    const result = fixture.run();
    assertSuccess(result);
    assert.equal(result.calls.length, 1);
    const [call] = result.calls;
    const manifest = JSON.parse(readFileSync(join(fixture.directory, 'tests/package.json'), 'utf8'));
    assert.equal(call.command, 'docker');
    assert.ok(call.args.includes(`mcr.microsoft.com/playwright:v${manifest.devDependencies['@playwright/test']}`));
    assert.ok(call.args.includes('--network=host'));
    assert.equal(call.browsers, 'chromium,firefox');
    assert.equal(call.args.at(-1), 'npm ci && npx playwright test');
  });

  it('runs the local CLI without Docker or dependency installation', () => {
    const result = fixture.run({ settings: { PLAYWRIGHT_EXECUTOR: 'direct', PLAYWRIGHT_BROWSERS: 'chromium' } });
    assertSuccess(result);
    assert.deepEqual(result.calls.map((call) => call.command), ['npx']);
    const [call] = result.calls;
    assert.deepEqual(call.args, ['--no-install', 'playwright', 'test']);
    assert.equal(call.browsers, 'chromium');
    assert.equal(call.browserPath, '/installed/browsers');
    assert.equal(call.cwd, join(fixture.directory, 'tests'));
  });

  it('supports a direct command override', () => {
    const result = fixture.run({ settings: { PLAYWRIGHT_EXECUTOR: 'direct', PLAYWRIGHT_COMMAND: 'local-playwright --custom' } });
    assertSuccess(result);
    assert.equal(result.calls[0].command, 'local-playwright');
    assert.deepEqual(result.calls[0].args, ['--custom', 'test']);
  });

  it('derives the Docker image from the committed dependency version', () => {
    const path = join(fixture.directory, 'tests/package.json');
    const manifest = JSON.parse(readFileSync(path, 'utf8'));
    manifest.devDependencies['@playwright/test'] = '1.63.0';
    writeFileSync(path, JSON.stringify(manifest));
    const result = fixture.run();
    assertSuccess(result);
    assert.ok(result.calls[0].args.includes('mcr.microsoft.com/playwright:v1.63.0'));
  });

  it('rejects an unknown executor without running tools', () => {
    const result = fixture.run({ settings: { PLAYWRIGHT_EXECUTOR: 'typo' } });
    assert.notEqual(result.status, 0);
    assert.deepEqual(result.calls, []);
  });

  it('propagates browser command failures for both executors', () => {
    for (const executor of ['docker', 'direct']) {
      const result = fixture.run({ settings: { PLAYWRIGHT_EXECUTOR: executor }, exitCode: 23 });
      assert.notEqual(result.status, 0, executor);
    }
  });
});
