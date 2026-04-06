import { Router, type IRouter } from "express";
import multer, { MulterError } from "multer";
import { randomUUID } from "node:crypto";
import { extname } from "node:path";
import { z } from "zod";
import {
  AdminMeResponse,
  DeleteAdminMediaObjectBody,
  DeleteAdminMediaObjectResponse,
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
import { logger } from "../lib/logger";
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
const MAX_STORAGE_OBJECT_PATH_LENGTH = 400;
const DEFAULT_STORAGE_BUCKET = "site-media";
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);
const MIME_TO_EXTENSION: Record<string, ".jpg" | ".png" | ".webp" | ".avif"> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
};
const MIME_TO_ALLOWED_EXTENSIONS: Record<string, string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/avif": [".avif"],
};
const UploadMediaBody = z.object({
  folder: z.string().trim().max(120).optional(),
  replacePath: z.string().trim().max(MAX_STORAGE_OBJECT_PATH_LENGTH).optional(),
});
const UploadMediaResponse = z.object({
  bucket: z.string().min(1),
  path: z.string().min(1),
  url: z.string().url(),
});
const STORAGE_OBJECT_PATH_PATTERN = /^[a-z0-9/_\-.]+$/i;

const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_UPLOAD_SIZE_BYTES,
  },
  fileFilter(_request, file, callback) {
    // Keep early rejection cheap. Full signature verification happens after upload parsing.
    if (file.mimetype && !ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
      callback(
        new HttpError(
          415,
          "Unsupported Media Type",
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

function normalizeStorageObjectPath(rawPath: string): string {
  const normalized = rawPath
    .trim()
    .replace(/\\/g, "/")
    .replace(/\/+/g, "/")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");

  if (!normalized) {
    throw new HttpError(400, "Validation Error", "Storage object path is required.");
  }
  if (normalized.length > MAX_STORAGE_OBJECT_PATH_LENGTH) {
    throw new HttpError(
      400,
      "Validation Error",
      `Storage object path exceeds ${MAX_STORAGE_OBJECT_PATH_LENGTH} characters.`,
    );
  }

  if (!STORAGE_OBJECT_PATH_PATTERN.test(normalized)) {
    throw new HttpError(
      400,
      "Validation Error",
      "Storage object path contains invalid characters.",
    );
  }

  const parts = normalized.split("/");
  if (parts.some((part) => part === "." || part === "..")) {
    throw new HttpError(
      400,
      "Validation Error",
      "Storage object path cannot contain traversal segments.",
    );
  }

  return normalized;
}

function detectImageMimeFromBuffer(buffer: Buffer): string | null {
  if (buffer.length >= 3) {
    const isJpeg =
      buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    if (isJpeg) return "image/jpeg";
  }

  if (buffer.length >= 8) {
    const isPng =
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a;
    if (isPng) return "image/png";
  }

  if (buffer.length >= 12) {
    const header = buffer.toString("ascii", 0, 4);
    const format = buffer.toString("ascii", 8, 12);
    if (header === "RIFF" && format === "WEBP") return "image/webp";
  }

  if (buffer.length >= 32) {
    const hasFtyp = buffer.toString("ascii", 4, 8) === "ftyp";
    const majorBrand = buffer.toString("ascii", 8, 12);
    if (hasFtyp && (majorBrand === "avif" || majorBrand === "avis")) {
      return "image/avif";
    }
  }

  return null;
}

function isFileExtensionAllowedForMime(
  originalName: string,
  mimeType: string,
): boolean {
  const extension = extname(originalName ?? "").toLowerCase();
  if (!extension) return true;
  const allowedExtensions = MIME_TO_ALLOWED_EXTENSIONS[mimeType] ?? [];
  return allowedExtensions.includes(extension);
}

function resolveStorageBucket(): string {
  return process.env.SUPABASE_STORAGE_BUCKET?.trim() || DEFAULT_STORAGE_BUCKET;
}

function resolveImageExtension(mimeType: string): string {
  return MIME_TO_EXTENSION[mimeType] ?? ".bin";
}

async function removeStorageObjectBestEffort(params: {
  supabase: ReturnType<typeof getSupabaseAdminClient>;
  bucket: string;
  objectPath: string;
  context: string;
}) {
  const { supabase, bucket, objectPath, context } = params;
  const { error } = await supabase.storage.from(bucket).remove([objectPath]);
  if (error && !/not\s+found/i.test(error.message)) {
    logger.warn(
      { bucket, objectPath, context, error: error.message },
      "Storage cleanup failed.",
    );
  }
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

router.use((_request, response, next) => {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Pragma", "no-cache");
  next();
});

router.use(adminRateLimit, requireAuth, requireAdmin);

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
      if (!file.buffer || file.buffer.length === 0 || file.size <= 0) {
        throw new HttpError(
          400,
          "Validation Error",
          "Empty image payload.",
        );
      }

      const body = UploadMediaBody.parse(request.body ?? {});
      const folder = normalizeFolder(body.folder);
      const replacePath = body.replacePath
        ? normalizeStorageObjectPath(body.replacePath)
        : null;
      const detectedMimeType = detectImageMimeFromBuffer(file.buffer);
      if (!detectedMimeType || !ALLOWED_IMAGE_TYPES.has(detectedMimeType)) {
        throw new HttpError(
          415,
          "Unsupported Media Type",
          "File signature is not a supported image (JPEG, PNG, WEBP, AVIF).",
        );
      }

      if (file.mimetype && file.mimetype !== detectedMimeType) {
        throw new HttpError(
          400,
          "Validation Error",
          "File content does not match provided MIME type.",
        );
      }

      if (!isFileExtensionAllowedForMime(file.originalname, detectedMimeType)) {
        throw new HttpError(
          400,
          "Validation Error",
          "File extension does not match image type.",
        );
      }

      const extension = resolveImageExtension(detectedMimeType);
      const fileName = `${Date.now()}-${randomUUID()}${extension}`;
      const objectPath = `${folder}/${fileName}`;
      if (objectPath.length > MAX_STORAGE_OBJECT_PATH_LENGTH) {
        throw new HttpError(
          400,
          "Validation Error",
          "Generated storage object path is too long.",
        );
      }
      const bucket = resolveStorageBucket();

      const supabase = getSupabaseAdminClient();
      const { error } = await supabase.storage
        .from(bucket)
        .upload(objectPath, file.buffer, {
          contentType: detectedMimeType,
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw new HttpError(500, "Storage Upload Failed", error.message);
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
      if (!data.publicUrl) {
        await removeStorageObjectBestEffort({
          supabase,
          bucket,
          objectPath,
          context: "upload-public-url-missing",
        });
        throw new HttpError(
          500,
          "Storage Upload Failed",
          "Public URL was not generated for uploaded asset.",
        );
      }

      if (replacePath && replacePath !== objectPath) {
        await removeStorageObjectBestEffort({
          supabase,
          bucket,
          objectPath: replacePath,
          context: "upload-replace-cleanup",
        });
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

router.delete("/admin/media/object", async (request, response, next) => {
  try {
    const body = DeleteAdminMediaObjectBody.parse(request.body ?? {});
    const objectPath = normalizeStorageObjectPath(body.path);
    const bucket = resolveStorageBucket();
    const supabase = getSupabaseAdminClient();

    const { error } = await supabase.storage.from(bucket).remove([objectPath]);
    if (error && !/not\s+found/i.test(error.message)) {
      throw new HttpError(500, "Storage Delete Failed", error.message);
    }

    response.json(
      DeleteAdminMediaObjectResponse.parse({
        bucket,
        path: objectPath,
        deleted: true,
      }),
    );
  } catch (error) {
    next(error);
  }
});

export default router;
