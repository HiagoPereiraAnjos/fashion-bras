import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GetContentSnapshotResponse } from "@workspace/api-zod";
import type { SiteContentState } from "@workspace/api-zod";
import type { ContentSection } from "./sections";

let cachedBaseline: SiteContentState | null = null;

function getBaselineCandidates(): string[] {
  const moduleDir = path.dirname(fileURLToPath(import.meta.url));

  return [
    path.resolve(moduleDir, "content-baseline.json"),
    path.resolve(moduleDir, "../src/content/content-baseline.json"),
    path.resolve(process.cwd(), "src/content/content-baseline.json"),
    path.resolve(process.cwd(), "dist/content-baseline.json"),
  ];
}

function readBaselineFile(): unknown {
  for (const candidate of getBaselineCandidates()) {
    if (!existsSync(candidate)) continue;

    const raw = readFileSync(candidate, "utf-8");
    return JSON.parse(raw) as unknown;
  }

  throw new Error(
    `[content] Unable to locate content-baseline.json. Checked: ${getBaselineCandidates().join(
      ", ",
    )}`,
  );
}

export function getContentBaseline(): SiteContentState {
  if (cachedBaseline) return cachedBaseline;

  const parsed = GetContentSnapshotResponse.parse(readBaselineFile());
  cachedBaseline = parsed;
  return parsed;
}

export function getDefaultSection<K extends ContentSection>(
  section: K,
): SiteContentState[K] {
  return getContentBaseline()[section];
}
