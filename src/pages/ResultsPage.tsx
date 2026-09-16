import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Question, AppLanguage } from '../types';
import {
  API_BASE_URL,
  SECTION_NAMES,
  SECTION_NAMES_KG,
  getRelativeQuestionNumber,
} from '../data/constants';
import { useAuth } from '../context/AuthContext';
import { getOptimizedTestPageUrl } from '../utils/imageOptimization';
import { calculateOrtMainScore } from '../utils/ortCalculator';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Award,
  Target,
  BarChart3,
  RotateCcw,
  Sparkles,
  Layers,
  X,
  BookOpen,
} from 'lucide-react';

interface ResultsState {
  userAnswers?: Record<number, string>;
  questions?: Question[];
  variantId?: string | number;
  bookmarks?: Record<number, boolean>;
  serverResult?: { finalScore: number; gainedScore?: number } | null;
  mode?: 'full' | 'section' | 'custom' | 'practice';
  targetSectionId?: number | null;
  customSections?: string | null;
}

const SECTION_COEFFICIENTS: Record<number, number> = {
  1: 1.45,
  2: 1.45,
  3: 1.2,
  4: 1.3,
  5: 1.1,
};

const I18N = {
  ru: {
    backToHome: 'На главную',
    dataNotFound: 'Данные теста не найдены',
    testResult: 'Итоги тестирования',
    blockTraining: 'Тренировка блоков',
    sectionTraining: 'Тренировка раздела',
    practiceMode: 'Тренировочный полигон',
    practiceReport: 'Отчет по тренировке:',
    fullTestDesc: 'Полный тест ОРТ (150 заданий)',
    certDescMath: 'Математика (Обе части)',
    certDescPractice: 'Точечная отработка без учета времени',
    ortScore: 'Балл ОРТ',
    gainedScore: 'Кол-во правильных ответов',
    accuracy: 'Точность',
    correctAnswers: 'Верно отвечено',
    tabOverall: 'Общий итог',
    tabMath: 'Математика',
    tabAnalogies: 'Аналогии и дополнения',
    tabReading: 'Чтение и понимание',
    tabGrammar: 'Грамматика',
    mapTitle: 'Карта всех ответов',
    mapSubtitle: 'Кликни на номер, чтобы свериться с ключом и посмотреть скан задания',
    legendCorrect: 'Верно',
    legendError: 'Ошибка',
    modalTitle: 'Разбор задания',
    modalQuestion: 'Вопрос №',
    modalNoImage: 'Изображение для этого вопроса не загружено в базу',
    modalYourAnswer: 'Твой ответ',
    modalCorrectKey: 'Верный ключ',
    noTheme: 'Тема не указана',
    noSkill: 'Умение не указано',
    closeModal: 'Закрыть',
    retryTest: 'Пройти снова',
    sectionBreakdown: 'Успеваемость по разделам',
  },
  kg: {
    backToHome: 'Башкы бетке',
    dataNotFound: 'Тесттин маалыматтары табылган жок',
    testResult: 'Тесттин жыйынтыгы',
    blockTraining: 'Бөлүмдөрдү машыгуу',
    sectionTraining: 'Бөлүмдү машыгуу',
    practiceMode: 'Машыгуу полигону',
    practiceReport: 'Машыгуу боюнча отчет:',
    fullTestDesc: 'ЖРТ толук тести (150 тапшырма)',
    certDescMath: 'Математика (Эки бөлүгү тең)',
    certDescPractice: 'Убакытты эсепке албастан машыгуу',
    ortScore: 'ОРТ баллы',
    gainedScore: 'Топтолгон балл',
    accuracy: 'Тактык',
    correctAnswers: 'Туура жооптор',
    tabOverall: 'Жалпы жыйынтык',
    tabMath: 'Математика',
    tabAnalogies: 'Окшоштуктар жана сүйлөмдү толуктоо',
    tabReading: 'Окуу жана түшүнүү',
    tabGrammar: 'Грамматика',
    mapTitle: 'Бардык жооптордун картасы',
    mapSubtitle: 'Ачкыч менен текшерүү жана тапшырманын сканын көрүү үчүн номерди бас',
    legendCorrect: 'Туура',
    legendError: 'Ката',
    modalTitle: 'Тапшырманы талдоо',
    modalQuestion: 'Суроо №',
    modalNoImage: 'Бул суроо үчүн сүрөт базага жүктөлгөн эмес',
    modalYourAnswer: 'Сенин жообуң',
    modalCorrectKey: 'Туура ачкыч',
    noTheme: 'Тема көрсөтүлгөн эмес',
    noSkill: 'Көндүм көрсөтүлгөн эмес',
    closeModal: 'Жабуу',
    retryTest: 'Кайра тапшыруу',
    sectionBreakdown: 'Бөлүмдөр боюнча жыйынтыктар',
  },
};

