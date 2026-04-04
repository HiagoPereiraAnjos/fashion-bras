import type { LeasingBenefit, SpaceType, Testimonial } from '@/types';
import { isRequired, normalizeText } from '@/utils/validation';

export interface LeasingSectionFormData {
  benefits: LeasingBenefit[];
  spaces: SpaceType[];
  testimonials: Testimonial[];
  differentials: string[];
}

export interface LeasingSectionSavePayload extends LeasingSectionFormData {
  removedCount: number;
}

export interface LeasingSectionSaveResult {
  payload?: LeasingSectionSavePayload;
  error?: string;
}

export function createLeasingSectionFormData(
  input: LeasingSectionFormData,
): LeasingSectionFormData {
  return {
    benefits: input.benefits.map((benefit) => ({ ...benefit })),
    spaces: input.spaces.map((space) => ({ ...space })),
    testimonials: input.testimonials.map((testimonial) => ({ ...testimonial })),
    differentials: [...input.differentials],
  };
}

function normalizeBenefits(benefits: LeasingBenefit[]): LeasingBenefit[] {
  return benefits.map((benefit) => ({
    icon: normalizeText(benefit.icon),
    title: normalizeText(benefit.title),
    description: normalizeText(benefit.description),
  }));
}

function normalizeSpaces(spaces: SpaceType[]): SpaceType[] {
  return spaces.map((space) => ({
    name: normalizeText(space.name),
    size: normalizeText(space.size),
    description: normalizeText(space.description),
  }));
}

function normalizeTestimonials(testimonials: Testimonial[]): Testimonial[] {
  return testimonials.map((testimonial) => ({
    name: normalizeText(testimonial.name),
    store: normalizeText(testimonial.store),
    text: normalizeText(testimonial.text),
  }));
}

function normalizeDifferentials(differentials: string[]): string[] {
  return differentials.map((item) => normalizeText(item));
}

function hasAnyAndNotAll(values: string[]): boolean {
  return values.some(isRequired) && !values.every(isRequired);
}

export function buildLeasingSectionSaveResult(
  form: LeasingSectionFormData,
): LeasingSectionSaveResult {
  const normalizedBenefits = normalizeBenefits(form.benefits);
  const normalizedSpaces = normalizeSpaces(form.spaces);
  const normalizedTestimonials = normalizeTestimonials(form.testimonials);
  const normalizedDifferentials = normalizeDifferentials(form.differentials);

  const hasIncompleteBenefit = normalizedBenefits.some((benefit) =>
    hasAnyAndNotAll([benefit.icon, benefit.title, benefit.description]),
  );
  const hasIncompleteSpace = normalizedSpaces.some((space) =>
    hasAnyAndNotAll([space.name, space.size, space.description]),
  );
  const hasIncompleteTestimonial = normalizedTestimonials.some((testimonial) =>
    hasAnyAndNotAll([testimonial.name, testimonial.store, testimonial.text]),
  );

  const validBenefits = normalizedBenefits.filter((benefit) =>
    [benefit.icon, benefit.title, benefit.description].every(isRequired),
  );
  const validSpaces = normalizedSpaces.filter((space) =>
    [space.name, space.size, space.description].every(isRequired),
  );
  const validTestimonials = normalizedTestimonials.filter((testimonial) =>
    [testimonial.name, testimonial.store, testimonial.text].every(isRequired),
  );
  const validDifferentials = normalizedDifferentials.filter(isRequired);

  if (hasIncompleteBenefit) {
    return { error: 'Complete ou remova benefícios incompletos.' };
  }
  if (hasIncompleteSpace) {
    return { error: 'Complete ou remova tipos de espaço incompletos.' };
  }
  if (hasIncompleteTestimonial) {
    return { error: 'Complete ou remova depoimentos incompletos.' };
  }
  if (validBenefits.length === 0) {
    return { error: 'Adicione pelo menos um benefício válido.' };
  }
  if (validSpaces.length === 0) {
    return { error: 'Adicione pelo menos um tipo de espaço válido.' };
  }
  if (validTestimonials.length === 0) {
    return { error: 'Adicione pelo menos um depoimento válido.' };
  }
  if (validDifferentials.length === 0) {
    return { error: 'Adicione pelo menos um diferencial válido.' };
  }

  const removedCount =
    normalizedBenefits.length - validBenefits.length +
    normalizedSpaces.length - validSpaces.length +
    normalizedTestimonials.length - validTestimonials.length +
    normalizedDifferentials.length - validDifferentials.length;

  return {
    payload: {
      benefits: validBenefits,
      spaces: validSpaces,
      testimonials: validTestimonials,
      differentials: validDifferentials,
      removedCount,
    },
  };
}
