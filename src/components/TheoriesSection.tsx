import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Lock,
  Crown,
  Zap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Play,
  Layers,
  ChevronRight,
  School,
  AlertTriangle,
  GraduationCap,
  Calculator,
  Compass,
  FileText,
  Video,
  Image as ImageIcon,
  Star,
  Eye,
  X,
  FileCheck,
  RotateCcw,
} from 'lucide-react';
import { AppLanguage, SubscriptionPlan } from '../types';
import { UserProfile, useAuth } from '../context/AuthContext';
import { THEORIES_DATA, TheoryBlock, TheoryTopic } from '../data/theoriesData';
import { SUBSCRIPTION_PLANS } from '../data/subscriptions';
import { TheoryPlanSelectionModal } from './TheoryPlanSelectionModal';
import { TrialNoticeBanner } from './TrialNoticeBanner';
import { MathBackgroundElements } from './MathBackgroundElements';

interface TheoriesSectionProps {
  user: UserProfile;
  lang: AppLanguage;
  onOpenSubscriptionModal: (plan?: SubscriptionPlan) => void;
}

interface HomeworkQuestion {
  id: number;
  questionRu: string;
  questionKg: string;
  options: string[];
  correctIdx: number;
  explanationRu: string;
  explanationKg: string;
}

const HOMEWORK_QUESTIONS: HomeworkQuestion[] = [
  {
    id: 1,
    questionRu: 'Какое наименьшее натуральное число удовлетворяет неравенству 2x - 7 > 0?',
    questionKg: '2x - 7 > 0 барабарсыздыгын канааттандырган эң кичине натуралдык санды тапкыла:',
    options: ['0', '3', '4', '5'],
    correctIdx: 2,
    explanationRu: '2x > 7 => x > 3.5. Ближайшее натуральное число больше 3.5 — это 4. Помните: 0 не является натуральным числом!',
    explanationKg: '2x > 7 => x > 3.5. 3.5тен чоң эң кичине натуралдык сан бул 4. Эске салсак: 0 натуралдык сан эмес!',
  },
  {
    id: 2,
    questionRu: 'Сколько целых чисел расположено строго между числами -4.8 и 3.2 на числовой прямой?',
    questionKg: 'Сан огунда -4.8 жана 3.2 сандарынын арасында канча бүтүн сан жайгашкан?',
    options: ['7', '8', '9', '6'],
    correctIdx: 1,
    explanationRu: 'Целые числа в этом интервале: -4, -3, -2, -1, 0, 1, 2, 3. Всего 8 целых чисел.',
    explanationKg: 'Бул аралыктагы бүтүн сандар: -4, -3, -2, -1, 0, 1, 2, 3. Бардыгы 8 бүтүн сан.',
  },
  {
    id: 3,
    questionRu: 'Произведение любых трех последовательных целых чисел обязательно делится на:',
    questionKg: 'Каалаган удаалаш үч бүтүн сандын көбөйтүндүсү сөзсүз кайсы санга бөлүнөт?',
    options: ['4', '6', '9', '12'],
    correctIdx: 1,
    explanationRu: 'Среди 3 последовательных чисел как минимум одно четное (делится на 2) и одно кратно 3. Значит их произведение всегда кратно 2 * 3 = 6.',
    explanationKg: 'Удаалаш 3 сандын ичинен жок дегенде бирөө жуп (2ге бөлүнөт) жана бирөө 3кө бөлүнөт. Демек көбөйтүндүсү дайыма 2 * 3 = 6га бөлүнөт.',
  },
];

