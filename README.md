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

```
# Customize to include application images, helm chart, variables, version, etc
zarf.yaml
common/zarf.yaml

# Customize UDS configuration chart for application. At a minimum it should include a uds-package that provisions required network policies and any required SSO configutation
chart/*

# UDS Package values files for common and different flavors
values/*

# Dependencies needed for testing the deployment of the UDS package that should be created before the package is deployed but aren't apart of the package itself. Examples: namespace, secrets, databases, etc
src/*

# Test files included are examples only since testing is very application specific and may include UI testing with playwright, testing custom resources being deployed in cluster, or other types of tests not included in the examples

# If application creates resources in cluster based on custom resources (example applications: cert-manager, trust-manager, database operators, etc), then test data can include a zarf package that deploys a custom resource so tests can ensure the application is creating resources as expected
tests/optional-example-zarf-tests/*

# If application has an exposed web interface to test, then customize these files for playwright to authenticate and test application endpoints. Rename template-application-name to match your application name
tests/template-application-name.test.ts
tests/auth.setup.ts

# Test/example UDS bundle used to test the UDS package with UDS core. Should include any required dependencies and configuration needed for a test deployment
bundle/*

# UDS tasks defined for testing the package deployed. Customize based on application resource names and types, playwright tests that need to run, and/or custom resources that the application manages
tasks/test.yaml

# Package specific documentation such as detailed configuration info that is too indepth to go in the README
docs/*

# If the package requires any workflow customizations such as using specific runners they can be customized or if it has extra or missing flavors from the template that need added or removed, otherwise the values from the template should work fine.
.github/*

# Update the version files with a version that matches the application version. For example if you are creating a package for myApp version 1.2.3 then the version in these files should be updated to 1.2.3-uds.0 for the initial package release
.release-please-manifest.json
version.txt
zarf.yaml
bundle/uds-bundle.yaml

# Add any custom package rules if needed for renovate to properly update things such as repo1 packages. Includes an example
renovate.json

# Replace contents of README.md with README-template.md and customize for application being packaged
README.md
```
