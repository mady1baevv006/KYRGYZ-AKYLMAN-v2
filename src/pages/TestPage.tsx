import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Question, CalculationResponse, SectionTimeLimits, AppLanguage } from '../types';
import {
  API_BASE_URL,
  SECTION_NAMES,
  SECTION_NAMES_KG,
  SECTION_TIMES,
  getSectionQuestionRange,
  getSectionQuestions,
  formatTime,
  getRelativeQuestionNumber,
} from '../data/constants';
import { getFallbackQuestions } from '../data/fallbackQuestions';
import { getOptimizedTestPageUrl } from '../utils/imageOptimization';

const TEST_TRANSLATIONS = {
  ru: {
    exitToHome: 'Выйти на главную',
    drawingTools: 'Инструменты рисования',
    cursorTool: 'Курсор (Двигать и листать)',
    penTool: 'Карандаш (Черновик)',
    eraserTool: 'Ластик',
    lineWidth: 'Толщина линии',
    clearCanvas: 'Очистить весь черновик',
    questionPrefix: 'Вопрос №',
    prevQuestion: 'Предыдущий вопрос',
    nextQuestion: 'Следующий вопрос',
    answerChoice: 'Выбор ответа',
    bookmarkTitle: 'Пометить вопрос (закладка)',
    sectionSheet: 'Бланк раздела',
    nextSection: 'Следующий раздел ➡️',
    finishTest: 'Завершить тест 🏁',
    loadingQuestion: 'Изображение для этого вопроса загружается или отсутствует.',
    timeUpTitle: 'Время вышло!',
    confirmTitle: 'Подтверждение',
    nextSectionLabel: 'Следующий раздел:',
    cancel: 'Отмена',
    finish: 'Завершить',
    continue: 'Продолжить',
    testPausedTitle: 'Тест на паузе',
    testPausedDesc: 'Ты переключился на другую вкладку или приложение. На реальном ОРТ важна предельная концентрация!',
    timerPausedNotice: 'Таймер поставлен на паузу.',
    iAmBack: 'Я вернулся',
    warningTitle: 'Внимание!',
    missingSectionsDesc: 'Временно недоступны следующие разделы:',
    startTest: 'Начать тест',
    timeOutNextMsg: 'Время вышло! Переводим к следующей части.',
    timeOutFinishMsg: 'Время вышло! Тест завершен.',
    manualNextMsg: 'Ты уверен, что хочешь закрыть этот раздел? Вернуться назад будет нельзя.',
    manualFinishMsg: 'Это был последний доступный раздел. Завершаем тест и смотрим результаты?',
    page: 'Стр.',
    pageFull: 'Страница',
    pageOf: 'из',
    prevPage: 'Предыдущая страница',
    nextPage: 'Следующая страница',
    openFullscreen: 'На весь экран',
    closeFullscreen: 'Закрыть просмотр',
  },
  kg: {
    exitToHome: 'Башкы бетке чыгуу',
    drawingTools: 'Сүрөт тартуу куралдары',
    cursorTool: 'Курсор (Жылдыруу жана барактоо)',
    penTool: 'Калем (Каралама)',
    eraserTool: 'Өчүргүч',
    lineWidth: 'Сызыктын калыңдыгы',
    clearCanvas: 'Бардык караламаны тазалоо',
    questionPrefix: 'Суроо №',
    prevQuestion: 'Мурунку суроо',
    nextQuestion: 'Кийинки суроо',
    answerChoice: 'Жооп тандоо',
    bookmarkTitle: 'Суроону белгилөө (кыстарма)',
    sectionSheet: 'Бөлүм бланкасы',
    nextSection: 'Кийинки бөлүм ➡️',
    finishTest: 'Тестти бүтүрүү 🏁',
    loadingQuestion: 'Бул суроо үчүн сүрөт жүктөлүүдө же табылган жок.',
    timeUpTitle: 'Убакыт бүттү!',
    confirmTitle: 'Ырастоо',
    nextSectionLabel: 'Кийинки бөлүм:',
    cancel: 'Жокко чыгаруу',
    finish: 'Бүтүрүү',
    continue: 'Улантуу',
    testPausedTitle: 'Тест тындырылды',
    testPausedDesc: 'Сиз башка өтмөккө же тиркемеге өттүңүз. Чыныгы ЖРТда толук көңүл буруу маанилүү!',
    timerPausedNotice: 'Таймер тындырылды.',
    iAmBack: 'Мен кайттым',
    warningTitle: 'Көңүл буруңуз!',
    missingSectionsDesc: 'Төмөнкү бөлүмдөр убактылуу жеткиликсиз:',
    startTest: 'Тестти баштоо',
    timeOutNextMsg: 'Убакыт бүттү! Кийинки бөлүккө өтөбүз.',
    timeOutFinishMsg: 'Убакыт бүттү! Тест аяктады.',
    manualNextMsg: 'Бул бөлүмдү жабууга ишенесизби? Кайра кайтууга мүмкүн болбойт.',
    manualFinishMsg: 'Бул акыркы жеткиликтүү бөлүм болчу. Тестти бүтүрүп, жыйынтыктарды көрөбүзбү?',
    page: 'Бет',
    pageFull: 'Бет',
    pageOf: 'ичинен',
    prevPage: 'Мурунку бет',
    nextPage: 'Кийинки бет',
    openFullscreen: 'Толук экран',
    closeFullscreen: 'Жабуу',
  },
};

