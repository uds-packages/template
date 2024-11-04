# uds-package-metallb

Zarf package containing a standalone version of [MetalLB](https://metallb.org/) to act as a standalone load-balancer or be a pre-req to UDS Core.

## Prerequisites

- Zarf is installed locally with a minimum version of [v0.27.1](https://github.com/defenseunicorns/zarf/releases/tag/v0.27.1)
- (Optional): A working Kubernetes cluster on v1.26+ -- e.g k3d, k3s, KinD, etc. (Zarf can be used to deploy a built-in k3s distribution)
- Working kube context (kubectl get nodes <-- this command works)
- Zarf State and Registry initialized and operational in your cluster (Git is not required by this package)
- No other Service LoadBalancer implementations are installed in the cluster (e.g. K3s's ServiceLB, another MetalLB, etc)

## Using

### Deploy

| value                                 | replace_with                | example                                                |
| ------------------------------------- | --------------------------- | ------------------------------------------------------ |
| `metallb`         | application name            | nginx, mattermost, cert-manager, etc...                |
| `MetalLB` | application name for humans | NGINX, Mattermost Cert Manager, etc...                 |
| `https://metallb.github.io/metallb`               | chart repository URL        | `https://charts.jetstack.io/`                          |
| `#UDS_PACKAGE_REPO#`                  | package repository URL      | `https://github.com/defenseunicorns/uds-package-nginx` |

```shell
$ ip addr
1: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 12:34:56:78:90:ab brd ff:ff:ff:ff:ff:ff
    inet 10.0.0.10/24 brd 10.0.0.255 scope global noprefixroute
       valid_lft forever preferred_lft forever
    inet6 1234::5678:90ab:cdef:1234/64 scope link noprefixroute 
       valid_lft forever preferred_lft forever
```

Then deploy the package specifying the ingress IP addresses that you would like to use:

```shell
$ zarf package deploy oci://ghcr.io/defenseunicorns/packages/metallb:<version> \
    --set IP_ADDRESS_POOL=10.0.0.32/27 \
    --confirm
```

Or, in the case of using this package in concert with UDS Core:

```shell
$ zarf package deploy oci://ghcr.io/defenseunicorns/packages/metallb:<version> \
    --set IP_ADDRESS_ADMIN_INGRESSGATEWAY=10.0.0.32 \
    --set IP_ADDRESS_TENANT_INGRESSGATEWAY=10.0.0.33 \
    --set IP_ADDRESS_PASSTHROUGH_INGRESSGATEWAY=10.0.0.34 \
    --confirm
```

> Notes:
>   - The IP addresses used here are placeholders. You can use whatever values you want that work for your environment.
>   - Package versions can be found [here](https://github.com/defenseunicorns/uds-package-metallb/pkgs/container/packages%2Fmetallb)
>   - If you also want a 4th default IPAddressPool you can additionally set the `IP_ADDRESS_POOL` variable too. It should be an IP range, not a single address unlike the other variables which are single address. Ranges can be specified in either CIDR notation or "StartAddress-EndAddress" notation.

## Contributing

### Create Package

Create this package by cloning down the repo and running the following in the root of the repo:

```shell
$ zarf package create .
```

### Commit Messages

Because we use the [release-please](https://github.com/googleapis/release-please) bot, commit messages to main must follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. This is only a requirement for the `main` branch. Commit messages in PRs can be whatever you want them to be. "Squash" mode must be used when merging a PR, with a commit message that follows the Conventional Commits specification.

### Release Process

This repo uses the [release-please](https://github.com/googleapis/release-please) bot. Release-please will automatically open a PR to update the version of the repo when a commit is merged to `main` that follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. The bot will automatically keep the PR up to date until a human merges it. When that happens the bot will automatically create a new release.

## Known Issues

This package is meant as a simple way to get MetalLB working for smaller clusters and doesn't support many of the more advanced options that MetalLB has.
