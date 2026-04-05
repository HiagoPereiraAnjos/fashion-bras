import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { isHttpError } from "../lib/httpError";
import { logger } from "../lib/logger";

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

  logger.error({ err: error, url: request.originalUrl }, "Unhandled API error");
  response.status(500).type("application/problem+json").json({
    type: "about:blank",
    title: "Internal Server Error",
    status: 500,
    detail: "Unexpected server error.",
    instance: request.originalUrl,
  });
};
