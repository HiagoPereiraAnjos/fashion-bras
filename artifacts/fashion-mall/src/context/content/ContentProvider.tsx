import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  AboutContent,
  BlogCategory,
  BlogPost,
  LeasingBenefit,
  Partner,
  SiteSettings,
  SpaceType,
  Store,
  StoreCategory,
  Testimonial,
} from '@/types';
import { createContentRepository } from '@/services/content/repositories/createContentRepository';
import type { ContentRepository } from '@/services/content/repositories/ContentRepository';
import type { ContentRepositoryKind } from '@/services/content/repositories/types';
import { getDefaultSection } from '@/services/content/defaults';
import { buildBlogCategories, buildStoreSegments } from '@/services/content/selectors';
import type { ContentSection, ContentState } from '@/services/content/types/content';

export interface AdminDataContextType extends ContentState {
  storeSegments: StoreCategory[];
  blogCategories: BlogCategory[];
  setStores: (stores: Store[]) => void;
  setBlogPosts: (posts: BlogPost[]) => void;
  setPartners: (partners: Partner[]) => void;
  setSiteSettings: (settings: SiteSettings) => void;
  setLeasingBenefits: (benefits: LeasingBenefit[]) => void;
  setSpaceTypes: (types: SpaceType[]) => void;
  setTestimonials: (testimonials: Testimonial[]) => void;
  setLeasingDifferentials: (diffs: string[]) => void;
  setAboutData: (data: AboutContent) => void;
  resetAll: () => void;
  resetSection: <K extends ContentSection>(section: K) => ContentState[K];
  hasCustomData: boolean;
}

interface ContentProviderProps {
  children: ReactNode;
  repository?: ContentRepository;
  repositoryKind?: ContentRepositoryKind;
}

const AdminDataContext = createContext<AdminDataContextType | null>(null);

