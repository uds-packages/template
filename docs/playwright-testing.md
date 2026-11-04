# Playwright testing

## Browser tests

`uds run test:all` checks health and ingress, then runs the browser suite. By
default, browser tests run in Docker with Chromium and Firefox.

Select browsers with `--set PLAYWRIGHT_BROWSERS=...` and a comma-separated list of
`chromium`, `firefox`, and `webkit`. This works with either executor. Omitting the
setting uses the default in `tests/playwright.config.ts`:

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
Docker image tag as well. Renovate updates the dependency and lockfile together;
no additional configuration step is needed after a bump. To choose a version
manually, use the ordinary dependency update:

```bash
npm install --prefix tests --save-dev --save-exact @playwright/test@1.63.0
```

Commit the updated `tests/package.json` and `tests/package-lock.json`; Docker and
CI require the npm lockfile to match the dependency. If you maintain a Bun lockfile,
refresh and commit it too. For direct execution, match the dependency pin to the
Playwright release that installed your runner's browsers.

The same executor and browser settings work with `uds run test:all`, preserving
its health, ingress, and authentication checks. Configure `BASE_URL` and customize
the tests for your application's routing and authentication before running them.

## Contributor checks

With Node.js 20 or later and the UDS CLI installed, prepare the locked test
dependencies with `npm ci --prefix tests`, then run `node --test scripts/*.test.mjs`.
These checks use Node's built-in test runner, execute real UDS tasks with recording
substitutes for Docker and npm, and invoke Playwright as a subprocess to check its
configuration and fixtures without launching browsers or requiring a cluster.
