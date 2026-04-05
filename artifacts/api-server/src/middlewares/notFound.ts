import type { Request, Response } from "express";

export function notFoundHandler(request: Request, response: Response) {
  response.status(404).type("application/problem+json").json({
    type: "about:blank",
    title: "Not Found",
    status: 404,
    detail: `Route not found: ${request.method} ${request.originalUrl}`,
  });
}
