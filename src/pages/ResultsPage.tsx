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
    officialResult: 'Официальный результат ОРТ',
    blockTraining: 'Тренировка блоков',
    sectionTraining: 'Тренировка раздела',
    practiceMode: 'Тренировочный полигон',
    practiceReport: 'Отчет по тренировке:',
    certDescFull: 'Подтвержденный результат симуляции ОРТ',
    certDescMath: 'Математика (Обе части)',
    certDescPractice: 'Точечная отработка без учета времени',
    ortScore: 'Балл ОРТ',
    gainedScore: 'Кол-во правильных ответов',
    accuracy: 'Точность',
    correctAnswers: 'Верно отвечено',
    tabOverall: 'Общий итог',
    tabMath: 'Математика',
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
  },
  kg: {
    backToHome: 'Башкы бетке',
    dataNotFound: 'Тесттин маалыматтары табылган жок',
    officialResult: 'ОРТнын ырасмий жыйынтыгы',
    blockTraining: 'Бөлүмдөрдү машыгуу',
    sectionTraining: 'Бөлүмдү машыгуу',
    practiceMode: 'Машыгуу полигону',
    practiceReport: 'Машыгуу боюнча отчет:',
    certDescFull: 'ОРТ симуляциясынын жыйынтыгы',
    certDescMath: 'Математика (Эки бөлүгү тең)',
    certDescPractice: 'Убакытты эсепке албастан машыгуу',
    ortScore: 'ОРТ баллы',
    gainedScore: 'Топтолгон балл',
    accuracy: 'Тактык',
    correctAnswers: 'Туура жооптор',
    tabOverall: 'Жалпы жыйынтык',
    tabMath: 'Математика',
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
    reading: { id: 'reading', label: t.tabReading, sections: [3, 4] },
    grammar: { id: 'grammar', label: t.tabGrammar, sections: [5] },
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#f3f7f5] dark:bg-[#041d16] transition-colors duration-200 flex flex-col items-center justify-center p-4 font-sans text-center">
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-4">
          {t.dataNotFound}
        </h2>
        <button
          onClick={() => navigate('/')}
          className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95"
        >
          {t.backToHome}
        </button>
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
            className="bg-white dark:bg-slate-800 transition-colors w-full max-w-4xl max-h-[95vh] md:max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200 dark:border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-slate-100 dark:border-slate-700 shrink-0 bg-white dark:bg-slate-800 shadow-sm z-10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-1">
                  {t.modalTitle}
                </p>
                <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white leading-none">
                  {t.modalQuestion}{' '}
                  {getRelativeQuestionNumber(selectedQuestion.question_number, selectedQuestion.section_id)}
                </h3>
              </div>
              <button
                onClick={() => setSelectedQuestion(null)}
                className="w-10 h-10 bg-slate-100 dark:bg-slate-700 hover:bg-rose-100 dark:hover:bg-rose-900/30 hover:text-rose-600 dark:hover:text-rose-400 text-slate-500 dark:text-slate-400 rounded-xl flex items-center justify-center transition-colors font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content - Question Image */}
            <div className="flex-1 overflow-y-auto p-2 md:p-6 bg-slate-100/50 dark:bg-slate-900/50 custom-scrollbar flex flex-col gap-4 items-center">
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
                        // Section 5 (Практическая грамматика)
                        if (selectedQuestion.section_id === 5 || (qNum >= 121 && qNum <= 150)) {
                          if (qNum <= 123) {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787128367/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%9F%D0%93_1.jpg');
                          } else if (qNum <= 131) {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787128430/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%9F%D0%93_2.jpg');
                          } else if (qNum <= 138) {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787128438/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%9F%D0%93_3.jpg');
                          } else if (qNum <= 146) {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787128482/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%9F%D0%93_4.jpg');
                          } else {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787128493/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%9F%D0%93_5.jpg');
                          }
                          return;
                        }
                        // Section 4 (Чтение и понимание)
                        if (selectedQuestion.section_id === 4 || (qNum >= 91 && qNum <= 120)) {
                          const rel = qNum - 90;
                          if (rel <= 3) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787132551/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%A7%D0%9F_1.jpg');
                          else if (rel <= 7) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787132423/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%A7%D0%9F_2.jpg');
                          else if (rel <= 10) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787132418/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%A7%D0%9F_3.jpg');
                          else if (rel <= 13) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787132412/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%A7%D0%9F_4.jpg');
                          else if (rel <= 17) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787132397/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%A7%D0%9F_5.jpg');
                          else if (rel <= 20) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787132391/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%A7%D0%9F_6.jpg');
                          else if (rel <= 23) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787132383/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%A7%D0%9F_7.jpg');
                          else if (rel <= 27) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787132373/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%A7%D0%9F_8.jpg');
                          else target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787132289/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%A7%D0%9F_9.jpg');
                          return;
                        }
                        // Section 3 (АДП)
                        if (selectedQuestion.section_id === 3 || (qNum >= 61 && qNum <= 90)) {
                          if (qNum <= 70) {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787062305/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%90%D0%94%D0%9F_1.jpg');
                          } else if (qNum <= 80) {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787064555/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%90%D0%94%D0%9F_2.jpg');
                          } else if (qNum <= 86) {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787064565/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%90%D0%94%D0%9F_3.jpg');
                          } else {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787064576/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%90%D0%94%D0%9F_4.jpg');
                          }
                          return;
                        }
                        const isV2 = selectedQuestion.variant_number === 2 || String(variantId) === '2';

                        // Section 2 (Math 2)
                        if (selectedQuestion.section_id === 2 || (qNum >= 31 && qNum <= 60)) {
                          if (isV2) {
                            if (qNum <= 35) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787137871/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_2_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_2.1.jpg');
                            else if (qNum <= 40) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787137873/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_2_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_2.2.jpg');
                            else if (qNum <= 46) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787137875/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_2_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_2.3.jpg');
                            else if (qNum <= 51) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787137872/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_2_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_2.4.jpg');
                            else if (qNum <= 58) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787137875/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_2_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_2.5.jpg');
                            else target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787137875/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_2_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_2.6.jpg');
                          } else {
                            if (qNum <= 35) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1786954730/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_-_%D0%A7%D0%B0%D1%81%D1%82%D1%8C_2_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_1.jpg');
                            else if (qNum <= 40) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1786995981/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_-_%D0%A7%D0%B0%D1%81%D1%82%D1%8C_2_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_2.jpg');
                            else if (qNum <= 45) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1786996040/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_-_%D0%A7%D0%B0%D1%81%D1%82%D1%8C_2_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_3.jpg');
                            else if (qNum <= 50) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1786996107/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_-_%D0%A7%D0%B0%D1%81%D1%82%D1%8C_2_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_4.jpg');
                            else if (qNum <= 55) target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1786996129/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_-_%D0%A7%D0%B0%D1%81%D1%82%D1%8C_2_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_5.jpg');
                            else target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1786996311/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_-_%D0%A7%D0%B0%D1%81%D1%82%D1%8C_2_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_6.jpg');
                          }
                          return;
                        }
                        // Section 1 (Math 1)
                        if (isV2) {
                          if (qNum <= 7) {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787137869/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_2_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_1.1.jpg');
                          } else if (qNum <= 15) {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787137870/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_2_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_1.2.jpg');
                          } else if (qNum <= 23) {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787137871/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_2_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_1.3.jpg');
                          } else {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1787137872/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_2_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_1.4.jpg');
                          }
                        } else {
                          if (imgPart.includes('page2') || (qNum >= 9 && qNum <= 16)) {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1786789690/%D0%A1%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B0_2.jpg');
                          } else if (imgPart.includes('page3') || (qNum >= 17 && qNum <= 23)) {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1786789766/%D0%A1%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B0_3.jpg');
                          } else if (imgPart.includes('page4') || (qNum >= 24 && qNum <= 30)) {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1786789771/%D0%A1%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B0_4.jpg');
                          } else {
                            target.src = getOptimizedTestPageUrl('https://res.cloudinary.com/rw9qhk3a/image/upload/v1786789680/%D0%A1%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B0_1.jpg');
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
            <div className="p-4 md:p-6 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 shrink-0 z-10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">
                    {t.modalYourAnswer}
                  </p>
                  <span
                    className={`inline-block px-4 py-2 rounded-xl font-black text-lg ${
                      userAnswers[selectedQuestion.question_number] === selectedQuestion.correct_answer
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                    }`}
                  >
                    {userAnswers[selectedQuestion.question_number] || '—'}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">
                    {t.modalCorrectKey}
                  </p>
                  <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 rounded-xl font-black text-lg">
                    {selectedQuestion.correct_answer}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            ← {t.backToHome}
          </Link>
        </div>

        {/* Hero Score Card */}
        <div
          className={`rounded-3xl p-8 md:p-10 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden border ${
            mode === 'full'
              ? 'bg-slate-900 border-slate-800'
              : 'bg-gradient-to-br from-emerald-700 via-teal-800 to-slate-900 border-emerald-500'
          }`}
        >
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none bg-white" />
          <div className="relative z-10 text-center md:text-left flex-1">
            <p className="text-xs font-black uppercase tracking-[0.2em] mb-2 text-emerald-300">
              {mode === 'full'
                ? t.officialResult
                : mode === 'custom'
                ? t.certDescMath
                : mode === 'practice'
                ? t.practiceMode
                : targetSectionId
                ? sectionNames[targetSectionId]
                : t.sectionTraining}
            </p>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2">
              {questions[0]?.title || `Вариант ${variantId}`}
            </h1>
            <p className="text-sm font-medium text-emerald-100">
              {mode === 'full'
                ? t.certDescFull
                : mode === 'custom'
                ? t.certDescMath
                : mode === 'practice'
                ? t.certDescPractice
                : targetSectionId
                ? sectionNames[targetSectionId]
                : ''}
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap justify-center md:justify-end gap-3 md:gap-4">
            <div
              className={`text-center px-6 py-5 rounded-3xl shadow-xl border ${
                mode === 'full'
                  ? 'bg-gradient-to-b from-amber-400 to-amber-600 border-amber-300'
                  : 'bg-emerald-600/60 backdrop-blur-md border-emerald-400/40'
              }`}
            >
              <p
                className={`text-[10px] uppercase font-black tracking-widest mb-1 ${
                  mode === 'full' ? 'text-amber-900' : 'text-emerald-100'
                }`}
              >
                {mode === 'full' ? t.ortScore : t.gainedScore}
              </p>
              <div className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                {mode === 'full' ? finalScore : `${totalCorrect} / ${relevantQuestions.length}`}
              </div>
            </div>

            <div className="text-center px-6 py-5 rounded-3xl border bg-black/20 border-white/10 hidden sm:block">
              <p className="text-[10px] uppercase font-bold tracking-widest mb-1 text-emerald-200">
                {t.accuracy}
              </p>
              <div className="flex items-end justify-center gap-1">
                <span className="text-3xl md:text-4xl font-black text-white">{accuracyPercent}</span>
                <span className="text-lg font-bold mb-1 text-emerald-200">%</span>
              </div>
            </div>

            {mode === 'full' && (
              <div className="text-center px-6 py-5 rounded-3xl border bg-black/20 border-white/10 hidden sm:block">
                <p className="text-[10px] uppercase font-bold tracking-widest mb-1 text-emerald-200">
                  {t.correctAnswers}
                </p>
                <div className="text-3xl md:text-4xl font-black text-white">
                  {totalCorrect} <span className="text-lg text-emerald-200">/ {relevantQuestions.length}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        {visibleTabs.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Answer Map Card */}
        <div className="bg-white dark:bg-slate-800 transition-colors p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">
                {t.mapTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {t.mapSubtitle}
              </p>
            </div>
            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-emerald-500 inline-block shadow-sm" />
                <span>{t.legendCorrect}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-rose-500 inline-block shadow-sm" />
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
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-500 dark:border-emerald-700 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-200 shadow-sm'
                  : 'bg-rose-100 dark:bg-rose-900/30 border-rose-500 dark:border-rose-700 text-rose-800 dark:text-rose-400 hover:bg-rose-200 shadow-sm';

                return (
                  <button
                    key={q.question_number}
                    onClick={() => setSelectedQuestion(q)}
                    className={`relative h-12 md:h-14 rounded-xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer transform hover:scale-105 active:scale-95 ${colorStyle}`}
                  >
                    <span className="font-black text-xs md:text-sm">
                      {getRelativeQuestionNumber(q.question_number, q.section_id)}
                    </span>
                    <span className="text-[9px] font-bold -mt-0.5 opacity-80 uppercase">
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
