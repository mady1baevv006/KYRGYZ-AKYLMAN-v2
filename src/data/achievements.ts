import { UserProfile, UserTestRecord } from '../context/AuthContext';

export interface Achievement {
  id: string;
  icon: string; // emoji or icon name
  titleRu: string;
  titleKg: string;
  descRu: string;
  descKg: string;
  category: 'tests' | 'score' | 'subject' | 'profile';
  maxProgress: number;
  getProgress: (user: UserProfile, history: UserTestRecord[]) => { current: number; isUnlocked: boolean };
}

export const ACHIEVEMENTS_LIST: Achievement[] = [
  {
    id: 'first_step',
    icon: '🚀',
    titleRu: 'Первый шаг',
    titleKg: 'Биринчи кадам',
    descRu: 'Завершите свой самый первый пробный тест на платформе',
    descKg: 'Платформада эң биринчи сыноо тестиңизди аяктаңыз',
    category: 'tests',
    maxProgress: 1,
    getProgress: (user, history) => {
      const count = history.length;
      return { current: Math.min(1, count), isUnlocked: count >= 1 };
    },
  },
  {
    id: 'threshold_passed',
    icon: '🎯',
    titleRu: 'Порог взят (110+)',
    titleKg: 'Босого баллдан өттү (110+)',
    descRu: 'Наберите более 110 баллов в основном тесте ОРТ',
    descKg: 'Негизги ЖРТ тестинен 110дон жогору балл топтоңуз',
    category: 'score',
    maxProgress: 110,
    getProgress: (user, history) => {
      const maxScore = history.length > 0 ? Math.max(...history.map((h) => h.totalScore)) : 0;
      return { current: Math.min(110, maxScore), isUnlocked: maxScore >= 110 };
    },
  },
  {
    id: 'budget_candidate',
    icon: '🎓',
    titleRu: 'Претендент на бюджет (180+)',
    titleKg: 'Бюджетке талапкер (180+)',
    descRu: 'Наберите 180+ баллов для поступления на бюджетные места',
    descKg: 'Бюджеттик орундарга тапшыруу үчүн 180ден жогору балл топтоңуз',
    category: 'score',
    maxProgress: 180,
    getProgress: (user, history) => {
      const maxScore = history.length > 0 ? Math.max(...history.map((h) => h.totalScore)) : 0;
      return { current: Math.min(180, maxScore), isUnlocked: maxScore >= 180 };
    },
  },
  {
    id: 'top_score',
    icon: '⭐',
    titleRu: 'Топ-ВУЗ (200+)',
    titleKg: 'Топ-ЖОЖ (200+)',
    descRu: 'Преодолейте отметку в 200 баллов для ведущих университетов',
    descKg: 'Алдыңкы университеттер үчүн 200 баллдык чекти багындырыңыз',
    category: 'score',
    maxProgress: 200,
    getProgress: (user, history) => {
      const maxScore = history.length > 0 ? Math.max(...history.map((h) => h.totalScore)) : 0;
      return { current: Math.min(200, maxScore), isUnlocked: maxScore >= 200 };
    },
  },
  {
    id: 'gold_candidate',
    icon: '🏆',
    titleRu: 'Золотой сертификат (230+)',
    titleKg: 'Алтын сертификат (230+)',
    descRu: 'Наберите 230+ баллов — уровень Топ-50 лучших выпускников КР',
    descKg: '230дан жогору балл — КР эң мыкты 50 бүтүрүүчүсүнүн деңгээли',
    category: 'score',
    maxProgress: 230,
    getProgress: (user, history) => {
      const maxScore = history.length > 0 ? Math.max(...history.map((h) => h.totalScore)) : 0;
      return { current: Math.min(230, maxScore), isUnlocked: maxScore >= 230 };
    },
  },
  {
    id: 'math_expert',
    icon: '📐',
    titleRu: 'Знаток математики',
    titleKg: 'Математика чебери',
    descRu: 'Решите блок или секцию математики с точностью 85% и выше',
    descKg: 'Математика бөлүгүн 85% жана андан жогору тактык менен тапшырыңыз',
    category: 'subject',
    maxProgress: 85,
    getProgress: (user, history) => {
      const mathTests = history.filter((h) => (h.subject && h.subject.toLowerCase().includes('матем')) || h.mode === 'custom');
      const maxAcc = mathTests.length > 0 ? Math.max(...mathTests.map((h) => h.accuracy || 0)) : 0;
      return { current: Math.min(85, Math.round(maxAcc)), isUnlocked: maxAcc >= 85 };
    },
  },
  {
    id: 'marathon_runner',
    icon: '⚡',
    titleRu: 'Марафонец ОРТ',
    titleKg: 'ЖРТ марафончусу',
    descRu: 'Пройдите 3 полных варианта тестирования',
    descKg: '3 толук тесттин вариантын аягына чейин тапшырыңыз',
    category: 'tests',
    maxProgress: 3,
    getProgress: (user, history) => {
      const fullCount = history.filter((h) => h.mode === 'full' || h.totalQuestions >= 100).length;
      return { current: Math.min(3, fullCount), isUnlocked: fullCount >= 3 };
    },
  },
  {
    id: 'goal_oriented',
    icon: '🎯',
    titleRu: 'Четкая цель',
    titleKg: 'Так максат',
    descRu: 'Укажите целевой балл и университет мечты в профиле',
    descKg: 'Профилде максаттуу баллды жана каалаган ЖОЖду белгилеңиз',
    category: 'profile',
    maxProgress: 1,
    getProgress: (user) => {
      const hasGoal = Boolean(user.targetScore && user.targetUniversity && user.targetUniversity.length > 3);
      return { current: hasGoal ? 1 : 0, isUnlocked: hasGoal };
    },
  },
  {
    id: 'high_accuracy',
    icon: '🔥',
    titleRu: 'Снайперская точность',
    titleKg: 'Мергендик тактык',
    descRu: 'Достигните точности ответов 90%+ в любом тесте',
    descKg: 'Каалаган тестте 90%дан жогору тактыкка жетиңиз',
    category: 'score',
    maxProgress: 90,
    getProgress: (user, history) => {
      const maxAcc = history.length > 0 ? Math.max(...history.map((h) => h.accuracy || 0)) : 0;
      return { current: Math.min(90, Math.round(maxAcc)), isUnlocked: maxAcc >= 90 };
    },
  },
];
