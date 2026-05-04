# UDS Package #TEMPLATE_APPLICATION_DISPLAY_NAME#

This package deploys [#TEMPLATE_APPLICATION_DISPLAY_NAME#](#TEMPLATE_CHART_REPO#) on [UDS Core](https://github.com/defenseunicorns/uds-core).

> 1-2 sentence summary of what the application does.

## Prerequisites

This package expects to be deployed on top of [UDS Core](https://github.com/defenseunicorns/uds-core). Document any additional dependencies (databases, operators, etc.) here.

## Flavors

This package ships an `upstream` flavor by default. Add `registry1` or `unicorn` flavors as needed — see [`zarf.yaml`](./zarf.yaml).

## Releases

Released packages are available in [GHCR](https://github.com/uds-packages/#TEMPLATE_APPLICATION_NAME#/pkgs/container/#TEMPLATE_APPLICATION_NAME#).

## Local development

Requires the [UDS CLI](https://github.com/defenseunicorns/uds-cli?tab=readme-ov-file#install).

```bash
uds run default     # spin up a local k3d cluster, build, and deploy
uds run dev         # iterate on an existing cluster
uds run --list      # show all available tasks
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).
