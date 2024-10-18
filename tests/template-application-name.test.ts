/**
 * Copyright 2024 Defense Unicorns
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial
 */

import { test, expect } from "@playwright/test";

// Customize tests for application being tested. Example given for reference

function randomProjectName() {
  return `uds-package-#TEMPLATE_APPLICATION_NAME#-${Math.floor((Math.random() * 1000))}`;
}

test('create a project', async ({ page }) => {
  await page.goto('/projects/create');

  const projectName = randomProjectName();

  await page.getByRole('button', { name: 'Manually' }).click();
  await page.getByLabel('Project display name*').fill(projectName);
  await page.getByRole('button', { name: 'Set Up' }).click();

  await expect(page).toHaveURL(`/dashboard?id=${projectName}`);

  await expect(page.getByRole('heading', { level: 1 })).toContainText(projectName);
});
