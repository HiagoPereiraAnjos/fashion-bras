export const CONTENT_REPOSITORY_KINDS = ['local', 'supabase'] as const;

export type ContentRepositoryKind = (typeof CONTENT_REPOSITORY_KINDS)[number];

export interface ContentRepositoryFactoryOptions {
  kind?: ContentRepositoryKind;
  storage?: Storage;
  namespace?: string;
}
