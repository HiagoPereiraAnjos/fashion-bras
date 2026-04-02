import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Store, BlogPost, Partner, SiteSettings } from '@/types';
import { storesData as defaultStores, storeSegments as defaultSegments } from '@/data/storesData';
import { blogPostsData as defaultPosts, blogCategories as defaultCategories } from '@/data/blogPostsData';
import { partnersData as defaultPartners } from '@/data/partnersData';
import { siteSettings as defaultSettings } from '@/data/siteSettings';
import { leasingBenefits as defaultBenefits, spaceTypes as defaultSpaces, testimonials as defaultTestimonials, leasingDifferentials as defaultDifferentials } from '@/data/leasingData';
import { aboutData as defaultAbout } from '@/data/aboutData';
import type { LeasingBenefit, SpaceType, Testimonial } from '@/types';

interface AboutData {
  history: string[];
  mission: string;
  vision: string;
  values: { title: string; description: string }[];
  differentials: string[];
  team: { name: string; role: string; description: string }[];
}

interface AdminDataContextType {
  // Data
  stores: Store[];
  blogPosts: BlogPost[];
  partners: Partner[];
  siteSettings: SiteSettings;
  leasingBenefits: LeasingBenefit[];
  spaceTypes: SpaceType[];
  testimonials: Testimonial[];
  leasingDifferentials: string[];
  aboutData: AboutData;

  // Setters
  setStores: (stores: Store[]) => void;
  setBlogPosts: (posts: BlogPost[]) => void;
  setPartners: (partners: Partner[]) => void;
  setSiteSettings: (settings: SiteSettings) => void;
  setLeasingBenefits: (benefits: LeasingBenefit[]) => void;
  setSpaceTypes: (types: SpaceType[]) => void;
  setTestimonials: (testimonials: Testimonial[]) => void;
  setLeasingDifferentials: (diffs: string[]) => void;
  setAboutData: (data: AboutData) => void;

  // Reset
  resetAll: () => void;
  resetSection: (section: string) => void;

  hasCustomData: boolean;
}

const AdminDataContext = createContext<AdminDataContextType | null>(null);

