import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  AboutContent,
  BlogCategory,
  BlogPost,
  ContentSection,
  ContentState,
  HomePageContent,
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

export interface AdminDataContextType extends ContentState {
  storeSegments: StoreCategory[];
  blogCategories: BlogCategory[];
  isBootstrapping: boolean;
  bootstrapError: string | null;
  setStores: (stores: Store[]) => void;
  setBlogPosts: (posts: BlogPost[]) => void;
  setPartners: (partners: Partner[]) => void;
  setSiteSettings: (settings: SiteSettings) => void;
  setHomeContent: (content: HomePageContent) => void;
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
  const [homeContent, setHomeContentState] = useState<HomePageContent>(
    () => repository.loadSection('homeContent') ?? getDefaultSection('homeContent'),
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
  const [isBootstrapping, setIsBootstrapping] = useState<boolean>(
    () => Boolean(repository.loadInitialState),
  );
  const [bootstrapError, setBootstrapError] = useState<string | null>(null);

  const applySnapshotState = useCallback((snapshot: Partial<ContentState>) => {
    if (snapshot.stores !== undefined) setStoresState(snapshot.stores);
    if (snapshot.blogPosts !== undefined) setBlogPostsState(snapshot.blogPosts);
    if (snapshot.partners !== undefined) setPartnersState(snapshot.partners);
    if (snapshot.siteSettings !== undefined) setSiteSettingsState(snapshot.siteSettings);
    if (snapshot.homeContent !== undefined) setHomeContentState(snapshot.homeContent);
    if (snapshot.leasingBenefits !== undefined) {
      setLeasingBenefitsState(snapshot.leasingBenefits);
    }
    if (snapshot.spaceTypes !== undefined) setSpaceTypesState(snapshot.spaceTypes);
    if (snapshot.testimonials !== undefined) setTestimonialsState(snapshot.testimonials);
    if (snapshot.leasingDifferentials !== undefined) {
      setLeasingDifferentialsState(snapshot.leasingDifferentials);
    }
    if (snapshot.aboutData !== undefined) setAboutDataState(snapshot.aboutData);
  }, []);

  useEffect(() => {
    if (!repository.loadInitialState) {
      setIsBootstrapping(false);
      setBootstrapError(null);
      return;
    }

    let isCancelled = false;
    setIsBootstrapping(true);
    setBootstrapError(null);

    void (async () => {
      try {
        const snapshot = await repository.loadInitialState!();
        if (isCancelled) return;
        applySnapshotState(snapshot);
        setIsBootstrapping(false);
      } catch (error) {
        if (isCancelled) return;
        // Keep rendering with local defaults/current state if remote bootstrap fails.
        console.warn('[content] Initial content bootstrap failed. Keeping current state.', error);
        setBootstrapError('Falha ao inicializar dados remotos. Conteudo local mantido.');
        setIsBootstrapping(false);
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [applySnapshotState, repository]);

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

  const setHomeContent = useCallback(
    (value: HomePageContent) => {
      setHomeContentState(value);
      repository.saveSection('homeContent', value);
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
        case 'homeContent':
          setHomeContentState(defaultValue as ContentState['homeContent']);
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
    setHomeContentState(getDefaultSection('homeContent'));
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
        homeContent,
        leasingBenefits,
        spaceTypes,
        testimonials,
        leasingDifferentials,
        aboutData,
        storeSegments,
        blogCategories,
        isBootstrapping,
        bootstrapError,
        setStores,
        setBlogPosts,
        setPartners,
        setSiteSettings,
        setHomeContent,
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
