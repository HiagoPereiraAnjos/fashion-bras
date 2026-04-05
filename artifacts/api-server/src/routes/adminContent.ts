import { Router, type IRouter } from "express";
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
import { requireAdmin } from "../middlewares/admin";
import { requireAuth } from "../middlewares/auth";
import {
  replaceContentSection,
  replaceContentSnapshot,
  resetAllContent,
  resetContentSection,
} from "../repositories/content/contentRepository";
import type { ContentSection } from "../content/sections";

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

export default router;
