export interface Store {
  id: string;
  name: string;
  segment: string;
  segmentSlug: string;
  floor: string;
  description: string;
  longDescription: string;
  phone: string;
  instagram: string;
  images: string[];
  featured?: boolean;
}

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  readTime: string;
  featured?: boolean;
}

export interface Partner {
  id: string;
  name: string;
  logo?: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SiteSettings {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  instagram: string;
  facebook: string;
  navLinks: NavLink[];
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaHref: string;
  image: string;
}

export interface LeasingBenefit {
  icon: string;
  title: string;
  description: string;
}

export interface SpaceType {
  name: string;
  size: string;
  description: string;
}

export interface Testimonial {
  name: string;
  store: string;
  text: string;
}
