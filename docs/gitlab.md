# GitLab project setup

This template uses repository features and CI/CD syntax available in GitLab 19.2. Project settings and credentials are not stored in the repository, so complete the following setup after creating a project from the template.

## CI/CD components

The pipeline includes the `commitlint`, `lint`, `test`, and `publish` components shipped with UDS Common v1.28.3. GitLab requires CI/CD components to reside on the same GitLab instance as the consuming project. Make UDS Common available at `defenseunicorns/uds/uds-common`, or update each component address in [`.gitlab-ci.yml`](../.gitlab-ci.yml) to match its full project path.

The component version is pinned so changes to UDS Common cannot silently alter existing pipelines. Keep the component version aligned with the UDS Common task versions in [`tasks.yaml`](../tasks.yaml).

Configure runners with these tags, or replace the tags in `.gitlab-ci.yml` with the tags used by your instance:

- `gitlab-runner-4c-amd64` for lint jobs
- `gitlab-runner-8c-amd64` for package tests and publishing
- `gitlab-runner-8c-arm64` for ARM publishing

The runner environment must provide the tools expected by the UDS Common components. Configure protected, masked CI/CD variables for any registries used by the package:

- `GH_USER_READ_ONLY` and `GH_PAT_READ_ONLY`
- `IRON_BANK_ROBOT_USERNAME` and `IRON_BANK_ROBOT_PASSWORD`
- `RAPIDFORT_USERNAME` and `RAPIDFORT_PASSWORD`
- `CHAINGUARD_IDENTITY`

GitLab supplies `CI_REGISTRY_USER` and `CI_REGISTRY_PASSWORD` for its integrated container registry. The publish component is configured to publish there and not trigger the optional GitHub mirror pipeline.

## Merge request controls

Protect the default branch and enable **Require approval from code owners** in its branch rule. GitLab reads the root [`CODEOWNERS`](../CODEOWNERS) file, but does not enforce its approval rules on an unprotected branch.

Issue templates are stored in `.gitlab/issue_templates`. The merge request template is named `.gitlab/merge_request_templates/Default.md`, so GitLab selects it automatically unless a project-level default overrides it. The issue templates use GitLab quick actions to apply labels; create the corresponding labels before use.

## Pipeline behavior

Merge request pipelines run commit title validation, repository linting, install and upgrade tests, and a dry run of publishing. Pipelines on the default branch publish the `upstream` flavor for AMD64 and ARM64. Add matrix entries only for flavors the package actually ships.

UDS Common v1.28.3 does not ship GitLab CI/CD components corresponding to its GitHub scan-comparison and image-digest auto-update workflows. Those jobs are intentionally not reproduced locally because doing so would fork release logic from UDS Common. Renovate continues to manage declared dependency updates through [`renovate.json`](../renovate.json); scan comparison and automatic republish-on-digest-change require a supported GitLab component or a separately maintained integration.

## GitLab references

- [CI/CD components](https://docs.gitlab.com/ci/components/)
- [Merge request pipelines](https://docs.gitlab.com/ci/pipelines/merge_request_pipelines/)
- [Description templates](https://docs.gitlab.com/user/project/description_templates/)
- [Code Owners](https://docs.gitlab.com/user/project/codeowners/)
- [Custom project templates](https://docs.gitlab.com/user/group/custom_project_templates/)
