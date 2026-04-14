import { expect, test } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { loginAsAdmin, openAdminTab } from '../support/admin';
import { e2eEnv, hasAdminCredentials } from '../support/env';

const uploadAPath = fileURLToPath(new URL('../fixtures/upload-a.png', import.meta.url));
const uploadBPath = fileURLToPath(new URL('../fixtures/upload-b.png', import.meta.url));

test.describe('Admin E2E - Midia', () => {
  test('upload, replace e delete de imagem em linha temporaria', async ({ page }) => {
    test.skip(
      !hasAdminCredentials(),
      'Defina E2E_ADMIN_EMAIL e E2E_ADMIN_PASSWORD para validar upload real.',
    );
    test.skip(
      !e2eEnv.enableMediaTests,
      'Teste de midia desativado. Use E2E_ENABLE_MEDIA_TESTS=true.',
    );

    await loginAsAdmin(page);
    await openAdminTab(page, 'Lojas');

    const editStoreButton = page.getByRole('button', { name: /Editar loja/i }).first();
    await expect(editStoreButton).toBeVisible();
    await editStoreButton.click();

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    await modal.getByTestId('store-add-image').click();
    const row = modal.locator('[data-testid^="store-image-row-"]').last();
    await expect(row).toBeVisible();

    const fileInput = row.locator('input[type="file"]');
    const mediaUrlInput = row.locator('input[type="text"]').first();

    await fileInput.setInputFiles(uploadAPath);
    await expect(modal.getByText(/Imagem enviada com sucesso/i)).toBeVisible();
    const firstUrl = await mediaUrlInput.inputValue();
    expect(firstUrl).toContain('/storage/v1/object/public/');

    await fileInput.setInputFiles(uploadBPath);
    await expect(modal.getByText(/Imagem enviada com sucesso/i)).toBeVisible();
    const secondUrl = await mediaUrlInput.inputValue();
    expect(secondUrl).not.toBe(firstUrl);

    await row.locator('button[title="Remover imagem"]').click();
    await expect(modal.getByText(/Imagem removida com sucesso/i)).toBeVisible();
    await expect(mediaUrlInput).toHaveValue('');

    await modal.getByRole('button', { name: /^Cancelar$/i }).click();
    await expect(modal).toBeHidden();
  });
});

