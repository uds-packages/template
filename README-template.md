# UDS Package #TEMPLATE_APPLICATION_DISPLAY_NAME#

[![Latest Release](https://img.shields.io/github/v/release/defenseunicorns/uds-package-#TEMPLATE_APPLICATION_NAME#)](https://github.com/defenseunicorns/uds-package-#TEMPLATE_APPLICATION_NAME#/releases)
[![Build Status](https://img.shields.io/github/actions/workflow/status/defenseunicorns/uds-package-#TEMPLATE_APPLICATION_NAME#/tag-and-release.yaml)](https://github.com/defenseunicorns/uds-package-#TEMPLATE_APPLICATION_NAME#/actions/workflows/tag-and-release.yaml)

This package is designed to be deployed on [UDS Core](https://github.com/defenseunicorns/uds-core) and is based on the upstream [#TEMPLATE_APPLICATION_DISPLAY_NAME#](#TEMPLATE_CHART_REPO#) chart.

> INSERT HERE 1-2 sentence summary of what the application does.

## Pre-requisites

The #TEMPLATE_APPLICATION_DISPLAY_NAME# Package expects to be deployed on top of [UDS Core](https://github.com/defenseunicorns/uds-core) with the dependencies listed below being configured prior to deployment.

#### Dependency information

Add any dependency information here

## Flavors

| Flavor | Description | Example Creation |
| ------ | ----------- | ---------------- |
| `upstream` | Uses upstream images within the package. | `zarf package create . -f upstream` |
| `registry1` | Uses images from registry1.dso.mil within the package | `zarf package create . -f registry1` |
| `unicorn` | Uses images from chainguard within the package | `zarf package create . -f unicorn` |

## Releases

The released packages can be found in [ghcr](https://github.com/defenseunicorns/uds-package-#TEMPLATE_APPLICATION_NAME#/pkgs/container/packages%2Fuds%2F#TEMPLATE_APPLICATION_NAME#).

## UDS Tasks (for local dev and CI)

*For local dev, this requires you install [uds-cli](https://github.com/defenseunicorns/uds-cli?tab=readme-ov-file#install)

> [!TIP]
> To get a list of tasks to run you can use `uds run --list`!

## Contributing

Please see the [CONTRIBUTING.md](./CONTRIBUTING.md)
