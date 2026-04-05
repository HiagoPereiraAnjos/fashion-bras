import { Router, type IRouter } from "express";
import {
  GetContentSectionParams,
  GetContentSectionResponse,
  GetContentSnapshotResponse,
} from "@workspace/api-zod";
import type { SiteContentState } from "@workspace/api-zod";
import { getContentSection, getContentSnapshot } from "../repositories/content/contentRepository";
import type { ContentSection } from "../content/sections";

function parseSectionValue<K extends ContentSection>(
  section: K,
  value: unknown,
): SiteContentState[K] {
  const schema = GetContentSnapshotResponse.shape[section];
  return schema.parse(value) as SiteContentState[K];
}

const router: IRouter = Router();

router.get("/content/snapshot", async (_request, response, next) => {
  try {
    const snapshot = await getContentSnapshot();
    response.json(GetContentSnapshotResponse.parse(snapshot));
  } catch (error) {
    next(error);
  }
});

router.get("/content/sections/:section", async (request, response, next) => {
  try {
    const { section } = GetContentSectionParams.parse(request.params);
    const value = await getContentSection(section);
    const parsedValue = parseSectionValue(section, value);

    response.json(
      GetContentSectionResponse.parse({
        section,
        value: parsedValue,
      }),
    );
  } catch (error) {
    next(error);
  }
});

export default router;
