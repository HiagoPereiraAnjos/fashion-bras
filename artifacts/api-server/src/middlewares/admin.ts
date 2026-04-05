import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../lib/httpError";
import { findAdminUserById } from "../repositories/content/contentRepository";

export async function requireAdmin(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  try {
    if (!request.authUser?.id) {
      throw new HttpError(401, "Unauthorized", "Missing authenticated user.");
    }

    const adminUser = await findAdminUserById(request.authUser.id);
    if (!adminUser || !adminUser.isActive) {
      throw new HttpError(
        403,
        "Forbidden",
        "Authenticated user is not an active admin.",
      );
    }

    request.adminUser = {
      userId: adminUser.userId,
      role: adminUser.role,
    };
    next();
  } catch (error) {
    next(error);
  }
}
