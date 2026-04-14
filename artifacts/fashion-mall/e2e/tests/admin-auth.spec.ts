import { expect, test } from '@playwright/test';
import { loginAsAdmin, waitForAdminPanel } from '../support/admin';
import { hasAdminCredentials } from '../support/env';

test.describe('Admin E2E - Autenticacao', () => {
  test('login, carregamento, persistencia de sessao e logout', async ({ page }) => {
    test.skip(
      !hasAdminCredentials(),
      'Defina E2E_ADMIN_EMAIL e E2E_ADMIN_PASSWORD para validar login real.',
    );

    await loginAsAdmin(page);
    await waitForAdminPanel(page);

    await page.reload();
    await expect(page).toHaveURL(/\/admin(?:[/?#].*)?$/);
    await waitForAdminPanel(page);

    await page.getByTestId('admin-logout-trigger').click();
    await expect(page).toHaveURL(/\/admin\/login(?:[/?#].*)?$/);
    await expect(page.getByRole('heading', { name: /Login/i })).toBeVisible();
  });
});

