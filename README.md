# UDS Package Template

A starting point for creating a new [UDS Package](https://docs.defenseunicorns.com/core/concepts/configuration-and-packaging/package-requirements/) on [UDS Core](https://github.com/defenseunicorns/uds-core).

> [!TIP]
> Found an issue with the template or want to contribute? See [Contributing](#contributing).

## Creating a package from this template

The canonical guide for turning this scaffolding into a working package is [Create a UDS Package](https://docs.defenseunicorns.com/core/how-to-guides/packaging-applications/create-uds-package/). It walks through the placeholder substitution, Zarf and chart configuration, the `Package` CR, and the dev/test bundle.

After working through that guide, finish the template-specific cleanup below.

## Template cleanup checklist

These items are specific to this template repo and aren't covered in the canonical doc:

- [ ] Remove the `ci-setup` task from [`tasks.yaml`](./tasks.yaml). It exists only so this template's own CI can validate the scaffolding using podinfo. To remove:
  - Delete the `ci-setup` task block, including the two `#### Template CI: Remove ... ####` comment markers that wrap it.
  - Delete the `- task: ci-setup` line under the `test-install` task.
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

This template repository is part of Defense Unicorns' Unicorn Delivery Service and follows the contributing guidelines in [`uds-common/CONTRIBUTING.md`](https://github.com/defenseunicorns/uds-common/blob/main/CONTRIBUTING.md).

[Open an issue](https://github.com/uds-packages/template/issues/new/choose) for defects or feature requests.
