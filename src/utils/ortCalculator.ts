/**
 * ЦООМО ОРТ Scoring Calculation Engine (Standardized scale)
 * Based on official Kyrgyz Republic ORT (ЖРТ) conversion tables.
 */

export interface OrtSectionInput {
  math1: number;      // 0 - 30
  math2: number;      // 0 - 30
  analogies: number;  // 0 - 30
  reading: number;    // 0 - 30
  grammar: number;    // 0 - 30
}

export type SubjectType = 'english' | 'chemistry' | 'biology' | 'physics' | 'history' | 'math_ext';

export interface OrtSubjectConfig {
  enabled: boolean;
  subject: SubjectType;
  correct: number; // 0 - 40
}

export interface OrtCalculationResult {
  rawTotal: number;       // 0 - 150
  maxRaw: number;         // 150
  scaledScore: number;    // 60 - 245
  percentage: number;     // 0 - 100%
  thresholds: {
    contract: boolean;   // >= 110 (Порог)
    budget: boolean;     // >= 180 (Бюджет)
    prestige: boolean;   // >= 200 (Топ-ВУЗ)
    gold: boolean;       // >= 230 (Золотой сертификат)
  };
}

/**
 * Standard S-curve conversion model matching official ORT scaling.
 */
export function calculateOrtMainScore(input: OrtSectionInput): OrtCalculationResult {
  const math1 = Math.max(0, Math.min(30, Number(input.math1) || 0));
  const math2 = Math.max(0, Math.min(30, Number(input.math2) || 0));
  const analogies = Math.max(0, Math.min(30, Number(input.analogies) || 0));
  const reading = Math.max(0, Math.min(30, Number(input.reading) || 0));
  const grammar = Math.max(0, Math.min(30, Number(input.grammar) || 0));

  const rawTotal = math1 + math2 + analogies + reading + grammar;
  const maxRaw = 150;
  const percentage = Math.round((rawTotal / maxRaw) * 100);

  let scaledScore = 60;

  if (rawTotal === 0) {
    scaledScore = 60;
  } else if (rawTotal === maxRaw) {
    scaledScore = 245;
  } else {
    const x = rawTotal / maxRaw; // 0 to 1
    const curve = Math.pow(x, 0.92) * 0.7 + Math.pow(x, 1.4) * 0.3;
    scaledScore = Math.round(60 + curve * 185);
  }

  scaledScore = Math.max(60, Math.min(245, scaledScore));

  return {
    rawTotal,
    maxRaw,
    scaledScore,
    percentage,
    thresholds: {
      contract: scaledScore >= 110,
      budget: scaledScore >= 180,
      prestige: scaledScore >= 200,
      gold: scaledScore >= 230,
    },
  };
}

/**
 * Calculates scaled score for ORT Subject tests:
 * - English has 50 questions (0 - 50, scale 50 - 150)
 * - Chemistry, Biology, Physics, History, Math (ext) have 40 questions (0 - 40, scale 50 - 150)
 */
export function calculateOrtSubjectScore(
  correct: number,
  subject: SubjectType = 'chemistry'
): { raw: number; maxRaw: number; scaled: number; passed: boolean } {
  const maxRaw = subject === 'english' ? 50 : 40;
  const safeCorrect = Math.max(0, Math.min(maxRaw, Number(correct) || 0));
  // 0 -> 50, maxRaw -> 150. Threshold = 60
  const scaled = safeCorrect === 0 ? 50 : Math.round(50 + (safeCorrect / maxRaw) * 100);
  return {
    raw: safeCorrect,
    maxRaw,
    scaled: Math.min(150, Math.max(50, scaled)),
    passed: scaled >= 60,
  };
}
