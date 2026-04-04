export type DomainId = string;
export type Slug = string;
export type UrlString = string;
export type DomainDateLabel = string;

export type Draft<T, OptionalKeys extends keyof T> = Omit<T, OptionalKeys> &
  Partial<Pick<T, OptionalKeys>>;

export type Persisted<T, RequiredKeys extends keyof T> = T &
  Required<Pick<T, RequiredKeys>>;
