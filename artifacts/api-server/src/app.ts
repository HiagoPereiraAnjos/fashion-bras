import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import router from "./routes";
import { HttpError } from "./lib/httpError";
import { logger } from "./lib/logger";
import { errorHandler } from "./middlewares/errorHandler";
import { notFoundHandler } from "./middlewares/notFound";

const HOSTNAME_LABEL_PATTERN = /^[a-z0-9-]+$/;

function parseUrlOrigin(value: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`Invalid origin URL: "${value}"`);
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error(`Unsupported origin protocol in "${value}"`);
  }

  if (parsed.pathname !== "/" || parsed.search || parsed.hash) {
    throw new Error(`Origin must not include path/query/hash: "${value}"`);
  }

  return parsed;
}

function normalizeConfiguredOrigin(value: string): string {
  return parseUrlOrigin(value).origin;
}

function resolveCorsOrigins(): string[] {
  const raw = process.env.CORS_ALLOWED_ORIGINS;
  if (!raw) {
    throw new Error(
      "CORS_ALLOWED_ORIGINS must be set with at least one allowed origin.",
    );
  }

  const origins = raw
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0)
    .map(normalizeConfiguredOrigin);

  if (origins.length === 0) {
    throw new Error(
      "CORS_ALLOWED_ORIGINS is empty. Define one or more origins separated by commas.",
    );
  }

  return origins;
}

function resolveVercelPreviewProjects(): string[] {
  const raw = process.env.CORS_ALLOWED_VERCEL_PROJECTS?.trim();
  if (!raw) return [];

  const projects = raw
    .split(",")
    .map((project) => project.trim().toLowerCase())
    .filter((project) => project.length > 0);

  for (const project of projects) {
    if (!HOSTNAME_LABEL_PATTERN.test(project)) {
      throw new Error(
        `CORS_ALLOWED_VERCEL_PROJECTS contains invalid slug: "${project}"`,
      );
    }
  }

  return projects;
}

function resolveVercelTeamSlug(): string | null {
  const raw = process.env.CORS_ALLOWED_VERCEL_TEAM_SLUG?.trim().toLowerCase();
  if (!raw) return null;

  if (!HOSTNAME_LABEL_PATTERN.test(raw)) {
    throw new Error("CORS_ALLOWED_VERCEL_TEAM_SLUG must be alphanumeric/hyphen.");
  }

  return raw;
}

function isAllowedVercelPreviewOrigin(
  url: URL,
  projectSlugs: string[],
  teamSlug: string | null,
): boolean {
  if (url.protocol !== "https:") return false;
  if (projectSlugs.length === 0) return false;
  if (url.hostname.includes("..")) return false;
  if (!url.hostname.endsWith(".vercel.app")) return false;

  const hostWithoutSuffix = url.hostname.slice(0, -".vercel.app".length);
  if (!hostWithoutSuffix || hostWithoutSuffix.includes(".")) return false;

  for (const projectSlug of projectSlugs) {
    const prefix = `${projectSlug}-`;
    if (!hostWithoutSuffix.startsWith(prefix)) continue;

    const remainder = hostWithoutSuffix.slice(prefix.length);
    if (!remainder || !HOSTNAME_LABEL_PATTERN.test(remainder)) {
      continue;
    }

    if (!teamSlug) return true;

    if (remainder === teamSlug) return true;
    if (remainder.endsWith(`-${teamSlug}`)) return true;
  }

  return false;
}

function normalizeRequestOrigin(value: string): string | null {
  try {
    return parseUrlOrigin(value).origin;
  } catch {
    return null;
  }
}

function isAllowedOrigin(
  origin: string,
  allowedOrigins: string[],
  vercelPreviewProjects: string[],
  vercelTeamSlug: string | null,
): boolean {
  const normalized = normalizeRequestOrigin(origin);
  if (!normalized) return false;
  if (allowedOrigins.includes(normalized)) {
    return true;
  }

  return isAllowedVercelPreviewOrigin(
    new URL(normalized),
    vercelPreviewProjects,
    vercelTeamSlug,
  );
}

const app: Express = express();
const allowedOrigins = resolveCorsOrigins();
const vercelPreviewProjects = resolveVercelPreviewProjects();
const vercelTeamSlug = resolveVercelTeamSlug();

app.disable("x-powered-by");
// Vercel runs behind a proxy. This keeps request.ip accurate for rate limiting/logging.
app.set("trust proxy", true);
app.use(helmet());
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        // Non-browser calls (curl/server-to-server) don't send Origin.
        callback(null, true);
        return;
      }

      if (
        isAllowedOrigin(
          origin,
          allowedOrigins,
          vercelPreviewProjects,
          vercelTeamSlug,
        )
      ) {
        callback(null, true);
        return;
      }

      callback(new HttpError(403, "Forbidden", "CORS origin not allowed."));
    },
    credentials: false,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
    maxAge: 86400,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
