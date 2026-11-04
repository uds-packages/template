# Configuration

#TEMPLATE_APPLICATION_DISPLAY_NAME# supports deploy-time configuration through Zarf package values.
Application chart settings and UDS integration settings use separate top-level keys:

| Key | Configures | Package default |
| --- | --- | --- |
| `#TEMPLATE_APPLICATION_NAME#` | [Application Helm chart](#TEMPLATE_CHART_REPO#) | `{}`, preserving chart and flavor defaults |
| `uds-#TEMPLATE_APPLICATION_NAME#-config` | UDS integration chart | `{}`, preserving chart defaults |

The UDS integration chart exposes `additionalNetworkAllow`, which defaults to `[]`. It appends
rules to the required `Package.spec.network.allow` entries. An override list replaces the previous
custom list while preserving the required rules.

Save overrides in a deployment-specific file. For example:

```yaml
# deployment-values.yaml
"#TEMPLATE_APPLICATION_NAME#": {}
"uds-#TEMPLATE_APPLICATION_NAME#-config":
  additionalNetworkAllow:
    - direction: Egress
      remoteNamespace: dependency-namespace
      remoteSelector:
        app: dependency
      port: 5432
```

Replace the example network rule with the traffic your deployment needs. Put supported application
chart overrides under `#TEMPLATE_APPLICATION_NAME#`.

Deploy with the archive you received, replacing `<package-archive>` with its path:

```bash
zarf package deploy <package-archive> --values deployment-values.yaml --features values=true
```

Keys omitted from the override file retain the packaged defaults. The generated
`zarf-values.schema.json` defines accepted values and types. Image references, security settings,
and other paths listed in the package's `excludePaths` remain controlled by the package.

For a [UDS CLI Next bundle](https://docs.defenseunicorns.com/cli/v0-40/reference/next/bundle-uds-hcl/),
reference the same override file through the package's `values_files` attribute.

## Additional Configuration Info Follows
