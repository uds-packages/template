#!/usr/bin/env bash
# Copyright #TEMPLATE_COPYRIGHT_YEAR# Defense Unicorns
# SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial
set -euo pipefail

# Run from tests/ through the ui task in tasks/test.yaml.
case "$PLAYWRIGHT_EXECUTOR" in
  docker)
    # The dependency is the single version pin for both executors.
    version=$(uds zarf tools yq -r '.devDependencies."@playwright/test"' package.json)
    exec docker run --rm \
      --network=host \
      --shm-size=1g \
      --security-opt seccomp=unconfined \
      --user "$(id -u):$(id -g)" \
      -e HOME=/tmp \
      -e NPM_CONFIG_CACHE=/tmp/.npm \
      -e PLAYWRIGHT_BROWSERS \
      -e BASE_URL \
      -v "$(pwd)":/app -w /app \
      "mcr.microsoft.com/playwright:v$version" \
      bash -lc 'npm ci && npx playwright test'
    ;;
  direct)
    # This is an explicitly configured shell command, e.g. a Bun launcher.
    # Dependencies and matching browsers must already be installed.
    exec bash -c "$PLAYWRIGHT_COMMAND \"\$@\"" -- test
    ;;
  *)
    echo "PLAYWRIGHT_EXECUTOR must be docker or direct: $PLAYWRIGHT_EXECUTOR" >&2
    exit 1
    ;;
esac
