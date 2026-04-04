import { useEffect } from 'react';
import { buildPageTitle, seoConfig, type PageSeoMetadata } from '@/seo/config';

const DEFAULT_ROBOTS =
  'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';
const NO_INDEX_ROBOTS = 'noindex,nofollow';

function upsertMetaByName(name: string, content: string) {
  const selector = `meta[name="${name}"]`;
  let node = document.head.querySelector<HTMLMetaElement>(selector);

  if (!node) {
    node = document.createElement('meta');
    node.setAttribute('name', name);
    document.head.appendChild(node);
  }

  node.setAttribute('content', content);
}

function upsertMetaByProperty(property: string, content: string) {
  const selector = `meta[property="${property}"]`;
  let node = document.head.querySelector<HTMLMetaElement>(selector);

  if (!node) {
    node = document.createElement('meta');
    node.setAttribute('property', property);
    document.head.appendChild(node);
  }

  node.setAttribute('content', content);
}

function upsertCanonicalLink(href: string) {
  let node = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!node) {
    node = document.createElement('link');
    node.setAttribute('rel', 'canonical');
    document.head.appendChild(node);
  }

  node.setAttribute('href', href);
}

function resolveAbsoluteUrl(pathOrUrl?: string) {
  const base = seoConfig.siteUrl.replace(/\/$/, '');

  if (!pathOrUrl) {
    return `${base}/`;
  }

  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  if (pathOrUrl.startsWith('/')) {
    return `${base}${pathOrUrl}`;
  }

  return `${base}/${pathOrUrl}`;
}

function resolveCurrentCanonicalUrl(canonicalPath?: string) {
  if (canonicalPath) return resolveAbsoluteUrl(canonicalPath);

  if (typeof window === 'undefined') {
    return resolveAbsoluteUrl('/');
  }

  return resolveAbsoluteUrl(`${window.location.pathname}${window.location.search}`);
}

export function usePageSeo({
  title,
  description,
  canonicalPath,
  image,
  type = 'website',
  noIndex = false,
}: PageSeoMetadata) {
  useEffect(() => {
    const pageTitle = buildPageTitle(title);
    const pageDescription = (description || seoConfig.defaultDescription).trim();
    const canonicalUrl = resolveCurrentCanonicalUrl(canonicalPath);
    const socialImage = resolveAbsoluteUrl(image || seoConfig.defaultImage);
    const robots = noIndex ? NO_INDEX_ROBOTS : DEFAULT_ROBOTS;

    document.documentElement.lang = 'pt-BR';
    document.title = pageTitle;

    upsertMetaByName('description', pageDescription);
    upsertMetaByName('robots', robots);
    upsertMetaByName('twitter:card', seoConfig.twitterCard);
    upsertMetaByName('twitter:title', pageTitle);
    upsertMetaByName('twitter:description', pageDescription);
    upsertMetaByName('twitter:image', socialImage);

    upsertMetaByProperty('og:type', type);
    upsertMetaByProperty('og:site_name', seoConfig.siteName);
    upsertMetaByProperty('og:locale', seoConfig.locale);
    upsertMetaByProperty('og:title', pageTitle);
    upsertMetaByProperty('og:description', pageDescription);
    upsertMetaByProperty('og:url', canonicalUrl);
    upsertMetaByProperty('og:image', socialImage);

    upsertCanonicalLink(canonicalUrl);
  }, [canonicalPath, description, image, noIndex, title, type]);
}
