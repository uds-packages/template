# UDS Package Template

A starting point for creating a new [UDS Package](https://docs.defenseunicorns.com/core/concepts/configuration-and-packaging/package-requirements/) on [UDS Core](https://github.com/defenseunicorns/uds-core).

> [!TIP]
> Found an issue with the template or want to contribute? See [Contributing](#contributing).

## Creating a package from this template

The canonical guide for turning this scaffolding into a working package is [Create a UDS Package](https://docs.defenseunicorns.com/core/how-to-guides/packaging-applications/create-uds-package/). It walks through the placeholder substitution, Zarf and chart configuration, the `Package` CR, and the dev/test bundle.

After working through that guide, finish the template-specific cleanup below.

The [dev/test bundle](./bundle/bundle.uds.hcl).
Use UDS CLI v0.40.0 or newer. The tasks enable Next through `NEXT_MODE=true`.

## Template cleanup checklist

These items are specific to this template repo and aren't covered in the canonical doc:

- [ ] Replace `#TEMPLATE_COPYRIGHT_YEAR#` throughout the package with the current UTC year (`date -u +%Y`) if your scaffolding tool has not already filled it in.
- [ ] Replace the application placeholders in `bundle/*.hcl` along with the YAML and other template files.
- [ ] Rename `bundle/values/application.yaml` to `bundle/values/<application-name>.yaml`. Update `values_files` in `bundle/bundle.uds.hcl` and any remaining references in `tasks.yaml`. If Go templating in the renamed file causes YAML lint errors, add its path to the `ignore` list in `.yamllint`.
- [ ] Review `excludePaths` in [`common/zarf.yaml`](./common/zarf.yaml) against the chosen application chart. Protect chart-specific image references, pull secrets, security settings, CRD installation, and settings controlled by UDS integration.
- [ ] Generate and review `zarf-values.schema.json` after selecting the chart and replacing placeholders. The bootstrap schema intentionally rejects package values until generation. Run `uds run lint:values-generate --with flavor=upstream`, then `uds run lint:values-check --with flavor=upstream`. Repeat for any additional flavors and review differences before publishing.
- [ ] Customize [`docs/configuration.md`](./docs/configuration.md) with supported application settings and deployment examples.
- [ ] Remove the `ci-setup` and `ci-test-values` tasks from [`tasks.yaml`](./tasks.yaml). They exist only so this template's own CI can validate the scaffolding using podinfo. To remove:
  - Delete the block between the two `#### Template CI: Remove ... ####` comment markers, including the markers.
  - Delete the `- task: ci-setup` call under `test-install` and the `- task: ci-test-values` calls under `test-install` and `test-upgrade`.
- [ ] `mv README-template.md README.md` and customize for your package.
- [ ] Update `CODEOWNERS` following the guidance in `CODEOWNERS-template.md`, then `rm CODEOWNERS-template.md`.
- [ ] If your application has a UI, rename `tests/template-application-name.test.ts` to `tests/<app-name>.test.ts` and customize it for your app. If your application has no UI, delete `tests/template-application-name.test.ts`, `tests/auth.setup.ts`, and the `ui` task in [`tasks/test.yaml`](./tasks/test.yaml).
- [ ] When ready to publish your first release, uncomment [`releaser.yaml`](./releaser.yaml) and set the version. Add `registry1` / `unicorn` entries if you've added those flavors.

## Engineers external to Defense Unicorns

These files are specific to Defense Unicorns infrastructure and may not apply to your situation:

- `releaser.yaml`
- `renovate.json`
- `.github/workflows` — the workflows are reusable, but runners, tokens, and secrets need to be updated to match your environment.

## Contributing

> [!NOTE]
> As a template repository, the [CONTRIBUTING.md](./CONTRIBUTING.md) file is part of the *template* — not the contributing guidelines for this repository itself.

This template repository is part of Defense Unicorns' Unified Defense Stack and follows the contributing guidelines in [`uds-common/CONTRIBUTING.md`](https://github.com/defenseunicorns/uds-common/blob/main/CONTRIBUTING.md).

[Open an issue](https://github.com/uds-packages/template/issues/new/choose) for defects or feature requests.
