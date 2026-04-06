import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import router from "./routes";
import { HttpError } from "./lib/httpError";
import { logger } from "./lib/logger";
import { errorHandler } from "./middlewares/errorHandler";
import { notFoundHandler } from "./middlewares/notFound";

function normalizeOrigin(value: string): string {
  try {
    return new URL(value).origin;
  } catch {
    return value.replace(/\/+$/, "");
  }
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
    .map(normalizeOrigin);

  if (origins.length === 0) {
    throw new Error(
      "CORS_ALLOWED_ORIGINS is empty. Define one or more origins separated by commas.",
    );
  }

  return origins;
}

function resolveCorsOriginRegex(): RegExp | null {
  const raw = process.env.CORS_ALLOWED_ORIGIN_REGEX?.trim();
  if (!raw) return null;

  try {
    return new RegExp(raw);
  } catch {
    throw new Error("CORS_ALLOWED_ORIGIN_REGEX is not a valid regular expression.");
  }
}

function isAllowedOrigin(
  origin: string,
  allowedOrigins: string[],
  allowedOriginRegex: RegExp | null,
): boolean {
  const normalized = normalizeOrigin(origin);
  if (allowedOrigins.includes(normalized)) {
    return true;
  }

  if (allowedOriginRegex && allowedOriginRegex.test(normalized)) {
    return true;
  }

  return false;
}

const app: Express = express();
const allowedOrigins = resolveCorsOrigins();
const allowedOriginRegex = resolveCorsOriginRegex();

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

      if (isAllowedOrigin(origin, allowedOrigins, allowedOriginRegex)) {
        callback(null, true);
        return;
      }

      callback(new HttpError(403, "Forbidden", "CORS origin not allowed."));
    },
    credentials: false,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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
