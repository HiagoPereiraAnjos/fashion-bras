export const CONTENT_SECTIONS = [
  "stores",
  "blogPosts",
  "partners",
  "siteSettings",
  "homeContent",
  "leasingBenefits",
  "spaceTypes",
  "testimonials",
  "leasingDifferentials",
  "aboutData",
] as const;

export type ContentSection = (typeof CONTENT_SECTIONS)[number];

export function isContentSection(value: string): value is ContentSection {
  return CONTENT_SECTIONS.includes(value as ContentSection);
}
