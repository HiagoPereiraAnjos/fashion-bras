export class HttpError extends Error {
  readonly status: number;
  readonly title: string;
  readonly detail?: string;
  readonly type: string;

  constructor(
    status: number,
    title: string,
    detail?: string,
    type = "about:blank",
  ) {
    super(detail ?? title);
    this.name = "HttpError";
    this.status = status;
    this.title = title;
    this.detail = detail;
    this.type = type;
  }
}

export function isHttpError(error: unknown): error is HttpError {
  return error instanceof HttpError;
}
