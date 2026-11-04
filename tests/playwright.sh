#!/usr/bin/env bash
# Copyright #TEMPLATE_COPYRIGHT_YEAR# Defense Unicorns
# SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial
set -euo pipefail

# Run from tests/ through the tasks in tasks/test.yaml.
case "$1" in
  test)
    command='npm ci && npx playwright test'
    ;;
  configure)
    : "${PLAYWRIGHT_VERSION:?Set PLAYWRIGHT_VERSION to the version to pin}"
    # Expanded by the executor's shell, including inside Docker.
    # shellcheck disable=SC2016
    command='npm install --package-lock-only --ignore-scripts --save-dev --save-exact "@playwright/test@$PLAYWRIGHT_VERSION"'
    ;;
  *)
    echo "Unknown Playwright action: $1" >&2
    exit 1
    ;;
esac

case "$PLAYWRIGHT_EXECUTOR" in
  docker)
    # The dependency is the single version pin for both executors. During
    # configuration, use the current image's npm to prepare the new lockfile.
    version=$(uds zarf tools yq -r '.devDependencies."@playwright/test"' package.json)
    exec docker run --rm \
      --network=host \
      --shm-size=1g \
      --security-opt seccomp=unconfined \
      --user "$(id -u):$(id -g)" \
      -e HOME=/tmp \
      -e NPM_CONFIG_CACHE=/tmp/.npm \
      -e PLAYWRIGHT_BROWSERS \
      -e PLAYWRIGHT_VERSION \
      -e BASE_URL \
      -v "$(pwd)":/app -w /app \
      "mcr.microsoft.com/playwright:v$version" \
      bash -lc "$command"
    ;;
  direct)
    if [ "$1" = test ]; then
      # This is an explicitly configured shell command, e.g. a Bun launcher.
      # Dependencies and matching browsers must already be installed.
      exec bash -c "$PLAYWRIGHT_COMMAND \"\$@\"" -- test
    fi
    exec bash -c "$command"
    ;;
  *)
    echo "PLAYWRIGHT_EXECUTOR must be docker or direct: $PLAYWRIGHT_EXECUTOR" >&2
    exit 1
    ;;
esac
