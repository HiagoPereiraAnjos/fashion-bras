import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getDefaultSection } from "@/services/content/defaults";

const snapshot = {
  stores: getDefaultSection("stores"),
  blogPosts: getDefaultSection("blogPosts"),
  partners: getDefaultSection("partners"),
  siteSettings: getDefaultSection("siteSettings"),
  homeContent: getDefaultSection("homeContent"),
  leasingBenefits: getDefaultSection("leasingBenefits"),
  spaceTypes: getDefaultSection("spaceTypes"),
  testimonials: getDefaultSection("testimonials"),
  leasingDifferentials: getDefaultSection("leasingDifferentials"),
  aboutData: getDefaultSection("aboutData"),
};

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const targetDir = path.join(root, "artifacts/api-server/src/content");
const targetFile = path.join(targetDir, "content-baseline.json");

mkdirSync(targetDir, { recursive: true });
writeFileSync(targetFile, JSON.stringify(snapshot, null, 2), "utf-8");

console.log(`[baseline] snapshot written to ${targetFile}`);
