# UDS Package #TEMPLATE_APPLICATION_DISPLAY_NAME#

This package deploys [#TEMPLATE_APPLICATION_DISPLAY_NAME#](#TEMPLATE_CHART_REPO#) on [UDS Core](https://github.com/defenseunicorns/uds-core).

> 1-2 sentence summary of what the application does.

## Prerequisites

This package expects to be deployed on top of [UDS Core](https://github.com/defenseunicorns/uds-core). Document any additional dependencies (databases, operators, etc.) here.

## Flavors

This package ships an `upstream` flavor by default. Add `registry1` or `unicorn` flavors as needed — see [`zarf.yaml`](./zarf.yaml).

## Configuration

See [configuration](./docs/configuration.md) for Zarf package values, defaults, and deploy-time overrides.

## Releases

Released packages are available in [GHCR](https://github.com/uds-packages/#TEMPLATE_APPLICATION_NAME#/pkgs/container/#TEMPLATE_APPLICATION_NAME#).

### Verify a Package

Packages are signed using [Zarf's Keyless Signing](https://docs.zarf.dev/ref/package-signing/#using-keyless-signing).

To verify a package, follow the below example:

```bash
uds zarf package verify "oci://ghcr.io/uds-packages/#TEMPLATE_APPLICATION_NAME#:0.1.0-uds.0-upstream" \
  --certificate-identity "https://github.com/uds-packages/#TEMPLATE_APPLICATION_NAME#/.github/workflows/release.yaml@refs/heads/main" \
  --certificate-oidc-issuer "https://token.actions.githubusercontent.com"
```

For a `unicorn` package, use `oci://ghcr.io/uds-packages/private/#TEMPLATE_APPLICATION_NAME#:<VERSION>-unicorn`
as the package source.

## Local development

Requires [UDS CLI](https://github.com/defenseunicorns/uds-cli?tab=readme-ov-file#install) v0.40.0 or newer.
See the [UDS CLI Next documentation](https://docs.defenseunicorns.com/cli/v0-40/reference/next-mode/) for usage and configuration.

```bash
uds run default     # spin up a local k3d cluster, build, and deploy
uds run dev         # iterate on an existing cluster
uds run --list      # show all available tasks
```

## Tests

Run `uds run test:all` to check health, ingress, and browser behavior. Browser tests
default to Docker with Chromium and Firefox. See [Playwright testing](./docs/playwright-testing.md) for
runner, browser, and Playwright version configuration.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).
