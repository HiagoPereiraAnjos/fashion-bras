import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

function shouldUseSsl(connectionString: string): boolean {
  const explicitSslMode = process.env.DB_SSL_MODE?.trim().toLowerCase();
  if (explicitSslMode === "disable") return false;
  if (explicitSslMode === "require") return true;

  try {
    const parsed = new URL(connectionString);
    return parsed.hostname.includes("supabase.co");
  } catch {
    return false;
  }
}

function resolvePoolMax(): number {
  const raw = process.env.DB_POOL_MAX?.trim();
  if (!raw) {
    // Conservative defaults for serverless runtimes and local development.
    return process.env.VERCEL ? 3 : 10;
  }

  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 10;
}

export const pool = new Pool({
  connectionString: databaseUrl,
  ssl: shouldUseSsl(databaseUrl) ? { rejectUnauthorized: false } : undefined,
  max: resolvePoolMax(),
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
  application_name: process.env.DB_APPLICATION_NAME ?? "fashion-bras-api",
});
export const db = drizzle(pool, { schema });

export * from "./schema";
