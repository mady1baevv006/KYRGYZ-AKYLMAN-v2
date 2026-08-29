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
import { MathSubjectBackground } from './subject-backgrounds/MathSubjectBackground';
import { RussianSubjectBackground } from './subject-backgrounds/RussianSubjectBackground';
import { EnglishSubjectBackground } from './subject-backgrounds/EnglishSubjectBackground';

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

const HOMEWORK_QUESTIONS_BY_SUBJECT: Record<string, HomeworkQuestion[]> = {
  algebra: [
    {
      id: 1,
      questionRu: 'Какое из следующих чисел является натуральным?',
      questionKg: 'Төмөнкү сандардын кайсынысы натуралдык сан болуп саналат?',
      options: ['-5', '0', '7', '3.14'],
      correctIdx: 2,
      explanationRu: 'Натуральные числа — это числа для счета предметов (1, 2, 3, ...). Число 7 является натуральным. Ноль (0), отрицательные (-5) и дробные (3.14) не являются натуральными.',
      explanationKg: 'Натуралдык сандар — нерселерди саноо үчүн колдонулуучу сандар (1, 2, 3, ...). 7 саны натуралдык сан. Нөл (0), терс (-5) жана бөлчөк сандар (3.14) натуралдык сан эмес.',
    },
    {
      id: 2,
      questionRu: 'Какое число является наименьшим натуральным числом?',
      questionKg: 'Эң кичине натуралдык сан кайсы?',
      options: ['0', '1', '-1', 'Не существует'],
      correctIdx: 1,
      explanationRu: 'Наименьшее натуральное число — это 1. Ноль (0) целое, но не натуральное число.',
      explanationKg: 'Эң кичине натуралдык сан — 1. Нөл (0) бүтүн сан, бирок натуралдык сан эмес.',
    },
    {
      id: 3,
      questionRu: 'Какое число является противоположным числу -14?',
      questionKg: '-14 санына карама-каршы сан кайсы?',
      options: ['-14', '0', '14', '1/14'],
      correctIdx: 2,
      explanationRu: 'Противоположные числа отличаются только знаком: для -14 противоположным является +14 (их сумма равна 0).',
      explanationKg: 'Карама-каршы сандар белгиси менен гана айырмаланат: -14 үчүн карама-каршы сан +14 болот (алардын суммасы 0гө барабар).',
    },
    {
      id: 4,
      questionRu: 'Чему равна сумма противоположных чисел: 25 + (-25)?',
      questionKg: 'Карама-каршы сандардын суммасы эмнеге барабар: 25 + (-25)?',
      options: ['50', '-50', '0', '1'],
      correctIdx: 2,
      explanationRu: 'Сумма любых двух противоположных чисел всегда равна нулю: a + (-a) = 0.',
      explanationKg: 'Каалаган эки карама-каршы сандын суммасы дайыма нөлгө барабар: a + (-a) = 0.',
    },
    {
      id: 5,
      questionRu: 'Какое из следующих сравнений чисел является верным?',
      questionKg: 'Төмөнкү сандарды салыштыруулардын кайсынысы туура?',
      options: ['-15 > -8', '-3 > 2', '-9 < -4', '0 < -6'],
      correctIdx: 2,
      explanationRu: 'На числовой прямой -9 лежит левее -4, поэтому -9 < -4. Из двух отрицательных чисел больше то, которое ближе к нулю.',
      explanationKg: 'Сан огунда -9 саны -4төн солдо жайгашкан, ошондуктан -9 < -4 туура. Эки терс сандын нөлгө жакыны чоңураак.',
    },
    {
      id: 6,
      questionRu: 'В записи x > 7 (x больше 7), входит ли само число 7 в список подходящих чисел?',
      questionKg: 'x > 7 (x жетиден чоң) жазылышында, 7 саны туура келүүчү сандардын катарына киреби?',
      options: [
        'Да, всегда входит',
        'Нет, знак «строго больше» (точка выколотая)',
        'Входит, если x — четное',
        'Невозможно определить',
      ],
      correctIdx: 1,
      explanationRu: 'Знак «>» означает строго больше. Число 7 не входит в список подходящих чисел (на прямой обозначается выколотой точкой).',
      explanationKg: '«>» белгиси катуу чоң дегенди билдирет. 7 саны жоопко кирбейт (сан огунда ичи бош чекит менен белгиленет).',
    },
    {
      id: 7,
      questionRu: 'Какая цифра стоит в разряде десятков в числе 4 582?',
      questionKg: '4 582 санында ондуктар разрядында кайсы цифра турат?',
      options: ['2', '8', '5', '4'],
      correctIdx: 1,
      explanationRu: 'Справа налево: 2 — единицы, 8 — десятки, 5 — сотни, 4 — тысячи. В разряде десятков стоит цифра 8.',
      explanationKg: 'Оңдон солго: 2 — бирдиктер, 8 — ондуктар, 5 — жүздүктөр, 4 — миңдиктер. Ондуктар разрядында 8 цифрасы турат.',
    },
    {
      id: 8,
      questionRu: 'Представьте число 639 в виде суммы разрядных слагаемых:',
      questionKg: '639 санын разряддык кошулуучулардын суммасы түрүндө көрсөтүңүз:',
      options: [
        '60 + 30 + 9',
        '6 · 100 + 3 · 10 + 9 · 1',
        '6 · 1000 + 3 · 100 + 9',
        '600 + 39',
      ],
      correctIdx: 1,
      explanationRu: 'Разрядный состав числа 639 = 600 + 30 + 9 = 6 · 100 + 3 · 10 + 9 · 1.',
      explanationKg: '639 санынын разряддык түзүлүшү = 600 + 30 + 9 = 6 · 100 + 3 · 10 + 9 · 1.',
    },
    {
      id: 9,
      questionRu: 'Округлите число 748 до десятков по правилам математического округления:',
      questionKg: '748 санын математикалык тегөрөктөө эрежеси боюнча ондуктарга чейин тегөрөктөңүз:',
      options: ['740', '750', '700', '800'],
      correctIdx: 1,
      explanationRu: 'Смотрим на цифру единиц: 8 ≥ 5, поэтому разряд десятков увеличивается на +1 (4 становится 5). Ответ: 750.',
      explanationKg: 'Бирдиктер разрядындагы цифраны карайбыз: 8 ≥ 5, ошондуктан ондуктар разряды +1ге көбөйөт (4 саны 5ке айланат). Жообу: 750.',
    },
    {
      id: 10,
      questionRu: 'В поход идут 23 человека. Каждая палатка вмещает максимум 4 человека. Сколько минимум палаток нужно взять?',
      questionKg: 'Жөө жүрүшкө 23 адам чыгып жатат. Ар бир чатырга эң көп 4 адам батат. Жок дегенде канча чатыр алуу керек?',
      options: ['5 палаток', '6 палаток', '4 палатки', '5.75 палатки'],
      correctIdx: 1,
      explanationRu: 'Прикладное округление с избытком: 23 : 4 = 5.75. В 5 палаток поместятся только 20 человек, поэтому нужно 6 палаток, чтобы разместить всех.',
      explanationKg: 'Турмуштук ашыгы менен тегөрөктөө: 23 : 4 = 5.75. 5 чатырга 20 гана адам батат, 3 адам сыртта калбашы үчүн 6 чатыр алуу керек.',
    },
  ],
  geometry: [
    {
      id: 1,
      questionRu: 'В прямоугольном треугольнике катеты равны 6 и 8. Чему равна гипотенуза?',
      questionKg: 'Тик бурчтуу үч бурчтуктун катеттери 6 жана 8ге барабар. Гипотенузасы канчага барабар?',
      options: ['10', '12', '14', '9'],
      correctIdx: 0,
      explanationRu: 'По теореме Пифагора: c² = 6² + 8² = 36 + 64 = 100 => c = 10 (Египетский треугольник).',
      explanationKg: 'Пифагор теоремасы боюнча: c² = 6² + 8² = 36 + 64 = 100 => c = 10.',
    },
    {
      id: 2,
      questionRu: 'Один из смежных углов равен 65°. Чему равен второй угол?',
      questionKg: 'Жанаша бурчтардын бири 65° болсо, экинчи бурч канчага барабар?',
      options: ['115°', '125°', '25°', '95°'],
      correctIdx: 0,
      explanationRu: 'Сумма смежных углов всегда равна 180°. 180° - 65° = 115°.',
      explanationKg: 'Жанаша бурчтардын суммасы дайыма 180° болот. 180° - 65° = 115°.',
    },
    {
      id: 3,
      questionRu: 'Сумма углов любого выпуклого четырехугольника равна:',
      questionKg: 'Каалаган төрт бурчтуктун ички бурчтарынын суммасы канчага барабар?',
      options: ['180°', '360°', '540°', '270°'],
      correctIdx: 1,
      explanationRu: 'Сумма углов выпуклого n-угольника = (n-2)*180°. Для n=4 получаем (4-2)*180° = 360°.',
      explanationKg: 'Төрт бурчтуктун ички бурчтарынын суммасы: (4-2)*180° = 360°.',
    },
  ],
  russian: [
    {
      id: 1,
      questionRu: 'Укажите пару с отношением «Род — Вид»: Дерево : Дуб',
      questionKg: '«Жалпы — Жекече» байланышы бар түгөйдү тандаңыз: Дарак : Эмен',
      options: ['Птица : Крыло', 'Цветок : Роза', 'Книга : Страница', 'Врач : Больница'],
      correctIdx: 1,
      explanationRu: 'Роза — это разновидность цветка (Род — Вид). Крыло — это часть птицы (Часть — Целое).',
      explanationKg: 'Роза — гүлдүн бир түрү (Жалпы — Жекече байланышы).',
    },
    {
      id: 2,
      questionRu: 'Найдите ошибку в употреблении деепричастного оборота:',
      questionKg: 'Чакчыл түрмөктүн туура эмес колдонулушун табыңыз:',
      options: [
        'Возвращаясь домой, мы попали под дождь.',
        'Читая книгу, мне стало скучно.',
        'Открыв окно, он вдохнул свежий воздух.',
        'Решая задачу, ученик допустил ошибку.',
      ],
      correctIdx: 1,
      explanationRu: '«Читая книгу, мне стало скучно» — ошибка, так как в безличном предложении нет субъекта, выполняющего добавочное действие деепричастия.',
      explanationKg: 'Чакчыл менен баяндооч бир эле ээге таандык болушу керек.',
    },
    {
      id: 3,
      questionRu: 'Укажите словосочетание с грамматической ошибкой управления:',
      questionKg: 'Башкаруу байланышы бузулган сөз айкашын белгилеңиз:',
      options: ['Согласно приказу', 'Вопреки прогнозу', 'Благодаря стараниям', 'Оплатить за проезд'],
      correctIdx: 3,
      explanationRu: 'Глагол «оплатить» требует винительного падежа без предлога («оплатить проезд»), либо «заплатить за проезд».',
      explanationKg: '«Оплатить» этиши предлогсуз колдонулат («оплатить проезд»).',
    },
  ],
  english: [
    {
      id: 1,
      questionRu: 'Choose the correct conditional form: If I ___ more free time, I would learn Spanish.',
      questionKg: 'Туура форманы тандаңыз: If I ___ more free time, I would learn Spanish.',
      options: ['have', 'had', 'will have', 'would have'],
      correctIdx: 1,
      explanationRu: 'Second Conditional (unreal present): If + Past Simple (had), would + Infinitive.',
      explanationKg: '2nd Conditional формуласы: If + Past Simple (had), would + Verb.',
    },
    {
      id: 2,
      questionRu: 'Find the sentence with the correct Passive Voice:',
      questionKg: 'Passive Voice туура түзүлгөн сүйлөмдү табыңыз:',
      options: [
        'The new library was built last year.',
        'The new library built last year.',
        'The new library was build last year.',
        'The new library had build last year.',
      ],
      correctIdx: 0,
      explanationRu: 'Past Simple Passive: was/were + Past Participle (built).',
      explanationKg: 'Пассив түзүлүшү: was + V3 (built).',
    },
    {
      id: 3,
      questionRu: 'Identify the error: She (A) enjoys (B) reading historical novels (C) and to write (D) poems.',
      questionKg: 'Катаны табыңыз: She enjoys reading historical novels and to write poems.',
      options: ['(A) enjoys', '(B) reading', '(C) and', '(D) to write'],
      correctIdx: 3,
      explanationRu: 'Parallel structure: "reading... and writing" (Gerund must follow "enjoys").',
      explanationKg: 'Параллелдик түзүлүш: "reading... and writing" болушу керек.',
    },
  ],
};