export const ResultsPage: React.FC<{ lang?: AppLanguage }> = ({ lang: propLang }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = (location.state || {}) as ResultsState;
  const {
    userAnswers = {},
    questions = [],
    variantId = 'Неизвестен',
    bookmarks = {},
    serverResult = null,
    mode = 'full',
    targetSectionId = null,
    customSections = null,
  } = state;

  const [activeTab, setActiveTab] = useState<string>('overall');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  const { saveTestResult } = useAuth();
  const savedHistoryRef = useRef(false);

  useEffect(() => {
    if (selectedQuestion) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedQuestion]);

  const lang: AppLanguage =
    questions.length > 0 && questions[0].language === 'kg'
      ? 'kg'
      : propLang || 'ru';
  const t = I18N[lang] || I18N.ru;
  const sectionNames = lang === 'kg' ? SECTION_NAMES_KG : SECTION_NAMES;

  const tabsConfig = {
    overall: { id: 'overall', label: t.tabOverall, sections: [1, 2, 3, 4, 5] },
    math: { id: 'math', label: t.tabMath, sections: [1, 2] },
    analogies: { id: 'analogies', label: t.tabAnalogies, sections: [3] },
    reading: { id: 'reading', label: t.tabReading, sections: [4] },
    grammar: { id: 'grammar', label: t.tabGrammar, sections: [5] },
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#031510] flex flex-col items-center justify-center p-4 font-sans text-center relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-md w-full bg-[#05261c] border border-emerald-800/60 rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5 text-emerald-400">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
            {t.dataNotFound}
          </h2>
          <p className="text-sm text-emerald-200/70 mb-6 font-medium">
            {lang === 'kg'
              ? 'Тестти кайрадан тапшыруу үчүн башкы бетке өтүңүз'
              : 'Чтобы пройти пробный тест, перейдите на главную страницу'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#031510] font-black px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.backToHome}</span>
          </button>
        </div>
      </div>
    );
  }

  const customSectionsList = customSections ? customSections.split(',').map(Number) : [];
  const relevantQuestions = questions.filter((q) => {
    if (mode === 'full') return true;
    if (mode === 'custom' || mode === 'practice') {
      return customSectionsList.length > 0 ? customSectionsList.includes(q.section_id) : true;
    }
    return targetSectionId ? q.section_id === targetSectionId : true;
  });

  let totalCorrect = 0;
  let rawScore = 0;
  const sectionCorrectMap: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  relevantQuestions.forEach((q) => {
    if (userAnswers[q.question_number] === q.correct_answer) {
      totalCorrect++;
      rawScore += SECTION_COEFFICIENTS[q.section_id] || 1;
      if (sectionCorrectMap[q.section_id] !== undefined) {
        sectionCorrectMap[q.section_id]++;
      }
    }
  });

  const calculatedMainResult = calculateOrtMainScore({
    math1: sectionCorrectMap[1] || 0,
    math2: sectionCorrectMap[2] || 0,
    analogies: sectionCorrectMap[3] || 0,
    reading: sectionCorrectMap[4] || 0,
    grammar: sectionCorrectMap[5] || 0,
  });

  const finalScore =
    mode === 'full'
      ? (serverResult?.finalScore ? serverResult.finalScore : calculatedMainResult.scaledScore)
      : Math.round(rawScore);
  const accuracyPercent = relevantQuestions.length > 0 ? ((totalCorrect / relevantQuestions.length) * 100).toFixed(1) : '0.0';

  useEffect(() => {
    if (relevantQuestions.length > 0 && !savedHistoryRef.current) {
      savedHistoryRef.current = true;
      const testName = String(variantId).toLowerCase().includes('цоомо') ? String(variantId) : `ЦООМО №${variantId}`;
      let subject = 'Математика';
      if (mode === 'full') {
        subject = lang === 'kg' ? 'Толук ЖРТ' : 'Полный ОРТ';
      } else if (targetSectionId === 3 || targetSectionId === 4 || targetSectionId === 5) {
        subject = lang === 'kg' ? 'Кыргыз тили' : 'Русский язык';
      } else {
        subject = 'Математика';
      }

      saveTestResult({
        variantId,
        testName,
        subject,
        title: testName,
        mode: mode || 'full',
        totalScore: finalScore,
        maxScore: mode === 'full' ? 245 : 100,
        accuracy: parseFloat(accuracyPercent) || 0,
        correctAnswers: totalCorrect,
        totalQuestions: relevantQuestions.length,
        userAnswers,
        language: lang,
      });
    }
  }, [relevantQuestions.length, variantId, mode, finalScore, accuracyPercent, totalCorrect, userAnswers, lang, targetSectionId, saveTestResult]);

  const visibleTabs = Object.values(tabsConfig).filter((tab) => {
    if (mode === 'full' || tab.id === 'overall') return true;
    if (mode === 'custom' || mode === 'practice') {
      return tab.sections.some((s) => customSectionsList.includes(s));
    }
    return targetSectionId ? tab.sections.includes(targetSectionId) : true;
  });

  const getStatsForSections = (sections: number[]) => {
    const subset = relevantQuestions.filter((q) => sections.includes(q.section_id));
    if (subset.length === 0) return null;

    const subSectionStats: Record<string, { total: number; correct: number }> = {};
    const skillStats: Record<string, { total: number; correct: number }> = {};
    let correctCount = 0;

    subset.forEach((q) => {
      const isRight = userAnswers[q.question_number] === q.correct_answer;
      if (isRight) correctCount++;
      const sub = q.sub_section || t.noTheme;
      const skill = q.skill || t.noSkill;

      if (!subSectionStats[sub]) subSectionStats[sub] = { total: 0, correct: 0 };
      subSectionStats[sub].total++;
      if (isRight) subSectionStats[sub].correct++;

      if (!skillStats[skill]) skillStats[skill] = { total: 0, correct: 0 };
      skillStats[skill].total++;
      if (isRight) skillStats[skill].correct++;
    });

    return {
      subSectionStats,
      skillStats,
      percent: ((correctCount / subset.length) * 100).toFixed(1),
      correctCount,
      totalCount: subset.length,
    };
  };

  return (
    <div className="min-h-screen bg-transparent transition-colors py-8 px-4 font-sans selection:bg-emerald-200 pb-20 relative">
      {/* Question Review Modal */}
      {selectedQuestion && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedQuestion(null)}
        >
          <div
            className="bg-[#05261c] w-full max-w-4xl max-h-[95vh] md:max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-emerald-800/70 text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-emerald-800/60 shrink-0 bg-[#05261c] shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-0.5">
                    {t.modalTitle}
                  </p>
                  <h3 className="text-lg md:text-xl font-black text-white leading-none">
                    {t.modalQuestion}{' '}
                    {activeTab === 'overall'
                      ? selectedQuestion.question_number
                      : getRelativeQuestionNumber(selectedQuestion.question_number, selectedQuestion.section_id)}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedQuestion(null)}
                className="w-9 h-9 bg-emerald-900/40 hover:bg-rose-500/20 text-emerald-300 hover:text-rose-400 border border-emerald-700/50 hover:border-rose-500/50 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                title={t.closeModal}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Question Image */}
            <div className="flex-1 overflow-y-auto p-3 md:p-6 bg-[#031510] custom-scrollbar flex flex-col gap-4 items-center">
              {selectedQuestion.image_url ? (
                selectedQuestion.image_url.split('|').map((imgPart, idx) => {
                  const rawUrl = imgPart.startsWith('http') || imgPart.startsWith('/')
                    ? imgPart
                    : `${API_BASE_URL}${imgPart.startsWith('/') ? '' : '/'}${imgPart}`;
                  const optimizedUrl = getOptimizedTestPageUrl(rawUrl);

                  return (
                    <img
                      key={idx}
                      src={optimizedUrl}
                      onError={(e) => {
                        const target = e.currentTarget;
                        const qNum = selectedQuestion.question_number;
                        const isV102 = selectedQuestion.variant_number === 102 || String(variantId) === '102';
                        const isV105 = selectedQuestion.variant_number === 105 || String(variantId) === '105';
                        const isV2 = selectedQuestion.variant_number === 2 || String(variantId) === '2';
                        const isV19 = selectedQuestion.variant_number === 19 || String(variantId) === '19';
                        const isV20 = selectedQuestion.variant_number === 20 || String(variantId) === '20';

                        // Section 5 (Практическая грамматика / Кыргыз тилинин практикалык грамматикасы)
                        if (selectedQuestion.section_id === 5 || (qNum >= 121 && qNum <= 150)) {
                          if (isV105) {
                            if (qNum <= 122) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789387258/5_%D0%91%D0%91%D0%9E%D0%A3%D0%91_1_%D0%9F%D1%80%D0%B0%D0%BA%D1%82%D0%B8%D0%BA%D0%B0%D0%BB%D1%8B%D0%BA_%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0.png');
                            else if (qNum <= 129) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789387259/5_%D0%91%D0%91%D0%9E%D0%A3%D0%91_2_%D0%9F%D1%80%D0%B0%D0%BA%D1%82%D0%B8%D0%BA%D0%B0%D0%BB%D1%8B%D0%BA_%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0.png');
                            else if (qNum <= 136) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789387243/5_%D0%91%D0%91%D0%9E%D0%A3%D0%91_3_%D0%9F%D1%80%D0%B0%D0%BA%D1%82%D0%B8%D0%BA%D0%B0%D0%BB%D1%8B%D0%BA_%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0.png');
                            else if (qNum <= 144) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789387256/5_%D0%91%D0%91%D0%9E%D0%A3%D0%91_4_%D0%9F%D1%80%D0%B0%D0%BA%D1%82%D0%B8%D0%BA%D0%B0%D0%BB%D1%8B%D0%BA_%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0.png');
                            else target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789387256/5_%D0%91%D0%91%D0%9E%D0%A3%D0%91_5_%D0%9F%D1%80%D0%B0%D0%BA%D1%82%D0%B8%D0%BA%D0%B0%D0%BB%D1%8B%D0%BA_%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0.png');
                          } else if (isV102) {
                            if (qNum <= 124) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788604508/2_%D0%91%D0%91%D0%9E%D0%A3%D0%91_1_%D0%9F%D1%80%D0%B0%D0%BA%D1%82%D0%B8%D0%BA%D0%B0%D0%BB%D1%8B%D0%BA_%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0.jpg');
                            else if (qNum <= 132) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788604509/2_%D0%91%D0%91%D0%9E%D0%A3%D0%91_2_%D0%9F%D1%80%D0%B0%D0%BA%D1%82%D0%B8%D0%BA%D0%B0%D0%BB%D1%8B%D0%BA_%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0.jpg');
                            else if (qNum <= 140) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788604511/2_%D0%91%D0%91%D0%9E%D0%A3%D0%91_3_%D0%9F%D1%80%D0%B0%D0%BA%D1%82%D0%B8%D0%BA%D0%B0%D0%BB%D1%8B%D0%BA_%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0.jpg');
                            else if (qNum <= 147) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788604511/2_%D0%91%D0%91%D0%9E%D0%A3%D0%91_4_%D0%9F%D1%80%D0%B0%D0%BA%D1%82%D0%B8%D0%BA%D0%B0%D0%BB%D1%8B%D0%BA_%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0.jpg');
                            else target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788604512/2_%D0%91%D0%91%D0%9E%D0%A3%D0%91_5_%D0%9F%D1%80%D0%B0%D0%BA%D1%82%D0%B8%D0%BA%D0%B0%D0%BB%D1%8B%D0%BA_%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0.jpg');
                          } else {
                            if (qNum <= 123) {
                              target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788605676/1_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%9F%D1%80%D0%B0%D0%BA%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F_%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0.jpg');
                            } else if (qNum <= 131) {
                              target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788605677/1_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_2_%D0%9F%D1%80%D0%B0%D0%BA%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F_%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0.jpg');
                            } else if (qNum <= 138) {
                              target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788605679/1_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_3_%D0%9F%D1%80%D0%B0%D0%BA%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F_%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0.jpg');
                            } else if (qNum <= 146) {
                              target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788605659/1_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_4_%D0%9F%D1%80%D0%B0%D0%BA%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F_%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0.jpg');
                            } else {
                              target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788605657/1_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_5_%D0%9F%D1%80%D0%B0%D0%BA%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F_%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0.jpg');
                            }
                          }
                          return;
                        }
                        // Section 4 (Чтение и понимание / Окуп жана түшүнүү)
                        if (selectedQuestion.section_id === 4 || (qNum >= 91 && qNum <= 120)) {
                          if (isV105) {
                            if (qNum <= 91) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789386634/5_%D0%91%D0%91%D0%9E%D0%A3%D0%91_1_%D0%A7%D1%82%D0%B5%D0%BD%D0%B8%D0%B5_%D0%B8_%D0%BF%D0%BE%D0%BD%D0%B8%D0%BC%D0%B0%D0%BD%D0%B8%D0%B5.png');
                            else if (qNum <= 92) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789386635/5_%D0%91%D0%91%D0%9E%D0%A3%D0%91_2_%D0%A7%D1%82%D0%B5%D0%BD%D0%B8%D0%B5_%D0%B8_%D0%BF%D0%BE%D0%BD%D0%B8%D0%BC%D0%B0%D0%BD%D0%B8%D0%B5.png');
                            else if (qNum <= 100) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789386636/5_%D0%91%D0%91%D0%9E%D0%A3%D0%91_3_%D0%A7%D1%82%D0%B5%D0%BD%D0%B8%D0%B5_%D0%B8_%D0%BF%D0%BE%D0%BD%D0%B8%D0%BC%D0%B0%D0%BD%D0%B8%D0%B5.png');
                            else if (qNum <= 103) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789386637/5_%D0%91%D0%91%D0%9E%D0%A3%D0%91_4_%D0%A7%D1%82%D0%B5%D0%BD%D0%B8%D0%B5_%D0%B8_%D0%BF%D0%BE%D0%BD%D0%B8%D0%BC%D0%B0%D0%BD%D0%B8%D0%B5.png');
                            else if (qNum <= 105) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789386633/5_%D0%91%D0%91%D0%9E%D0%A3%D0%91_5_%D0%A7%D1%82%D0%B5%D0%BD%D0%B8%D0%B5_%D0%B8_%D0%BF%D0%BE%D0%BD%D0%B8%D0%BC%D0%B0%D0%BD%D0%B8%D0%B5.png');
                            else if (qNum <= 110) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789386633/5_%D0%91%D0%91%D0%9E%D0%A3%D0%91_6_%D0%A7%D1%82%D0%B5%D0%BD%D0%B8%D0%B5_%D0%B8_%D0%BF%D0%BE%D0%BD%D0%B8%D0%BC%D0%B0%D0%BD%D0%B8%D0%B5.png');
                            else if (qNum <= 112) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789386634/5_%D0%91%D0%91%D0%9E%D0%A3%D0%91_7_%D0%A7%D1%82%D0%B5%D0%BD%D0%B8%D0%B5_%D0%B8_%D0%BF%D0%BE%D0%BD%D0%B8%D0%BC%D0%B0%D0%BD%D0%B8%D0%B5.png');
                            else if (qNum <= 114) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789386634/5_%D0%91%D0%91%D0%9E%D0%A3%D0%91_8_%D0%A7%D1%82%D0%B5%D0%BD%D0%B8%D0%B5_%D0%B8_%D0%BF%D0%BE%D0%BD%D0%B8%D0%BC%D0%B0%D0%BD%D0%B8%D0%B5.png');
                            else target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789386646/5_%D0%91%D0%91%D0%9E%D0%A3%D0%91_9_%D0%A7%D1%82%D0%B5%D0%BD%D0%B8%D0%B5_%D0%B8_%D0%BF%D0%BE%D0%BD%D0%B8%D0%BC%D0%B0%D0%BD%D0%B8%D0%B5.png');
                          } else if (isV102) {
                            if (qNum <= 93) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788604243/2_%D0%91%D0%91%D0%9E%D0%A3%D0%91_1_%D0%9E%D0%BA%D1%83%D0%BF_%D0%B6%D0%B0%D0%BD%D0%B0_%D1%82%D1%83%D1%88%D1%83%D0%BD%D1%83%D1%83.jpg');
                            else if (qNum <= 95) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788604244/2_%D0%91%D0%91%D0%9E%D0%A3%D0%91_2_%D0%9E%D0%BA%D1%83%D0%BF_%D0%B6%D0%B0%D0%BD%D0%B0_%D1%82%D1%83%D1%88%D1%83%D0%BD%D1%83%D1%83.jpg');
                            else if (qNum <= 97) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788604245/2_%D0%91%D0%91%D0%9E%D0%A3%D0%91_3_%D0%9E%D0%BA%D1%83%D0%BF_%D0%B6%D0%B0%D0%BD%D0%B0_%D1%82%D1%83%D1%88%D1%83%D0%BD%D1%83%D1%83.jpg');
                            else if (qNum <= 100) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788604246/2_%D0%91%D0%91%D0%9E%D0%A3%D0%91_4_%D0%9E%D0%BA%D1%83%D0%BF_%D0%B6%D0%B0%D0%BD%D0%B0_%D1%82%D1%83%D1%88%D1%83%D0%BD%D1%83%D1%83.jpg');
                            else if (qNum <= 104) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788604247/2_%D0%91%D0%91%D0%9E%D0%A3%D0%91_5_%D0%9E%D0%BA%D1%83%D0%BF_%D0%B6%D0%B0%D0%BD%D0%B0_%D1%82%D1%83%D1%88%D1%83%D0%BD%D1%83%D1%83.jpg');
                            else if (qNum <= 107) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788604247/2_%D0%91%D0%91%D0%9E%D0%A3%D0%91_6_%D0%9E%D0%BA%D1%83%D0%BF_%D0%B6%D0%B0%D0%BD%D0%B0_%D1%82%D1%83%D1%88%D1%83%D0%BD%D1%83%D1%83.jpg');
                            else if (qNum <= 110) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788604249/2_%D0%91%D0%91%D0%9E%D0%A3%D0%91_7_%D0%9E%D0%BA%D1%83%D0%BF_%D0%B6%D0%B0%D0%BD%D0%B0_%D1%82%D1%83%D1%88%D1%83%D0%BD%D1%83%D1%83.jpg');
                            else if (qNum <= 112) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788604249/2_%D0%91%D0%91%D0%9E%D0%A3%D0%91_8_%D0%9E%D0%BA%D1%83%D0%BF_%D0%B6%D0%B0%D0%BD%D0%B0_%D1%82%D1%83%D1%88%D1%83%D0%BD%D1%83%D1%83.jpg');
                            else if (qNum <= 114) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788604255/2_%D0%91%D0%91%D0%9E%D0%A3%D0%91_9_%D0%9E%D0%BA%D1%83%D0%BF_%D0%B6%D0%B0%D0%BD%D0%B0_%D1%82%D1%83%D1%88%D1%83%D0%BD%D1%83%D1%83.jpg');
                            else target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788604284/2_%D0%91%D0%91%D0%9E%D0%A3%D0%91_10_%D0%9E%D0%BA%D1%83%D0%BF_%D0%B6%D0%B0%D0%BD%D0%B0_%D1%82%D1%83%D1%88%D1%83%D0%BD%D1%83%D1%83.jpg');
                          } else {
                            const rel = qNum - 90;
                            if (rel <= 3) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788605415/1_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%A7%D1%82%D0%B5%D0%BD%D0%B8%D0%B5_%D0%B8_%D0%BF%D0%BE%D0%BD%D0%B8%D0%BC%D0%B0%D0%BD%D0%B8%D0%B5.jpg');
                            else if (rel <= 7) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788605416/1_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_2_%D0%A7%D1%82%D0%B5%D0%BD%D0%B8%D0%B5_%D0%B8_%D0%BF%D0%BE%D0%BD%D0%B8%D0%BC%D0%B0%D0%BD%D0%B8%D0%B5.jpg');
                            else if (rel <= 10) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788605417/1_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_3_%D0%A7%D1%82%D0%B5%D0%BD%D0%B8%D0%B5_%D0%B8_%D0%BF%D0%BE%D0%BD%D0%B8%D0%BC%D0%B0%D0%BD%D0%B8%D0%B5.jpg');
                            else if (rel <= 13) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788605446/1_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_4_%D0%A7%D1%82%D0%B5%D0%BD%D0%B8%D0%B5_%D0%B8_%D0%BF%D0%BE%D0%BD%D0%B8%D0%BC%D0%B0%D0%BD%D0%B8%D0%B5.jpg');
                            else if (rel <= 17) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788605448/1_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_5_%D0%A7%D1%82%D0%B5%D0%BD%D0%B8%D0%B5_%D0%B8_%D0%BF%D0%BE%D0%BD%D0%B8%D0%BC%D0%B0%D0%BD%D0%B8%D0%B5.jpg');
                            else if (rel <= 20) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788605448/1_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_6_%D0%A7%D1%82%D0%B5%D0%BD%D0%B8%D0%B5_%D0%B8_%D0%BF%D0%BE%D0%BD%D0%B8%D0%BC%D0%B0%D0%BD%D0%B8%D0%B5.jpg');
                            else if (rel <= 23) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788605412/1_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_7_%D0%A7%D1%82%D0%B5%D0%BD%D0%B8%D0%B5_%D0%B8_%D0%BF%D0%BE%D0%BD%D0%B8%D0%BC%D0%B0%D0%BD%D0%B8%D0%B5.jpg');
                            else if (rel <= 27) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788605414/1_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_8_%D0%A7%D1%82%D0%B5%D0%BD%D0%B8%D0%B5_%D0%B8_%D0%BF%D0%BE%D0%BD%D0%B8%D0%BC%D0%B0%D0%BD%D0%B8%D0%B5.jpg');
                            else target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788605451/1_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_9_%D0%A7%D1%82%D0%B5%D0%BD%D0%B8%D0%B5_%D0%B8_%D0%BF%D0%BE%D0%BD%D0%B8%D0%BC%D0%B0%D0%BD%D0%B8%D0%B5.jpg');
                          }
                          return;
                        }
                        // Section 3 (АДП / Окшоштуктар жана сүйлөмдү толуктоо)
                        if (selectedQuestion.section_id === 3 || (qNum >= 61 && qNum <= 90)) {
                          if (isV105) {
                            if (qNum <= 70) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789386299/5_%D0%91%D0%91%D0%9E%D0%A3%D0%91_1_%D0%90%D0%BD%D0%B0%D0%BB%D0%BE%D0%B3%D0%B8%D0%B8_%D0%B8_%D0%B4%D0%BE%D0%BF%D0%BE%D0%BB%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5_%D0%BF%D1%80%D0%B5%D0%B4%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B9.png');
                            else if (qNum <= 80) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789386318/5_%D0%91%D0%91%D0%9E%D0%A3%D0%91_2_%D0%90%D0%BD%D0%B0%D0%BB%D0%BE%D0%B3%D0%B8%D0%B8_%D0%B8_%D0%B4%D0%BE%D0%BF%D0%BE%D0%BB%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5_%D0%BF%D1%80%D0%B5%D0%B4%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B9.png');
                            else if (qNum <= 85) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789386319/5_%D0%91%D0%91%D0%9E%D0%A3%D0%91_3_%D0%90%D0%BD%D0%B0%D0%BB%D0%BE%D0%B3%D0%B8%D0%B8_%D0%B8_%D0%B4%D0%BE%D0%BF%D0%BE%D0%BB%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5_%D0%BF%D1%80%D0%B5%D0%B4%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B9.png');
                            else target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789386300/5_%D0%91%D0%91%D0%9E%D0%A3%D0%91_4_%D0%90%D0%BD%D0%B0%D0%BB%D0%BE%D0%B3%D0%B8%D0%B8_%D0%B8_%D0%B4%D0%BE%D0%BF%D0%BE%D0%BB%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5_%D0%BF%D1%80%D0%B5%D0%B4%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B9.png');
                          } else if (isV102) {
                            if (qNum <= 68) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788604082/2_%D0%91%D0%91%D0%9E%D0%A3%D0%91_1_%D0%9E%D0%BA%D1%88%D0%BE%D1%88%D1%82%D1%83%D0%BA%D1%82%D0%B0%D1%80_%D0%B6%D0%B0%D0%BD%D0%B0_%D1%81%D1%83%D0%B9%D0%BB%D0%BE%D0%BC%D0%B4%D0%BE%D1%80%D0%B4%D1%83_%D1%82%D0%BE%D0%BB%D1%83%D0%BA%D1%82%D0%BE%D0%BE.jpg');
                            else if (qNum <= 80) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788604083/2_%D0%91%D0%91%D0%9E%D0%A3%D0%91_2_%D0%9E%D0%BA%D1%88%D0%BE%D1%88%D1%82%D1%83%D0%BA%D1%82%D0%B0%D1%80_%D0%B6%D0%B0%D0%BD%D0%B0_%D1%81%D1%83%D0%B9%D0%BB%D0%BE%D0%BC%D0%B4%D0%BE%D1%80%D0%B4%D1%83_%D1%82%D0%BE%D0%BB%D1%83%D0%BA%D1%82%D0%BE%D0%BE.jpg');
                            else if (qNum <= 85) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788604113/2_%D0%91%D0%91%D0%9E%D0%A3%D0%91_3_%D0%9E%D0%BA%D1%88%D0%BE%D1%88%D1%82%D1%83%D0%BA%D1%82%D0%B0%D1%80_%D0%B6%D0%B0%D0%BD%D0%B0_%D1%81%D1%83%D0%B9%D0%BB%D0%BE%D0%BC%D0%B4%D0%BE%D1%80%D0%B4%D1%83_%D1%82%D0%BE%D0%BB%D1%83%D0%BA%D1%82%D0%BE%D0%BE.jpg');
                            else target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788604114/2_%D0%91%D0%91%D0%9E%D0%A3%D0%91_4_%D0%9E%D0%BA%D1%88%D0%BE%D1%88%D1%82%D1%83%D0%BA%D1%82%D0%B0%D1%80_%D0%B6%D0%B0%D0%BD%D0%B0_%D1%81%D1%83%D0%B9%D0%BB%D0%BE%D0%BC%D0%B4%D0%BE%D1%80%D0%B4%D1%83_%D1%82%D0%BE%D0%BB%D1%83%D0%BA%D1%82%D0%BE%D0%BE.jpg');
                          } else {
                            if (qNum <= 70) {
                              target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788605292/1_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%90%D0%BD%D0%B0%D0%BB%D0%BE%D0%B3%D0%B8%D0%B8_%D0%B8_%D0%B4%D0%BE%D0%BF%D0%BE%D0%BB%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5_%D0%BF%D1%80%D0%B5%D0%B4%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B9.jpg');
                            } else if (qNum <= 80) {
                              target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788605293/1_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_2_%D0%90%D0%BD%D0%B0%D0%BB%D0%BE%D0%B3%D0%B8%D0%B8_%D0%B8_%D0%B4%D0%BE%D0%BF%D0%BE%D0%BB%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5_%D0%BF%D1%80%D0%B5%D0%B4%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B9.jpg');
                            } else if (qNum <= 86) {
                              target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788605267/1_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_3_%D0%90%D0%BD%D0%B0%D0%BB%D0%BE%D0%B3%D0%B8%D0%B8_%D0%B8_%D0%B4%D0%BE%D0%BF%D0%BE%D0%BB%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5_%D0%BF%D1%80%D0%B5%D0%B4%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B9.jpg');
                            } else {
                              target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788605291/1_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_4_%D0%90%D0%BD%D0%B0%D0%BB%D0%BE%D0%B3%D0%B8%D0%B8_%D0%B8_%D0%B4%D0%BE%D0%BF%D0%BE%D0%BB%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5_%D0%BF%D1%80%D0%B5%D0%B4%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B9.jpg');
                            }
                          }
                          return;
                        }

                        // Section 2 (Math 2)
                        if (selectedQuestion.section_id === 2 || (qNum >= 31 && qNum <= 60)) {
                          if (isV105) {
                            if (qNum <= 34) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789386106/5_%D0%91%D0%91%D0%9E%D0%A3%D0%91_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_2.1.png');
                            else if (qNum <= 39) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789386108/5_%D0%91%D0%91%D0%9E%D0%A3%D0%91_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_2.2.png');
                            else if (qNum <= 45) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789386109/5_%D0%91%D0%91%D0%9E%D0%A3%D0%91_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_2.3.png');
                            else if (qNum <= 52) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789386107/5_%D0%91%D0%91%D0%9E%D0%A3%D0%91_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_2.4.png');
                            else if (qNum <= 56) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789386111/5_%D0%91%D0%91%D0%9E%D0%A3%D0%91_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_2.5.png');
                            else target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789386111/5_%D0%91%D0%91%D0%9E%D0%A3%D0%91_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_2.6.png');
                          } else if (isV102) {
                            if (qNum <= 35) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788603828/2_%D0%91%D0%91%D0%9E%D0%A3%D0%91_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.1.jpg');
                            else if (qNum <= 40) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788603828/2_%D0%91%D0%91%D0%9E%D0%A3%D0%91_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.2.jpg');
                            else if (qNum <= 46) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788603829/2_%D0%91%D0%91%D0%9E%D0%A3%D0%91_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.3.jpg');
                            else if (qNum <= 51) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788603830/2_%D0%91%D0%91%D0%9E%D0%A3%D0%91_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.4.jpg');
                            else if (qNum <= 58) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788603834/2_%D0%91%D0%91%D0%9E%D0%A3%D0%91_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.5.jpg');
                            else target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788603834/2_%D0%91%D0%91%D0%9E%D0%A3%D0%91_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.6.jpg');
                          } else if (isV2) {
                            if (qNum <= 35) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788603378/2_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.1.jpg');
                            else if (qNum <= 40) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788603379/2_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.2.jpg');
                            else if (qNum <= 46) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788603376/2_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.3.jpg');
                            else if (qNum <= 51) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788603368/2_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.4.jpg');
                            else if (qNum <= 58) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788603377/2_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.5.jpg');
                            else target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788603377/2_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.6.jpg');
                          } else if (isV19) {
                            if (qNum <= 36) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788681362/19_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.1.jpg');
                            else if (qNum <= 42) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788681362/19_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.2.jpg');
                            else if (qNum <= 47) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788681362/19_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.3.jpg');
                            else if (qNum <= 52) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788681362/19_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.4.jpg');
                            else if (qNum <= 56) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788681362/19_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.5.jpg');
                            else target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788681362/19_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.6.jpg');
                          } else if (isV20) {
                            if (qNum <= 31) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789474283/20_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_1.3.png');
                            else if (qNum <= 38) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789474295/20_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.1.png');
                            else if (qNum <= 44) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789474307/20_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.2.png');
                            else if (qNum <= 50) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789474429/20_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.3.png');
                            else if (qNum <= 55) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789474431/20_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.4.png');
                            else target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789474431/20_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_2.5.png');
                          } else {
                            if (qNum <= 33) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788605098/1_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_2.1.jpg');
                            else if (qNum <= 39) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788605099/1_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_2.2.jpg');
                            else if (qNum <= 43) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788605100/1_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_2.3.jpg');
                            else if (qNum <= 48) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788605110/1_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_2.4.jpg');
                            else if (qNum <= 56) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788605112/1_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_2.5.jpg');
                            else target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788605113/1_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_2.6.jpg');
                          }
                          return;
                        }
                        // Section 1 (Math 1)
                        if (isV105) {
                          if (qNum <= 6) {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789385941/5_%D0%91%D0%91%D0%9E%D0%A3%D0%91_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_1.1.png');
                          } else if (qNum <= 15) {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789385942/5_%D0%91%D0%91%D0%9E%D0%A3%D0%91_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_1.2.png');
                          } else if (qNum <= 23) {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789385943/5_%D0%91%D0%91%D0%9E%D0%A3%D0%91_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_1.3.png');
                          } else {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789385942/5_%D0%91%D0%91%D0%9E%D0%A3%D0%91_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_1.4.png');
                          }
                        } else if (isV102) {
                          if (qNum <= 6) {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788603599/2_%D0%91%D0%91%D0%9E%D0%A3%D0%91_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_1.1.jpg');
                          } else if (qNum <= 15) {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788603597/2_%D0%91%D0%91%D0%9E%D0%A3%D0%91_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_1.2.jpg');
                          } else if (qNum <= 23) {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788603598/2_%D0%91%D0%91%D0%9E%D0%A3%D0%91_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_1.3.jpg');
                          } else {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788603599/2_%D0%91%D0%91%D0%9E%D0%A3%D0%91_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_1.4.jpg');
                          }
                        } else if (isV2) {
                          if (qNum <= 7) {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788603233/2_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_1.1.jpg');
                          } else if (qNum <= 15) {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788603233/2_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_1.2.jpg');
                          } else if (qNum <= 23) {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788603234/2_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_1.3.jpg');
                          } else {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788603234/2_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_1.4.jpg');
                          }
                        } else if (isV19) {
                          if (qNum <= 6) {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788681259/19_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_1.1.jpg');
                          } else if (qNum <= 17) {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788681259/19_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_1.2.jpg');
                          } else if (qNum <= 26) {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788681259/19_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_1.3.jpg');
                          } else {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788681259/19_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_1.4.jpg');
                          }
                        } else if (isV20) {
                          if (qNum <= 7) {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789474260/20_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_1.1.png');
                          } else if (qNum <= 19) {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789474271/20_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_1.2.png');
                          } else {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1789474283/20_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC_1.3.png');
                          }
                        } else {
                          if (imgPart.includes('page2') || (qNum >= 7 && qNum <= 15)) {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788604855/1_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_1.2.jpg');
                          } else if (imgPart.includes('page3') || (qNum >= 16 && qNum <= 24)) {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788604856/1_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_1.3.jpg');
                          } else if (imgPart.includes('page4') || (qNum >= 25 && qNum <= 30)) {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788604857/1_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_1.4.jpg');
                          } else {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1788604855/1_%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_1.1.jpg');
                          }
                        }
                      }}
                      alt={`Вопрос ${idx + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full max-w-3xl h-auto object-contain bg-white rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 select-none"
                    />
                  );
                })
              ) : (
                <div className="text-slate-400 dark:text-slate-500 italic py-20 font-medium">
                  {t.modalNoImage}
                </div>
              )}
            </div>

            {/* Modal Bottom Answer Bar */}
            <div className="p-4 md:p-6 bg-[#05261c] border-t border-emerald-800/60 shrink-0 z-10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-emerald-300/70 font-bold uppercase tracking-wider mb-1">
                    {t.modalYourAnswer}
                  </p>
                  <span
                    className={`inline-flex items-center justify-center min-w-[52px] px-4 py-2 rounded-xl font-black text-lg ${
                      userAnswers[selectedQuestion.question_number] === selectedQuestion.correct_answer
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {userAnswers[selectedQuestion.question_number] || '—'}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-emerald-300/70 font-bold uppercase tracking-wider mb-1">
                    {t.modalCorrectKey}
                  </p>
                  <span className="inline-flex items-center justify-center min-w-[52px] px-4 py-2 bg-emerald-500 text-[#031510] rounded-xl font-black text-lg shadow-md shadow-emerald-500/20">
                    {selectedQuestion.correct_answer}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedQuestion(null)}
                className="px-5 py-2.5 rounded-xl bg-emerald-900/50 hover:bg-emerald-800/60 border border-emerald-700/60 text-emerald-200 text-sm font-bold transition-all cursor-pointer"
              >
                {t.closeModal}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation / Actions Bar */}
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#05261c] hover:bg-emerald-900/40 border border-emerald-800/60 text-emerald-200 hover:text-white text-sm font-bold transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>{t.backToHome}</span>
          </Link>

          <button
            onClick={() => {
              if (variantId) {
                navigate(`/test/${variantId}`);
              } else {
                navigate('/');
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#031510] text-sm font-black transition-all shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.retryTest}</span>
          </button>
        </div>

        {/* Hero Score Card */}
        <div className="relative rounded-3xl p-6 sm:p-8 md:p-10 bg-[#05261c] border border-emerald-800/70 shadow-2xl overflow-hidden">
          {/* Subtle background mesh / glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none transform -translate-x-1/3 translate-y-1/3" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {mode === 'full'
                    ? t.testResult
                    : mode === 'custom'
                    ? t.certDescMath
                    : mode === 'practice'
                    ? t.practiceMode
                    : targetSectionId
                    ? sectionNames[targetSectionId]
                    : t.sectionTraining}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                {questions[0]?.title || `Вариант ${variantId}`}
              </h1>

              <p className="text-sm text-emerald-200/80 font-medium max-w-xl">
                {mode === 'full'
                  ? t.fullTestDesc
                  : mode === 'custom'
                  ? t.certDescMath
                  : mode === 'practice'
                  ? t.certDescPractice
                  : targetSectionId
                  ? sectionNames[targetSectionId]
                  : ''}
              </p>
            </div>

            {/* Score & KPI Badges */}
            <div className={`grid gap-3 shrink-0 ${mode === 'full' ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2'}`}>
              {/* Main Score - Only shown if pupil took the full test (all sections together) */}
              {mode === 'full' && (
                <div className="col-span-2 sm:col-span-1 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#06382a] via-[#052c20] to-[#042017] border border-emerald-500/60 shadow-xl text-center flex flex-col justify-center">
                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-emerald-300 mb-1">
                    <Award className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t.ortScore}</span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    {finalScore}
                  </div>
                </div>
              )}

              {/* Accuracy */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#031d15]/80 border border-emerald-800/60 text-center flex flex-col justify-center">
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-300/80 mb-1">
                  <Target className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.accuracy}</span>
                </div>
                <div className="flex items-baseline justify-center gap-0.5 text-2xl sm:text-3xl font-black text-white">
                  <span>{accuracyPercent}</span>
                  <span className="text-sm font-bold text-emerald-400">%</span>
                </div>
              </div>

              {/* Correct count */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#031d15]/80 border border-emerald-800/60 text-center flex flex-col justify-center">
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-300/80 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.correctAnswers}</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  <span>{totalCorrect}</span>
                  <span className="text-xs sm:text-sm font-semibold text-emerald-300/60 ml-1">
                    /{relevantQuestions.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        {visibleTabs.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {visibleTabs.map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-emerald-500 text-[#031510] shadow-lg shadow-emerald-500/25 font-black'
                      : 'bg-[#05261c] hover:bg-emerald-900/40 border border-emerald-800/60 text-emerald-200/80 hover:text-emerald-100'
                  }`}
                >
                  <Layers className={`w-4 h-4 ${isSelected ? 'text-[#031510]' : 'text-emerald-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Answer Map Card */}
        <div className="bg-[#05261c] border border-emerald-800/70 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {t.mapTitle}
                </h2>
                <p className="text-xs text-emerald-300/70 font-medium">
                  {t.mapSubtitle}
                </p>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs font-bold shrink-0">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{t.legendCorrect}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300">
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>{t.legendError}</span>
              </div>
            </div>
          </div>

          {/* Grid of Questions */}
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2.5">
            {relevantQuestions
              .filter((q) => {
                if (activeTab === 'overall') return true;
                const tabSections = tabsConfig[activeTab as keyof typeof tabsConfig]?.sections || [];
                return tabSections.includes(q.section_id);
              })
              .map((q) => {
                const userAns = userAnswers[q.question_number];
                const isCorrect = userAns === q.correct_answer;

                const colorStyle = isCorrect
                  ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-200 hover:bg-emerald-500/25 shadow-sm'
                  : 'bg-rose-500/15 border-rose-500/50 text-rose-200 hover:bg-rose-500/25 shadow-sm';

                return (
                  <button
                    key={q.question_number}
                    onClick={() => setSelectedQuestion(q)}
                    className={`relative h-13 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer transform hover:scale-105 active:scale-95 ${colorStyle}`}
                  >
                    <span className="font-black text-xs sm:text-sm text-white">
                      {activeTab === 'overall'
                        ? q.question_number
                        : getRelativeQuestionNumber(q.question_number, q.section_id)}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase mt-0.5 opacity-90">
                      {userAns || '—'}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
