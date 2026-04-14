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
import { resolveUserFacingError } from '@/services/errors/userFacingError';

export interface AdminDataContextType extends ContentState {
  storeSegments: StoreCategory[];
  blogCategories: BlogCategory[];
  isBootstrapping: boolean;
  bootstrapError: string | null;
  setStores: (stores: Store[]) => Promise<void>;
  setBlogPosts: (posts: BlogPost[]) => Promise<void>;
  setPartners: (partners: Partner[]) => Promise<void>;
  setSiteSettings: (settings: SiteSettings) => Promise<void>;
  setHomeContent: (content: HomePageContent) => Promise<void>;
  setLeasingBenefits: (benefits: LeasingBenefit[]) => Promise<void>;
  setSpaceTypes: (types: SpaceType[]) => Promise<void>;
  setTestimonials: (testimonials: Testimonial[]) => Promise<void>;
  setLeasingDifferentials: (diffs: string[]) => Promise<void>;
  setAboutData: (data: AboutContent) => Promise<void>;
  resetAll: () => Promise<void>;
  resetSection: <K extends ContentSection>(section: K) => Promise<ContentState[K]>;
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
        const { message } = resolveUserFacingError(error, {
          unexpectedMessage:
            'Nao foi possivel carregar a versao mais recente do conteudo. Exibindo os dados disponiveis.',
          validationMessage:
            'Recebemos dados de conteudo invalidos do servidor. Exibindo os dados disponiveis.',
          networkMessage:
            'Nao foi possivel atualizar o conteudo por falha de conexao. Exibindo os dados disponiveis.',
          allowValidationDetail: false,
        });
        setBootstrapError(message);
        setIsBootstrapping(false);
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [applySnapshotState, repository]);

  const setStores = useCallback(
    async (value: Store[]) => {
      const nextValue = await repository.saveSection('stores', value);
      setStoresState(nextValue);
    },
    [repository],
  );

  const setBlogPosts = useCallback(
    async (value: BlogPost[]) => {
      const nextValue = await repository.saveSection('blogPosts', value);
      setBlogPostsState(nextValue);
    },
    [repository],
  );

  const setPartners = useCallback(
    async (value: Partner[]) => {
      const nextValue = await repository.saveSection('partners', value);
      setPartnersState(nextValue);
    },
    [repository],
  );

  const setSiteSettings = useCallback(
    async (value: SiteSettings) => {
      const nextValue = await repository.saveSection('siteSettings', value);
      setSiteSettingsState(nextValue);
    },
    [repository],
  );

  const setHomeContent = useCallback(
    async (value: HomePageContent) => {
      const nextValue = await repository.saveSection('homeContent', value);
      setHomeContentState(nextValue);
    },
    [repository],
  );

  const setLeasingBenefits = useCallback(
    async (value: LeasingBenefit[]) => {
      const nextValue = await repository.saveSection('leasingBenefits', value);
      setLeasingBenefitsState(nextValue);
    },
    [repository],
  );

  const setSpaceTypes = useCallback(
    async (value: SpaceType[]) => {
      const nextValue = await repository.saveSection('spaceTypes', value);
      setSpaceTypesState(nextValue);
    },
    [repository],
  );

  const setTestimonials = useCallback(
    async (value: Testimonial[]) => {
      const nextValue = await repository.saveSection('testimonials', value);
      setTestimonialsState(nextValue);
    },
    [repository],
  );

  const setLeasingDifferentials = useCallback(
    async (value: string[]) => {
      const nextValue = await repository.saveSection('leasingDifferentials', value);
      setLeasingDifferentialsState(nextValue);
    },
    [repository],
  );

  const setAboutData = useCallback(
    async (value: AboutContent) => {
      const nextValue = await repository.saveSection('aboutData', value);
      setAboutDataState(nextValue);
    },
    [repository],
  );

  const resetSection = useCallback(
    async <K extends ContentSection>(section: K): Promise<ContentState[K]> => {
      const defaultValue = await repository.removeSection(section);

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

      return defaultValue as ContentState[K];
    },
    [repository],
  );

  const resetAll = useCallback(async () => {
    const snapshot = await repository.clearAll();
    applySnapshotState(snapshot);
  }, [applySnapshotState, repository]);

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
