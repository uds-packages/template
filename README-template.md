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

## Local development

Requires [UDS CLI](https://github.com/defenseunicorns/uds-cli?tab=readme-ov-file#install) v0.40.0 or newer.
See the [UDS CLI Next documentation](https://docs.defenseunicorns.com/cli/v0-40/reference/next-mode/) for usage and configuration.

```bash
uds run default     # spin up a local k3d cluster, build, and deploy
uds run dev         # iterate on an existing cluster
uds run --list      # show all available tasks
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).
