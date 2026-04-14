export function isTruthyEnv(value: string | undefined): boolean {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes';
}

export const e2eEnv = {
  adminEmail: process.env.E2E_ADMIN_EMAIL?.trim() ?? '',
  adminPassword: process.env.E2E_ADMIN_PASSWORD?.trim() ?? '',
  allowDestructiveSectionReset: isTruthyEnv(process.env.E2E_ALLOW_DESTRUCTIVE_SECTION_RESET),
  allowDestructiveResetAll: isTruthyEnv(process.env.E2E_ALLOW_DESTRUCTIVE_RESET_ALL),
  enableMediaTests: isTruthyEnv(process.env.E2E_ENABLE_MEDIA_TESTS),
} as const;

export function hasAdminCredentials(): boolean {
  return e2eEnv.adminEmail.length > 0 && e2eEnv.adminPassword.length > 0;
}

