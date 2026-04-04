import type { AboutContent } from '@/types';
import { hasMinLength, isRequired, normalizeText } from '@/utils/validation';

export type AboutSectionFormData = AboutContent;

export interface AboutSectionSavePayload extends AboutContent {
  removedCount: number;
}

export interface AboutSectionSaveResult {
  payload?: AboutSectionSavePayload;
  error?: string;
}

export function createAboutSectionFormData(input: AboutContent): AboutSectionFormData {
  return {
    ...input,
    history: [...input.history],
    values: input.values.map((value) => ({ ...value })),
    differentials: [...input.differentials],
    team: input.team.map((member) => ({ ...member })),
  };
}

function normalizeAboutSectionData(form: AboutSectionFormData): AboutSectionFormData {
  return {
    mission: normalizeText(form.mission),
    vision: normalizeText(form.vision),
    history: form.history.map((item) => normalizeText(item)),
    values: form.values.map((item) => ({
      title: normalizeText(item.title),
      description: normalizeText(item.description),
    })),
    differentials: form.differentials.map((item) => normalizeText(item)),
    team: form.team.map((item) => ({
      name: normalizeText(item.name),
      role: normalizeText(item.role),
      description: normalizeText(item.description),
    })),
  };
}

export function buildAboutSectionSaveResult(
  form: AboutSectionFormData,
): AboutSectionSaveResult {
  const normalized = normalizeAboutSectionData(form);

  const hasIncompleteValue = normalized.values.some(
    (value) =>
      [value.title, value.description].some(isRequired) &&
      ![value.title, value.description].every(isRequired),
  );
  const hasIncompleteTeam = normalized.team.some(
    (member) =>
      [member.name, member.role, member.description].some(isRequired) &&
      ![member.name, member.role, member.description].every(isRequired),
  );

  const validHistory = normalized.history.filter(isRequired);
  const validDifferentials = normalized.differentials.filter(isRequired);
  const validValues = normalized.values.filter((value) =>
    [value.title, value.description].every(isRequired),
  );
  const validTeam = normalized.team.filter((member) =>
    [member.name, member.role, member.description].every(isRequired),
  );

  if (!isRequired(normalized.mission) || !hasMinLength(normalized.mission, 20)) {
    return { error: 'Missão deve ter pelo menos 20 caracteres.' };
  }
  if (!isRequired(normalized.vision) || !hasMinLength(normalized.vision, 20)) {
    return { error: 'Visão deve ter pelo menos 20 caracteres.' };
  }
  if (hasIncompleteValue) {
    return { error: 'Complete ou remova valores incompletos.' };
  }
  if (hasIncompleteTeam) {
    return { error: 'Complete ou remova membros de equipe incompletos.' };
  }
  if (validHistory.length === 0) {
    return { error: 'Adicione ao menos um parágrafo de história.' };
  }
  if (validValues.length === 0) {
    return { error: 'Adicione ao menos um valor institucional.' };
  }
  if (validDifferentials.length === 0) {
    return { error: 'Adicione ao menos um diferencial.' };
  }
  if (validTeam.length === 0) {
    return { error: 'Adicione ao menos um membro da equipe.' };
  }

  const removedCount =
    normalized.history.length - validHistory.length +
    normalized.values.length - validValues.length +
    normalized.differentials.length - validDifferentials.length +
    normalized.team.length - validTeam.length;

  return {
    payload: {
      mission: normalized.mission,
      vision: normalized.vision,
      history: validHistory,
      values: validValues,
      differentials: validDifferentials,
      team: validTeam,
      removedCount,
    },
  };
}
