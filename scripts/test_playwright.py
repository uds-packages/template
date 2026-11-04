# Copyright #TEMPLATE_COPYRIGHT_YEAR# Defense Unicorns
# SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial

"""Run with python3 -m unittest discover -s scripts (requires UDS CLI)."""

import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
UDS = shutil.which("uds")


class PlaywrightTasksTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        shutil.copytree(ROOT / "tasks", self.root / "tasks")
        shutil.copytree(ROOT / "tests", self.root / "tests", ignore=shutil.ignore_patterns("node_modules", ".playwright"))
        (self.root / "tasks.yaml").write_text("includes:\n  - test: ./tasks/test.yaml\n")
        self.bin = self.root / "bin"
        self.bin.mkdir()
        self.log = self.root / "commands.jsonl"
        stub = f"""#!{sys.executable}
import json, os, sys
from pathlib import Path
with open(os.environ['COMMAND_LOG'], 'a') as output:
    output.write(json.dumps({{'command': Path(sys.argv[0]).name, 'args': sys.argv[1:],
                             'browsers': os.environ.get('PLAYWRIGHT_BROWSERS'),
                             'version': os.environ.get('PLAYWRIGHT_VERSION'),
                             'browser_path': os.environ.get('PLAYWRIGHT_BROWSERS_PATH'),
                             'cwd': os.getcwd()}}) + '\\n')
sys.exit(int(os.environ.get('COMMAND_EXIT_CODE', '0')))
"""
        for command in ("docker", "npm", "npx", "local-playwright"):
            path = self.bin / command
            path.write_text(stub)
            path.chmod(0o755)

    def run_task(self, name="ui", *, settings=None, exit_code=0):
        env = os.environ.copy()
        for key in tuple(env):
            if key.startswith("PLAYWRIGHT_"):
                del env[key]
        env.update(PATH=str(self.bin) + os.pathsep + env["PATH"], COMMAND_LOG=str(self.log),
                   COMMAND_EXIT_CODE=str(exit_code), PLAYWRIGHT_BROWSERS_PATH="/installed/browsers")
        args = [UDS, "run", f"test:{name}"]
        for key, value in (settings or {}).items():
            args.extend(["--set", f"{key}={value}"])
        result = subprocess.run(args, cwd=self.root, env=env, text=True, capture_output=True, timeout=30)
        calls = [json.loads(line) for line in self.log.read_text().splitlines()] if self.log.exists() else []
        return result, calls

    def assert_success(self, result):
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_defaults_preserve_docker_and_both_browsers(self):
        result, calls = self.run_task()
        self.assert_success(result)
        self.assertEqual(len(calls), 1)
        call = calls[0]
        self.assertEqual(call["command"], "docker")
        version = json.loads((self.root / "tests/package.json").read_text())["devDependencies"]["@playwright/test"]
        self.assertIn(f"mcr.microsoft.com/playwright:v{version}", call["args"])
        self.assertIn("--network=host", call["args"])
        self.assertEqual(call["browsers"], "chromium,firefox")
        self.assertEqual(call["args"][-1], "npm ci && npx playwright test")

    def test_direct_uses_local_cli_without_docker_or_dependency_install(self):
        result, calls = self.run_task(settings={"PLAYWRIGHT_EXECUTOR": "direct", "PLAYWRIGHT_BROWSERS": "chromium"})
        self.assert_success(result)
        self.assertEqual([call["command"] for call in calls], ["npx"])
        self.assertEqual(calls[0]["args"], ["--no-install", "playwright", "test"])
        self.assertEqual(calls[0]["browsers"], "chromium")
        self.assertEqual(calls[0]["browser_path"], "/installed/browsers")
        self.assertEqual(calls[0]["cwd"], str(self.root / "tests"))

    def test_direct_command_override(self):
        result, calls = self.run_task(settings={"PLAYWRIGHT_EXECUTOR": "direct", "PLAYWRIGHT_COMMAND": "local-playwright --custom"})
        self.assert_success(result)
        self.assertEqual(calls[0]["command"], "local-playwright")
        self.assertEqual(calls[0]["args"], ["--custom", "test"])

    def test_docker_uses_the_committed_dependency_version(self):
        manifest = self.root / "tests/package.json"
        package = json.loads(manifest.read_text())
        package["devDependencies"]["@playwright/test"] = "1.63.0"
        manifest.write_text(json.dumps(package))
        result, calls = self.run_task()
        self.assert_success(result)
        self.assertIn("mcr.microsoft.com/playwright:v1.63.0", calls[0]["args"])

    def test_configure_updates_the_pinned_dependency_and_lockfile(self):
        result, calls = self.run_task("configure", settings={"PLAYWRIGHT_EXECUTOR": "direct", "PLAYWRIGHT_VERSION": "1.63.0"})
        self.assert_success(result)
        self.assertEqual(calls[0]["command"], "npm")
        self.assertEqual(calls[0]["args"], ["install", "--package-lock-only", "--ignore-scripts", "--save-dev", "--save-exact", "@playwright/test@1.63.0"])

    def test_configure_can_use_docker_without_host_npm(self):
        result, calls = self.run_task("configure", settings={"PLAYWRIGHT_VERSION": "1.63.0"})
        self.assert_success(result)
        self.assertEqual([call["command"] for call in calls], ["docker"])
        self.assertIn("PLAYWRIGHT_VERSION", calls[0]["args"])
        self.assertEqual(calls[0]["version"], "1.63.0")

    def test_configure_requires_an_explicit_version(self):
        result, calls = self.run_task("configure")
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(calls, [])

    def test_invalid_executor_fails_without_running_tools(self):
        result, calls = self.run_task(settings={"PLAYWRIGHT_EXECUTOR": "typo"})
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(calls, [])

    def test_browser_failure_propagates(self):
        for executor in ("docker", "direct"):
            with self.subTest(executor=executor):
                result, _ = self.run_task(settings={"PLAYWRIGHT_EXECUTOR": executor}, exit_code=23)
                self.assertNotEqual(result.returncode, 0)


if __name__ == "__main__":
    unittest.main()
