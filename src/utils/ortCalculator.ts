/**
 * SchoolClub.kg Exact ORT (ЖРТ) Scoring Engine
 * Synchronized with official Kyrgyz Republic ORT (ЦООМО) 3-section model:
 * 1. Математика (Math 1 + Math 2, 60 questions) -> max 67 points
 * 2. Аналогии и чтение текста (Analogies + Reading, 60 questions) -> max 121 points
 * 3. Практическая грамматика (Grammar, 30 questions) -> max 57 points
 * Total maximum = 67 + 121 + 57 = 245 points.
 *
 * Algorithm matches https://schoolclub.kg/services/calculator backend:
 * - Math score: roundHalfToEven(67 * mathPct / 100)
 * - Analogy & Reading score: roundHalfToEven(121 * analogyPct / 100)
 * - Grammar score: roundHalfToEven(57 * grammarPct / 100)
 * - Levels: A (0-120), B (121-170), C (171-245)
 */

export interface OrtSectionInput {
  math1?: number;      // 0 - 30
  math2?: number;      // 0 - 30
  analogies?: number;  // 0 - 30
  reading?: number;    // 0 - 30
  grammar?: number;    // 0 - 30
  mathPct?: number;    // 0 - 100%
  analogyPct?: number; // 0 - 100%
  grammarPct?: number; // 0 - 100%
}

export type SubjectType = 'english' | 'chemistry' | 'biology' | 'physics' | 'history' | 'math_ext';

export interface OrtSubjectConfig {
  enabled: boolean;
  subject: SubjectType;
  correct: number; // 0 - 40 (or 0 - 50 for english)
}

export interface SectionScoreInfo {
  score: number;
  max: number;
  pct: number;
}

export interface OrtCalculationResult {
  rawTotal: number;       // 0 - 150
  maxRaw: number;         // 150
  scaledScore: number;    // 0 - 245 (SchoolClub exact score)
  percentage: number;     // 0 - 100%
  level: 'A' | 'B' | 'C';
  levelLabel: {
    ru: string;
    ky: string;
  };
  levelDesc: {
    ru: string;
    ky: string;
  };
  sections: {
    math: SectionScoreInfo;      // max 67
    analogy: SectionScoreInfo;   // max 121
    grammar: SectionScoreInfo;   // max 57
  };
  thresholds: {
    contract: boolean;   // >= 110 (Порог)
    budget: boolean;     // >= 180 (Бюджет)
    prestige: boolean;   // >= 200 (Топ-ВУЗ)
    gold: boolean;       // >= 230 (Золотой сертификат)
  };
}

/**
 * Banker's Rounding (Round half to even) matching SchoolClub backend exactly:
 * e.g., round(33.5) = 34, round(60.5) = 60, round(28.5) = 28
 */
export function roundHalfToEven(num: number): number {
  const floor = Math.floor(num);
  const diff = num - floor;
  if (Math.abs(diff - 0.5) < 1e-9) {
    return floor % 2 === 0 ? floor : floor + 1;
  }
  return Math.round(num);
}

/**
 * SchoolClub.kg Exact ORT Score Calculator
 */
export function calculateOrtMainScore(input: OrtSectionInput): OrtCalculationResult {
  const math1 = Math.max(0, Math.min(30, Number(input.math1) || 0));
  const math2 = Math.max(0, Math.min(30, Number(input.math2) || 0));
  const analogies = Math.max(0, Math.min(30, Number(input.analogies) || 0));
  const reading = Math.max(0, Math.min(30, Number(input.reading) || 0));
  const grammar = Math.max(0, Math.min(30, Number(input.grammar) || 0));

  const mathRaw = math1 + math2; // 0 - 60
  const analogyRaw = analogies + reading; // 0 - 60
  const grammarRaw = grammar; // 0 - 30
  const rawTotal = mathRaw + analogyRaw + grammarRaw; // 0 - 150
  const maxRaw = 150;
  const percentage = Math.round((rawTotal / maxRaw) * 100);

  // Section Percentages (matching the 3 official ЦООМО result blanks)
  const mathPct = input.mathPct !== undefined
    ? Math.max(0, Math.min(100, Math.round(Number(input.mathPct))))
    : (mathRaw === 0 ? 0 : Math.round((mathRaw / 60) * 100));

  const analogyPct = input.analogyPct !== undefined
    ? Math.max(0, Math.min(100, Math.round(Number(input.analogyPct))))
    : (analogyRaw === 0 ? 0 : Math.round((analogyRaw / 60) * 100));

  const grammarPct = input.grammarPct !== undefined
    ? Math.max(0, Math.min(100, Math.round(Number(input.grammarPct))))
    : (grammarRaw === 0 ? 0 : Math.round((grammarRaw / 30) * 100));

  // Scaled Section Points according to SchoolClub formulas
  const mathScore = Math.min(67, Math.max(0, roundHalfToEven((67 * mathPct) / 100)));
  const analogyScore = Math.min(121, Math.max(0, roundHalfToEven((121 * analogyPct) / 100)));
  const grammarScore = Math.min(57, Math.max(0, roundHalfToEven((57 * grammarPct) / 100)));

  const scaledScore = Math.min(245, Math.max(0, mathScore + analogyScore + grammarScore));

  // SchoolClub Level Classification
  let level: 'A' | 'B' | 'C' = 'A';
  if (scaledScore >= 171) {
    level = 'C';
  } else if (scaledScore >= 121) {
    level = 'B';
  } else {
    level = 'A';
  }

  const levelLabels = {
    A: { ru: 'Уровень A — базовый', ky: 'A деңгээли — базалык' },
    B: { ru: 'Уровень B — средний', ky: 'B деңгээли — орто' },
    C: { ru: 'Уровень C — продвинутый', ky: 'C деңгээли — жогорку' },
  };

  const levelDescs = {
    A: { ru: 'Базовый уровень — хорошее начало', ky: 'Базалык деңгээл — баштоо үчүн жакшы' },
    B: { ru: 'Средний уровень — крепкая база', ky: 'Орто деңгээл — бекем негиз бар' },
    C: { ru: 'Продвинутый — путь к золотому сертификату', ky: 'Жогорку деңгээл — алтын сертификатка жол' },
  };

  return {
    rawTotal,
    maxRaw,
    scaledScore,
    percentage,
    level,
    levelLabel: levelLabels[level],
    levelDesc: levelDescs[level],
    sections: {
      math: { score: mathScore, max: 67, pct: mathPct },
      analogy: { score: analogyScore, max: 121, pct: analogyPct },
      grammar: { score: grammarScore, max: 57, pct: grammarPct },
    },
    thresholds: {
      contract: scaledScore >= 110,
      budget: scaledScore >= 180,
      prestige: scaledScore >= 200,
      gold: scaledScore >= 230,
    },
  };
}

/**
 * Direct percentage-based calculator (SchoolClub.kg mode)
 */
export function calculateOrtFromPercentages(
  mathPct: number,
  analogyPct: number,
  grammarPct: number
): OrtCalculationResult {
  return calculateOrtMainScore({ mathPct, analogyPct, grammarPct });
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
