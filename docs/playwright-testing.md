# Playwright testing

`uds run test:all` checks health, ingress and UI; `uds run test:ui` runs only UI.
Browser tests default to Docker with Chromium and Firefox.

Use `--set PLAYWRIGHT_BROWSERS=chromium`, `firefox`, or `chromium,firefox` with
either executor. Authentication setup uses the first selected browser.

For direct execution, install the suite's dependencies and matching browsers and
system libraries first. The runner's `PLAYWRIGHT_BROWSERS_PATH` is respected:

```bash
uds run test:ui --set PLAYWRIGHT_EXECUTOR=direct --set PLAYWRIGHT_BROWSERS=chromium
```

Direct mode runs `npx --no-install playwright test` without installing anything.
For Bun, prepare dependencies with Bun and add
`--set 'PLAYWRIGHT_COMMAND=bun run --bun playwright'` (a trusted shell command).
Set `BASE_URL` to the application's URL and customize the authentication tests.

The `@playwright/test` pin in `tests/package.json` also selects the Docker image.
For direct execution, match it to the release that installed the runner's browsers.
Keep `tests/package.json` and `tests/package-lock.json` synchronized; refresh any
Bun lockfile too. Renovate handles npm updates; no additional configuration is needed.