const cleanTopicTitle = (title: string) => {
  return (title || '').replace(/^\d+[\.\)\-\s]+/, '');
};

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
  const [subjectModalMode, setSubjectModalMode] = useState<'math_only' | 'russian_only' | 'english_only' | 'all'>('all');
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

  const handleOpenRussianModal = () => {
    setSubjectModalMode('russian_only');
    setIsSubjectModalOpen(true);
  };

  const handleOpenEnglishModal = () => {
    setSubjectModalMode('english_only');
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

  const currentHomeworkQuestions =
    HOMEWORK_QUESTIONS_BY_SUBJECT[selectedSubjectId] || HOMEWORK_QUESTIONS_BY_SUBJECT.algebra;

  const calculateHomeworkScore = () => {
    let correct = 0;
    currentHomeworkQuestions.forEach((q) => {
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
        <div className="space-y-7">
          {/* BLOCK 1: ТЕОРИЯ ПО МАТЕМАТИКЕ (Основной предмет) */}
          <div className="relative rounded-3xl bg-gradient-to-b from-[#062920] via-[#051f18] to-[#031510] border-2 border-emerald-500/50 p-6 sm:p-10 shadow-2xl overflow-hidden group">
            {/* Mathematical Blueprint Background Elements (50% Opacity) */}
            <MathSubjectBackground className="opacity-50" />

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
              <div className="p-4 sm:p-5 rounded-2xl bg-[#02100c]/80 border border-emerald-700/40 space-y-2 select-none">
                <div className="flex items-center gap-2 text-emerald-400 font-black text-base">
                  <Calculator className="w-5 h-5" />
                  <span>{isKg ? 'Алгебра' : 'Алгебра'}</span>
                </div>
                <p className="text-xs text-emerald-200/70 leading-relaxed">
                  {isKg
                    ? 'Сандардын түрлөрү, бөлүнүүчүлүк, теңдемелер, барабарсыздыктар, модулдар, маселелер'
                    : 'Числа и делимость, уравнения, неравенства, модули, прогрессии, текстовые задачи'}
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#02100c]/80 border border-emerald-700/40 space-y-2 select-none">
                <div className="flex items-center gap-2 text-teal-400 font-black text-base">
                  <Compass className="w-5 h-5" />
                  <span>{isKg ? 'Геометрия' : 'Геометрия'}</span>
                </div>
                <p className="text-xs text-emerald-200/70 leading-relaxed">
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

          {/* BLOCK 2: ТЕОРИЯ ПО РУССКОМУ ЯЗЫКУ */}
          <div className="relative rounded-3xl bg-gradient-to-b from-[#062920] via-[#051f18] to-[#031510] border-2 border-emerald-500/50 p-6 sm:p-10 shadow-2xl overflow-hidden group">
            {/* Russian Language & Literature Background */}
            <RussianSubjectBackground className="opacity-40" />

            {/* Glowing accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header pill & Methodology badge */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black uppercase tracking-wider shadow-inner">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>{isKg ? 'Негизги предмет' : 'Основной предмет'}</span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#02100c]/85 border border-emerald-700/50 shadow-md">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="text-left leading-tight">
                  <span className="text-xs font-bold text-white block">{isKg ? 'Орус тили жана адабияты' : 'Русский язык и литература'}</span>
                  <span className="text-[10px] text-emerald-300/80 font-medium">
                    {isKg ? '3 бөлүм • 60 суроо' : '3 тематических блока ОРТ'}
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

            {/* 3 Informational Sub-blocks Row */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-8">
              <div className="p-4 rounded-2xl bg-[#02100c]/80 border border-emerald-700/40 space-y-1 select-none">
                <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
                  <FileText className="w-4 h-4" />
                  <span>{isKg ? 'Аналогия жана толуктоо' : 'Аналогия и дополнения'}</span>
                </div>
                <p className="text-xs text-emerald-200/70 leading-relaxed">
                  {isKg ? 'Түр-тек, бөлүк-бүтүн, себеп-натыйжа логикасы' : 'Род-вид, часть-целое, причина-следствие, контекст'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#02100c]/80 border border-emerald-700/40 space-y-1 select-none">
                <div className="flex items-center gap-2 text-teal-400 font-black text-sm">
                  <BookOpen className="w-4 h-4" />
                  <span>{isKg ? 'Текстти түшүнүү' : 'Чтение и понимание'}</span>
                </div>
                <p className="text-xs text-emerald-200/70 leading-relaxed">
                  {isKg ? 'Тексттин мааниси, башкы ой, контекстти талдоо' : 'Анализ микротем, подтекст, аргументация и выводы'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#02100c]/80 border border-emerald-700/40 space-y-1 select-none">
                <div className="flex items-center gap-2 text-emerald-300 font-black text-sm">
                  <GraduationCap className="w-4 h-4" />
                  <span>{isKg ? 'Грамматика' : 'Практическая грамматика'}</span>
                </div>
                <p className="text-xs text-emerald-200/70 leading-relaxed">
                  {isKg ? 'Пунктуация, орфография, синтаксис эрежелери' : 'Пунктуация, орфография, синтаксис и разбор ошибок'}
                </p>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="relative z-10 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleOpenRussianModal}
                className="px-8 py-4 sm:px-10 sm:py-4.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:brightness-110 text-slate-950 font-black text-sm sm:text-base uppercase tracking-wider flex items-center gap-3 shadow-2xl shadow-emerald-500/40 transition-all cursor-pointer group/btn active:scale-95"
              >
                <span>{isKg ? 'Орус тили бөлүмүн тандап баштоо' : 'Пройти теорию по русскому языку'}</span>
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* BLOCK 3: ТЕОРИЯ ПО АНГЛИЙСКОМУ ЯЗЫКУ */}
          <div className="relative rounded-3xl bg-gradient-to-b from-[#062920] via-[#051f18] to-[#031510] border-2 border-teal-500/50 p-6 sm:p-10 shadow-2xl overflow-hidden group">
            {/* British & English Background Elements */}
            <EnglishSubjectBackground className="opacity-40" />

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
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="text-left leading-tight">
                  <span className="text-xs font-bold text-white block">{isKg ? 'Англис тили курсу' : 'Курс английского языка'}</span>
                  <span className="text-[10px] text-teal-300/80 font-medium">
                    {isKg ? '3 предметтик блок' : '3 профильных блока ОРТ'}
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
                  ? 'Англис тили — ЖРТнын предметтик тести. Бул бөлүмдө Reading Comprehension, Grammar & Vocabulary жана Error Identification боюнча бардык эрежелер камтылган.'
                  : 'Английский язык — профильный предметный тест ОРТ. Включает 3 блока: Reading Comprehension, Grammar & Vocabulary и Error Identification с практическими разборами типовых заданий.'}
              </p>
            </div>

            {/* 3 Informational Sub-blocks Row */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-8">
              <div className="p-4 rounded-2xl bg-[#02100c]/80 border border-teal-700/40 space-y-1 select-none">
                <div className="flex items-center gap-2 text-teal-400 font-black text-sm">
                  <BookOpen className="w-4 h-4" />
                  <span>{isKg ? 'Тексттерди окуу' : 'Reading Comprehension'}</span>
                </div>
                <p className="text-xs text-emerald-200/70 leading-relaxed">
                  {isKg ? 'Тексттерди талдоо, сөздүктөр жана суроолор' : 'Понимание текстов, подтекст, главная мысль'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#02100c]/80 border border-teal-700/40 space-y-1 select-none">
                <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
                  <FileText className="w-4 h-4" />
                  <span>{isKg ? 'Грамматика жана сөздүк' : 'Grammar & Vocabulary'}</span>
                </div>
                <p className="text-xs text-emerald-200/70 leading-relaxed">
                  {isKg ? 'Англисче чактар, модалдык этиштер жана пассив' : 'Времена глаголов, модальные глаголы, пассив'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#02100c]/80 border border-teal-700/40 space-y-1 select-none">
                <div className="flex items-center gap-2 text-teal-300 font-black text-sm">
                  <GraduationCap className="w-4 h-4" />
                  <span>{isKg ? 'Каталарды табуу' : 'Error Identification'}</span>
                </div>
                <p className="text-xs text-emerald-200/70 leading-relaxed">
                  {isKg ? 'Сүйлөмдөрдөгү типтүү грамматикалык каталар' : 'Типовые грамматические ошибки в тестах ОРТ'}
                </p>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="relative z-10 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleOpenEnglishModal}
                className="px-8 py-4 sm:px-10 sm:py-4.5 rounded-2xl bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-400 hover:brightness-110 text-slate-950 font-black text-sm sm:text-base uppercase tracking-wider flex items-center gap-3 shadow-2xl shadow-teal-500/40 transition-all cursor-pointer group/btn active:scale-95"
              >
                <span>{isKg ? 'Англис тили бөлүмүн тандап баштоо' : 'Пройти теорию по английскому языку'}</span>
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
            {selectedSubjectId === 'russian' ? (
              <RussianSubjectBackground className="opacity-25" />
            ) : selectedSubjectId === 'english' ? (
              <EnglishSubjectBackground className="opacity-25" />
            ) : (
              <MathSubjectBackground className="opacity-25" />
            )}
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
                  {block.topics.map((topic, idx) => {
                    const rawTitle = isKg ? topic.titleKg : topic.titleRu;
                    const cleanTitle = rawTitle.replace(/^\d+[\.\)\-\s]+/, '').trim();

                    return (
                      <div
                        key={topic.id}
                        onClick={() => topic.isAvailable && handleSelectTopic(block, topic)}
                        className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          topic.isAvailable
                            ? 'bg-[#041d16] hover:bg-[#072a20] border-emerald-700/60 hover:border-emerald-400 cursor-pointer shadow-md hover:scale-[1.01] active:scale-95 group'
                            : 'bg-[#031510]/60 border-emerald-900/40 opacity-70 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                              topic.isAvailable
                                ? 'bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors'
                                : 'bg-white/5 border border-white/10 text-slate-400'
                            }`}
                          >
                            {idx + 1}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug break-words">
                              {cleanTitle}
                            </h4>
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
                    );
                  })}
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
              <span className="text-white">
                {(isKg ? selectedTopic.titleKg : selectedTopic.titleRu).replace(/^\d+[\.\)\-\s]+/, '').trim()}
              </span>
            </div>
          </div>

          {/* Main Topic Header */}
          <div className="relative rounded-3xl bg-gradient-to-r from-[#062920] to-[#041a14] border border-emerald-700/60 p-6 sm:p-8 shadow-xl overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {selectedSubjectId === 'russian' ? (
              <RussianSubjectBackground className="opacity-25" />
            ) : selectedSubjectId === 'english' ? (
              <EnglishSubjectBackground className="opacity-25" />
            ) : (
              <MathSubjectBackground className="opacity-25" />
            )}
            <div className="relative z-10">
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {(isKg ? selectedTopic.titleKg : selectedTopic.titleRu).replace(/^\d+[\.\)\-\s]+/, '').trim()}
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
              <div className="space-y-6 text-emerald-100 leading-relaxed text-sm sm:text-base font-normal">
                {selectedTopic.id === 'natural-and-integers' ? (
                  <>
                    {/* 1. Натуральные и целые числа (N и Z) */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-[#041a14] border border-emerald-700/50 space-y-4">
                      <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black flex items-center justify-center">
                          1
                        </span>
                        <span>
                          {isKg ? 'Натуралдык жана бүтүн сандар (ℕ жана ℤ)' : 'Натуральные и целые числа (ℕ и ℤ)'}
                        </span>
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs sm:text-sm">
                        <div className="p-4 rounded-xl bg-[#02100c] border border-emerald-800/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-emerald-400 font-bold text-sm">
                              {isKg ? 'Натуралдык сандар (ℕ)' : 'Натуральные числа (ℕ)'}
                            </span>
                          </div>
                          <p className="text-emerald-200/80 leading-relaxed">
                            {isKg
                              ? 'Нерселерди (буюмдарды) табигый саноо үчүн колдонулуучу сандар: 1, 2, 3, 4, 5, ...'
                              : 'Числа для подсчета реальных предметов: 1, 2, 3, 4, 5, ...'}
                          </p>
                          <div className="text-[11px] text-emerald-300/90 font-medium">
                            {isKg ? '• Эң кичине натуралдык сан: 1' : '• Самое маленькое натуральное число: 1'}
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-[#02100c] border border-emerald-800/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-teal-400 font-bold text-sm">
                              {isKg ? 'Бүтүн сандар (ℤ)' : 'Целые числа (ℤ)'}
                            </span>
                          </div>
                          <p className="text-emerald-200/80 leading-relaxed">
                            {isKg
                              ? 'Натуралдык сандарды, аларга карама-каршы терс сандарды жана 0 санын камтыйт: ..., -2, -1, 0, 1, 2, ...'
                              : 'Включают натуральные, отрицательные и ноль (..., -2, -1, 0, 1, 2, ...).'}
                          </p>
                          <div className="text-[11px] text-teal-300/90 font-medium">
                            {isKg
                              ? '• Эң кичине жана эң чоң бүтүн сан жок, бүтүн сандар чексиз.'
                              : '• Самого маленького и большого целого числа — нет, целые числа бесконечны.'}
                          </div>
                        </div>
                      </div>

                      {/* ⚠️ Trap Alert Box: Ноль */}
                      <div className="p-4 rounded-xl bg-amber-950/40 border-2 border-amber-500/60 text-amber-200 text-xs sm:text-sm font-bold flex items-start gap-3 shadow-lg">
                        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-black text-amber-300 uppercase tracking-wider block mb-1">
                            {isKg ? 'Нөлгө басым (0):' : 'Акцент на ноль (0):'}
                          </span>
                          <span className="font-normal text-amber-100">
                            {isKg
                              ? 'Ноль — бүтүн сан, бирок натуралдык сан ЭМЕС!'
                              : 'Ноль — целое число, но НЕ натуральное!'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 2. Противоположные числа */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-[#041a14] border border-emerald-700/50 space-y-4">
                      <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black flex items-center justify-center">
                          2
                        </span>
                        <span>
                          {isKg ? 'Карама-каршы сандар' : 'Противоположные числа'}
                        </span>
                      </h3>
                      <p className="text-emerald-200/90 text-xs sm:text-sm leading-relaxed">
                        {isKg
                          ? 'Бири-биринен белгиси менен гана айырмаланган эгиз сандар.'
                          : 'Числа-близнецы, которые отличаются только знаком.'}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                        <div className="p-3.5 rounded-xl bg-[#02100c] border border-emerald-800/60 flex items-center justify-between">
                          <span className="text-emerald-200/80">{isKg ? 'Мисал:' : 'Пример:'}</span>
                          <div className="font-mono text-emerald-300 font-bold">
                            <span>5</span> <span className="text-emerald-500 mx-1.5">↔</span> <span className="text-rose-400">-5</span>
                          </div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#02100c] border border-emerald-800/60 flex items-center justify-between">
                          <span className="text-emerald-200/80">{isKg ? 'Мисал:' : 'Пример:'}</span>
                          <div className="font-mono text-emerald-300 font-bold">
                            <span className="text-rose-400">-12</span> <span className="text-emerald-500 mx-1.5">↔</span> <span>12</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-emerald-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>
                          {isKg
                            ? 'Башкы касиет: Карама-каршы сандардын суммасы дайыма нөлгө барабар: a + (-a) = 0'
                            : 'Главное свойство: Сумма противоположных чисел всегда равна нулю: a + (-a) = 0'}
                        </span>
                      </div>
                    </div>

                    {/* 3. Числовая прямая и координатный луч */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-[#041a14] border border-emerald-700/50 space-y-4">
                      <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black flex items-center justify-center">
                          3
                        </span>
                        <span>
                          {isKg ? 'Сан огу жана координаталык шоола' : 'Числовая прямая и координатный луч'}
                        </span>
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                        <div className="p-3.5 rounded-xl bg-[#02100c] border border-emerald-800/60 space-y-1">
                          <strong className="text-emerald-300 block">
                            {isKg ? '• Координаталык шоола:' : '• Координатный луч:'}
                          </strong>
                          <p className="text-emerald-200/80">
                            {isKg
                              ? '0дөн башталып оңго гана кетет (оң сандардын гана зонасы).'
                              : 'Старт от 0 и только вправо (зона только положительных чисел).'}
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#02100c] border border-emerald-800/60 space-y-1">
                          <strong className="text-teal-300 block">
                            {isKg ? '• Сан түз сызыгы:' : '• Числовая прямая:'}
                          </strong>
                          <p className="text-emerald-200/80">
                            {isKg
                              ? 'Эки тарапка тең чексиз кеткен жол: сол жакта минус, ортодо 0, оң жакта плюс.'
                              : 'Бесконечная дорога в обе стороны: слева минус, по центру 0, справа плюс.'}
                          </p>
                        </div>
                      </div>

                      {/* SVG Visual Graphic of Number Line & Ray */}
                      <div className="p-4 sm:p-5 rounded-xl bg-[#020e0b] border border-emerald-800/80 space-y-5">
                        {/* Ray */}
                        <div>
                          <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-2">
                            {isKg ? '1. Координаталык шоола (0дөн баштап оңго)' : '1. Координатный луч (от 0 только вправо)'}
                          </div>
                          <div className="overflow-x-auto py-2">
                            <svg className="w-full min-w-[500px] h-12" viewBox="0 0 600 50">
                              <defs>
                                <marker id="arrow-right" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#34d399" />
                                </marker>
                              </defs>
                              {/* Line */}
                              <line x1="50" y1="25" x2="570" y2="25" stroke="#34d399" strokeWidth="2.5" markerEnd="url(#arrow-right)" />
                              {/* Points */}
                              {[
                                { x: 50, val: '0', isOrigin: true },
                                { x: 140, val: '1' },
                                { x: 230, val: '2' },
                                { x: 320, val: '3' },
                                { x: 410, val: '4' },
                                { x: 500, val: '5' },
                              ].map((pt, i) => (
                                <g key={i}>
                                  <line x1={pt.x} y1="18" x2={pt.x} y2="32" stroke="#34d399" strokeWidth="2" />
                                  <circle cx={pt.x} cy="25" r={pt.isOrigin ? '4' : '3'} fill={pt.isOrigin ? '#10b981' : '#34d399'} />
                                  <text x={pt.x} y="44" fill="#a7f3d0" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                                    {pt.val}
                                  </text>
                                </g>
                              ))}
                              <text x="580" y="29" fill="#34d399" fontSize="12" fontWeight="bold" fontFamily="monospace">X</text>
                            </svg>
                          </div>
                        </div>

                        {/* Number Line */}
                        <div>
                          <div className="text-[11px] font-bold text-teal-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                            <span>{isKg ? '2. Сан огу (солго терс, оңго оң сандар)' : '2. Числовая прямая (влево минус, вправо плюс)'}</span>
                            <span className="text-[10px] text-emerald-400 font-normal">← Меньше | Больше →</span>
                          </div>
                          <div className="overflow-x-auto py-2">
                            <svg className="w-full min-w-[500px] h-12" viewBox="0 0 600 50">
                              <defs>
                                <marker id="arrow-left" viewBox="0 0 10 10" refX="4" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                                  <path d="M 10 0 L 0 5 L 10 10 z" fill="#2dd4bf" />
                                </marker>
                                <marker id="arrow-right-teal" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#2dd4bf" />
                                </marker>
                              </defs>
                              {/* Line */}
                              <line x1="30" y1="25" x2="570" y2="25" stroke="#2dd4bf" strokeWidth="2.5" markerStart="url(#arrow-left)" markerEnd="url(#arrow-right-teal)" />
                              {/* Points */}
                              {[
                                { x: 70, val: '-3', color: '#f87171' },
                                { x: 150, val: '-2', color: '#f87171' },
                                { x: 230, val: '-1', color: '#f87171' },
                                { x: 300, val: '0', color: '#fbbf24', isCenter: true },
                                { x: 370, val: '1', color: '#34d399' },
                                { x: 440, val: '2', color: '#34d399' },
                                { x: 510, val: '3', color: '#34d399' },
                              ].map((pt, i) => (
                                <g key={i}>
                                  <line x1={pt.x} y1="18" x2={pt.x} y2="32" stroke={pt.color} strokeWidth="2" />
                                  <circle cx={pt.x} cy="25" r={pt.isCenter ? '4.5' : '3'} fill={pt.color} />
                                  <text x={pt.x} y="44" fill={pt.color} fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                                    {pt.val}
                                  </text>
                                </g>
                              ))}
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs sm:text-sm font-semibold text-emerald-300">
                        {isKg
                          ? '👉 Башкы ориентир: Сан огунда сан канчалык оңдо турса, ошончолук чоң (эгер B чекити Aдан оңдо болсо, B > A).'
                          : '👉 Главный ориентир: Чем число правее на прямой, тем оно больше (если B правее A, то B > A).'}
                      </div>
                    </div>

                    {/* 4. Сравнение целых чисел */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-[#041a14] border border-emerald-700/50 space-y-4">
                      <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black flex items-center justify-center">
                          4
                        </span>
                        <span>
                          {isKg ? 'Бүтүн сандарды салыштыруу' : 'Сравнение целых чисел'}
                        </span>
                      </h3>

                      <div className="p-4 rounded-xl bg-[#02100c] border border-emerald-800/60 space-y-2 text-xs sm:text-sm">
                        <strong className="text-emerald-300 block text-sm">
                          {isKg ? '• Белгисин эске алуу менен салыштыруу:' : '• Сравнение с учетом знака:'}
                        </strong>
                        <ul className="space-y-1.5 text-emerald-200/90 list-disc list-inside">
                          <li>
                            {isKg
                              ? 'Кандай гана оң сан болбосун, бардык терс сандан дайыма чоң: '
                              : 'Любой плюс всегда сильнее любого минуса: '}
                            <span className="font-mono text-emerald-300 font-bold">-10 &lt; 2</span>
                          </li>
                          <li>
                            {isKg
                              ? 'Эки терс сандын нөлгө жакын турганы (модулу кичинеси) чоңураак: '
                              : 'Из двух минусов больше тот, который ближе к нулю: '}
                            <span className="font-mono text-emerald-300 font-bold">-3 &gt; -8</span>
                          </li>
                        </ul>
                      </div>

                      {/* Strict vs Non-strict */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                        <div className="p-4 rounded-xl bg-[#02100c] border border-amber-800/50 space-y-2">
                          <div className="flex items-center gap-2 text-amber-300 font-bold">
                            <span className="w-4 h-4 rounded-full border-2 border-amber-400 bg-transparent inline-block" />
                            <span>{isKg ? 'Катуу салыштыруу (> же <)' : 'Строгое сравнение (> или <)'}</span>
                          </div>
                          <p className="text-emerald-200/80 text-xs leading-relaxed">
                            {isKg
                              ? 'Чектик сан жоопко кирбейт (сан огунда ичи бош чекит ○ менен белгиленет).'
                              : 'Граничное число не входит в ответ (на числовой прямой обозначается выколотой точкой ○).'}
                          </p>
                          <div className="p-3 rounded-lg bg-black/50 border border-amber-500/20 text-xs text-amber-200/95 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-amber-300">{isKg ? 'Мисал 1:' : 'Пример 1:'}</span>
                              <span className="font-mono bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-200 font-bold">x &gt; 5</span>
                              <span>→ {isKg ? '6, 7, 8... (5 саны кирбейт)' : 'подходят 6, 7, 8... (число 5 не входит)'}</span>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-amber-300">{isKg ? 'Мисал 2:' : 'Пример 2:'}</span>
                              <span className="font-mono bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-200 font-bold">x &lt; 3</span>
                              <span>→ {isKg ? '2, 1, 0, -1... (3 саны кирбейт)' : 'подходят 2, 1, 0, -1... (число 3 не входит)'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-[#02100c] border border-emerald-800/60 space-y-2">
                          <div className="flex items-center gap-2 text-emerald-300 font-bold">
                            <span className="w-4 h-4 rounded-full bg-emerald-400 inline-block" />
                            <span>{isKg ? 'Катуу эмес салыштыруу (≥ же ≤)' : 'Нестрогое сравнение (≥ или ≤)'}</span>
                          </div>
                          <p className="text-emerald-200/80 text-xs leading-relaxed">
                            {isKg
                              ? 'Чектик сан дагы жоопко кирет (сан огунда боелгон чекит ● менен белгиленет).'
                              : 'Граничное число входит в ответ (на числовой прямой обозначается закрашенной точкой ●).'}
                          </p>
                          <div className="p-3 rounded-lg bg-black/50 border border-emerald-500/20 text-xs text-emerald-200/95 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-emerald-300">{isKg ? 'Мисал 1:' : 'Пример 1:'}</span>
                              <span className="font-mono bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-200 font-bold">x ≥ 5</span>
                              <span>→ {isKg ? '5, 6, 7, 8... (5 саны кирет)' : 'подходят 5, 6, 7, 8... (число 5 входит)'}</span>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-emerald-300">{isKg ? 'Мисал 2:' : 'Пример 2:'}</span>
                              <span className="font-mono bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-200 font-bold">x ≤ -2</span>
                              <span>→ {isKg ? '-2, -3, -4... (-2 саны кирет)' : 'подходят -2, -3, -4... (число -2 входит)'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 5. Разряды чисел */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-[#041a14] border border-emerald-700/50 space-y-4">
                      <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black flex items-center justify-center">
                          5
                        </span>
                        <span>
                          {isKg ? 'Сандардын разряддары' : 'Разряды чисел'}
                        </span>
                      </h3>
                      <p className="text-emerald-200/90 text-xs sm:text-sm">
                        {isKg
                          ? 'Сандагы цифранын ээлеген орду, оңдон солго карай саналат.'
                          : 'Место цифры в числе, отсчитывается справа налево.'}
                      </p>

                      <div className="p-4 rounded-xl bg-[#02100c] border border-emerald-800/60 space-y-3">
                        <div className="text-xs sm:text-sm text-emerald-300 font-bold">
                          {isKg ? 'Мисал: 457 санында:' : 'Пример: В числе 457:'}
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-700/40">
                            <div className="text-lg font-black text-white font-mono">4</div>
                            <div className="text-emerald-300 font-bold">{isKg ? 'Жүздүктөр' : 'Сотни'}</div>
                          </div>
                          <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-700/40">
                            <div className="text-lg font-black text-white font-mono">5</div>
                            <div className="text-teal-300 font-bold">{isKg ? 'Ондуктар' : 'Десятки'}</div>
                          </div>
                          <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-700/40">
                            <div className="text-lg font-black text-white font-mono">7</div>
                            <div className="text-amber-300 font-bold">{isKg ? 'Бирдиктер' : 'Единицы'}</div>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-[#010907] border border-emerald-900 font-mono text-xs text-center text-emerald-300">
                          457 = 400 + 50 + 7 = 4 · 100 + 5 · 10 + 7 · 1
                        </div>
                      </div>
                    </div>

                    {/* 6. Математическое округление */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-[#041a14] border border-emerald-700/50 space-y-4">
                      <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black flex items-center justify-center">
                          6
                        </span>
                        <span>
                          {isKg ? 'Математикалык тегөрөктөө' : 'Математическое округление'}
                        </span>
                      </h3>
                      <p className="text-emerald-200/90 text-xs sm:text-sm">
                        {isKg
                          ? 'Ашыкча цифраларды эреже боюнча кесебиз: оң жагындагы кийинки цифраны карайбыз.'
                          : 'Срезаем лишние цифры по правилу: смотрим на следующую цифру справа.'}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                        <div className="p-3.5 rounded-xl bg-[#02100c] border border-emerald-800/60 space-y-1.5">
                          <div className="text-emerald-400 font-bold">0, 1, 2, 3, 4</div>
                          <p className="text-emerald-200/80">
                            {isKg
                              ? 'Разрядды ошол бойдон калтырабыз (ордунда калат): 43 → 40 (3 ордунда калтырат).'
                              : 'Оставляем разряд как есть: 43 → 40 (цифра 3 оставляет на месте).'}
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#02100c] border border-emerald-800/60 space-y-1.5">
                          <div className="text-amber-300 font-bold">5, 6, 7, 8, 9</div>
                          <p className="text-emerald-200/80">
                            {isKg
                              ? 'Разрядга +1 кошобуз (жогору тегөрөктөө): 47 → 50 (7 жогору тартат).'
                              : 'Накидываем +1 к разряду (округление вверх): 47 → 50 (7 тянет вверх).'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 7. Прикладное округление (с избытком и недостатком) */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-[#041a14] border border-emerald-700/50 space-y-4">
                      <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black flex items-center justify-center">
                          7
                        </span>
                        <span>
                          {isKg ? 'Турмуштук (колдонмо) тегөрөктөө' : 'Прикладное округление (с избытком и недостатком)'}
                        </span>
                      </h3>
                      <p className="text-emerald-300 font-medium text-xs sm:text-sm">
                        {isKg
                          ? 'Математика турмуштук логикага жол берет:'
                          : 'Математика уступает жизненной логике:'}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm">
                        <div className="p-4 rounded-xl bg-[#02100c] border border-emerald-800/60 space-y-2">
                          <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs">
                              {isKg ? 'Ашыгы менен' : 'С избытком'}
                            </span>
                            <span>{isKg ? '(чоң жагына)' : '(в большую сторону)'}</span>
                          </div>
                          <p className="text-emerald-200/90 leading-relaxed">
                            {isKg
                              ? '13 адамды 4 орундуу машиналар менен ташуу керек (13 : 4 = 3.25). Үч машинага баары батпайт, ошондуктан 4 машина алабыз.'
                              : 'Нужно везти 13 человек на 4-местных машинах (13 : 4 = 3.25). В три машины все не влезут, поэтому берем 4 машины.'}
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-[#02100c] border border-emerald-800/60 space-y-2">
                          <div className="text-teal-400 font-bold flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 text-xs">
                              {isKg ? 'Кемдиги менен' : 'С недостатком'}
                            </span>
                            <span>{isKg ? '(кичине жагына)' : '(в меньшую сторону)'}</span>
                          </div>
                          <p className="text-emerald-200/90 leading-relaxed">
                            {isKg
                              ? '500 сом бар, китептин баасы 120 сом (500 : 120 = 4.16). 5-китепке акча жетпейт, демек 4 гана китеп сатып ала алабыз.'
                              : 'Есть 500 сомов, книга стоит 120 сомов (500 : 120 = 4.16). На 5-ю книгу не хватает, значит купить можем только 4 книги.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : selectedTopic.id === 'arithmetic-operations-and-brackets' ? (
                  <>
                    {/* 1. Компоненты действий */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-[#041a14] border border-emerald-700/50 space-y-4">
                      <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black flex items-center justify-center">
                          1
                        </span>
                        <span>
                          {isKg ? 'Амалдардын компоненттери' : 'Компоненты действий'}
                        </span>
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                        <div className="p-3.5 rounded-xl bg-[#02100c] border border-emerald-800/60 flex flex-col gap-1">
                          <span className="text-emerald-400 font-extrabold text-sm flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-mono text-xs">+</span>
                            {isKg ? 'Кошуу' : 'Сложение'}
                          </span>
                          <span className="font-mono text-white text-sm">$a + b = c$</span>
                          <span className="text-emerald-200/70 text-xs">
                            {isKg ? '(кошулуучу + кошулуучу = сумма)' : '(слагаемое + слагаемое = сумма)'}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[#02100c] border border-emerald-800/60 flex flex-col gap-1">
                          <span className="text-teal-400 font-extrabold text-sm flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-md bg-teal-500/20 text-teal-300 flex items-center justify-center font-mono text-xs">-</span>
                            {isKg ? 'Кемитүү' : 'Вычитание'}
                          </span>
                          <span className="font-mono text-white text-sm">$a - b = c$</span>
                          <span className="text-emerald-200/70 text-xs">
                            {isKg ? '(кемүүчү - кемитүүчү = айырма)' : '(уменьшаемое - вычитаемое = разность)'}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[#02100c] border border-emerald-800/60 flex flex-col gap-1">
                          <span className="text-emerald-300 font-extrabold text-sm flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-mono text-xs">·</span>
                            {isKg ? 'Көбөйтүү' : 'Умножение'}
                          </span>
                          <span className="font-mono text-white text-sm">$a \cdot b = c$</span>
                          <span className="text-emerald-200/70 text-xs">
                            {isKg ? '(көбөйтүүчү · көбөйтүүчү = көбөйтүндү)' : '(множитель · множитель = произведение)'}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[#02100c] border border-emerald-800/60 flex flex-col gap-1">
                          <span className="text-rose-400 font-extrabold text-sm flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-md bg-rose-500/20 text-rose-300 flex items-center justify-center font-mono text-xs">:</span>
                            {isKg ? 'Бөлүү' : 'Деление'}
                          </span>
                          <span className="font-mono text-white text-sm">$a : b = c$</span>
                          <span className="text-emerald-200/70 text-xs">
                            {isKg ? '(бөлүнүүчү : бөлүүчү = тийинди)' : '(делимое : делитель = частное)'}
                          </span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-200 text-xs sm:text-sm font-bold flex items-center gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{isKg ? '0гө бөлүүгө болбойт.' : 'На 0 делить нельзя.'}</span>
                      </div>
                    </div>

                    {/* 2. Арифметические операции (Правила знаков) */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-[#041a14] border border-emerald-700/50 space-y-4">
                      <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black flex items-center justify-center">
                          2
                        </span>
                        <span>
                          {isKg ? 'Арифметикалык амалдар (Белгилердин эрежелери)' : 'Арифметические операции (Правила знаков)'}
                        </span>
                      </h3>

                      {/* Группа 1: Сложение и вычитание */}
                      <div className="p-4 rounded-xl bg-[#02100c] border border-emerald-800/60 space-y-3">
                        <h4 className="text-sm sm:text-base font-extrabold text-emerald-300 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span>{isKg ? '1-топ: Кошуу жана кемитүү (+ жана -)' : 'Группа 1: Сложение и вычитание (+ и -)'}</span>
                        </h4>

                        <div className="space-y-3 text-xs sm:text-sm">
                          {/* Case A: Same signs */}
                          <div className="p-3.5 rounded-xl bg-[#031510] border border-emerald-700/40 space-y-2">
                            <span className="font-bold text-white block">
                              {isKg ? 'Бирдей белгилер (+ жана +) же (- жана -):' : 'Одинаковые знаки (+ и +) или (- и -):'}
                            </span>
                            <p className="text-emerald-200/90">
                              <strong>{isKg ? 'Эреже:' : 'Правило:'}</strong>{' '}
                              {isKg
                                ? 'Сандардын модулдарын кошобуз жана алардын жалпы белгисин коёбуз.'
                                : 'Складываем модули чисел и ставим их общий знак.'}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-emerald-300 text-xs sm:text-sm pt-1">
                              <div className="p-2 rounded-lg bg-black/40 border border-emerald-900/60">
                                $+5 + 3 = +8$ {isKg ? '(же жөн гана 8)' : '(или просто 8)'}
                              </div>
                              <div className="p-2 rounded-lg bg-black/40 border border-emerald-900/60">
                                $-5 - 3 = -8$
                              </div>
                            </div>
                          </div>

                          {/* Case B: Different signs */}
                          <div className="p-3.5 rounded-xl bg-[#031510] border border-emerald-700/40 space-y-2">
                            <span className="font-bold text-white block">
                              {isKg ? 'Ар башка белгилер (+ жана -) же (- жана +):' : 'Разные знаки (+ и -) или (- и +):'}
                            </span>
                            <p className="text-emerald-200/90">
                              <strong>{isKg ? 'Эреже:' : 'Правило:'}</strong>{' '}
                              {isKg
                                ? 'Модулу боюнча чоң сандын модулунан кичинесин кемитебиз жана модулу чоң сандын белгисин коёбуз.'
                                : 'Из большего по модулю числа вычитаем меньшее и ставим знак большего по модулю числа.'}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-emerald-300 text-xs sm:text-sm pt-1">
                              <div className="p-2 rounded-lg bg-black/40 border border-emerald-900/60">
                                $-8 + 3 = -5$ <span className="text-[11px] text-emerald-200/70 font-sans block mt-0.5">({isKg ? 'модуль |-8| > |3|, минус' : 'модуль |-8| > |3|, знак минус'})</span>
                              </div>
                              <div className="p-2 rounded-lg bg-black/40 border border-emerald-900/60">
                                $+8 - 3 = +5$ <span className="text-[11px] text-emerald-200/70 font-sans block mt-0.5">({isKg ? 'модуль |8| > |-3|, плюс' : 'модуль |8| > |-3|, знак плюс'})</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Группа 2: Умножение и деление */}
                      <div className="p-4 rounded-xl bg-[#02100c] border border-emerald-800/60 space-y-3">
                        <h4 className="text-sm sm:text-base font-extrabold text-teal-300 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-teal-400" />
                          <span>{isKg ? '2-топ: Көбөйтүү жана бөлүү (· жана :)' : 'Группа 2: Умножение и деление (· и :)'}</span>
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
                          {/* Sign formula */}
                          <div className="p-3.5 rounded-xl bg-[#031510] border border-emerald-700/40 space-y-2">
                            <span className="font-extrabold text-emerald-400 block uppercase tracking-wider text-[11px]">
                              {isKg ? 'Белгилердин формуласы:' : 'Формула знаков:'}
                            </span>
                            <div className="space-y-1.5 font-mono text-xs sm:text-sm text-emerald-200">
                              <div className="p-1.5 rounded-lg bg-black/30 flex justify-between">
                                <span>$(+) \cdot (+) = (+)$</span>
                                <span className="text-white/40">|</span>
                                <span>$(+) : (+) = (+)$</span>
                              </div>
                              <div className="p-1.5 rounded-lg bg-black/30 flex justify-between">
                                <span>$(-) \cdot (-) = (+)$</span>
                                <span className="text-white/40">|</span>
                                <span>$(-) : (-) = (+)$</span>
                              </div>
                              <div className="p-1.5 rounded-lg bg-black/30 flex justify-between">
                                <span>$(-) \cdot (+) = (-)$</span>
                                <span className="text-white/40">|</span>
                                <span>$(-) : (+) = (-)$</span>
                              </div>
                              <div className="p-1.5 rounded-lg bg-black/30 flex justify-between">
                                <span>$(+) \cdot (-) = (-)$</span>
                                <span className="text-white/40">|</span>
                                <span>$(+) : (-) = (-)$</span>
                              </div>
                            </div>
                          </div>

                          {/* Examples */}
                          <div className="p-3.5 rounded-xl bg-[#031510] border border-emerald-700/40 space-y-2">
                            <span className="font-extrabold text-teal-400 block uppercase tracking-wider text-[11px]">
                              {isKg ? 'Мисалдар:' : 'Примеры:'}
                            </span>
                            <div className="space-y-1.5 font-mono text-xs sm:text-sm text-emerald-200">
                              <div className="p-1.5 rounded-lg bg-black/30 flex justify-between">
                                <span>$4 \cdot 5 = 20$</span>
                                <span className="text-white/40">|</span>
                                <span>$20 : 5 = 4$</span>
                              </div>
                              <div className="p-1.5 rounded-lg bg-black/30 flex justify-between">
                                <span>$-4 \cdot (-5) = 20$</span>
                                <span className="text-white/40">|</span>
                                <span>$-20 : (-5) = 4$</span>
                              </div>
                              <div className="p-1.5 rounded-lg bg-black/30 flex justify-between">
                                <span>$-4 \cdot 5 = -20$</span>
                                <span className="text-white/40">|</span>
                                <span>$-20 : 5 = -4$</span>
                              </div>
                              <div className="p-1.5 rounded-lg bg-black/30 flex justify-between">
                                <span>$4 \cdot (-5) = -20$</span>
                                <span className="text-white/40">|</span>
                                <span>$20 : (-5) = -4$</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3. Скобки и их раскрытие */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-[#041a14] border border-emerald-700/50 space-y-4">
                      <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black flex items-center justify-center">
                          3
                        </span>
                        <span>
                          {isKg ? 'Кашаалар жана аларды ачуу' : 'Скобки и их раскрытие'}
                        </span>
                      </h3>

                      <p className="text-xs sm:text-sm text-emerald-200/90 font-medium">
                        {isKg
                          ? 'Кашаалар амалдардын тартибин өзгөртөт: алардын ичиндеги амалдар биринчи кезекте аткарылат.'
                          : 'Скобки меняют приоритет: действия внутри них выполняются в первую очередь.'}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
                        {/* Случай 1 */}
                        <div className="p-4 rounded-xl bg-[#02100c] border border-emerald-800/60 space-y-2">
                          <span className="font-extrabold text-emerald-400 block text-xs sm:text-sm">
                            {isKg ? '1-учур: Кашаанын алдында «+» белгиси турса' : 'Случай 1: Перед скобкой стоит знак «+»'}
                          </span>
                          <p className="text-emerald-200/80 text-xs">
                            {isKg
                              ? 'Кашаанын ичиндеги кошулуучулардын белгилери өзгөрбөйт (кашаалар жөн эле алынып салынат).'
                              : 'Знаки слагаемых внутри скобок не меняются (скобки просто опускаются).'}
                          </p>
                          <div className="p-2.5 rounded-lg bg-black/40 font-mono text-emerald-300 text-xs space-y-1">
                            <div>$a + (b - c) = a + b - c$</div>
                            <div>$5 + (3 - 2) = 5 + 3 - 2 = 6$</div>
                          </div>
                        </div>

                        {/* Случай 2 */}
                        <div className="p-4 rounded-xl bg-[#02100c] border border-emerald-800/60 space-y-2">
                          <span className="font-extrabold text-teal-400 block text-xs sm:text-sm">
                            {isKg ? '2-учур: Кашаанын алдында «-» белгиси турса' : 'Случай 2: Перед скобкой стоит знак «-»'}
                          </span>
                          <p className="text-emerald-200/80 text-xs">
                            {isKg
                              ? 'Кашаанын ичиндеги бардык кошулуучулардын белгилери карама-каршысына өзгөрөт.'
                              : 'Знаки всех слагаемых внутри скобок меняются на противоположные.'}
                          </p>
                          <div className="p-2.5 rounded-lg bg-black/40 font-mono text-teal-300 text-xs space-y-1">
                            <div>$a - (b - c) = a - b + c$</div>
                            <div>$a - (b + c) = a - b - c$</div>
                            <div>$5 - (3 - 2) = 5 - 3 + 2 = 4$</div>
                            <div>$5 - (-3 + 2) = 5 + 3 - 2 = 6$</div>
                          </div>
                        </div>

                        {/* Случай 3 */}
                        <div className="p-4 rounded-xl bg-[#02100c] border border-emerald-800/60 space-y-2">
                          <span className="font-extrabold text-emerald-300 block text-xs sm:text-sm">
                            {isKg
                              ? '3-учур: Кашаага көбөйтүү/бөлүү (Бөлүштүрүүчүлүк касиети)'
                              : 'Случай 3: Умножение/деление на скобку (Распределительное свойство)'}
                          </span>
                          <p className="text-emerald-200/80 text-xs">
                            {isKg
                              ? 'Кашаанын сыртындагы көбөйтүүчү кашаанын ичиндеги ар бир кошулуучуга көбөйтүлөт (белгилерди эске алуу менен).'
                              : 'Множитель за скобкой умножается на каждое слагаемое внутри скобки (с учетом правил знаков).'}
                          </p>
                          <div className="p-2.5 rounded-lg bg-black/40 font-mono text-emerald-300 text-xs space-y-1">
                            <div>$a \cdot (b + c) = a \cdot b + a \cdot c$</div>
                            <div>$a \cdot (b - c) = a \cdot b - a \cdot c$</div>
                            <div>$-a \cdot (b - c) = -a \cdot b + a \cdot c$</div>
                            <div>$3 \cdot (4 - 2) = 3 \cdot 4 - 3 \cdot 2 = 12 - 6 = 6$</div>
                            <div>$-3 \cdot (4 - 2) = -3 \cdot 4 + 3 \cdot 2 = -12 + 6 = -6$</div>
                          </div>
                        </div>

                        {/* Случай 4 */}
                        <div className="p-4 rounded-xl bg-[#02100c] border border-emerald-800/60 space-y-2">
                          <span className="font-extrabold text-teal-300 block text-xs sm:text-sm">
                            {isKg ? '4-учур: Биринин ичине бири кирген кашаалар' : 'Случай 4: Вложенные скобки'}
                          </span>
                          <p className="text-emerald-200/80 text-xs">
                            {isKg
                              ? 'Эгерде кашаалардын бир нече деңгээли болсо ([ { } ]), алар ичтен сыртка карай ачылат.'
                              : 'Если есть несколько уровней скобок ([ { } ]), они раскрываются изнутри наружу.'}
                          </p>
                          <div className="p-2.5 rounded-lg bg-black/40 font-mono text-teal-300 text-xs space-y-1">
                            <div>$10 - (5 - (2 + 1)) = 10 - (5 - 3) = 10 - 2 = 8$</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-5 sm:p-6 rounded-2xl bg-[#041a14] border border-emerald-700/50 whitespace-pre-line text-sm text-emerald-100">
                    {isKg ? selectedTopic.contentKg || selectedTopic.contentRu : selectedTopic.contentRu}
                  </div>
                )}
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

                <div className="relative rounded-3xl overflow-hidden">
                  {/* If user is NOT subscribed to Accessible (Standard) or Premium, lock photos */}
                  {!isSubscribed && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-[#031510]/90 backdrop-blur-md text-center rounded-3xl border border-emerald-600/50">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-xl shadow-emerald-500/30 mb-3">
                        <ImageIcon className="w-7 h-7 text-slate-950" />
                      </div>
                      <h4 className="text-lg sm:text-xl font-black text-white mb-1.5">
                        {isKg ? 'Сүрөт-материалдар жана чыгаруу жолдору жазылууда жеткиликтүү' : 'Фотоматериалы реального ОРТ и разбор решений'}
                      </h4>
                      <p className="text-xs sm:text-sm text-emerald-200/80 max-w-md mb-4 leading-relaxed">
                        {isKg
                          ? 'Чыныгы ЖРТ бланкалары, тузактардын сүрөт-анализдери «Доступная» жана «Премиум» жазылууларында ачык.'
                          : 'Реальные бланки ОРТ с пошаговым разбором решений и ловушек доступны в тарифах «Доступная» (2 000 сом) и «Премиум» (5 000 сом).'}
                      </p>
                      <button
                        type="button"
                        onClick={handleOpenPlanChoice}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 text-slate-950 font-black text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer"
                      >
                        <Zap className="w-4 h-4" />
                        <span>{isKg ? 'Жазылууну активдештирүү' : 'Оформить подписку'}</span>
                      </button>
                    </div>
                  )}

                  {!selectedTopic.photos || selectedTopic.photos.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-[#041a14] border border-emerald-800/60 text-center flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-white">
                        {isKg ? 'Азырынча жүктөлө элек' : 'Еще не загружено'}
                      </p>
                      <p className="text-xs text-emerald-200/60">
                        {isKg ? 'Сүрөт-материалдар жакында кошулат.' : 'Фотоматериалы и разборы скоро появятся.'}
                      </p>
                    </div>
                  ) : (
                    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${!isSubscribed ? 'filter blur-sm select-none pointer-events-none opacity-30' : ''}`}>
                      {selectedTopic.photos.map((photo, pIdx) => (
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
                            {photo.imageUrl ? (
                              <>
                                <img
                                  src={photo.imageUrl}
                                  alt={photo.titleRu}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <button
                                  type="button"
                                  onClick={() => isSubscribed && setPreviewPhotoUrl(photo.imageUrl)}
                                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs backdrop-blur-xs cursor-pointer"
                                >
                                  <Eye className="w-5 h-5 text-emerald-400" />
                                  <span>{isKg ? 'Чоңойтуп көрүү' : 'Увеличить фото'}</span>
                                </button>
                              </>
                            ) : (
                              <div className="flex flex-col items-center justify-center text-emerald-300/60 p-4 text-center">
                                <ImageIcon className="w-8 h-8 mb-2 opacity-50 text-emerald-400" />
                                <span className="text-xs font-bold text-emerald-200/80">{isKg ? 'Азырынча жүктөлө элек' : 'Еще не загружено'}</span>
                              </div>
                            )}
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
                  )}
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
                            {isKg ? 'Жыйынтык:' : 'Результат:'} {calculateHomeworkScore()} / {currentHomeworkQuestions.length}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {currentHomeworkQuestions.map((q, idx) => {
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
                          ? 'Теория жана ЖРТ мисалдарын чыгаруу видеороликтери Премиум жазылуусу бар колдонуучуларга гана жеткиликтүү.'
                          : 'Видеоролики с теорией и с решением примеров ОРТ доступны только для пользователей с премиальной подпиской.'}
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
                        <div className="w-full h-full relative">
                          <iframe
                            src="https://www.youtube.com/embed/How87IgS9Pw?autoplay=1&rel=0"
                            title={isKg ? selectedTopic.titleKg : selectedTopic.titleRu}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                          <button
                            type="button"
                            onClick={() => setIsPlayingVideo(false)}
                            className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/80 hover:bg-black text-white text-xs font-bold border border-white/20 backdrop-blur-md transition-colors cursor-pointer z-10"
                          >
                            {isKg ? 'Жабуу' : 'Закрыть видео'}
                          </button>
                        </div>
                      ) : (
                        <>
                          <img
                            src={
                              selectedTopic.videos?.[0]?.thumbnailUrl ||
                              'https://img.youtube.com/vi/How87IgS9Pw/maxresdefault.jpg'
                            }
                            alt="Video Thumbnail"
                            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-between p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                              <span className="px-3 py-1 rounded-xl bg-black/70 border border-emerald-500/40 text-emerald-300 text-xs font-bold backdrop-blur-md">
                                {selectedTopic.videos?.[0]?.duration || '15:30'}
                              </span>
                              <span className="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold backdrop-blur-md">
                                YouTube HD • 1080p
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
                                {isKg ? 'Автордук видеоразбор' : 'Авторский видеоразбор'}
                              </span>
                              <h4 className="text-sm sm:text-base font-bold text-white line-clamp-2">
                                {isKg
                                  ? `${cleanTopicTitle(selectedTopic.titleKg)}: Теманын теориясы жана ЖРТ мисалдары`
                                  : `${cleanTopicTitle(selectedTopic.titleRu)}: Теория темы и разбор тестов ОРТ`}
                              </h4>
                            </div>
                          </div>
                        </>
                      )}
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
                      : subjectModalMode === 'russian_only'
                      ? isKg
                        ? 'Орус тили бөлүмүн тандаңыз'
                        : 'Выберите раздел русского языка'
                      : subjectModalMode === 'english_only'
                      ? isKg
                        ? 'Англис тили бөлүмүн тандаңыз'
                        : 'Выберите раздел английского языка'
                      : isKg
                      ? 'Бөлүмдү тандаңыз'
                      : 'Выберите предмет теории'}
                  </h3>
                  <span className="text-[11px] text-emerald-200/70 block">
                    {subjectModalMode === 'math_only'
                      ? isKg
                        ? 'Алгебра же Геометрия (2 бөлүм)'
                        : 'Алгебра или Геометрия (2 раздела)'
                      : subjectModalMode === 'russian_only'
                      ? isKg
                        ? 'ЖРТ программасынын 3 бөлүмү'
                        : '3 тематических блока программы ОРТ'
                      : subjectModalMode === 'english_only'
                      ? isKg
                        ? 'ЖРТ предметтик тестинин 3 бөлүмү'
                        : '3 профильных блока предметного теста ОРТ'
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
              {/* 1. MATH ONLY MODE */}
              {subjectModalMode === 'math_only' && (
                <>
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
                          {isKg ? 'Математика • 1-бөлүм' : 'Математика • Раздел 1'}
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
                          {isKg ? 'Математика • 2-бөлүм' : 'Математика • Раздел 2'}
                        </span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400 group-hover:bg-teal-500 group-hover:text-slate-950 transition-all shrink-0 mt-2">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                </>
              )}

              {/* 2. RUSSIAN ONLY MODE (3 Sub-blocks) */}
              {subjectModalMode === 'russian_only' && (
                <>
                  {/* Russian Sub-block 1: Аналогия и дополнения предложения */}
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
                          {isKg ? 'Аналогия жана сүйлөмдү толуктоо' : 'Аналогия и дополнения предложения'}
                        </h4>
                        <p className="text-xs text-emerald-200/70 mt-1 leading-snug">
                          {isKg
                            ? 'Түр-тек, бөлүк-бүтүн, себеп-натыйжа логикасы жана контекст боюнча сөздөрдү коюу'
                            : 'Отношения род-вид, часть-целое, причина-следствие и контекстное дополнение предложений'}
                        </p>
                        <span className="inline-block mt-2 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                          {isKg ? 'Орус тили • 1-блок' : 'Русский язык • 1-й Блок'}
                        </span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all shrink-0 mt-2">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Russian Sub-block 2: Чтение и понимание */}
                  <button
                    type="button"
                    onClick={() => handleSelectSubject('russian')}
                    className="p-5 rounded-2xl bg-[#041a14] hover:bg-[#062b20] border-2 border-emerald-700/60 hover:border-emerald-400 text-left transition-all flex items-start justify-between gap-4 cursor-pointer group shadow-md hover:scale-[1.01] active:scale-95"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/50 flex items-center justify-center text-teal-300 group-hover:scale-105 transition-transform shrink-0">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-black text-white group-hover:text-emerald-300 transition-colors">
                          {isKg ? 'Чтение и понимание (Текстти түшүнүү)' : 'Чтение и понимание'}
                        </h4>
                        <p className="text-xs text-emerald-200/70 mt-1 leading-snug">
                          {isKg
                            ? 'Микротексттерди талдоо, негизги ой, подтекст, аргументтер жана автордук позиция'
                            : 'Анализ микротекстов, поиск главной мысли, подтекст, аргументация и авторская позиция'}
                        </p>
                        <span className="inline-block mt-2 text-[10px] font-extrabold uppercase tracking-wider text-teal-300">
                          {isKg ? 'Орус тили • 2-блок' : 'Русский язык • 2-й Блок'}
                        </span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-300 group-hover:bg-teal-400 group-hover:text-slate-950 transition-all shrink-0 mt-2">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Russian Sub-block 3: Практическая грамматика */}
                  <button
                    type="button"
                    onClick={() => handleSelectSubject('russian')}
                    className="p-5 rounded-2xl bg-[#041a14] hover:bg-[#062b20] border-2 border-emerald-700/60 hover:border-emerald-400 text-left transition-all flex items-start justify-between gap-4 cursor-pointer group shadow-md hover:scale-[1.01] active:scale-95"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform shrink-0">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-black text-white group-hover:text-emerald-300 transition-colors">
                          {isKg ? 'Практикалык грамматика' : 'Практическая грамматика'}
                        </h4>
                        <p className="text-xs text-emerald-200/70 mt-1 leading-snug">
                          {isKg
                            ? 'Орфография жана пунктуация эрежелери, синтаксис, грамматикалык каталарды табуу'
                            : 'Орфографические и пунктуационные нормы, синтаксис, исправление речевых и грамматических ошибок'}
                        </p>
                        <span className="inline-block mt-2 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                          {isKg ? 'Орус тили • 3-блок' : 'Русский язык • 3-й Блок'}
                        </span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all shrink-0 mt-2">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                </>
              )}

              {/* 3. ENGLISH ONLY MODE (3 Sub-blocks) */}
              {subjectModalMode === 'english_only' && (
                <>
                  {/* English Sub-block 1: Reading Comprehension */}
                  <button
                    type="button"
                    onClick={() => handleSelectSubject('english')}
                    className="p-5 rounded-2xl bg-[#041a14] hover:bg-[#062b20] border-2 border-teal-700/60 hover:border-teal-400 text-left transition-all flex items-start justify-between gap-4 cursor-pointer group shadow-md hover:scale-[1.01] active:scale-95"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/50 flex items-center justify-center text-teal-300 group-hover:scale-105 transition-transform shrink-0">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-black text-white group-hover:text-teal-300 transition-colors">
                          Reading Comprehension
                        </h4>
                        <p className="text-xs text-emerald-200/70 mt-1 leading-snug">
                          {isKg
                            ? 'Skimming жана scanning, контексттик сөздүк, негизги идея жана логикалык тыянактар'
                            : 'Skimming, scanning, контекстное значение слов, главная идея и логические выводы ОРТ'}
                        </p>
                        <span className="inline-block mt-2 text-[10px] font-extrabold uppercase tracking-wider text-teal-400">
                          {isKg ? 'Англис тили • 1-блок' : 'English • Block 1'}
                        </span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400 group-hover:bg-teal-400 group-hover:text-slate-950 transition-all shrink-0 mt-2">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>

                  {/* English Sub-block 2: Grammar & Vocabulary */}
                  <button
                    type="button"
                    onClick={() => handleSelectSubject('english')}
                    className="p-5 rounded-2xl bg-[#041a14] hover:bg-[#062b20] border-2 border-teal-700/60 hover:border-teal-400 text-left transition-all flex items-start justify-between gap-4 cursor-pointer group shadow-md hover:scale-[1.01] active:scale-95"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-black text-white group-hover:text-teal-300 transition-colors">
                          Grammar & Vocabulary
                        </h4>
                        <p className="text-xs text-emerald-200/70 mt-1 leading-snug">
                          {isKg
                            ? 'Чактар, Passive Voice, Conditionals, модалдык этиштер, предлогдор жана фразалык этиштер'
                            : 'Времена глаголов, Passive Voice, Conditionals, модальные глаголы, предлоги и фразовые глаголы'}
                        </p>
                        <span className="inline-block mt-2 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                          {isKg ? 'Англис тили • 2-блок' : 'English • Block 2'}
                        </span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300 group-hover:bg-emerald-400 group-hover:text-slate-950 transition-all shrink-0 mt-2">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>

                  {/* English Sub-block 3: Error Identification */}
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
                          Error Identification
                        </h4>
                        <p className="text-xs text-emerald-200/70 mt-1 leading-snug">
                          {isKg
                            ? 'Сүйлөмдөрдүн асты сызылган бөлүктөрүнөн грамматикалык жана синтаксистик каталарды табуу'
                            : 'Поиск грамматических и синтаксических ошибок в подчеркнутых частях предложений формата ОРТ'}
                        </p>
                        <span className="inline-block mt-2 text-[10px] font-extrabold uppercase tracking-wider text-teal-300">
                          {isKg ? 'Англис тили • 3-блок' : 'English • Block 3'}
                        </span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-300 group-hover:bg-teal-400 group-hover:text-slate-950 transition-all shrink-0 mt-2">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                </>
              )}

              {/* 4. ALL SUBJECTS MODE (General Switcher) */}
              {subjectModalMode === 'all' && (
                <>
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

                  {/* Russian Language Option */}
                  <button
                    type="button"
                    onClick={() => handleSelectSubject('russian')}
                    className="p-5 rounded-2xl bg-[#041a14] hover:bg-[#062b20] border-2 border-blue-700/60 hover:border-blue-400 text-left transition-all flex items-start justify-between gap-4 cursor-pointer group shadow-md hover:scale-[1.01] active:scale-95"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/50 flex items-center justify-center text-blue-300 group-hover:scale-105 transition-transform shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-black text-white group-hover:text-blue-300 transition-colors">
                          {isKg ? 'Орус тили' : 'Русский язык'}
                        </h4>
                        <p className="text-xs text-emerald-200/70 mt-1 leading-snug">
                          {isKg
                            ? 'Аналогиялар, текстти окуу жана түшүнүү, практикалык грамматика жана ЖРТ тузактары'
                            : 'Аналогии, чтение и понимание текстов, практическая грамматика (3 блока ОРТ)'}
                        </p>
                        <span className="inline-block mt-2 text-[10px] font-extrabold uppercase tracking-wider text-blue-400">
                          {isKg ? 'Орус тили • Негизги предмет' : 'Русский язык • Основной предмет'}
                        </span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all shrink-0 mt-2">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>

                  {/* English Language Option */}
                  <button
                    type="button"
                    onClick={() => handleSelectSubject('english')}
                    className="p-5 rounded-2xl bg-[#041a14] hover:bg-[#062b20] border-2 border-indigo-700/60 hover:border-indigo-400 text-left transition-all flex items-start justify-between gap-4 cursor-pointer group shadow-md hover:scale-[1.01] active:scale-95"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/50 flex items-center justify-center text-indigo-300 group-hover:scale-105 transition-transform shrink-0">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-black text-white group-hover:text-indigo-300 transition-colors">
                          {isKg ? 'Англис тили' : 'Английский язык'}
                        </h4>
                        <p className="text-xs text-emerald-200/70 mt-1 leading-snug">
                          {isKg
                            ? 'Reading Comprehension, Grammar & Vocabulary, Error Identification'
                            : 'Reading Comprehension, Grammar & Vocabulary, Error Identification (3 блока)'}
                        </p>
                        <span className="inline-block mt-2 text-[10px] font-extrabold uppercase tracking-wider text-indigo-400">
                          {isKg ? 'Англис тили • Предметтик тест ОРТ' : 'Английский язык • Предметный тест ОРТ'}
                        </span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all shrink-0 mt-2">
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
