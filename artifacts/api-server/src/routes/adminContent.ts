import { Router, type IRouter } from "express";
import multer, { MulterError } from "multer";
import { randomUUID } from "node:crypto";
import { extname } from "node:path";
import { z } from "zod";
import {
  AdminMeResponse,
  GetContentSnapshotResponse,
  PostAdminImportContentBody,
  PostAdminImportContentResponse,
  PostAdminResetAllContentResponse,
  PostAdminResetContentSectionParams,
  PostAdminResetContentSectionResponse,
  PutAdminContentSectionBody,
  PutAdminContentSectionParams,
  PutAdminContentSectionResponse,
} from "@workspace/api-zod";
import type { SiteContentState } from "@workspace/api-zod";
import { adminRateLimit } from "../middlewares/adminRateLimit";
import { HttpError } from "../lib/httpError";
import { getSupabaseAdminClient } from "../lib/supabaseAdmin";
import { requireAdmin } from "../middlewares/admin";
import { requireAuth } from "../middlewares/auth";
import {
  replaceContentSection,
  replaceContentSnapshot,
  resetAllContent,
  resetContentSection,
} from "../repositories/content/contentRepository";
import type { ContentSection } from "../content/sections";

const MAX_UPLOAD_SIZE_BYTES = 8 * 1024 * 1024;
const DEFAULT_STORAGE_BUCKET = "site-media";
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);
const UploadMediaBody = z.object({
  folder: z.string().trim().max(120).optional(),
});
const UploadMediaResponse = z.object({
  bucket: z.string().min(1),
  path: z.string().min(1),
  url: z.string().url(),
});

const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_UPLOAD_SIZE_BYTES,
  },
  fileFilter(_request, file, callback) {
    if (!ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
      callback(
        new HttpError(
          400,
          "Validation Error",
          "Invalid image type. Allowed: JPEG, PNG, WEBP, AVIF.",
        ),
      );
      return;
    }
    callback(null, true);
  },
});

function normalizeFolder(rawFolder?: string): string {
  const value = (rawFolder ?? "general").toLowerCase().trim();
  const sanitized = value
    .replace(/[^a-z0-9/_-]+/g, "-")
    .replace(/\/+/g, "/")
    .replace(/^\/+|\/+$/g, "");

  return sanitized || "general";
}

function resolveStorageBucket(): string {
  return process.env.SUPABASE_STORAGE_BUCKET?.trim() || DEFAULT_STORAGE_BUCKET;
}

function resolveImageExtension(file: Express.Multer.File): string {
  const extensionByType: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/avif": ".avif",
  };

  const fromType = extensionByType[file.mimetype];
  if (fromType) return fromType;

  const fromName = extname(file.originalname ?? "").toLowerCase();
  if (fromName) return fromName;

  return ".bin";
}

function parseUploadError(error: unknown): HttpError | unknown {
  if (!(error instanceof MulterError)) return error;

  if (error.code === "LIMIT_FILE_SIZE") {
    return new HttpError(
      413,
      "Payload Too Large",
      "Image exceeds 8MB limit.",
    );
  }

  return new HttpError(400, "Validation Error", error.message);
}

function parseSectionValue<K extends ContentSection>(
  section: K,
  value: unknown,
): SiteContentState[K] {
  const schema = GetContentSnapshotResponse.shape[section];
  return schema.parse(value) as SiteContentState[K];
}

const router: IRouter = Router();

router.use(requireAuth, requireAdmin, adminRateLimit);

router.get("/admin/me", (request, response) => {
  response.json(
    AdminMeResponse.parse({
      userId: request.adminUser?.userId ?? request.authUser?.id ?? "",
      email: request.authUser?.email ?? "",
      role: request.adminUser?.role ?? "admin",
    }),
  );
});

router.put("/admin/content/sections/:section", async (request, response, next) => {
  try {
    const { section } = PutAdminContentSectionParams.parse(request.params);
    const { value } = PutAdminContentSectionBody.parse(request.body);
    const parsedValue = parseSectionValue(section, value);
    const savedValue = await replaceContentSection(section, parsedValue);

    response.json(
      PutAdminContentSectionResponse.parse({
        section,
        value: savedValue,
      }),
    );
  } catch (error) {
    next(error);
  }
});

router.post("/admin/content/reset/:section", async (request, response, next) => {
  try {
    const { section } = PostAdminResetContentSectionParams.parse(request.params);
    const value = await resetContentSection(section);

    response.json(
      PostAdminResetContentSectionResponse.parse({
        section,
        value,
      }),
    );
  } catch (error) {
    next(error);
  }
});

router.post("/admin/content/reset-all", async (_request, response, next) => {
  try {
    const snapshot = await resetAllContent();
    response.json(PostAdminResetAllContentResponse.parse(snapshot));
  } catch (error) {
    next(error);
  }
});

router.post("/admin/content/import", async (request, response, next) => {
  try {
    const snapshot = PostAdminImportContentBody.parse(request.body);
    const persisted = await replaceContentSnapshot(snapshot);
    response.json(PostAdminImportContentResponse.parse(persisted));
  } catch (error) {
    next(error);
  }
});

router.post(
  "/admin/media/upload",
  (request, response, next) => {
    uploadImage.single("file")(request, response, (error) => {
      if (error) {
        next(parseUploadError(error));
        return;
      }
      next();
    });
  },
  async (request, response, next) => {
    try {
      const file = request.file;
      if (!file) {
        throw new HttpError(
          400,
          "Validation Error",
          "Missing image file in field \"file\".",
        );
      }

      const body = UploadMediaBody.parse(request.body ?? {});
      const folder = normalizeFolder(body.folder);
      const extension = resolveImageExtension(file);
      const fileName = `${Date.now()}-${randomUUID()}${extension}`;
      const objectPath = `${folder}/${fileName}`;
      const bucket = resolveStorageBucket();

      const supabase = getSupabaseAdminClient();
      const { error } = await supabase.storage
        .from(bucket)
        .upload(objectPath, file.buffer, {
          contentType: file.mimetype,
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw new HttpError(500, "Storage Upload Failed", error.message);
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
      if (!data.publicUrl) {
        throw new HttpError(
          500,
          "Storage Upload Failed",
          "Public URL was not generated for uploaded asset.",
        );
      }

      response.status(201).json(
        UploadMediaResponse.parse({
          bucket,
          path: objectPath,
          url: data.publicUrl,
        }),
      );
    } catch (error) {
      next(error);
    }
  },
);

export default router;
