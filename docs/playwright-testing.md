# Playwright testing

## Browser tests

`uds run test:all` checks health and ingress, then runs the browser suite. By
default, browser tests run in Docker with Chromium and Firefox.

Select browsers with a comma-separated list of `chromium`, `firefox`, and `webkit`:

```bash
uds run test:ui --set PLAYWRIGHT_BROWSERS=chromium
```

To use an installed Playwright instead of Docker, prepare the dependencies in
`tests/` with `npm ci`, and install the matching browsers and system dependencies
if your runner does not already provide them. Then run:

```bash
uds run test:ui --set PLAYWRIGHT_EXECUTOR=direct --set PLAYWRIGHT_BROWSERS=chromium
```

Direct mode runs `npx --no-install playwright test` from `tests/`. It does not
install dependencies or download browsers, and preserves `PLAYWRIGHT_BROWSERS_PATH`
and other runner environment settings. To use another installed launcher, set
`PLAYWRIGHT_COMMAND`, for example `--set 'PLAYWRIGHT_COMMAND=bun run --bun playwright'`
after preparing the suite's dependencies with Bun. This setting is a trusted shell
command and applies only to direct mode. Both executors use the same test files,
authentication setup, and selected browser projects. Authentication setup uses
the first selected browser, so a single-browser runner needs only that browser.

The exact `@playwright/test` dependency in `tests/package.json` determines the
Docker image tag as well. To change it, update the dependency and npm lockfile
together:

```bash
uds run test:configure --set PLAYWRIGHT_VERSION=1.63.0
```

This uses the current Docker image's npm without requiring npm on the host. Use
`--set PLAYWRIGHT_EXECUTOR=direct` to configure with host npm instead. Commit the
updated `tests/package.json` and `tests/package-lock.json`; if you maintain a Bun
lockfile, refresh and commit that too. `PLAYWRIGHT_VERSION` is used only by this
configuration task, not as a runtime dependency override. For direct execution,
match this pin to the Playwright release that installed your runner's browsers.
Scaffolding tools can run the configuration task with the runner's version after
copying the template.

The same executor and browser settings work with `uds run test:all`, preserving
its health, ingress, and authentication checks. Configure `BASE_URL` and customize
the tests for your application's routing and authentication before running them.

## Contributor checks

To check the task launcher without Docker or a cluster, run
`python3 -m unittest discover -s scripts -v` with Python 3 and the UDS CLI installed.
The tests execute real UDS tasks with recording substitutes for Docker and npm.
With `npm ci` completed in `tests/`, also run
`python3 -m unittest discover -s scripts -p 'check_*.py' -v` to check the real
Playwright project configuration without launching browsers.
