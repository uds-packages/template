# UDS Package Template

After creating a repo from the UDS Package Template, follow this README in order to customize the template for a new application package.

## Find and replace
Some placeholders have been placed throughout the template repo to make it easier to find and replace with values for application name being packaged. For some applications a simple find and replace for these won't make sense in every location, so doublecheck after doing the replace. This will mostly pop up for applications that use a namespace that doesn't match the application name and locations where it is desired to have a capitalized name instead of a lowercase hyphenated name (example: GitLab Runner instead of gitlab-runner)

```
#TEMPLATE_APPLICATION_NAME# - example values: gitlab, sonarqube
#TEMPLATE_APPLICATION_DISPLAY_NAME# - example values: Gitlab, Sonarqube
#TEMPLATE_CHART_REPO# - example value: https://charts.jetstack.io/
```

## Customize Template Files

The following files will need to be customized for the application being packaged and include things like dependencies and application specific helm values. Examples have been included for reference.

| File/Directory | Function | New Package ToDos |
| :------------- | :------- | :--- |
| .github/  | **CICD** pipeline specification | If the package requires any workflow customizations, such as needing specific runners testing other flavors, they can be customized. Else the template values should work fine. |
| adr/ | **DOCS**: Architecture Design Records. | Record any architectural decisions per the format found in this directory. |
| bundle/ | **DEV/TEST**: Test/example UDS bundle used to test the UDS package with UDS core. Should include any required dependencies and configuration needed for a test deployment. | Update fields to match this app's name, version, etc. |
| chart/ | **CONFIG**: Any extra K8s manifests (often things like SSO secrets and network policies) pacakged as a helm chart which need deployed before/after the main application. | Customize UDS configuration chart for application. At a minimum it should include a uds-package that provisions required network policies and any required SSO configuration. |
| common/zarf.yaml | **ZARF PACKAGE**: Root zarf package definition for _this app_ conventionally placed in `common/`. The root-level `zarf.yaml` imports this by explicit reference to this file path. | Customize to include application images, helm chart, variables, version, etc. |
| docs/ | **DOCS**: Package specific documentation such as detailed configuration info that is too indepth to go in the README | Add documentation.|
| src/ | **DEV/TEST**: New/bespoke Zarf packages to support dev/test bundle. These must exist before the main package is deployed, but are not part of it. One use-case is creating the namespace where Minio can deploy secrets _before_ the app that would otherwise create that namespace comes to exist. Other use-cases are databases (probably should be it's own UDS package) and some secrets. | Add custom Zarf packages as necessary. |
| tasks/ | **DEV/TEST**: UDS filename-scoped tasks. | Add tasks as necessary to support your development loop. The templated tasks are often sufficient. |
| tasks/tests.yaml | **DEV/TEST**: UDS tasks defined for testing the package deployed. | Customize based on application resource names and types, playwright tests that need to run, and/or custom resources that the application manages. |
| tests/ | **DEV/TEST**: Test files included are examples only since testing is very application specific and may include UI testing with playwright, testing custom resources being deployed in cluster, or other types of tests not included in the examples. | If application creates resources in cluster based on custom resources (example applications: cert-manager, trust-manager, database operators, etc), then test data can include a zarf package that deploys a custom resource so tests can ensure the application is creating resources as expected `tests/optional-example-zarf-tests/*`.<br/><br/>If application has an exposed web interface to test, then customize these files for playwright to authenticate and test application endpoints. Rename template-application-name to match your application name `tests/template-application-name.test.ts` `tests/auth.setup.ts` |
| .release-please-manifest.json | **ZARF PACKAGE**: Release version info. | Update version in concert with other version records. |
| README.md | **DOCS**: UDS package README. | Replace contents of README.md with README-template.md and customize for application being packaged when done following this README's guidance.
| renovate.json | **CICD**: Custom rules for renovate to update things. | Add any custom package rules if needed for renovate to properly update things such as repo1 packages. Includes an example.
| version.txt | **ZARF PACKAGE**: Text file with UDS package version specification. | Update as the UDS package is updated. |
| zarf.yaml | **ZARF PACKAGE**: top-level Zarf package definition. | Copy from `common/zarf.yaml` the settings you'd like to expose for changes, much like a top-level values.yaml file. Often flavors, images, and variables are also specified primarily here, not in `common/zarf.yaml`. |
