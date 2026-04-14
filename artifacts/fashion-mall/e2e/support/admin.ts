import { expect, type Page } from '@playwright/test';
import { e2eEnv } from './env';

export async function loginAsAdmin(page: Page): Promise<void> {
  await page.goto('/admin/login');

  if (page.url().includes('/admin') && !page.url().includes('/admin/login')) {
    await waitForAdminPanel(page);
    return;
  }

  await expect(page.getByRole('heading', { name: /Login/i })).toBeVisible();

  await page.getByTestId('admin-login-email').fill(e2eEnv.adminEmail);
  await page.getByTestId('admin-login-password').fill(e2eEnv.adminPassword);
  await page.getByTestId('admin-login-submit').click();

  await expect(page).toHaveURL(/\/admin(?:[/?#].*)?$/);
  await waitForAdminPanel(page);
}

export async function waitForAdminPanel(page: Page): Promise<void> {
  await expect(page.getByRole('heading', { name: /Painel de Administracao/i })).toBeVisible();
}

export async function openAdminTab(page: Page, tabLabel: string): Promise<void> {
  await page.getByRole('button', { name: new RegExp(tabLabel, 'i') }).click();
}

export async function saveCurrentSection(page: Page): Promise<void> {
  await page.getByRole('button', { name: /Salvar alteracoes/i }).click();
  await expect(page.getByRole('button', { name: /Salvo!/i })).toBeVisible();
}