const STORAGE_KEY = 'fashionbras_admin_data';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${key}`);
    if (stored) return JSON.parse(stored) as T;
  } catch {}
  return fallback;
}

function saveToStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(`${STORAGE_KEY}_${key}`, JSON.stringify(value));
  } catch {}
}

function removeFromStorage(key: string) {
  try {
    localStorage.removeItem(`${STORAGE_KEY}_${key}`);
  } catch {}
}

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [stores, setStoresState] = useState<Store[]>(() => loadFromStorage('stores', defaultStores));
  const [blogPosts, setBlogPostsState] = useState<BlogPost[]>(() => loadFromStorage('blogPosts', defaultPosts));
  const [partners, setPartnersState] = useState<Partner[]>(() => loadFromStorage('partners', defaultPartners));
  const [siteSettingsState, setSiteSettingsState] = useState<SiteSettings>(() => loadFromStorage('siteSettings', defaultSettings));
  const [leasingBenefits, setLeasingBenefitsState] = useState<LeasingBenefit[]>(() => loadFromStorage('leasingBenefits', defaultBenefits));
  const [spaceTypes, setSpaceTypesState] = useState<SpaceType[]>(() => loadFromStorage('spaceTypes', defaultSpaces));
  const [testimonials, setTestimonialsState] = useState<Testimonial[]>(() => loadFromStorage('testimonials', defaultTestimonials));
  const [leasingDifferentials, setLeasingDifferentialsState] = useState<string[]>(() => loadFromStorage('leasingDifferentials', defaultDifferentials));
  const [aboutData, setAboutDataState] = useState<AboutData>(() => loadFromStorage('aboutData', defaultAbout));

  const setStores = useCallback((v: Store[]) => { setStoresState(v); saveToStorage('stores', v); }, []);
  const setBlogPosts = useCallback((v: BlogPost[]) => { setBlogPostsState(v); saveToStorage('blogPosts', v); }, []);
  const setPartners = useCallback((v: Partner[]) => { setPartnersState(v); saveToStorage('partners', v); }, []);
  const setSiteSettings = useCallback((v: SiteSettings) => { setSiteSettingsState(v); saveToStorage('siteSettings', v); }, []);
  const setLeasingBenefits = useCallback((v: LeasingBenefit[]) => { setLeasingBenefitsState(v); saveToStorage('leasingBenefits', v); }, []);
  const setSpaceTypes = useCallback((v: SpaceType[]) => { setSpaceTypesState(v); saveToStorage('spaceTypes', v); }, []);
  const setTestimonials = useCallback((v: Testimonial[]) => { setTestimonialsState(v); saveToStorage('testimonials', v); }, []);
  const setLeasingDifferentials = useCallback((v: string[]) => { setLeasingDifferentialsState(v); saveToStorage('leasingDifferentials', v); }, []);
  const setAboutData = useCallback((v: AboutData) => { setAboutDataState(v); saveToStorage('aboutData', v); }, []);

  const resetSection = useCallback((section: string) => {
    switch (section) {
      case 'stores': setStores(defaultStores); removeFromStorage('stores'); break;
      case 'blogPosts': setBlogPosts(defaultPosts); removeFromStorage('blogPosts'); break;
      case 'partners': setPartners(defaultPartners); removeFromStorage('partners'); break;
      case 'siteSettings': setSiteSettings(defaultSettings); removeFromStorage('siteSettings'); break;
      case 'leasingBenefits': setLeasingBenefits(defaultBenefits); removeFromStorage('leasingBenefits'); break;
      case 'spaceTypes': setSpaceTypes(defaultSpaces); removeFromStorage('spaceTypes'); break;
      case 'testimonials': setTestimonials(defaultTestimonials); removeFromStorage('testimonials'); break;
      case 'leasingDifferentials': setLeasingDifferentials(defaultDifferentials); removeFromStorage('leasingDifferentials'); break;
      case 'aboutData': setAboutData(defaultAbout); removeFromStorage('aboutData'); break;
    }
  }, [setStores, setBlogPosts, setPartners, setSiteSettings, setLeasingBenefits, setSpaceTypes, setTestimonials, setLeasingDifferentials, setAboutData]);

  const resetAll = useCallback(() => {
    ['stores','blogPosts','partners','siteSettings','leasingBenefits','spaceTypes','testimonials','leasingDifferentials','aboutData']
      .forEach(removeFromStorage);
    setStoresState(defaultStores);
    setBlogPostsState(defaultPosts);
    setPartnersState(defaultPartners);
    setSiteSettingsState(defaultSettings);
    setLeasingBenefitsState(defaultBenefits);
    setSpaceTypesState(defaultSpaces);
    setTestimonialsState(defaultTestimonials);
    setLeasingDifferentialsState(defaultDifferentials);
    setAboutDataState(defaultAbout);
  }, []);

  const hasCustomData = !!localStorage.getItem(`${STORAGE_KEY}_stores`)
    || !!localStorage.getItem(`${STORAGE_KEY}_blogPosts`)
    || !!localStorage.getItem(`${STORAGE_KEY}_siteSettings`);

  return (
    <AdminDataContext.Provider value={{
      stores, blogPosts, partners, siteSettings: siteSettingsState,
      leasingBenefits, spaceTypes, testimonials, leasingDifferentials, aboutData,
      setStores, setBlogPosts, setPartners, setSiteSettings,
      setLeasingBenefits, setSpaceTypes, setTestimonials, setLeasingDifferentials, setAboutData,
      resetAll, resetSection, hasCustomData,
    }}>
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error('useAdminData must be used within AdminDataProvider');
  return ctx;
}
