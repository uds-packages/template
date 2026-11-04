# Copyright #TEMPLATE_COPYRIGHT_YEAR# Defense Unicorns
# SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial

"""Check project selection with the installed suite: npm ci in tests/ first."""

import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest


TESTS = Path(__file__).resolve().parents[1] / "tests"


class PlaywrightConfigTest(unittest.TestCase):
    def list_projects(self, browsers=None):
        env = os.environ.copy()
        env.pop("PLAYWRIGHT_BROWSERS", None)
        if browsers is not None:
            env["PLAYWRIGHT_BROWSERS"] = browsers
        with tempfile.TemporaryDirectory() as directory:
            reporter = Path(directory) / "projects.cjs"
            reporter.write_text("""
module.exports = class {
  onBegin(config) {
    console.log(JSON.stringify(config.projects.map(({name, dependencies, use}) => ({
      name, dependencies, browser: use.browserName ?? use.defaultBrowserType ?? 'chromium',
    }))));
  }
};
""")
            return subprocess.run(
                ["node", "node_modules/@playwright/test/cli.js", "test", "--list", f"--reporter={reporter}"],
                cwd=TESTS, env=env, capture_output=True, text=True, timeout=30,
            )

    def assert_projects(self, browsers, expected):
        result = self.list_projects(browsers)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        report = json.loads(result.stdout)
        self.assertEqual([project["name"] for project in report], ["setup", *expected])
        self.assertEqual(report[0]["browser"], expected[0])
        # The browser projects must retain their authentication dependency.
        for project in report[1:]:
            self.assertEqual(project["dependencies"], ["setup"])

    def test_defaults(self):
        self.assert_projects(None, ["chromium", "firefox"])

    def test_chromium_only(self):
        self.assert_projects("chromium", ["chromium"])

    def test_setup_uses_first_selected_browser(self):
        for browser in ("firefox", "webkit"):
            with self.subTest(browser=browser):
                self.assert_projects(browser, [browser])

    def test_setup_resolves_the_selected_playwright_fixture(self):
        # Resolve Playwright's real browserName fixture without downloading or
        # launching a browser, or contacting the template application's ingress.
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            config = root / "playwright.config.ts"
            config.write_text(
                f"import config from {json.dumps(str(TESTS / 'playwright.config.ts'))};\n"
                f"export default {{...config, testDir: {json.dumps(directory)}}};\n"
            )
            (root / "auth.setup.ts").write_text(
                f"import {{test, expect}} from {json.dumps(str(TESTS / 'node_modules/@playwright/test'))};\n"
                "test('selected setup browser', async ({browserName}) => {\n"
                "  expect(browserName).toBe(process.env.PLAYWRIGHT_BROWSERS);\n"
                "});\n"
            )
            for browser in ("firefox", "webkit"):
                with self.subTest(browser=browser):
                    result = subprocess.run(
                        ["node", "node_modules/@playwright/test/cli.js", "test", f"--config={config}",
                         "--project=setup", "--reporter=list", f"--output={root / 'output'}"],
                        cwd=TESTS, env={**os.environ, "PLAYWRIGHT_BROWSERS": browser},
                        capture_output=True, text=True, timeout=30,
                    )
                    self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_other_browsers_and_whitespace(self):
        self.assert_projects(" firefox, webkit ", ["firefox", "webkit"])

    def test_invalid_or_empty_selection_fails(self):
        for browsers in ("", "typo", "chromium,"):
            with self.subTest(browsers=browsers):
                result = self.list_projects(browsers)
                self.assertNotEqual(result.returncode, 0)
                self.assertIn("Unknown PLAYWRIGHT_BROWSERS entry", result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
