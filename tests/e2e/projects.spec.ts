import { expect, test } from '@playwright/test';
import { testPassword } from '../helpers.js';
async function signIn(page: import('@playwright/test').Page) {
  await page.goto('/admin/login');
  await page.getByLabel('Username').fill('owner'); await page.getByLabel('Password').fill(testPassword);
  await page.getByRole('button', { name: 'Sign in' }).click();
}
test('creates a project and reopens its private detail after refreshing', async ({ page }) => {
  await signIn(page);
  await page.goto('/admin/projects');
  await expect(page.getByText('No projects yet')).toBeVisible();
  await page.getByRole('link', { name: 'New project' }).click();
  await page.getByLabel('Title').fill('Community calendar');
  await page.getByLabel('Description').fill('A calendar for local events.');
  await page.getByLabel('Technologies').fill('TypeScript\nSQLite\nTypeScript');
  await page.getByLabel('Code link (optional)').fill('https://example.com/calendar');
  await page.getByRole('button', { name: 'Create project' }).click();
  await expect(page.getByRole('heading', { name: 'Community calendar' })).toBeVisible();
  await expect(page.getByText('TypeScript', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'View code' })).toHaveAttribute('href', 'https://example.com/calendar');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Community calendar' })).toBeVisible();
  await page.getByRole('link', { name: 'Back to projects' }).click();
  await expect(page.getByRole('link', { name: 'Community calendar' })).toBeVisible();
  await page.screenshot({ path: 'test-results/projects-admin.png', fullPage: true });
});
test('shows useful validation errors and keeps the submitted title', async ({ page }) => {
  await signIn(page); await page.goto('/admin/projects/new');
  await page.getByLabel('Title').fill(''); await page.getByLabel('Description').fill('An example description.');
  await page.getByLabel('Technologies').fill('TypeScript');
  await page.getByLabel('Code link (optional)').fill('javascript:alert(1)');
  await page.getByRole('button', { name: 'Create project' }).click();
  await expect(page.getByText('Title is required.')).toBeVisible();
  await expect(page.getByText('Enter an absolute HTTP or HTTPS link.')).toBeVisible();
  await expect(page.getByLabel('Title')).toHaveValue('');
  await expect(page.getByLabel('Title')).toBeFocused();
});
test('can create projects without client JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false }); const page = await context.newPage();
  await page.setViewportSize({ width: 1280, height: 1600 });
  await signIn(page); await page.goto('/admin/projects/new');
  await page.getByLabel('Title').fill('Static form'); await page.getByLabel('Description').fill('Works without scripting.');
  await page.getByLabel('Technologies').fill('TypeScript');
  await page.getByRole('button', { name: 'Create project' }).click();
  await expect(page.getByRole('heading', { name: 'Static form' })).toBeVisible();
  await context.close();
});

test('project form, list, and detail fit mobile and desktop widths', async ({ page }) => {
  await signIn(page);
  await page.setViewportSize({ width: 390, height: 844 });
  const expectNoHorizontalOverflow = async () => {
    const dimensions = await page.evaluate(() => ({
      page: document.documentElement.scrollWidth,
      viewport: document.documentElement.clientWidth,
    }));
    expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport);
  };

  await page.goto('/admin/projects/new');
  await expectNoHorizontalOverflow();
  await page.getByLabel('Title').fill('Responsive project');
  await page.getByLabel('Description').fill('A project shown on mobile and desktop.');
  await page.getByLabel('Technologies').fill('TypeScript');
  await page.getByRole('button', { name: 'Create project' }).click();
  await expectNoHorizontalOverflow();
  await page.setViewportSize({ width: 1280, height: 900 });
  await expectNoHorizontalOverflow();
  await page.goto('/admin/projects');
  await expectNoHorizontalOverflow();
});

test('project form fields and actions are reachable with the keyboard', async ({ page }) => {
  await signIn(page);
  await page.goto('/admin/projects/new');
  const title = page.getByLabel('Title');
  await title.focus();
  await expect(title).toBeFocused();
  await expect(title).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Description')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Technologies')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Code link (optional)')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Demo link (optional)')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Cancel' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Create project' })).toBeFocused();
});
