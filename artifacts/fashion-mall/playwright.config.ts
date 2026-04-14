import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');

const frontendUrl = process.env.E2E_BASE_URL?.trim() || 'http://127.0.0.1:4173';
const apiUrl = process.env.E2E_API_BASE_URL?.trim() || 'http://127.0.0.1:3000';
const shouldStartLocalStack = process.env.E2E_START_LOCAL_STACK === 'true';

const webServer = shouldStartLocalStack
  ? [
      {
        command: 'pnpm --filter @workspace/api-server dev',
        url: apiUrl,
        cwd: repoRoot,
        timeout: 180_000,
        reuseExistingServer: !process.env.CI,
        env: {
          ...process.env,
          PORT: '3000',
          CORS_ALLOWED_ORIGINS:
            process.env.CORS_ALLOWED_ORIGINS ??
            'http://127.0.0.1:4173,http://localhost:4173',
        },
      },
      {
        command: 'pnpm --filter @workspace/fashion-mall dev --host 127.0.0.1 --port 4173',
        url: frontendUrl,
        cwd: repoRoot,
        timeout: 180_000,
        reuseExistingServer: !process.env.CI,
        env: {
          ...process.env,
          VITE_CONTENT_BACKEND_MODE: 'remote',
          VITE_API_BASE_URL: apiUrl,
          VITE_SUPABASE_URL:
            process.env.VITE_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
          VITE_SUPABASE_ANON_KEY:
            process.env.VITE_SUPABASE_ANON_KEY ??
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
            '',
        },
      },
    ]
  : undefined;

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 90_000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: frontendUrl,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1366, height: 900 },
  },
  webServer,
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
      },
    },
  ],
});