export const TheoriesSection: React.FC<TheoriesSectionProps> = ({
  user,
  lang,
  onOpenSubscriptionModal,
}) => {
  const isKg = lang === 'kg';
  const { subscriptionStatus, openTrialWelcomeModal } = useAuth();

  // Effective plan logic handles Day 1 Premium, Day 2 Standard, and Day 3 Free
  const isSubscribed =
    subscriptionStatus.effectivePlan === 'standard' ||
    subscriptionStatus.effectivePlan === 'premium' ||
    user.isPaid;
  const isPremium =
    subscriptionStatus.effectivePlan === 'premium' ||
    (user.isPaid && user.subscriptionPlan === 'premium');

  // Navigation states: 'overview' -> 'blocks' -> 'topic'
  const [currentView, setCurrentView] = useState<'overview' | 'blocks' | 'topic'>('overview');
  const [selectedSubjectId, setSelectedSubjectId] = useState<'algebra' | 'geometry' | 'russian' | 'english'>('algebra');
  const [selectedBlock, setSelectedBlock] = useState<TheoryBlock | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<TheoryTopic | null>(null);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [subjectModalMode, setSubjectModalMode] = useState<'math_only' | 'all'>('all');
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // Interactive Homework state
  const [homeworkAnswers, setHomeworkAnswers] = useState<Record<number, number>>({});
  const [showHomeworkResults, setShowHomeworkResults] = useState(false);

  const subject = THEORIES_DATA[selectedSubjectId] || THEORIES_DATA['algebra'];

  const handleOpenPlanChoice = () => {
    setIsPlanModalOpen(true);
  };

  const handleSelectPlanFromModal = (plan: SubscriptionPlan) => {
    setIsPlanModalOpen(false);
    onOpenSubscriptionModal(plan);
  };

  const handleOpenMathModal = () => {
    setSubjectModalMode('math_only');
    setIsSubjectModalOpen(true);
  };

  const handleOpenGeneralSubjectModal = () => {
    setSubjectModalMode('all');
    setIsSubjectModalOpen(true);
  };

  const handleSelectSubject = (subjectId: 'algebra' | 'geometry' | 'russian' | 'english') => {
    setSelectedSubjectId(subjectId);
    setIsSubjectModalOpen(false);
    setCurrentView('blocks');
    setSelectedBlock(null);
    setSelectedTopic(null);
  };

  const handleSelectTopic = (block: TheoryBlock, topic: TheoryTopic) => {
    if (!topic.isAvailable) return;
    setSelectedBlock(block);
    setSelectedTopic(topic);
    setCurrentView('topic');
    setHomeworkAnswers({});
    setShowHomeworkResults(false);
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleBackToOverview = () => {
    setCurrentView('overview');
    setSelectedBlock(null);
    setSelectedTopic(null);
  };

  const handleBackToBlocks = () => {
    setCurrentView('blocks');
    setSelectedTopic(null);
  };

  const handleSelectHomeworkOption = (qId: number, optionIdx: number) => {
    if (showHomeworkResults) return;
    setHomeworkAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const calculateHomeworkScore = () => {
    let correct = 0;
    HOMEWORK_QUESTIONS.forEach((q) => {
      if (homeworkAnswers[q.id] === q.correctIdx) {
        correct++;
      }
    });
    return correct;
  };

  return (
    <div className="space-y-6">
      {/* Live Trial Notice Banner */}
      <TrialNoticeBanner
        lang={lang}
        onOpenUpgradeModal={handleOpenPlanChoice}
        onOpenTrialDetails={openTrialWelcomeModal}
      />

      {/* ------------------------------------------------------------- */}
      {/* 1. OVERVIEW VIEW (3 Major Subject Blocks: Math, Russian, English) */}
      {/* ------------------------------------------------------------- */}
      {currentView === 'overview' && (
        <div className="space-y-6">
          {/* BLOCK 1: ТЕОРИЯ ПО МАТЕМАТИКЕ (Основной предмет) */}
          <div className="relative rounded-3xl bg-gradient-to-b from-[#062920] via-[#051f18] to-[#031510] border-2 border-emerald-500/40 p-6 sm:p-10 shadow-2xl overflow-hidden group">
            {/* Mathematical Blueprint Background Elements */}
            <MathBackgroundElements opacity="opacity-30" variant="math" />

            {/* Glowing background accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header pill & Methodology Badge */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black uppercase tracking-wider shadow-inner">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>{isKg ? 'Негизги предмет' : 'Основной предмет'}</span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#02100c]/85 border border-emerald-700/50 shadow-md">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 shrink-0">
                  <Calculator className="w-4 h-4" />
                </div>
                <div className="text-left leading-tight">
                  <span className="text-xs font-bold text-white block">{isKg ? 'Автордук методика' : 'Авторская методика'}</span>
                  <span className="text-[10px] text-emerald-300/80 font-medium">
                    {isKg ? 'ЖРТнын бардык бөлүмдөрү' : 'Все разделы ОРТ'}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Title & Subtitle */}
            <div className="relative z-10 space-y-4 max-w-3xl mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
                {isKg ? 'Математика боюнча теория' : 'Теория по математике'}
              </h1>
              <p className="text-emerald-100/90 text-sm sm:text-base md:text-lg leading-relaxed">
                {isKg
                  ? 'Математика — ЖРТдагы эң чоң упай алып келүүчү негизги бөлүк (60 суроо). 2 чоң бөлүмдөн турат: Алгебра жана Геометрия.'
                  : 'Математика — главный фундамент Общереспубликанского тестирования (60 вопросов). Включает 2 фундаментальных блока: Алгебра и Геометрия со всеми конспектами, формулами и ловушками ОРТ.'}
              </p>
            </div>

            {/* Key Value Cards Row (2 Main Subjects: Algebra and Geometry) */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div
                onClick={() => handleSelectSubject('algebra')}
                className="p-4 sm:p-5 rounded-2xl bg-[#02100c]/80 hover:bg-[#041d16] border border-emerald-700/40 hover:border-emerald-400 space-y-2 cursor-pointer transition-all group/subcard"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-black text-base">
                    <Calculator className="w-5 h-5" />
                    <span>{isKg ? '1. Алгебра' : '1. Алгебра'}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-400 opacity-60 group-hover/subcard:opacity-100 group-hover/subcard:translate-x-1 transition-all" />
                </div>
                <p className="text-xs text-emerald-200/70">
                  {isKg
                    ? 'Сандардын түрлөрү, бөлүнүүчүлүк, теңдемелер, барабарсыздыктар, модулдар, маселелер'
                    : 'Числа и делимость, уравнения, неравенства, модули, прогрессии, текстовые задачи'}
                </p>
              </div>

              <div
                onClick={() => handleSelectSubject('geometry')}
                className="p-4 sm:p-5 rounded-2xl bg-[#02100c]/80 hover:bg-[#041d16] border border-emerald-700/40 hover:border-teal-400 space-y-2 cursor-pointer transition-all group/subcard"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-teal-400 font-black text-base">
                    <Compass className="w-5 h-5" />
                    <span>{isKg ? '2. Геометрия' : '2. Геометрия'}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-teal-400 opacity-60 group-hover/subcard:opacity-100 group-hover/subcard:translate-x-1 transition-all" />
                </div>
                <p className="text-xs text-emerald-200/70">
                  {isKg
                    ? 'Үч бурчтуктар, төрт бурчтуктар, тегерек жана айлана, аянттар, стереометрия'
                    : 'Треугольники, четырехугольники, окружности, формулы площадей, стереометрия'}
                </p>
              </div>
            </div>

            {/* Primary Action Button: "Пройти теорию" */}
            <div className="relative z-10 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleOpenMathModal}
                className="px-8 py-4 sm:px-10 sm:py-4.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:brightness-110 text-slate-950 font-black text-sm sm:text-base uppercase tracking-wider flex items-center gap-3 shadow-2xl shadow-emerald-500/40 transition-all cursor-pointer group/btn active:scale-95"
              >
                <span>{isKg ? 'Математика теориясын баштоо' : 'Пройти теорию по математике'}</span>
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* BLOCK 2: ТЕОРИЯ ПО РУССКОМУ ЯЗЫКУ (Основной предмет) */}
          <div className="relative rounded-3xl bg-gradient-to-b from-[#072c23] via-[#052119] to-[#031510] border-2 border-emerald-500/40 p-6 sm:p-10 shadow-2xl overflow-hidden group">
            {/* Background elements with Russian Literature/Grammar motifs */}
            <MathBackgroundElements opacity="opacity-25" variant="literature" />

            {/* Glowing accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-500/20 transition-all" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header pill & Methodology Badge */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black uppercase tracking-wider shadow-inner">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>{isKg ? 'Негизги предмет' : 'Основной предмет'}</span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#02100c]/85 border border-emerald-700/50 shadow-md">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="text-left leading-tight">
                  <span className="text-xs font-bold text-white block">{isKg ? 'Автордук методика' : 'Авторская методика'}</span>
                  <span className="text-[10px] text-emerald-300/80 font-medium">
                    {isKg ? '3 тематикалык блок' : '3 тематических блока'}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Title & Subtitle */}
            <div className="relative z-10 space-y-4 max-w-3xl mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
                {isKg ? 'Орус тили боюнча теория' : 'Теория по русскому языку'}
              </h1>
              <p className="text-emerald-100/90 text-sm sm:text-base md:text-lg leading-relaxed">
                {isKg
                  ? 'Орус тили — ЖРТдагы милдеттүү негизги предмет (60 суроо). 3 өзүнчө блокту камтыйт: Аналогиялар жана сүйлөмдү толуктоо, Текстти окуу жана түшүнүү, Практикалык грамматика.'
                  : 'Русский язык — второй обязательный основной предмет Общереспубликанского тестирования (60 вопросов). Включает 3 тематических блока: Аналогии и дополнение предложений, Чтение и понимание, Практическая грамматика.'}
              </p>
            </div>

            {/* 3 Rectangular Blocks Row */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-8">
              <div
                onClick={() => handleSelectSubject('russian')}
                className="p-4 rounded-2xl bg-[#02100c]/80 hover:bg-[#041d16] border border-emerald-700/40 hover:border-emerald-400 space-y-1 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
                  <FileText className="w-4 h-4" />
                  <span>{isKg ? '1. Аналогиялар' : '1. Аналогии и дополнения'}</span>
                </div>
                <p className="text-xs text-emerald-200/70">
                  {isKg ? 'Түр-тек, бөлүк-бүтүн, себеп-натыйжа логикасы' : 'Род-вид, часть-целое, причина-следствие, ловушки'}
                </p>
              </div>

              <div
                onClick={() => handleSelectSubject('russian')}
                className="p-4 rounded-2xl bg-[#02100c]/80 hover:bg-[#041d16] border border-emerald-700/40 hover:border-emerald-400 space-y-1 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2 text-teal-400 font-black text-sm">
                  <BookOpen className="w-4 h-4" />
                  <span>{isKg ? '2. Текстти түшүнүү' : '2. Чтение и понимание'}</span>
                </div>
                <p className="text-xs text-emerald-200/70">
                  {isKg ? 'Тексттин мааниси, башкы ой, контекстти талдоо' : 'Анализ микротем, подтекст, аргументация и выводы'}
                </p>
              </div>

              <div
                onClick={() => handleSelectSubject('russian')}
                className="p-4 rounded-2xl bg-[#02100c]/80 hover:bg-[#041d16] border border-emerald-700/40 hover:border-emerald-400 space-y-1 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
                  <GraduationCap className="w-4 h-4" />
                  <span>{isKg ? '3. Грамматика' : '3. Практическая грамматика'}</span>
                </div>
                <p className="text-xs text-emerald-200/70">
                  {isKg ? 'Пунктуация, орфография, синтаксис эрежелери' : 'Пунктуация, орфография, нормы речи и тесты'}
                </p>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="relative z-10 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => handleSelectSubject('russian')}
                className="px-8 py-4 sm:px-10 sm:py-4.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:brightness-110 text-slate-950 font-black text-sm sm:text-base uppercase tracking-wider flex items-center gap-3 shadow-2xl shadow-emerald-500/40 transition-all cursor-pointer group/btn active:scale-95"
              >
                <span>{isKg ? 'Орус тили теориясын баштоо' : 'Пройти теорию по русскому языку'}</span>
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* BLOCK 3: ТЕОРИЯ ПО АНГЛИЙСКОМУ ЯЗЫКУ (Предметный тест ОРТ) */}
          <div className="relative rounded-3xl bg-gradient-to-b from-[#06241b] via-[#041c15] to-[#02110c] border-2 border-teal-500/40 p-6 sm:p-10 shadow-2xl overflow-hidden group">
            {/* Background elements with English dictionary/vocab motifs */}
            <MathBackgroundElements opacity="opacity-25" variant="english" />

            {/* Glowing accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-500/20 transition-all" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header pill & Methodology Badge */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-black uppercase tracking-wider shadow-inner">
                <GraduationCap className="w-4 h-4 text-teal-400" />
                <span>{isKg ? 'Предметтик тест ОРТ' : 'Предметный тест ОРТ'}</span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#02100c]/85 border border-teal-700/50 shadow-md">
                <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-400 flex items-center justify-center text-teal-300 shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="text-left leading-tight">
                  <span className="text-xs font-bold text-white block">{isKg ? 'Предметтик курс' : 'Предметный курс'}</span>
                  <span className="text-[10px] text-teal-300/80 font-medium">
                    {isKg ? 'Англис тили' : 'Английский язык'}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Title & Subtitle */}
            <div className="relative z-10 space-y-4 max-w-3xl mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
                {isKg ? 'Англис тили боюнча теория' : 'Теория по английскому языку'}
              </h1>
              <p className="text-emerald-100/90 text-sm sm:text-base md:text-lg leading-relaxed">
                {isKg
                  ? 'Англис тили — ЖРТнын предметтик тести. Бул бөлүмдө Reading Comprehension, грамматика жана Error Identification боюнча бардык эрежелер камтылган.'
                  : 'Английский язык — профильный предметный тест ОРТ. Включает 3 блока: Reading Comprehension, Grammar & Vocabulary и Error Identification с практическими разборами типовых заданий.'}
              </p>
            </div>

            {/* 3 Rectangular Blocks Row */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-8">
              <div
                onClick={() => handleSelectSubject('english')}
                className="p-4 rounded-2xl bg-[#02100c]/80 hover:bg-[#041d16] border border-teal-700/40 hover:border-teal-400 space-y-1 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2 text-teal-400 font-black text-sm">
                  <BookOpen className="w-4 h-4" />
                  <span>{isKg ? '1. Тексттерди окуу' : '1. Reading Comprehension'}</span>
                </div>
                <p className="text-xs text-emerald-200/70">
                  {isKg ? 'Тексттерди талдоо, сөздүктөр жана суроолор' : 'Понимание текстов, подтекст, главная мысль'}
                </p>
              </div>

              <div
                onClick={() => handleSelectSubject('english')}
                className="p-4 rounded-2xl bg-[#02100c]/80 hover:bg-[#041d16] border border-teal-700/40 hover:border-teal-400 space-y-1 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
                  <FileText className="w-4 h-4" />
                  <span>{isKg ? '2. Грамматика' : '2. Grammar & Vocabulary'}</span>
                </div>
                <p className="text-xs text-emerald-200/70">
                  {isKg ? 'Англисче чактар, модалдык этиштер жана пассив' : 'Времена глаголов, модальные глаголы, пассив'}
                </p>
              </div>

              <div
                onClick={() => handleSelectSubject('english')}
                className="p-4 rounded-2xl bg-[#02100c]/80 hover:bg-[#041d16] border border-teal-700/40 hover:border-teal-400 space-y-1 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2 text-teal-400 font-black text-sm">
                  <GraduationCap className="w-4 h-4" />
                  <span>{isKg ? '3. Каталарды табуу' : '3. Error Identification'}</span>
                </div>
                <p className="text-xs text-emerald-200/70">
                  {isKg ? 'Сүйлөмдөрдөгү типтүү грамматикалык каталар' : 'Типовые грамматические ошибки в тестах ОРТ'}
                </p>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="relative z-10 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => handleSelectSubject('english')}
                className="px-8 py-4 sm:px-10 sm:py-4.5 rounded-2xl bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-400 hover:brightness-110 text-slate-950 font-black text-sm sm:text-base uppercase tracking-wider flex items-center gap-3 shadow-2xl shadow-teal-500/40 transition-all cursor-pointer group/btn active:scale-95"
              >
                <span>{isKg ? 'Англис тили теориясын баштоо' : 'Пройти теорию по английскому языку'}</span>
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. BLOCKS VIEW (List of Rectangular Blocks inside Subject)    */}
      {/* ------------------------------------------------------------- */}
      {currentView === 'blocks' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Breadcrumb / Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-emerald-800/60">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleBackToOverview}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-emerald-700/50 text-xs sm:text-sm font-bold text-emerald-200 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-emerald-400" />
                <span>{isKg ? 'Башкыга кайтуу' : 'Назад к обзору'}</span>
              </button>

              <button
                type="button"
                onClick={handleOpenGeneralSubjectModal}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-xs sm:text-sm font-bold text-emerald-300 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <GraduationCap className="w-4 h-4" />
                <span>{isKg ? subject.titleKg : subject.titleRu}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-70" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenPlanChoice}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-500/25 transition-all cursor-pointer shadow-sm"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isKg ? 'Тарифтерди көрүү' : 'Посмотреть тарифы'}</span>
              </button>
            </div>
          </div>

          {/* Subject Header Card */}
          <div className="relative rounded-3xl bg-gradient-to-r from-[#062920] to-[#041a14] border border-emerald-700/60 p-6 sm:p-8 shadow-xl overflow-hidden">
            <MathBackgroundElements
              opacity="opacity-20"
              variant={
                selectedSubjectId === 'russian'
                  ? 'literature'
                  : selectedSubjectId === 'english'
                  ? 'english'
                  : 'math'
              }
            />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider mb-1">
                  {selectedSubjectId === 'algebra' ? (
                    <Calculator className="w-3.5 h-3.5" />
                  ) : selectedSubjectId === 'geometry' ? (
                    <Compass className="w-3.5 h-3.5" />
                  ) : selectedSubjectId === 'russian' ? (
                    <FileText className="w-3.5 h-3.5" />
                  ) : (
                    <GraduationCap className="w-3.5 h-3.5" />
                  )}
                  <span>{isKg ? subject.titleKg : subject.titleRu}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {isKg ? 'Бардык темалар жана блоктор' : 'Тематические блоки'}
                </h2>
                <p className="text-xs sm:text-sm text-emerald-200/80 max-w-xl">
                  {isKg ? subject.descKg : subject.descRu}
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenGeneralSubjectModal}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-emerald-700/60 text-xs font-bold text-emerald-300 flex items-center gap-2 transition-colors self-start cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>{isKg ? 'Бөлүмдү алмаштыруу' : 'Сменить раздел'}</span>
              </button>
            </div>
          </div>

          {/* List of Rectangular Blocks */}
          <div className="space-y-4">
            {subject.blocks.map((block) => (
              <div
                key={block.id}
                className="rounded-3xl bg-[#06261d] border border-emerald-800/60 p-5 sm:p-7 shadow-xl space-y-4 transition-all"
              >
                {/* Block header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-800/50">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-1.5">
                      {isKg ? `${block.number}-Блок` : `Блок ${block.number}`}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                      {isKg ? block.titleKg : block.titleRu}
                    </h3>
                    <p className="text-xs sm:text-sm text-emerald-200/70 mt-1">
                      {isKg ? block.descKg : block.descRu}
                    </p>
                  </div>
                </div>

                {/* Topics inside this block */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {block.topics.map((topic, idx) => (
                    <div
                      key={topic.id}
                      onClick={() => topic.isAvailable && handleSelectTopic(block, topic)}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        topic.isAvailable
                          ? 'bg-[#041d16] hover:bg-[#072a20] border-emerald-700/60 hover:border-emerald-400 cursor-pointer shadow-md hover:scale-[1.01] active:scale-95 group'
                          : 'bg-[#031510]/60 border-emerald-900/40 opacity-70 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                            topic.isAvailable
                              ? 'bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors'
                              : 'bg-white/5 border border-white/10 text-slate-400'
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-emerald-300 transition-colors">
                            {isKg ? topic.titleKg : topic.titleRu}
                          </h4>
                          <span className="text-[11px] text-emerald-200/60 block">
                            {topic.isAvailable
                              ? isKg
                                ? 'Теория, сүрөт, ДЗ жана видео'
                                : 'Теория, фото, ДЗ и видеоуроки'
                              : isKg
                              ? 'Жакында кошулат'
                              : 'Скоро будет доступно'}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {topic.isAvailable ? (
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>{isKg ? 'Жакында' : 'Скоро'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. TOPIC VIEW (Full Text Theory, Solution Photos, HW, Video)   */}
      {/* ------------------------------------------------------------- */}
      {currentView === 'topic' && selectedTopic && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Breadcrumbs Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-emerald-800/60">
            <button
              type="button"
              onClick={handleBackToBlocks}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-emerald-700/50 text-xs sm:text-sm font-bold text-emerald-200 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span>{isKg ? 'Блокторго кайтуу' : 'Назад к блокам'}</span>
            </button>

            <div className="text-xs sm:text-sm font-bold text-emerald-300/80 flex items-center gap-2">
              <span>{isKg ? subject.titleKg : subject.titleRu}</span>
              <span>/</span>
              <span className="text-white">{isKg ? selectedTopic.titleKg : selectedTopic.titleRu}</span>
            </div>
          </div>

          {/* Main Topic Header */}
          <div className="relative rounded-3xl bg-gradient-to-r from-[#062920] to-[#041a14] border border-emerald-700/60 p-6 sm:p-8 shadow-xl overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <MathBackgroundElements opacity="opacity-25" variant="banner" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black uppercase tracking-wider mb-3">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>{selectedBlock ? (isKg ? selectedBlock.titleKg : selectedBlock.titleRu) : 'Теория'}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {isKg ? selectedTopic.titleKg : selectedTopic.titleRu}
              </h1>
            </div>

            {!isSubscribed && (
              <button
                type="button"
                onClick={handleOpenPlanChoice}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer active:scale-95"
              >
                <Zap className="w-4 h-4" />
                <span>{isKg ? 'Жазылууну алуу' : 'Оформить подписку'}</span>
              </button>
            )}
          </div>

          {/* Gated Theory Content Wrapper */}
          <div className="relative rounded-3xl bg-[#06261d] border border-emerald-800/60 p-6 sm:p-8 shadow-xl overflow-hidden">
            {/* If user does NOT have active subscription (standard or premium), blur & lock the theory */}
            {!isSubscribed && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-[#031510]/85 backdrop-blur-md">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 shadow-2xl shadow-emerald-500/40 mb-4 animate-bounce">
                  <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-slate-950" />
                </div>

                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white text-center mb-2">
                  {isKg ? 'Теория жазылуу аркылуу жеткиликтүү' : 'Теория доступна по подписке'}
                </h3>

                <p className="text-xs sm:text-sm text-emerald-200/80 text-center max-w-md mb-6 leading-relaxed">
                  {isKg
                    ? 'Бардык теориялык макалаларга, ОРТнын чыныгы мисалдарынын сүрөттөрүнө, үй тапшырмаларына жана видеосабактарга толук мүмкүнчүлүк алыңыз.'
                    : 'Оформите «Доступную» или «Премиальную» подписку, чтобы получить полный доступ к теории, фото-разборам, домашним заданиям и видеоурокам.'}
                </p>

                <button
                  type="button"
                  onClick={handleOpenPlanChoice}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 text-slate-950 font-black text-sm sm:text-base hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-500/30 flex items-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>{isKg ? 'Жазылууну тандап алуу' : 'Оформить подписку'}</span>
                </button>
              </div>
            )}

            {/* Blurred/Clean Theory Text Body */}
            <div className={`space-y-8 ${!isSubscribed ? 'filter blur-sm select-none pointer-events-none opacity-40' : ''}`}>
              {/* ------------------------------------------------------------- */}
              {/* Section 1: Written Theory (Standard + Premium)                 */}
              {/* ------------------------------------------------------------- */}
              <div className="space-y-4 text-emerald-100 leading-relaxed text-sm sm:text-base font-normal">
                {/* 1. Натуральные числа */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#041a14] border border-emerald-700/50 space-y-3">
                  <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black flex items-center justify-center">
                      1
                    </span>
                    <span>
                      {isKg ? 'Натуралдык сандар (ℕ)' : 'Натуральные числа (ℕ)'}
                    </span>
                  </h3>
                  <p className="text-emerald-200/90 text-sm sm:text-base">
                    {isKg
                      ? 'Натуралдык сандар — бул нерселерди (буюмдарды) табигый саноодо колдонулуучу сандар.'
                      : 'Натуральные числа — это числа, которые используются при естественном счете предметов.'}
                  </p>
                  <div className="p-3 rounded-xl bg-[#02100c] border border-emerald-800/60 font-mono text-xs sm:text-sm text-emerald-300">
                    <strong>{isKg ? 'Мисал:' : 'Пример:'}</strong> 1, 2, 3, 4, 5, ..., 100, ...
                  </div>

                  {/* ⚠️ Trap Alert Box */}
                  <div className="p-4 rounded-xl bg-amber-950/40 border-2 border-amber-500/60 text-amber-200 text-xs sm:text-sm font-bold flex items-start gap-3 shadow-lg">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-black text-amber-300 uppercase tracking-wider block mb-1">
                        {isKg ? '⚠️ ЖРТнын башкы тузагы:' : '⚠️ Главная ловушка ОРТ:'}
                      </span>
                      <span>
                        {isKg
                          ? 'Нөл (0) натуралдык сан ЭМЕС! Сен «0 буюм» деп санай албайсың.'
                          : 'Ноль (0) НЕ является натуральным числом! Ты не можешь посчитать «0 предметов».'}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-1.5 text-xs sm:text-sm text-emerald-200/80 list-disc list-inside">
                    <li>
                      <strong>{isKg ? 'Эң кичине натуралдык сан:' : 'Самое маленькое натуральное число:'}</strong>{' '}
                      <span className="text-white font-bold">1</span>.
                    </li>
                    <li>
                      <strong>{isKg ? 'Эң чоң натуралдык сан:' : 'Самого большого натурального числа:'}</strong>{' '}
                      <span className="text-white font-bold">{isKg ? 'жок (чексиз)' : 'не существует (множество натуральных чисел бесконечно)'}</span>.
                    </li>
                  </ul>
                </div>

                {/* 2. Целые числа */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#041a14] border border-emerald-700/50 space-y-3">
                  <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black flex items-center justify-center">
                      2
                    </span>
                    <span>
                      {isKg ? 'Бүтүн сандар (ℤ)' : 'Целые числа (ℤ)'}
                    </span>
                  </h3>
                  <p className="text-emerald-200/90 text-sm sm:text-base">
                    {isKg
                      ? 'Бүтүн сандар — бул сандардын кеңейтилген тобу. Анын курамына кирет:'
                      : 'Целые числа — это расширенный набор чисел. В него входят:'}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs sm:text-sm">
                    <div className="p-3 rounded-xl bg-[#02100c] border border-emerald-800/60">
                      <span className="text-emerald-400 font-bold block mb-0.5">1. {isKg ? 'Натуралдык сандар' : 'Натуральные'}</span>
                      <span className="text-emerald-200/70 font-mono">1, 2, 3, 4, ...</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#02100c] border border-emerald-800/60">
                      <span className="text-teal-400 font-bold block mb-0.5">2. {isKg ? '0 (нөл) саны' : 'Число 0 (нуль)'}</span>
                      <span className="text-emerald-200/70 font-mono">0</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#02100c] border border-emerald-800/60">
                      <span className="text-rose-400 font-bold block mb-0.5">3. {isKg ? 'Терс бүтүн сандар' : 'Отрицательные целые'}</span>
                      <span className="text-emerald-200/70 font-mono">-1, -2, -3, ...</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#02100c] border border-emerald-800/60 font-mono text-xs sm:text-sm text-emerald-300">
                    <strong>{isKg ? 'Мисал:' : 'Пример:'}</strong> ..., -4, -3, -2, -1, 0, 1, 2, 3, 4, ...
                  </div>

                  {/* Important properties */}
                  <div className="p-4 rounded-xl bg-[#031510] border border-emerald-700/40 space-y-2 text-xs sm:text-sm">
                    <h4 className="font-black text-white uppercase tracking-wider text-[11px] text-emerald-400">
                      {isKg ? 'ЖРТ үчүн маанилүү касиеттер:' : 'Важные свойства для ОРТ:'}
                    </h4>
                    <ul className="space-y-1.5 text-emerald-200/90 list-disc list-inside">
                      <li>
                        <strong>{isKg ? 'Нөл (0):' : 'Ноль (0):'}</strong>{' '}
                        {isKg
                          ? 'Бул бүтүн сан, бирок ал оң дагы, терс дагы эмес.'
                          : 'Это целое число, но оно не является ни положительным, ни отрицательным.'}
                      </li>
                      <li>
                        <strong>{isKg ? 'Оң бүтүн сандар:' : 'Положительные целые:'}</strong>{' '}
                        {isKg ? 'Натуралдык сандар менен бирдей.' : 'Полностью совпадают с натуральными числами.'}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* Section 2: Photos with Solutions (Standard + Premium)          */}
              {/* ------------------------------------------------------------- */}
              <div className="pt-4 border-t border-emerald-800/60 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-base sm:text-xl font-black text-white">
                    <ImageIcon className="w-5 h-5 text-emerald-400" />
                    <span>{isKg ? 'ЖРТнын чыныгы мисалдары жана сүрөт-чечмелөөлөрү' : 'Фотоматериалы реального ОРТ и разбор решений'}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {isKg ? 'Доступная + Премиум' : 'Доступная и Премиум'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-emerald-200/80">
                  {isKg
                    ? 'Тесттерде көп кездешүүчү тузактардын жана мисалдардын фотосүрөттөрү менен толук чечмелениши:'
                    : 'Реальные бланки заданий и пошаговые иллюстрации с разбором решений:'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedTopic.photos?.map((photo, pIdx) => (
                    <div
                      key={photo.id}
                      className="relative rounded-2xl bg-[#041a14] border border-emerald-700/60 overflow-hidden shadow-lg hover:border-emerald-400 transition-all group"
                    >
                      {/* Mathematical blueprint frame corner marks */}
                      <div className="absolute top-2 left-2 z-20 font-mono text-[9px] font-black text-white/50 bg-black/60 px-1.5 py-0.5 rounded border border-white/20">
                        {pIdx === 0 ? '∀x ∈ ℕ: x ≥ 1' : 'Δ = b² - 4ac'}
                      </div>
                      <div className="absolute top-2 right-2 z-20 font-mono text-[9px] font-black text-white/50 bg-black/60 px-1.5 py-0.5 rounded border border-white/20">
                        {pIdx === 0 ? 'a² + b² = c²' : 'x ∈ ℤ'}
                      </div>

                      <div className="relative aspect-[4/3] bg-black/40 overflow-hidden flex items-center justify-center">
                        <img
                          src={photo.imageUrl}
                          alt={photo.titleRu}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          type="button"
                          onClick={() => setPreviewPhotoUrl(photo.imageUrl)}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs backdrop-blur-xs cursor-pointer"
                        >
                          <Eye className="w-5 h-5 text-emerald-400" />
                          <span>{isKg ? 'Чоңойтуп көрүү' : 'Увеличить фото'}</span>
                        </button>
                      </div>
                      <div className="p-4 bg-[#031510] border-t border-emerald-800/60 space-y-1 relative">
                        <div className="flex items-center justify-between gap-2">
                          <h5 className="text-xs sm:text-sm font-bold text-white">
                            {isKg ? photo.titleKg : photo.titleRu}
                          </h5>
                          <span className="font-mono text-[10px] text-white/40 shrink-0">
                            {pIdx === 0 ? '№1 Math' : '№2 Math'}
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-emerald-200/70 leading-snug">
                          {isKg ? photo.descriptionKg : photo.descriptionRu}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* Section 3: Homework Section (PREMIUM ONLY)                     */}
              {/* ------------------------------------------------------------- */}
              <div className="pt-4 border-t border-emerald-800/60 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-base sm:text-xl font-black text-white">
                    <FileCheck className="w-5 h-5 text-amber-400" />
                    <span>{isKg ? 'Үй тапшырмасы: Билимди бекемдөө' : 'Домашнее задание: Закрепление темы'}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-300" />
                    <span>{isKg ? 'Премиум жазылуу' : 'Только в Премиум'}</span>
                  </span>
                </div>

                <div className="relative rounded-3xl bg-[#041a14] border border-amber-500/40 p-5 sm:p-7 shadow-xl overflow-hidden">
                  {/* If user is NOT premium, show locked HW banner */}
                  {!isPremium && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-[#031510]/85 backdrop-blur-md text-center">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/30 mb-3">
                        <FileCheck className="w-7 h-7 text-slate-950" />
                      </div>
                      <h4 className="text-lg sm:text-xl font-black text-white mb-1.5">
                        {isKg ? 'Үй тапшырмасы Премиум жазылууда жеткиликтүү' : 'Домашнее задание доступно в Премиум подписке'}
                      </h4>
                      <p className="text-xs sm:text-sm text-emerald-200/80 max-w-md mb-4 leading-relaxed">
                        {isKg
                          ? 'Ар бир тема боюнча бекемдөөчү тесттер, интерактивдүү текшерүү жана туура чыгаруу жолдору Премиум колдонуучуларга гана ачылат.'
                          : 'Практические задания по каждой теме с автоматической проверкой, подсказками и подробным решением доступны обладателям Премиальной подписки.'}
                      </p>
                      <button
                        type="button"
                        onClick={handleOpenPlanChoice}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-slate-950 font-black text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-amber-500/25 flex items-center gap-2 cursor-pointer"
                      >
                        <Crown className="w-4 h-4" />
                        <span>{isKg ? 'Премиум жазылууну алуу' : 'Перейти на Премиум'}</span>
                      </button>
                    </div>
                  )}

                  {/* Interactive Homework Content (Unlocks for Premium users) */}
                  <div className={`${!isPremium ? 'filter blur-sm select-none pointer-events-none opacity-35' : ''} space-y-6`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-800/60">
                      <div>
                        <h4 className="text-sm sm:text-base font-black text-white">
                          {isKg ? 'Тема боюнча 3 көнүгүү (чыныгы ЖРТ форматы):' : '3 практических задания по теме (формат ОРТ):'}
                        </h4>
                        <span className="text-xs text-emerald-200/70">
                          {isKg ? 'Туура вариантты тандап, текшериңиз' : 'Выберите правильный вариант и проверьте себя'}
                        </span>
                      </div>

                      {showHomeworkResults && (
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-xs">
                          <span>
                            {isKg ? 'Жыйынтык:' : 'Результат:'} {calculateHomeworkScore()} / {HOMEWORK_QUESTIONS.length}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {HOMEWORK_QUESTIONS.map((q, idx) => {
                        const selectedAns = homeworkAnswers[q.id];
                        const isAnswered = selectedAns !== undefined;
                        const isCorrect = selectedAns === q.correctIdx;

                        return (
                          <div
                            key={q.id}
                            className="p-4 sm:p-5 rounded-2xl bg-[#031510] border border-emerald-800/70 space-y-3"
                          >
                            <div className="flex items-start gap-2.5">
                              <span className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                                {isKg ? q.questionKg : q.questionRu}
                              </p>
                            </div>

                            {/* Options A, B, C, D */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                              {q.options.map((opt, optIdx) => {
                                const optLetter = ['А', 'Б', 'В', 'Г'][optIdx];
                                const isSelected = selectedAns === optIdx;
                                let btnClasses =
                                  'p-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-between gap-2 transition-all cursor-pointer';

                                if (showHomeworkResults) {
                                  if (optIdx === q.correctIdx) {
                                    btnClasses += ' bg-emerald-600/40 border-emerald-400 text-white font-black';
                                  } else if (isSelected && !isCorrect) {
                                    btnClasses += ' bg-rose-600/40 border-rose-400 text-rose-200';
                                  } else {
                                    btnClasses += ' bg-[#020e0b] border-emerald-900/40 text-emerald-200/50';
                                  }
                                } else if (isSelected) {
                                  btnClasses += ' bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-md';
                                } else {
                                  btnClasses += ' bg-[#020e0b] hover:bg-[#042018] border-emerald-800/60 text-emerald-200';
                                }

                                return (
                                  <button
                                    key={optIdx}
                                    type="button"
                                    onClick={() => handleSelectHomeworkOption(q.id, optIdx)}
                                    className={btnClasses}
                                  >
                                    <span>
                                      {optLetter}) {opt}
                                    </span>
                                    {showHomeworkResults && optIdx === q.correctIdx && (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                    )}
                                    {showHomeworkResults && isSelected && !isCorrect && (
                                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Explanation shown after checking */}
                            {showHomeworkResults && (
                              <div
                                className={`p-3 rounded-xl text-xs space-y-1 ${
                                  isCorrect
                                    ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-200'
                                    : 'bg-rose-950/30 border border-rose-500/30 text-rose-200'
                                }`}
                              >
                                <span className="font-bold block">
                                  {isCorrect
                                    ? isKg ? '✅ Туура чыгарылды!' : '✅ Правильно!'
                                    : isKg ? '❌ Ката. Туура чыгарылышы:' : '❌ Неверно. Объяснение решения:'}
                                </span>
                                <p>{isKg ? q.explanationKg : q.explanationRu}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* HW Buttons: Check answers / Try again */}
                    <div className="flex items-center gap-3 pt-2">
                      {!showHomeworkResults ? (
                        <button
                          type="button"
                          onClick={() => setShowHomeworkResults(true)}
                          disabled={Object.keys(homeworkAnswers).length === 0}
                          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{isKg ? 'Жоопторду текшерүү' : 'Проверить ответы'}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setHomeworkAnswers({});
                            setShowHomeworkResults(false);
                          }}
                          className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-emerald-700/60 text-xs font-bold text-emerald-300 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>{isKg ? 'Кайрадан чыгаруу' : 'Пройти заново'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* Section 4: Video Lessons & Video Solutions (PREMIUM ONLY)      */}
              {/* ------------------------------------------------------------- */}
              <div className="pt-4 border-t border-emerald-800/60 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-base sm:text-xl font-black text-white">
                    <Video className="w-5 h-5 text-amber-400" />
                    <span>{isKg ? 'Теория жана мисалдарды чыгаруу видеороликтери' : 'Видеоролики с теорией и видеоразборами от автора'}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-300" />
                    <span>{isKg ? 'Премиум жазылуу' : 'Только в Премиум'}</span>
                  </span>
                </div>

                <div className="relative rounded-3xl bg-[#041a14] border border-amber-500/40 p-5 sm:p-6 shadow-xl overflow-hidden">
                  {/* If user is NOT premium, show locked video banner */}
                  {!isPremium && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-[#031510]/85 backdrop-blur-md text-center">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/30 mb-3">
                        <Crown className="w-7 h-7 text-slate-950" />
                      </div>
                      <h4 className="text-lg sm:text-xl font-black text-white mb-1.5">
                        {isKg ? 'Видеосабактар Премиум жазылууда жеткиликтүү' : 'Видеоуроки доступны в Премиум подписке'}
                      </h4>
                      <p className="text-xs sm:text-sm text-emerald-200/80 max-w-md mb-4 leading-relaxed">
                        {isKg
                          ? 'Теория жана ЖРТ мисалдарын чыгаруу видеороликтери (Абдраим Турусбековичтин жеке түшүндүрмөсү менен) Премиум жазылуусу бар колдонуучуларга гана жеткиликтүү.'
                          : 'Видеоролики с теорией и с решением примеров (лично от Абдраима Турусбековича) доступны только для пользователей с премиальной подпиской.'}
                      </p>
                      <button
                        type="button"
                        onClick={handleOpenPlanChoice}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-slate-950 font-black text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-amber-500/25 flex items-center gap-2 cursor-pointer"
                      >
                        <Crown className="w-4 h-4" />
                        <span>{isKg ? 'Премиум жазылууну алуу' : 'Перейти на Премиум'}</span>
                      </button>
                    </div>
                  )}

                  {/* Video Player Content */}
                  <div className={`${!isPremium ? 'filter blur-sm select-none pointer-events-none opacity-40' : ''} space-y-4`}>
                    <div className="relative aspect-video rounded-2xl bg-black border border-emerald-800/80 overflow-hidden shadow-2xl flex items-center justify-center group">
                      {isPlayingVideo ? (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#020b08]">
                          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 mb-3 animate-pulse">
                            <Play className="w-8 h-8 ml-1" />
                          </div>
                          <h4 className="text-base font-bold text-white mb-1">
                            {isKg ? 'Видеосабак ойнотулууда' : 'Видеоурок воспроизводится'}
                          </h4>
                          <p className="text-xs text-emerald-200/60 max-w-sm">
                            {isKg
                              ? 'Абдраим Турусбекович: 1-сабак • Натуралдык жана бүтүн сандар'
                              : 'Абдраим Турусбекович: Урок 1 • Натуральные и целые числа ОРТ'}
                          </p>
                        </div>
                      ) : (
                        <>
                          <img
                            src="https://res.cloudinary.com/rw9qhk3a/image/upload/v1787233847/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E__12_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_1.1.jpg"
                            alt="Video Thumbnail"
                            className="w-full h-full object-cover opacity-40"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-between p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                              <span className="px-3 py-1 rounded-xl bg-black/70 border border-emerald-500/40 text-emerald-300 text-xs font-bold backdrop-blur-md">
                                14:20
                              </span>
                              <span className="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold backdrop-blur-md">
                                Full HD • 1080p
                              </span>
                            </div>

                            <div className="flex flex-col items-center justify-center my-auto">
                              <button
                                type="button"
                                onClick={() => isPremium && setIsPlayingVideo(true)}
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-300 text-slate-950 flex items-center justify-center shadow-2xl shadow-emerald-500/50 group-hover:scale-110 active:scale-95 transition-all cursor-pointer"
                              >
                                <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-slate-950 ml-1" />
                              </button>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
                                {isKg ? 'Автордук видеоролик' : 'Авторский видеоролик'}
                              </span>
                              <h4 className="text-sm sm:text-base font-bold text-white">
                                {isKg
                                  ? '1-тема: Натуралдык жана бүтүн сандардын теориясы жана ЖРТ мисалдары'
                                  : 'Тема 1: Теория натуральных и целых чисел и решение задач ОРТ'}
                              </h4>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="p-4 rounded-2xl bg-[#031510] border border-emerald-800/60 flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shrink-0 shadow-md">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div>
                        <h5 className="text-xs sm:text-sm font-bold text-white">
                          {isKg ? 'Эксперттик видеосабак' : 'Экспертный видеоурок'}
                        </h5>
                        <p className="text-[11px] text-emerald-200/70">
                          {isKg
                            ? 'ЖРТ боюнча автордук методика жана мисалдардын толук талдоосу'
                            : 'Авторская методика подготовки к ОРТ и разбор всех заданий'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* Mini Modal: Choice "Алгебра", "Геометрия", "Русский", "English" */}
      {/* ------------------------------------------------------------- */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#07241c] border border-emerald-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-800/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    {subjectModalMode === 'math_only'
                      ? isKg
                        ? 'Математика бөлүмүн тандаңыз'
                        : 'Выберите раздел математики'
                      : isKg
                      ? 'Бөлүмдү тандаңыз'
                      : 'Выберите предмет теории'}
                  </h3>
                  <span className="text-[11px] text-emerald-200/70 block">
                    {subjectModalMode === 'math_only'
                      ? isKg
                        ? 'Алгебра же Геометрия'
                        : 'Алгебра или Геометрия (2 раздела)'
                      : isKg
                      ? 'ЖРТ программасы боюнча бардык предметтер'
                      : 'Предметы программы ОРТ'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSubjectModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Choice Cards */}
            <div className="grid grid-cols-1 gap-3.5">
              {/* Algebra Option */}
              <button
                type="button"
                onClick={() => handleSelectSubject('algebra')}
                className="p-5 rounded-2xl bg-[#041a14] hover:bg-[#062b20] border-2 border-emerald-700/60 hover:border-emerald-400 text-left transition-all flex items-start justify-between gap-4 cursor-pointer group shadow-md hover:scale-[1.01] active:scale-95"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform shrink-0">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-black text-white group-hover:text-emerald-300 transition-colors">
                      {isKg ? 'Алгебра' : 'Алгебра'}
                    </h4>
                    <p className="text-xs text-emerald-200/70 mt-1 leading-snug">
                      {isKg
                        ? 'Сандар, теңдемелер, барабарсыздыктар, модулдар, прогрессиялар жана маселелер'
                        : 'Числа, делимость, уравнения, неравенства, модули, прогрессии и текстовые задачи ОРТ'}
                    </p>
                    <span className="inline-block mt-2 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                      {isKg ? 'Математика • Негизги предмет' : 'Математика • Основной предмет'}
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all shrink-0 mt-2">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>

              {/* Geometry Option */}
              <button
                type="button"
                onClick={() => handleSelectSubject('geometry')}
                className="p-5 rounded-2xl bg-[#041a14] hover:bg-[#062b20] border-2 border-emerald-700/60 hover:border-teal-400 text-left transition-all flex items-start justify-between gap-4 cursor-pointer group shadow-md hover:scale-[1.01] active:scale-95"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/50 flex items-center justify-center text-teal-300 group-hover:scale-105 transition-transform shrink-0">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-black text-white group-hover:text-teal-300 transition-colors">
                      {isKg ? 'Геометрия' : 'Геометрия'}
                    </h4>
                    <p className="text-xs text-emerald-200/70 mt-1 leading-snug">
                      {isKg
                        ? 'Үч бурчтуктар, төрт бурчтуктар, тегеректер, фигуралардын аянттары жана стереометрия'
                        : 'Треугольники, четырехугольники, окружности, площади фигур и стереометрия ОРТ'}
                    </p>
                    <span className="inline-block mt-2 text-[10px] font-extrabold uppercase tracking-wider text-teal-400">
                      {isKg ? 'Математика • Негизги предмет' : 'Математика • Основной предмет'}
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400 group-hover:bg-teal-500 group-hover:text-slate-950 transition-all shrink-0 mt-2">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>

              {/* Russian and English Options (Shown when not math_only) */}
              {subjectModalMode === 'all' && (
                <>
                  {/* Russian Language Option */}
                  <button
                    type="button"
                    onClick={() => handleSelectSubject('russian')}
                    className="p-5 rounded-2xl bg-[#041a14] hover:bg-[#062b20] border-2 border-emerald-700/60 hover:border-emerald-400 text-left transition-all flex items-start justify-between gap-4 cursor-pointer group shadow-md hover:scale-[1.01] active:scale-95"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-black text-white group-hover:text-emerald-300 transition-colors">
                          {isKg ? 'Орус тили' : 'Русский язык'}
                        </h4>
                        <p className="text-xs text-emerald-200/70 mt-1 leading-snug">
                          {isKg
                            ? 'Аналогиялар, текстти окуу жана түшүнүү, практикалык грамматика жана ЖРТ тузактары'
                            : 'Аналогии, чтение и понимание текстов, практическая грамматика и разбор ловушек ОРТ'}
                        </p>
                        <span className="inline-block mt-2 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                          {isKg ? 'Орус тили • Негизги предмет' : 'Русский язык • Основной предмет'}
                        </span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all shrink-0 mt-2">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>

                  {/* English Language Option */}
                  <button
                    type="button"
                    onClick={() => handleSelectSubject('english')}
                    className="p-5 rounded-2xl bg-[#041a14] hover:bg-[#062b20] border-2 border-teal-700/60 hover:border-teal-400 text-left transition-all flex items-start justify-between gap-4 cursor-pointer group shadow-md hover:scale-[1.01] active:scale-95"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/50 flex items-center justify-center text-teal-300 group-hover:scale-105 transition-transform shrink-0">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-black text-white group-hover:text-teal-300 transition-colors">
                          {isKg ? 'Англис тили' : 'Английский язык'}
                        </h4>
                        <p className="text-xs text-emerald-200/70 mt-1 leading-snug">
                          {isKg
                            ? 'Reading Comprehension, грамматика, чактар жана каталарды табуу'
                            : 'Reading Comprehension, Grammar & Vocabulary, Error Identification'}
                        </p>
                        <span className="inline-block mt-2 text-[10px] font-extrabold uppercase tracking-wider text-teal-400">
                          {isKg ? 'Англис тили • Предметтик тест ОРТ' : 'Английский язык • Предметный тест ОРТ'}
                        </span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400 group-hover:bg-teal-500 group-hover:text-slate-950 transition-all shrink-0 mt-2">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2-Tier Plan Selection Modal ("Доступная" vs "Премиальная")    */}
      {/* ------------------------------------------------------------- */}
      <TheoryPlanSelectionModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onSelectPlan={handleSelectPlanFromModal}
        lang={lang}
      />

      {/* Photo Preview Modal */}
      {previewPhotoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              type="button"
              onClick={() => setPreviewPhotoUrl(null)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewPhotoUrl}
              alt="Preview"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl border-2 border-emerald-500/60 shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
