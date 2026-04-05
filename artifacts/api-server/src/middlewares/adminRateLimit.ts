import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../lib/httpError";

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 90;
const buckets = new Map<string, { count: number; resetAt: number }>();

function resolveClientKey(request: Request): string {
  return (
    request.ip?.trim() ||
    request.socket.remoteAddress?.trim() ||
    "unknown"
  );
}

function pruneExpiredBuckets(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

export function adminRateLimit(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const now = Date.now();
  const key = resolveClientKey(request);
  const existing = buckets.get(key);

  if (existing && existing.resetAt > now) {
    if (existing.count >= MAX_REQUESTS_PER_WINDOW) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((existing.resetAt - now) / 1000),
      );
      response.setHeader("Retry-After", String(retryAfterSeconds));
      next(
        new HttpError(
          429,
          "Too Many Requests",
          "Rate limit exceeded for admin operations. Please retry shortly.",
        ),
      );
      return;
    }

    existing.count += 1;
  } else {
    buckets.set(key, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });
  }

  // Keeps memory bounded in long-lived processes.
  if (buckets.size > 500) {
    pruneExpiredBuckets(now);
  }

  next();
}
