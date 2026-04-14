import { expect, test } from '@playwright/test';
import { loginAsAdmin, openAdminTab, saveCurrentSection } from '../support/admin';
import { e2eEnv, hasAdminCredentials } from '../support/env';

test.describe('Admin E2E - Conteudo', () => {
  test.describe.configure({ mode: 'serial' });

  test('editar e salvar configuracoes com persistencia apos refresh', async ({ page }) => {
    test.skip(
      !hasAdminCredentials(),
      'Defina E2E_ADMIN_EMAIL e E2E_ADMIN_PASSWORD para validar persistencia real.',
    );

    await loginAsAdmin(page);
    await openAdminTab(page, 'Configuracoes');

    const taglineInput = page.getByTestId('site-settings-tagline-input');
    await expect(taglineInput).toBeVisible();

    const originalTagline = await taglineInput.inputValue();
    const updatedTagline = `E2E ${Date.now()} - Fashion Bras`;

    await taglineInput.fill(updatedTagline);
    await saveCurrentSection(page);

    await page.reload();
    await openAdminTab(page, 'Configuracoes');
    await expect(taglineInput).toHaveValue(updatedTagline);

    await taglineInput.fill(originalTagline);
    await saveCurrentSection(page);
    await expect(taglineInput).toHaveValue(originalTagline);
  });

  test('resetar secao (configuracoes) e restaurar valor original', async ({ page }) => {
    test.skip(
      !hasAdminCredentials(),
      'Defina E2E_ADMIN_EMAIL e E2E_ADMIN_PASSWORD para validar reset real.',
    );
    test.skip(
      !e2eEnv.allowDestructiveSectionReset,
      'Teste destrutivo desativado. Use E2E_ALLOW_DESTRUCTIVE_SECTION_RESET=true.',
    );

    await loginAsAdmin(page);
    await openAdminTab(page, 'Configuracoes');

    const taglineInput = page.getByTestId('site-settings-tagline-input');
    await expect(taglineInput).toBeVisible();
    const originalTagline = await taglineInput.inputValue();
    const mutatedTagline = `E2E-RESET-${Date.now()}`;

    await taglineInput.fill(mutatedTagline);
    await saveCurrentSection(page);
    await expect(taglineInput).toHaveValue(mutatedTagline);

    await page.getByRole('button', { name: /Restaurar padrao/i }).click();
    await expect(page.getByText(/restaurad/i)).toBeVisible();
    await expect(taglineInput).not.toHaveValue(mutatedTagline);

    await taglineInput.fill(originalTagline);
    await saveCurrentSection(page);
    await expect(taglineInput).toHaveValue(originalTagline);
  });
});

