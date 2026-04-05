import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../lib/httpError";
import { getSupabaseAdminClient } from "../lib/supabaseAdmin";

function extractBearerToken(request: Request): string | null {
  const authorizationHeader = request.headers.authorization;
  if (!authorizationHeader) return null;

  const [scheme, token] = authorizationHeader.split(" ");
  if (!scheme || !token) return null;
  if (scheme.toLowerCase() !== "bearer") return null;

  return token.trim();
}

export async function requireAuth(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  try {
    const token = extractBearerToken(request);
    if (!token) {
      throw new HttpError(
        401,
        "Unauthorized",
        "Missing bearer token.",
      );
    }

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      throw new HttpError(
        401,
        "Unauthorized",
        "Invalid or expired auth token.",
      );
    }

    request.authUser = {
      id: data.user.id,
      email: data.user.email ?? null,
    };
    next();
  } catch (error) {
    next(error);
  }
}
