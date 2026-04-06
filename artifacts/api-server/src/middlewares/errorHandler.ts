import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { isHttpError } from "../lib/httpError";
import { logger } from "../lib/logger";

function isDatabaseUnavailable(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const pgCode = (error as { code?: string }).code;
  const causeCode = (
    (error as { cause?: { code?: string } }).cause ?? {}
  ).code;
  const message = error.message.toLowerCase();

  return (
    error.name === "DrizzleQueryError" ||
    pgCode === "ECONNREFUSED" ||
    pgCode === "ENOTFOUND" ||
    pgCode === "ETIMEDOUT" ||
    causeCode === "ECONNREFUSED" ||
    causeCode === "ENOTFOUND" ||
    causeCode === "ETIMEDOUT" ||
    message.includes("database_url") ||
    message.includes("connection") ||
    message.includes("timeout")
  );
}

export const errorHandler: ErrorRequestHandler = (
  error,
  request,
  response,
  _next,
) => {
  if (isHttpError(error)) {
    response.status(error.status).type("application/problem+json").json({
      type: error.type,
      title: error.title,
      status: error.status,
      detail: error.detail ?? error.message,
      instance: request.originalUrl,
    });
    return;
  }

  if (error instanceof ZodError) {
    response.status(400).type("application/problem+json").json({
      type: "https://example.com/problems/validation-error",
      title: "Validation Error",
      status: 400,
      detail: error.issues.map((issue) => issue.message).join("; "),
      instance: request.originalUrl,
    });
    return;
  }

  if (isDatabaseUnavailable(error)) {
    logger.error({ err: error, url: request.originalUrl }, "Database unavailable");
    response.status(503).type("application/problem+json").json({
      type: "about:blank",
      title: "Service Unavailable",
      status: 503,
      detail: "Database temporarily unavailable.",
      instance: request.originalUrl,
    });
    return;
  }

  logger.error({ err: error, url: request.originalUrl }, "Unhandled API error");
  response.status(500).type("application/problem+json").json({
    type: "about:blank",
    title: "Internal Server Error",
    status: 500,
    detail: "Unexpected server error.",
    instance: request.originalUrl,
  });
};
