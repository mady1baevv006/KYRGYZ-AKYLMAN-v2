export type AppLanguage = 'ru' | 'kg';

export interface StudentResult {
  id: number | string;
  name: string;
  nameKg?: string;
  score: number;
  scoreLabel?: string;
  scoreLabelKg?: string;
  university: string;
  universityKg?: string;
  photoUrl: string;
  isGoldCertificate?: boolean;
  avatarColor?: string;
}

export interface Question {
  id: number;
  variant_number?: number;
  section_id: number; // 1: Math 1, 2: Math 2, 3: Analogies & Sentence completion, 4: Reading & Comprehension, 5: Practical Grammar
  question_number: number;
  image_url: string;
  correct_answer: 'А' | 'Б' | 'В' | 'Г' | 'Д' | string;
  topic?: string;
  sub_section?: string;
  skill?: string;
  title?: string;
  theme_color?: string;
  language?: 'ru' | 'kg';
  is_practice?: boolean;
}

export interface Variant {
  id: number;
  title: string;
  themeColor: string;
  language: 'ru' | 'kg';
  isPractice: boolean;
  isNew: boolean;
  tags: string[];
  status?: string;
  availableSections: number[];
  pdfUrl?: string;
}

export interface TestDraft {
  variantId: string;
  mode: 'full' | 'section' | 'custom';
  url: string;
}

export interface RecommendedChannel {
  id: number;
  name: string;
  description: string;
  link: string;
  avatar: string;
  members: string;
}

export type SectionMap = {
  [key: number]: string;
};

export type SectionTimeLimits = Record<number, number>;

export type SubscriptionTier = 'free' | 'standard' | 'premium';

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  nameKg: string;
  price: number;
  priceLabel: string;
  priceLabelKg: string;
  periodLabel: string;
  periodLabelKg: string;
  badge?: string;
  badgeKg?: string;
  description: string;
  descriptionKg: string;
  features: string[];
  featuresKg: string[];
  popular?: boolean;
  highlight?: boolean;
}

export interface AnalyticDetail {
  title: string;
  total: number;
  correct: number;
  percent: number;
}

export interface CalculationResponse {
  totalScore: number;
  maxScore: number;
  mainScore: number;
  mathScore: number;
  sections: {
    [sectionId: number]: {
      name: string;
      total: number;
      correct: number;
      score: number;
      details?: Record<number, { isCorrect: boolean; userAnswer: string; correctAnswer: string; sub_section?: string; skill?: string }>;
    };
  };
  topicsAnalytics?: {
    bySubSection: Record<string, AnalyticDetail>;
    bySkill: Record<string, AnalyticDetail>;
  };
  recommendations?: string[];
  certificateId?: string;
  date?: string;
  variantId?: string | number;
}
