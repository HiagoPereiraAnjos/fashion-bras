import { expect, test } from '@playwright/test';
import { loginAsAdmin } from '../support/admin';
import { e2eEnv, hasAdminCredentials } from '../support/env';

test.describe('Admin E2E - Reset', () => {
  test('abrir modal de reset all e cancelar com seguranca', async ({ page }) => {
    test.skip(
      !hasAdminCredentials(),
      'Defina E2E_ADMIN_EMAIL e E2E_ADMIN_PASSWORD para validar o fluxo de reset.',
    );

    await loginAsAdmin(page);

    const trigger = page.getByTestId('admin-reset-all-trigger');
    await expect(trigger).toBeVisible();
    await trigger.click();

    await expect(page.getByRole('heading', { name: /Resetar tudo\?/i })).toBeVisible();
    await page.getByRole('button', { name: /^Cancelar$/i }).click();
    await expect(page.getByRole('heading', { name: /Resetar tudo\?/i })).toBeHidden();
  });

  test('confirmar reset all (destrutivo)', async ({ page }) => {
    test.skip(
      !hasAdminCredentials(),
      'Defina E2E_ADMIN_EMAIL e E2E_ADMIN_PASSWORD para validar reset all real.',
    );
    test.skip(
      !e2eEnv.allowDestructiveResetAll,
      'Teste destrutivo desativado. Use E2E_ALLOW_DESTRUCTIVE_RESET_ALL=true.',
    );

    await loginAsAdmin(page);

    await page.getByTestId('admin-reset-all-trigger').click();
    const modal = page.getByRole('dialog', { name: /Resetar tudo\?/i });
    await expect(modal).toBeVisible();

    await modal.getByRole('button', { name: /^Resetar$/i }).click();
    await expect(page.getByText(/Conteudo restaurado com sucesso/i)).toBeVisible();
  });
});