export function ContentProvider({
  children,
  repository: repositoryOverride,
  repositoryKind = 'local',
}: ContentProviderProps) {
  const repository = useMemo(
    () =>
      repositoryOverride ??
      // Future integration: switch to "supabase" when remote repository is implemented.
      createContentRepository({ kind: repositoryKind }),
    [repositoryKind, repositoryOverride],
  );

  const [stores, setStoresState] = useState<Store[]>(
    () => repository.loadSection('stores') ?? getDefaultSection('stores'),
  );
  const [blogPosts, setBlogPostsState] = useState<BlogPost[]>(
    () => repository.loadSection('blogPosts') ?? getDefaultSection('blogPosts'),
  );
  const [partners, setPartnersState] = useState<Partner[]>(
    () => repository.loadSection('partners') ?? getDefaultSection('partners'),
  );
  const [siteSettings, setSiteSettingsState] = useState<SiteSettings>(
    () => repository.loadSection('siteSettings') ?? getDefaultSection('siteSettings'),
  );
  const [leasingBenefits, setLeasingBenefitsState] = useState<LeasingBenefit[]>(
    () => repository.loadSection('leasingBenefits') ?? getDefaultSection('leasingBenefits'),
  );
  const [spaceTypes, setSpaceTypesState] = useState<SpaceType[]>(
    () => repository.loadSection('spaceTypes') ?? getDefaultSection('spaceTypes'),
  );
  const [testimonials, setTestimonialsState] = useState<Testimonial[]>(
    () => repository.loadSection('testimonials') ?? getDefaultSection('testimonials'),
  );
  const [leasingDifferentials, setLeasingDifferentialsState] = useState<string[]>(
    () =>
      repository.loadSection('leasingDifferentials') ??
      getDefaultSection('leasingDifferentials'),
  );
  const [aboutData, setAboutDataState] = useState<AboutContent>(
    () => repository.loadSection('aboutData') ?? getDefaultSection('aboutData'),
  );

  const setStores = useCallback(
    (value: Store[]) => {
      setStoresState(value);
      // Persist writes in one place so repository migration stays isolated.
      repository.saveSection('stores', value);
    },
    [repository],
  );

  const setBlogPosts = useCallback(
    (value: BlogPost[]) => {
      setBlogPostsState(value);
      repository.saveSection('blogPosts', value);
    },
    [repository],
  );

  const setPartners = useCallback(
    (value: Partner[]) => {
      setPartnersState(value);
      repository.saveSection('partners', value);
    },
    [repository],
  );

  const setSiteSettings = useCallback(
    (value: SiteSettings) => {
      setSiteSettingsState(value);
      repository.saveSection('siteSettings', value);
    },
    [repository],
  );

  const setLeasingBenefits = useCallback(
    (value: LeasingBenefit[]) => {
      setLeasingBenefitsState(value);
      repository.saveSection('leasingBenefits', value);
    },
    [repository],
  );

  const setSpaceTypes = useCallback(
    (value: SpaceType[]) => {
      setSpaceTypesState(value);
      repository.saveSection('spaceTypes', value);
    },
    [repository],
  );

  const setTestimonials = useCallback(
    (value: Testimonial[]) => {
      setTestimonialsState(value);
      repository.saveSection('testimonials', value);
    },
    [repository],
  );

  const setLeasingDifferentials = useCallback(
    (value: string[]) => {
      setLeasingDifferentialsState(value);
      repository.saveSection('leasingDifferentials', value);
    },
    [repository],
  );

  const setAboutData = useCallback(
    (value: AboutContent) => {
      setAboutDataState(value);
      repository.saveSection('aboutData', value);
    },
    [repository],
  );

  const resetSection = useCallback(
    <K extends ContentSection>(section: K): ContentState[K] => {
      const defaultValue = getDefaultSection(section);
      repository.removeSection(section);

      switch (section) {
        case 'stores':
          setStoresState(defaultValue as ContentState['stores']);
          break;
        case 'blogPosts':
          setBlogPostsState(defaultValue as ContentState['blogPosts']);
          break;
        case 'partners':
          setPartnersState(defaultValue as ContentState['partners']);
          break;
        case 'siteSettings':
          setSiteSettingsState(defaultValue as ContentState['siteSettings']);
          break;
        case 'leasingBenefits':
          setLeasingBenefitsState(defaultValue as ContentState['leasingBenefits']);
          break;
        case 'spaceTypes':
          setSpaceTypesState(defaultValue as ContentState['spaceTypes']);
          break;
        case 'testimonials':
          setTestimonialsState(defaultValue as ContentState['testimonials']);
          break;
        case 'leasingDifferentials':
          setLeasingDifferentialsState(defaultValue as ContentState['leasingDifferentials']);
          break;
        case 'aboutData':
          setAboutDataState(defaultValue as ContentState['aboutData']);
          break;
      }

      return defaultValue;
    },
    [repository],
  );

  const resetAll = useCallback(() => {
    repository.clearAll();

    setStoresState(getDefaultSection('stores'));
    setBlogPostsState(getDefaultSection('blogPosts'));
    setPartnersState(getDefaultSection('partners'));
    setSiteSettingsState(getDefaultSection('siteSettings'));
    setLeasingBenefitsState(getDefaultSection('leasingBenefits'));
    setSpaceTypesState(getDefaultSection('spaceTypes'));
    setTestimonialsState(getDefaultSection('testimonials'));
    setLeasingDifferentialsState(getDefaultSection('leasingDifferentials'));
    setAboutDataState(getDefaultSection('aboutData'));
  }, [repository]);

  const storeSegments = useMemo(() => buildStoreSegments(stores), [stores]);
  const blogCategories = useMemo(() => buildBlogCategories(blogPosts), [blogPosts]);
  const hasCustomData = repository.hasAnyStoredSection();

  return (
    <AdminDataContext.Provider
      value={{
        stores,
        blogPosts,
        partners,
        siteSettings,
        leasingBenefits,
        spaceTypes,
        testimonials,
        leasingDifferentials,
        aboutData,
        storeSegments,
        blogCategories,
        setStores,
        setBlogPosts,
        setPartners,
        setSiteSettings,
        setLeasingBenefits,
        setSpaceTypes,
        setTestimonials,
        setLeasingDifferentials,
        setAboutData,
        resetAll,
        resetSection,
        hasCustomData,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export const AdminDataProvider = ContentProvider;

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) throw new Error('useAdminData must be used within AdminDataProvider');
  return context;
}
