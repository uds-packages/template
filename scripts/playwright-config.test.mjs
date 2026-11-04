// Copyright #TEMPLATE_COPYRIGHT_YEAR# Defense Unicorns
// SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { it } from 'node:test';
import { fileURLToPath } from 'node:url';

const tests = fileURLToPath(new URL('../tests/', import.meta.url));

function temporaryDirectory(t) {
  const directory = mkdtempSync(join(tmpdir(), 'playwright-config-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  return directory;
}

function runPlaywright(args, browsers) {
  const env = { ...process.env };
  delete env.PLAYWRIGHT_BROWSERS;
  if (browsers !== undefined) env.PLAYWRIGHT_BROWSERS = browsers;
  const result = spawnSync(process.execPath, ['node_modules/@playwright/test/cli.js', 'test', ...args], {
    cwd: tests, env, encoding: 'utf8', timeout: 30_000,
  });
  assert.ifError(result.error);
  assert.equal(result.signal, null, result.stdout + result.stderr);
  return result;
}

function listProjects(t, browsers) {
  const reporter = join(temporaryDirectory(t), 'projects.cjs');
  writeFileSync(reporter, `
module.exports = class {
  onBegin(config) {
    console.log(JSON.stringify(config.projects.map(({ name, dependencies, use }) => ({
      name, dependencies, browser: use.browserName ?? use.defaultBrowserType ?? 'chromium',
    }))));
  }
};
`);
  return runPlaywright(['--list', `--reporter=${reporter}`], browsers);
}

function assertProjects(t, browsers, expected) {
  const result = listProjects(t, browsers);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const projects = JSON.parse(result.stdout);
  assert.deepEqual(projects.map((project) => project.name), ['setup', ...expected]);
  assert.equal(projects[0].browser, expected[0]);
  for (const project of projects.slice(1)) assert.deepEqual(project.dependencies, ['setup']);
}

it('defaults to Chromium and Firefox with authentication setup', (t) => {
  assertProjects(t, undefined, ['chromium', 'firefox']);
});

it('selects Chromium alone', (t) => {
  assertProjects(t, 'chromium', ['chromium']);
});

it('uses the first selected browser for setup', (t) => {
  for (const browser of ['firefox', 'webkit']) assertProjects(t, browser, [browser]);
});

it('resolves the selected browser through the real Playwright fixture', (t) => {
  // Exercise browserName without launching browsers or contacting app ingress.
  const directory = temporaryDirectory(t);
  const config = join(directory, 'playwright.config.ts');
  writeFileSync(config,
    `import config from ${JSON.stringify(join(tests, 'playwright.config.ts'))};\n` +
    `export default {...config, testDir: ${JSON.stringify(directory)}};\n`);
  writeFileSync(join(directory, 'auth.setup.ts'),
    `import {test, expect} from ${JSON.stringify(join(tests, 'node_modules/@playwright/test'))};\n` +
    `test('selected setup browser', async ({browserName}) => {\n` +
    `  expect(browserName).toBe(process.env.PLAYWRIGHT_BROWSERS);\n` +
    `});\n`);
  for (const browser of ['firefox', 'webkit']) {
    const result = runPlaywright([
      `--config=${config}`, '--project=setup', '--reporter=list', `--output=${join(directory, 'output')}`,
    ], browser);
    assert.equal(result.status, 0, result.stdout + result.stderr);
  }
});

it('supports other browsers and surrounding whitespace', (t) => {
  assertProjects(t, ' firefox, webkit ', ['firefox', 'webkit']);
});

it('rejects invalid or empty browser selections', (t) => {
  for (const browsers of ['', 'typo', 'chromium,']) {
    const result = listProjects(t, browsers);
    assert.notEqual(result.status, 0, browsers);
    assert.match(result.stdout + result.stderr, /Unknown PLAYWRIGHT_BROWSERS entry/);
  }
});