export const TestPage: React.FC<{ lang?: AppLanguage }> = ({ lang = 'ru' }) => {
  const { variantId } = useParams<{ variantId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const t = TEST_TRANSLATIONS[lang] || TEST_TRANSLATIONS.ru;

  const mode = searchParams.get('mode') || 'full';
  const targetSectionId = searchParams.get('id') ? parseInt(searchParams.get('id')!, 10) : undefined;
  const customSectionsParam = searchParams.get('sections');

  // Compute initial starting section and first question to avoid any momentary flash of Math Part 1
  const initialTargetSec = targetSectionId || (customSectionsParam ? Number(customSectionsParam.split(',')[0]) : 1);
  const initialFirstQ = initialTargetSec === 3 ? 61 : (initialTargetSec === 2 ? 31 : (initialTargetSec === 4 ? 91 : (initialTargetSec === 5 ? 121 : 1)));

  const builtInVariantIds = [1, 2, 3, 12, 16, 19, 20, 101];

  const [questions, setQuestions] = useState<Question[]>(() => {
    if (builtInVariantIds.includes(Number(variantId)) || !variantId) {
      return getFallbackQuestions(variantId || 1);
    }
    return [];
  });
  const [loading, setLoading] = useState<boolean>(() => !builtInVariantIds.includes(Number(variantId)) && !!variantId);
  const [calculating, setCalculating] = useState(false);

  const [currentSection, setCurrentSection] = useState<number>(initialTargetSec);
  const [currentQuestionNum, setCurrentQuestionNum] = useState<number>(initialFirstQ);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [previousAnswers, setPreviousAnswers] = useState<Record<number, string>>({});
  const [availableSectionsList, setAvailableSectionsList] = useState<number[]>([initialTargetSec]);

  // Modals & alerts
  const [missingSectionsAlert, setMissingSectionsAlert] = useState(false);
  const [missingSectionsText, setMissingSectionsText] = useState('');
  const [isWindowBlurred, setIsWindowBlurred] = useState(false);
  const [sectionModal, setSectionModal] = useState<{
    isOpen: boolean;
    type: string;
    message: string;
    nextSectionName: string;
  }>({
    isOpen: false,
    type: '',
    message: '',
    nextSectionName: '',
  });

  // Time remaining
  const [timeLeft, setTimeLeft] = useState<number>(() => SECTION_TIMES[initialTargetSec] || 1800);
  const handleSectionEndRef = useRef<(isTimeout?: boolean) => void>(() => {});

  // Zoom image
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const sectionDict = (lang === 'kg' || questions[0]?.language === 'kg') ? SECTION_NAMES_KG : SECTION_NAMES;

  // 1. Initial Data Fetching & Setup
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fast instant initialization for standard variants without waiting for sleepy backend
        let initialData: Question[] = [];
        const savedLocal = localStorage.getItem(`ort_custom_variant_${variantId}`);
        if (savedLocal) {
          try {
            initialData = JSON.parse(savedLocal);
          } catch (e) {
            console.error('Error parsing local variant:', e);
          }
        }
        if (!initialData || initialData.length === 0 || builtInVariantIds.includes(Number(variantId))) {
          initialData = getFallbackQuestions(variantId || 1);
        }

        if (initialData && initialData.length > 0) {
          setQuestions(initialData);
          setLoading(false);
        } else {
          setLoading(true);
        }

        // Background fast network check for custom variants (with 2.5s AbortController timeout to prevent Render sleep blocking)
        let serverData: Question[] | null = null;
        if (!builtInVariantIds.includes(Number(variantId))) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2500);
            const res = await fetch(`${API_BASE_URL}/api/questions/${variantId}`, {
              signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (res.ok) {
              serverData = await res.json();
            }
          } catch (netErr) {
            // Network failed or timed out, graceful fallback is already active
          }
        }

        const finalData = (serverData && serverData.length >= (initialData?.length || 0))
          ? serverData
          : initialData;

        if (finalData && finalData.length > 0) {
          setQuestions(finalData);
        }

        // Compute sections
        const data = finalData || initialData;
        const availableInVariant = Array.from(new Set(data.map((q) => q.section_id))).sort(
          (a, b) => a - b
        );
        let activeSections = availableInVariant;

        if (mode === 'section' && targetSectionId) {
          activeSections = [targetSectionId];
        } else if (mode === 'custom' && customSectionsParam) {
          const parsed = customSectionsParam
            .split(',')
            .map(Number)
            .filter((s) => availableInVariant.includes(s));
          activeSections = parsed.length > 0 ? parsed : availableInVariant;
        }

        setAvailableSectionsList(activeSections);

        // Draft check
        const draftKey = `ort_draft_variant_${variantId}_${mode}_${
          targetSectionId || customSectionsParam || 'full'
        }`;
        const savedDraft = localStorage.getItem(draftKey);

        if (savedDraft) {
          try {
            const draft = JSON.parse(savedDraft);
            setUserAnswers(draft.userAnswers || {});
            setPreviousAnswers(draft.previousAnswers || {});

            // Ensure restored section is valid for the current test mode
            const savedSec = (draft.currentSection && activeSections.includes(draft.currentSection))
              ? draft.currentSection
              : activeSections[0];

            setCurrentSection(savedSec);
            setTimeLeft(draft.timeLeft || SECTION_TIMES[savedSec]);

            const validQ = (draft.currentQuestionNum && data.some((q) => q.section_id === savedSec && q.question_number === draft.currentQuestionNum))
              ? draft.currentQuestionNum
              : (data.find((q) => q.section_id === savedSec)?.question_number || (savedSec === 3 ? 61 : (savedSec === 2 ? 31 : 1)));

            setCurrentQuestionNum(validQ);
          } catch (e) {
            console.error('Error parsing draft:', e);
          }
        } else {
          if (activeSections.length > 0) {
            const firstSec = activeSections[0];
            setCurrentSection(firstSec);
            setTimeLeft(SECTION_TIMES[firstSec]);
            const firstQ = data.find((q) => q.section_id === firstSec);
            if (firstQ) {
              setCurrentQuestionNum(firstQ.question_number);
            } else {
              setCurrentQuestionNum(firstSec === 3 ? 61 : (firstSec === 2 ? 31 : 1));
            }
          }

          if (mode === 'full') {
            const missing = [1, 2, 3, 4, 5].filter((s) => !availableInVariant.includes(s));
            if (missing.length > 0) {
              setMissingSectionsText(missing.map((s) => sectionDict[s]).join('; '));
              setMissingSectionsAlert(true);
            }
          }
        }
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [variantId, mode, targetSectionId, customSectionsParam]);

  // 2. Draft Auto-Saving
  useEffect(() => {
    if (!loading && !calculating && questions.length > 0) {
      const draftData = {
        userAnswers,
        previousAnswers,
        currentSection,
        timeLeft,
      };
      const draftKey = `ort_draft_variant_${variantId}_${mode}_${
        targetSectionId || customSectionsParam || 'full'
      }`;
      localStorage.setItem(draftKey, JSON.stringify(draftData));
    }
  }, [userAnswers, previousAnswers, currentSection, timeLeft, loading, calculating, questions.length, variantId, mode, targetSectionId, customSectionsParam]);

  // 3. Section Navigation Trigger
  const promptNextSectionOrFinish = (isTimeout = false) => {
    const nextSec = availableSectionsList.find((s) => s > currentSection);
    const nextName = nextSec ? sectionDict[nextSec] : '';

    if (isTimeout) {
      setSectionModal(
        nextSec
          ? {
              isOpen: true,
              type: 'timeout_next',
              message: t.timeOutNextMsg,
              nextSectionName: nextName,
            }
          : {
              isOpen: true,
              type: 'timeout_finish',
              message: t.timeOutFinishMsg,
              nextSectionName: '',
            }
      );
      return;
    }

    setSectionModal(
      nextSec
        ? {
            isOpen: true,
            type: 'manual_next',
            message: t.manualNextMsg,
            nextSectionName: nextName,
          }
        : {
            isOpen: true,
            type: 'manual_finish',
            message: t.manualFinishMsg,
            nextSectionName: '',
          }
    );
  };

  // 4. Modal Confirmation Execution
  const confirmSectionTransition = async () => {
    const modalType = sectionModal.type;
    setSectionModal({ isOpen: false, type: '', message: '', nextSectionName: '' });

    const nextSec = availableSectionsList.find((s) => s > currentSection);

    if (modalType === 'timeout_finish' || modalType === 'manual_finish') {
      try {
        setCalculating(true);

        let serverRes: CalculationResponse | null = null;
        try {
          const res = await fetch(`${API_BASE_URL}/api/questions/${variantId}/calculate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ variantId, userAnswers }),
          });
          if (res.ok) {
            serverRes = await res.json();
          }
        } catch (calcErr) {
          console.warn('Server calculation error, proceeding client-side fallback:', calcErr);
        }

        // Remove draft
        const draftKey = `ort_draft_variant_${variantId}_${mode}_${
          targetSectionId || customSectionsParam || 'full'
        }`;
        localStorage.removeItem(draftKey);

        navigate('/results', {
          state: {
            userAnswers,
            questions,
            variantId,
            serverResult: serverRes,
            mode,
            targetSectionId,
            customSections: customSectionsParam,
          },
        });
      } catch (err) {
        console.error('Critical calculation error:', err);
        setCalculating(false);
      }
      return;
    }

    if (nextSec) {
      setCurrentSection(nextSec);
      setTimeLeft(SECTION_TIMES[nextSec]);
      const startingNumMap: Record<number, number> = { 1: 1, 2: 31, 3: 61, 4: 91, 5: 121 };
      setCurrentQuestionNum(startingNumMap[nextSec] || 1);
    }
  };

  // Keep ref up to date
  useEffect(() => {
    handleSectionEndRef.current = promptNextSectionOrFinish;
  });

  // Blur pause detection
  useEffect(() => {
    if (loading || calculating || missingSectionsAlert || sectionModal.isOpen) return;

    const onBlur = () => setIsWindowBlurred(true);
    window.addEventListener('blur', onBlur);
    return () => window.removeEventListener('blur', onBlur);
  }, [loading, calculating, missingSectionsAlert, sectionModal.isOpen]);

  // Timer Tick
  useEffect(() => {
    if (loading || calculating || missingSectionsAlert || isWindowBlurred || sectionModal.type.includes('timeout')) {
      return;
    }

    if (timeLeft <= 0) {
      handleSectionEndRef.current(true);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, loading, calculating, missingSectionsAlert, isWindowBlurred, sectionModal.type]);

  const currentQ = questions.find((q) => q.question_number === currentQuestionNum);
  const options = currentSection === 2 ? ['А', 'Б', 'В', 'Г', 'Д'] : ['А', 'Б', 'В', 'Г'];

  // Section questions list: prioritize questions present in data for this section
  const sectionQuestions = useMemo(() => {
    const existingInSec = questions
      .filter((q) => q.section_id === currentSection)
      .map((q) => q.question_number)
      .sort((a, b) => a - b);
    if (existingInSec.length > 0) {
      return existingInSec;
    }
    return getSectionQuestions(currentSection);
  }, [questions, currentSection]);

  const totalSectionQuestions = sectionQuestions.length || 30;
  const answeredCount = sectionQuestions.filter((qNum) => userAnswers[qNum]).length;
  const isSectionComplete = totalSectionQuestions > 0 && answeredCount === totalSectionQuestions;
  const progressPercent = totalSectionQuestions > 0 ? (answeredCount / totalSectionQuestions) * 100 : 0;

  const getImageUrl = (url?: string) => {
    if (!url) return '/coomo1_page1.jpg';
    let fullUrl = url;
    if (
      !url.startsWith('http://') &&
      !url.startsWith('https://') &&
      !url.startsWith('/') &&
      !url.startsWith('data:')
    ) {
      fullUrl = `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    }
    return getOptimizedTestPageUrl(fullUrl);
  };

  const SECTION_PAGE_FALLBACKS: Record<string, string> = {
    // Section 1: Математика I
    'страница_1': 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1786789680/%D0%A1%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B0_1.jpg',
    'страница_2': 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1786789690/%D0%A1%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B0_2.jpg',
    'страница_3': 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1786789766/%D0%A1%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B0_3.jpg',
    'страница_4': 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1786789771/%D0%A1%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B0_4.jpg',
    'page1': 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1786789680/%D0%A1%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B0_1.jpg',
    'page2': 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1786789690/%D0%A1%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B0_2.jpg',
    'page3': 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1786789766/%D0%A1%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B0_3.jpg',
    'page4': 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1786789771/%D0%A1%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B0_4.jpg',

    // Section 2: Математика II
    'математика_1': 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1786954730/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_-_%D0%A7%D0%B0%D1%81%D1%82%D1%8C_2_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_1.jpg',
    'математика_2': 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1786995981/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_-_%D0%A7%D0%B0%D1%81%D1%82%D1%8C_2_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_2.jpg',
    'математика_3': 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1786996040/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_-_%D0%A7%D0%B0%D1%81%D1%82%D1%8C_2_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_3.jpg',
    'математика_4': 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1786996107/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_-_%D0%A7%D0%B0%D1%81%D1%82%D1%8C_2_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_4.jpg',
    'математика_5': 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1786996129/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_-_%D0%A7%D0%B0%D1%81%D1%82%D1%8C_2_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_5.jpg',
    'математика_6': 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1786996311/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_-_%D0%A7%D0%B0%D1%81%D1%82%D1%8C_2_%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0_6.jpg',

    // Section 3: АДП
    'адп_1': 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1787062305/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%90%D0%94%D0%9F_1.jpg',
    'адп_2': 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1787064555/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%90%D0%94%D0%9F_2.jpg',
    'адп_3': 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1787064565/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%90%D0%94%D0%9F_3.jpg',
    'адп_4': 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1787064576/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%90%D0%94%D0%9F_4.jpg',

    // Section 4: ЧП
    'чп_1': 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1787132551/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%A7%D0%9F_1.jpg',
    'чп_2': 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1787132423/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%A7%D0%9F_2.jpg',
    'чп_3': 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1787132418/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%A7%D0%9F_3.jpg',
    'чп_4': 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1787132412/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%A7%D0%9F_4.jpg',
    'чп_5': 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1787132397/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%A7%D0%9F_5.jpg',
    'чп_6': 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1787132391/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%A7%D0%9F_6.jpg',
    'чп_7': 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1787132383/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%A7%D0%9F_7.jpg',
    'чп_8': 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1787132373/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%A7%D0%9F_8.jpg',
    'чп_9': 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1787132289/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%A7%D0%9F_9.jpg',

    // Section 5: ПГ
    'пг_1': 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1787128367/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%9F%D0%93_1.jpg',
    'пг_2': 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1787128430/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%9F%D0%93_2.jpg',
    'пг_3': 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1787128438/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%9F%D0%93_3.jpg',
    'пг_4': 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1787128482/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%9F%D0%93_4.jpg',
    'пг_5': 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1787128493/%D0%A6%D0%9E%D0%9E%D0%9C%D0%9E_1_%D0%9F%D0%93_5.jpg',
  };

  const getFallbackImageUrl = (origUrl: string, qNum?: number): string => {
    const decodedUrl = (() => {
      try {
        return decodeURIComponent(origUrl || '').toLowerCase();
      } catch {
        return (origUrl || '').toLowerCase();
      }
    })();

    // 1. Direct page token match (Priority: prevents reverting selected page to page 1)
    for (const [token, directUrl] of Object.entries(SECTION_PAGE_FALLBACKS)) {
      if (decodedUrl.includes(token)) {
        return getOptimizedTestPageUrl(directUrl);
      }
    }

    // 2. If already a valid absolute URL, return optimized version
    if (origUrl && (origUrl.startsWith('http://') || origUrl.startsWith('https://'))) {
      return getOptimizedTestPageUrl(origUrl);
    }

    // 3. Fallback based on question number
    const q = qNum || currentQuestionNum;

    // Section 5: Практическая грамматика (Вопросы 121 - 150)
    if (q >= 121 && q <= 150) {
      if (q <= 123) return getOptimizedTestPageUrl(SECTION_PAGE_FALLBACKS['пг_1']);
      if (q <= 131) return getOptimizedTestPageUrl(SECTION_PAGE_FALLBACKS['пг_2']);
      if (q <= 138) return getOptimizedTestPageUrl(SECTION_PAGE_FALLBACKS['пг_3']);
      if (q <= 146) return getOptimizedTestPageUrl(SECTION_PAGE_FALLBACKS['пг_4']);
      return getOptimizedTestPageUrl(SECTION_PAGE_FALLBACKS['пг_5']);
    }

    // Section 4: Чтение и понимание (Вопросы 91 - 120)
    if (q >= 91 && q <= 120) {
      const rel = q - 90;
      if (rel <= 3) return getOptimizedTestPageUrl(SECTION_PAGE_FALLBACKS['чп_1']);
      if (rel <= 7) return getOptimizedTestPageUrl(SECTION_PAGE_FALLBACKS['чп_2']);
      if (rel <= 10) return getOptimizedTestPageUrl(SECTION_PAGE_FALLBACKS['чп_3']);
      if (rel <= 13) return getOptimizedTestPageUrl(SECTION_PAGE_FALLBACKS['чп_4']);
      if (rel <= 17) return getOptimizedTestPageUrl(SECTION_PAGE_FALLBACKS['чп_5']);
      if (rel <= 20) return getOptimizedTestPageUrl(SECTION_PAGE_FALLBACKS['чп_6']);
      if (rel <= 23) return getOptimizedTestPageUrl(SECTION_PAGE_FALLBACKS['чп_7']);
      if (rel <= 27) return getOptimizedTestPageUrl(SECTION_PAGE_FALLBACKS['чп_8']);
      return getOptimizedTestPageUrl(SECTION_PAGE_FALLBACKS['чп_9']);
    }

    // Section 3: Аналогии и дополнение предложений (Вопросы 61 - 90)
    if (q >= 61 && q <= 90) {
      if (q <= 70) return getOptimizedTestPageUrl(SECTION_PAGE_FALLBACKS['адп_1']);
      if (q <= 80) return getOptimizedTestPageUrl(SECTION_PAGE_FALLBACKS['адп_2']);
      if (q <= 86) return getOptimizedTestPageUrl(SECTION_PAGE_FALLBACKS['адп_3']);
      return getOptimizedTestPageUrl(SECTION_PAGE_FALLBACKS['адп_4']);
    }

    // Section 2: Математика Часть II (Вопросы 31 - 60)
    if (q >= 31 && q <= 60) {
      if (q <= 35) return getOptimizedTestPageUrl(SECTION_PAGE_FALLBACKS['математика_1']);
      if (q <= 40) return getOptimizedTestPageUrl(SECTION_PAGE_FALLBACKS['математика_2']);
      if (q <= 45) return getOptimizedTestPageUrl(SECTION_PAGE_FALLBACKS['математика_3']);
      if (q <= 50) return getOptimizedTestPageUrl(SECTION_PAGE_FALLBACKS['математика_4']);
      if (q <= 55) return getOptimizedTestPageUrl(SECTION_PAGE_FALLBACKS['математика_5']);
      return getOptimizedTestPageUrl(SECTION_PAGE_FALLBACKS['математика_6']);
    }

    // Section 1: Математика Часть I (Вопросы 1 - 30)
    if (q <= 8) return getOptimizedTestPageUrl(SECTION_PAGE_FALLBACKS['страница_1']);
    if (q <= 16) return getOptimizedTestPageUrl(SECTION_PAGE_FALLBACKS['страница_2']);
    if (q <= 23) return getOptimizedTestPageUrl(SECTION_PAGE_FALLBACKS['страница_3']);
    return getOptimizedTestPageUrl(SECTION_PAGE_FALLBACKS['страница_4']);
  };

  // Proactive background preloader: downloads and caches all section & test photos instantly
  useEffect(() => {
    if (!questions || questions.length === 0) return;

    const currentSecUrls: string[] = [];
    const otherUrls: string[] = [];

    questions.forEach((q) => {
      if (q.image_url) {
        const fullUrl = getImageUrl(q.image_url);
        if (q.section_id === currentSection) {
          currentSecUrls.push(fullUrl);
        } else {
          otherUrls.push(fullUrl);
        }
      }
    });

    const uniqueUrls = Array.from(new Set([...currentSecUrls, ...otherUrls]));

    uniqueUrls.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [questions, currentSection]);

  const handlePrevQuestion = () => {
    const idx = sectionQuestions.indexOf(currentQuestionNum);
    if (idx > 0) {
      setCurrentQuestionNum(sectionQuestions[idx - 1]);
    }
  };

  const handleNextQuestion = () => {
    const idx = sectionQuestions.indexOf(currentQuestionNum);
    if (idx >= 0 && idx < sectionQuestions.length - 1) {
      setCurrentQuestionNum(sectionQuestions[idx + 1]);
    }
  };

  // Active Section Unique Booklet Pages
  const sectionPages = useMemo(() => {
    const pages: string[] = [];
    const currentSecQuestions = questions.filter((q) => q.section_id === currentSection);
    currentSecQuestions.forEach((q) => {
      if (q.image_url && !pages.includes(q.image_url)) {
        pages.push(q.image_url);
      }
    });

    // Fallback predefined booklet pages if questions are still populating
    if (pages.length === 0) {
      if (currentSection === 1) {
        return [
          SECTION_PAGE_FALLBACKS['страница_1'],
          SECTION_PAGE_FALLBACKS['страница_2'],
          SECTION_PAGE_FALLBACKS['страница_3'],
          SECTION_PAGE_FALLBACKS['страница_4'],
        ].map((u) => getOptimizedTestPageUrl(u));
      }
      if (currentSection === 2) {
        return [
          SECTION_PAGE_FALLBACKS['математика_1'],
          SECTION_PAGE_FALLBACKS['математика_2'],
          SECTION_PAGE_FALLBACKS['математика_3'],
          SECTION_PAGE_FALLBACKS['математика_4'],
          SECTION_PAGE_FALLBACKS['математика_5'],
          SECTION_PAGE_FALLBACKS['математика_6'],
        ].map((u) => getOptimizedTestPageUrl(u));
      }
      if (currentSection === 3) {
        return [
          SECTION_PAGE_FALLBACKS['адп_1'],
          SECTION_PAGE_FALLBACKS['адп_2'],
          SECTION_PAGE_FALLBACKS['адп_3'],
          SECTION_PAGE_FALLBACKS['адп_4'],
        ].map((u) => getOptimizedTestPageUrl(u));
      }
      if (currentSection === 4) {
        return [
          SECTION_PAGE_FALLBACKS['чп_1'],
          SECTION_PAGE_FALLBACKS['чп_2'],
          SECTION_PAGE_FALLBACKS['чп_3'],
          SECTION_PAGE_FALLBACKS['чп_4'],
          SECTION_PAGE_FALLBACKS['чп_5'],
          SECTION_PAGE_FALLBACKS['чп_6'],
          SECTION_PAGE_FALLBACKS['чп_7'],
          SECTION_PAGE_FALLBACKS['чп_8'],
          SECTION_PAGE_FALLBACKS['чп_9'],
        ].map((u) => getOptimizedTestPageUrl(u));
      }
      if (currentSection === 5) {
        return [
          SECTION_PAGE_FALLBACKS['пг_1'],
          SECTION_PAGE_FALLBACKS['пг_2'],
          SECTION_PAGE_FALLBACKS['пг_3'],
          SECTION_PAGE_FALLBACKS['пг_4'],
          SECTION_PAGE_FALLBACKS['пг_5'],
        ].map((u) => getOptimizedTestPageUrl(u));
      }
    }

    return pages;
  }, [questions, currentSection]);

  const [selectedPageUrl, setSelectedPageUrl] = useState<string | null>(null);

  // Auto-sync viewed page when question changes
  useEffect(() => {
    if (currentQ?.image_url) {
      setSelectedPageUrl(currentQ.image_url);
    }
  }, [currentQuestionNum, currentQ?.image_url]);

  // Reset selected page when section changes
  useEffect(() => {
    setSelectedPageUrl(null);
  }, [currentSection]);

  const activeDisplayPageRaw = selectedPageUrl || currentQ?.image_url || sectionPages[0] || '';
  
  const currentPageIdx = useMemo(() => {
    if (!activeDisplayPageRaw || sectionPages.length === 0) return 0;
    const directIdx = sectionPages.indexOf(activeDisplayPageRaw);
    if (directIdx !== -1) return directIdx;

    const activeClean = activeDisplayPageRaw.split('?')[0].toLowerCase();
    const fuzzyIdx = sectionPages.findIndex((p) => {
      const pClean = p.split('?')[0].toLowerCase();
      return pClean === activeClean || pClean.includes(activeClean) || activeClean.includes(pClean);
    });
    return fuzzyIdx !== -1 ? fuzzyIdx : 0;
  }, [sectionPages, activeDisplayPageRaw]);

  const totalPages = Math.max(1, sectionPages.length);

  const handlePrevPage = () => {
    if (currentPageIdx > 0) {
      setSelectedPageUrl(sectionPages[currentPageIdx - 1]);
    }
  };

  const handleNextPage = () => {
    if (currentPageIdx < totalPages - 1) {
      setSelectedPageUrl(sectionPages[currentPageIdx + 1]);
    }
  };

  const handleSelectPage = (idx: number) => {
    if (idx >= 0 && idx < sectionPages.length) {
      setSelectedPageUrl(sectionPages[idx]);
    }
  };

  if (loading || calculating) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-bold text-lg animate-pulse">
          {calculating ? 'Идет подсчет результатов...' : 'Загрузка вопросов...'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 select-none overflow-hidden font-sans">
      {/* Confirmation & Alert Modals */}
      {sectionModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[250] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-8 text-center border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner border ${
                sectionModal.type.includes('timeout')
                  ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-500 border-amber-100 dark:border-amber-900/50'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border-emerald-100 dark:border-emerald-900/50'
              }`}
            >
              {sectionModal.type.includes('timeout') ? '⏳' : '🚪'}
            </div>

            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">
              {sectionModal.type.includes('timeout') ? t.timeUpTitle : t.confirmTitle}
            </h3>

            <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed text-sm font-medium">
              {sectionModal.message}
            </p>

            {sectionModal.nextSectionName && (
              <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl mb-6 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500 block mb-1">
                  {t.nextSectionLabel}
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-base">
                  {sectionModal.nextSectionName}
                </span>
              </div>
            )}

            <div className="flex gap-3">
              {!sectionModal.type.includes('timeout') && (
                <button
                  onClick={() =>
                    setSectionModal({ isOpen: false, type: '', message: '', nextSectionName: '' })
                  }
                  className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-black rounded-2xl transition-colors cursor-pointer"
                >
                  {t.cancel}
                </button>
              )}
              <button
                onClick={confirmSectionTransition}
                className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-lg shadow-emerald-600/30 transition-all active:scale-95 cursor-pointer"
              >
                {sectionModal.type.includes('finish') ? t.finish : t.continue}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blur Protection Modal */}
      {isWindowBlurred && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-8 text-center border border-slate-200 dark:border-slate-700">
            <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/30 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner border border-rose-100 dark:border-rose-900/50">
              ⏸️
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-3">{t.testPausedTitle}</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed text-sm">
              {t.testPausedDesc} <br />
              <br />
              <span className="text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-900/30 px-3 py-1 rounded-lg">
                {t.timerPausedNotice}
              </span>
            </p>
            <button
              onClick={() => setIsWindowBlurred(false)}
              className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black uppercase tracking-wider py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-rose-600/30 cursor-pointer"
            >
              {t.iAmBack}
            </button>
          </div>
        </div>
      )}

      {/* Missing sections notification in full mode */}
      {missingSectionsAlert && mode === 'full' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-8 text-center border border-slate-200 dark:border-slate-700">
            <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner border border-amber-100 dark:border-amber-900/50">
              ⚠️
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-3">{t.warningTitle}</h3>
            <div className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed text-sm">
              {t.missingSectionsDesc}
              <br />
              <span className="font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 px-3 py-2 rounded-lg inline-block mt-2">
                {missingSectionsText}
              </span>
            </div>
            <button
              onClick={() => setMissingSectionsAlert(false)}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-wider py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-600/30 cursor-pointer"
            >
              {t.startTest}
            </button>
          </div>
        </div>
      )}

      {/* Image Zoom Modal with Page Flip Controls */}
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-[300] flex flex-col items-center justify-between p-3 sm:p-6 cursor-default"
          onClick={() => setZoomedImage(null)}
        >
          {/* Zoom Modal Header Toolbar */}
          <div
            className="w-full max-w-4xl flex items-center justify-between gap-3 text-white z-10 bg-slate-900/90 px-4 py-2.5 rounded-2xl border border-slate-700 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold text-xs sm:text-sm">
                {t.pageFull} {currentPageIdx + 1} {t.pageOf} {totalPages}
              </span>
            </div>

            {/* Page Flipping Buttons in Zoom Modal */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 max-w-[65%] sm:max-w-none scrollbar-none touch-pan-x">
                <button
                  type="button"
                  onClick={handlePrevPage}
                  disabled={currentPageIdx <= 0}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all border border-slate-700 touch-manipulation active:scale-95"
                >
                  ◀
                </button>
                <div className="flex items-center gap-1">
                  {sectionPages.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPage(idx)}
                      className={`h-7 min-w-[28px] px-2 rounded-lg text-xs font-black transition-all cursor-pointer touch-manipulation active:scale-95 ${
                        idx === currentPageIdx
                          ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 scale-105 shadow-md shadow-emerald-600/40'
                          : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={currentPageIdx >= totalPages - 1}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all border border-slate-700 touch-manipulation active:scale-95"
                >
                  ▶
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setZoomedImage(null)}
              className="text-white hover:text-rose-400 text-lg px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 cursor-pointer transition-colors touch-manipulation active:scale-95"
              title={t.closeFullscreen}
            >
              ✕
            </button>
          </div>

          {/* Zoom Image Area */}
          <div
            className="flex-1 w-full flex items-center justify-center p-2 overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              key={activeDisplayPageRaw}
              src={getImageUrl(activeDisplayPageRaw) || '/coomo1_page1.jpg'}
              alt={`Страница ${currentPageIdx + 1}`}
              onError={(e) => {
                const target = e.currentTarget;
                const fallback = getFallbackImageUrl(activeDisplayPageRaw, currentQuestionNum);
                if (target.src !== fallback) {
                  target.src = fallback;
                }
              }}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-slate-800 select-none"
            />
          </div>
        </div>
      )}

      {/* Top Test Header */}
      <header className="shrink-0 bg-[#041d16] text-white border-b border-emerald-900/40 shadow-xl z-50 flex flex-col">
        <div className="h-1 bg-emerald-950 w-full">
          <div
            className="h-full bg-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="p-3 md:p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-slate-400 hover:text-white transition-colors bg-slate-800 p-2 rounded-xl"
              title={t.exitToHome}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>

            <div>
              <h1 className="font-black text-xs md:text-sm uppercase tracking-tighter text-slate-200">
                {questions[0]?.title || `Вариант ${variantId}`}
              </h1>
              <p className="text-[10px] text-emerald-400 font-bold">{sectionDict[currentSection]}</p>
            </div>
          </div>

          {/* Countdown Clock */}
          <div
            className={`px-4 md:px-5 py-1.5 rounded-full font-mono text-lg md:text-xl font-bold border shadow-inner transition-colors ${
              timeLeft < 180
                ? 'bg-rose-900/50 text-rose-400 border-rose-500/50 animate-pulse'
                : 'bg-slate-800 text-white border-slate-700'
            }`}
          >
            {formatTime(timeLeft)}
          </div>
        </div>
      </header>

      {/* Main Workspace: Left is question, Right is answers & grid */}
      <main className="flex-1 min-h-0 w-full flex flex-col lg:flex-row">
        {/* Left Side: Question Display */}
        <div className="flex-1 min-h-0 relative bg-slate-200/80 dark:bg-slate-900/50 flex flex-col">
          {/* Page Flipping Toolbar */}
          {totalPages > 1 && (
            <div className="shrink-0 flex items-center justify-between gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white/95 dark:bg-[#06261d]/95 backdrop-blur-md border-b border-slate-200 dark:border-emerald-900/40 z-30 shadow-xs">
              {/* Prev Page Button */}
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={currentPageIdx <= 0}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-emerald-950/60 text-slate-700 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all border border-slate-200 dark:border-emerald-800/40 touch-manipulation active:scale-95"
                title={t.prevPage}
              >
                <span>◀</span>
                <span className="hidden sm:inline">{t.prevPage}</span>
              </button>

              {/* Page Number Pills */}
              <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-[65%] sm:max-w-none scrollbar-none touch-pan-x">
                <span className="text-[10px] uppercase font-black text-slate-500 dark:text-emerald-400/80 mr-1 hidden md:inline">
                  {t.pageFull}:
                </span>
                {sectionPages.map((_, idx) => {
                  const isCurrent = idx === currentPageIdx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPage(idx)}
                      className={`h-8 sm:h-7 min-w-[32px] sm:min-w-[28px] px-2 sm:px-2 rounded-lg text-xs font-black transition-all cursor-pointer select-none touch-manipulation active:scale-95 ${
                        isCurrent
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-105 ring-2 ring-emerald-400/40'
                          : 'bg-slate-100 dark:bg-emerald-950/40 text-slate-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 border border-slate-200 dark:border-emerald-800/30'
                      }`}
                      title={`${t.pageFull} ${idx + 1}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Next Page Button + Zoom Button */}
              <div className="flex items-center gap-1 sm:gap-1.5">
                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={currentPageIdx >= totalPages - 1}
                  className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-emerald-950/60 text-slate-700 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all border border-slate-200 dark:border-emerald-800/40 touch-manipulation active:scale-95"
                  title={t.nextPage}
                >
                  <span className="hidden sm:inline">{t.nextPage}</span>
                  <span>▶</span>
                </button>

                <button
                  type="button"
                  onClick={() => setZoomedImage(getImageUrl(activeDisplayPageRaw) || '/coomo1_page1.jpg')}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-emerald-950/60 text-slate-700 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-slate-200 dark:border-emerald-800/40 cursor-pointer transition-all touch-manipulation active:scale-95"
                  title={t.openFullscreen}
                >
                  🔍
                </button>
              </div>
            </div>
          )}

          {/* Question Image Viewer */}
          <div className="flex-1 min-h-0 w-full p-2 sm:p-4 lg:p-6 flex items-center justify-center relative select-none overflow-hidden">
            <div className="relative w-full h-full max-w-4xl max-h-[85vh] flex items-center justify-center">
              {activeDisplayPageRaw || currentQ ? (
                <div className="relative w-full h-full flex items-center justify-center group">
                  <img
                    key={activeDisplayPageRaw}
                    src={getImageUrl(activeDisplayPageRaw) || '/coomo1_page1.jpg'}
                    alt={`Страница ${currentPageIdx + 1}`}
                    loading="eager"
                    decoding="async"
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                    onError={(e) => {
                      const target = e.currentTarget;
                      const fallback = getFallbackImageUrl(activeDisplayPageRaw, currentQuestionNum);
                      if (target.src !== fallback) {
                        target.src = fallback;
                      }
                    }}
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-xl border border-slate-300 dark:border-slate-800 bg-white cursor-zoom-in transition-all select-none pointer-events-auto"
                    onClick={() => {
                      setZoomedImage(getImageUrl(activeDisplayPageRaw) || '/coomo1_page1.jpg');
                    }}
                  />
                  {/* Discreet Anti-Screenshot Watermark Pattern */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.04] rotate-[-20deg] select-none text-slate-950 dark:text-emerald-400 font-black text-2xl tracking-[0.3em] uppercase">
                    KYRGYZ AKYLMAN • ОРТ
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-4xl mb-3 block">📄</span>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                    {t.questionPrefix}{getRelativeQuestionNumber(currentQuestionNum, currentSection)}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {t.loadingQuestion}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Answer Selector and Question Navigation Matrix */}
        <div className="w-full lg:w-96 flex flex-col shrink-0 bg-white dark:bg-slate-800 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 z-40 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] lg:shadow-none transition-colors">
          {/* Answer Choice Panel */}
          <div className="shrink-0 p-3 lg:p-5 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 z-10">
            <div className="flex justify-between items-center mb-2 lg:mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevQuestion}
                  disabled={sectionQuestions.indexOf(currentQuestionNum) <= 0}
                  className="p-1.5 lg:p-2 rounded-lg lg:rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  title={t.prevQuestion}
                >
                  <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <span className="hidden lg:block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                    {t.answerChoice}
                  </span>
                  <p className="text-base lg:text-2xl font-black text-slate-800 dark:text-white leading-none lg:leading-tight">
                    {t.questionPrefix}{getRelativeQuestionNumber(currentQuestionNum, currentSection)}
                  </p>
                </div>
                <button
                  onClick={handleNextQuestion}
                  disabled={sectionQuestions.indexOf(currentQuestionNum) >= sectionQuestions.length - 1}
                  className="p-1.5 lg:p-2 rounded-lg lg:rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  title={t.nextQuestion}
                >
                  <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Answer letters A, B, V, G, (D) */}
            <div className="flex gap-1.5 lg:gap-2">
              {options.map((opt) => {
                const currentAns = userAnswers[currentQuestionNum];
                const prevAns = previousAnswers[currentQuestionNum];
                const isSelected = currentAns === opt;
                const isPrevious = prevAns === opt;
                const hasChanged = Boolean(prevAns);
                const isLocked = hasChanged && !isSelected && !isPrevious;

                let btnStyle =
                  'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 hover:border-emerald-300 dark:hover:border-emerald-600 cursor-pointer';

                if (isSelected) {
                  btnStyle =
                    'bg-emerald-600 text-white border-emerald-800 shadow-md scale-105 ring-2 ring-emerald-400/40 cursor-pointer';
                } else if (isPrevious) {
                  btnStyle =
                    'bg-amber-400 text-amber-950 border-amber-500 font-black line-through decoration-2 shadow-inner opacity-90 cursor-default';
                } else if (isLocked) {
                  btnStyle =
                    'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-800 opacity-40 cursor-not-allowed';
                }

                return (
                  <button
                    key={opt}
                    disabled={isLocked || isPrevious}
                    onClick={() => {
                      if (!currentAns) {
                        // First time selecting an answer
                        setUserAnswers((prev) => ({ ...prev, [currentQuestionNum]: opt }));
                        return;
                      }
                      if (currentAns === opt) {
                        return;
                      }
                      if (prevAns) {
                        // Already used 1 change
                        return;
                      }
                      // Use the 1 allowed change:
                      setPreviousAnswers((prev) => ({ ...prev, [currentQuestionNum]: currentAns }));
                      setUserAnswers((prev) => ({ ...prev, [currentQuestionNum]: opt }));
                    }}
                    title={
                      isPrevious
                        ? lang === 'kg'
                          ? 'Мурунку жокко чыгарылган жооп'
                          : 'Предыдущий отмененный ответ'
                        : isSelected
                        ? lang === 'kg'
                          ? 'Тандалган жооп'
                          : 'Выбранный ответ'
                        : isLocked
                        ? lang === 'kg'
                          ? 'Жооп алмаштыруу лимити бүттү (1 жолу гана)'
                          : 'Лимит смены ответа исчерпан (только 1 раз)'
                        : undefined
                    }
                    className={`flex-1 h-10 lg:h-12 rounded-lg lg:rounded-2xl font-black text-base lg:text-xl transition-all duration-200 border-b-4 active:border-b-0 active:translate-y-1 flex items-center justify-center ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section Matrix Header */}
          <div className="shrink-0 px-3 py-2 lg:p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <h2 className="font-black text-slate-800 dark:text-slate-200 text-[10px] uppercase tracking-widest">
              {t.sectionSheet}
            </h2>
            <span
              className={`text-[10px] font-black px-2 lg:px-2.5 py-1 rounded-md transition-colors ${
                isSectionComplete
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50'
              }`}
            >
              {answeredCount} / {totalSectionQuestions}
            </span>
          </div>

          {/* Questions Grid (1 to 6 or 1 to 30) */}
          <div
            className={`flex-1 min-h-0 overflow-y-auto p-2 lg:p-4 grid ${
              sectionQuestions.length <= 6 ? 'grid-cols-6' : 'grid-cols-6 lg:grid-cols-5'
            } gap-1.5 lg:gap-2 bg-slate-50/50 dark:bg-slate-900/50 content-start`}
          >
            {sectionQuestions.map((qNum) => {
              const isActive = currentQuestionNum === qNum;
              const ans = userAnswers[qNum];

              let cellStyle =
                'bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600 shadow-sm hover:border-emerald-400 dark:hover:border-emerald-500';

              if (ans) {
                cellStyle =
                  'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 font-black relative';
              }
              if (isActive) {
                cellStyle =
                  'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300 dark:ring-emerald-800 border-emerald-600 scale-105 lg:scale-110 z-10 relative';
              }

              return (
                <button
                  key={qNum}
                  onClick={() => setCurrentQuestionNum(qNum)}
                  className={`h-9 lg:h-11 rounded-lg lg:rounded-xl text-xs lg:text-sm transition-all flex items-center justify-center font-bold overflow-hidden cursor-pointer ${cellStyle}`}
                >
                  <span>{ans && !isActive ? ans : getRelativeQuestionNumber(qNum, currentSection)}</span>
                </button>
              );
            })}
          </div>

          {/* Next Section or Finish Button */}
          <div className="shrink-0 p-3 pb-6 lg:pb-4 lg:p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 z-10 shadow-[0_-5px_15px_rgba(0,0,0,0.03)] dark:shadow-[0_-5px_15px_rgba(0,0,0,0.2)]">
            <button
              onClick={() => promptNextSectionOrFinish(false)}
              className={`w-full py-3.5 lg:py-4 rounded-xl font-black text-xs lg:text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                isSectionComplete
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/40 animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
              }`}
            >
              {availableSectionsList.find((s) => s > currentSection)
                ? t.nextSection
                : t.finishTest}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
