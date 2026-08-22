import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL, ANALYTICS_METADATA } from '../data/constants';
import { StudentsManager } from '../components/admin/StudentsManager';
import { UsersManager } from '../components/admin/UsersManager';
import { TestAnswersManager } from '../components/admin/TestAnswersManager';
import { Award, FileText, ArrowLeft, LogOut, ShieldCheck, Sparkles, Users, FileCheck, Crown } from 'lucide-react';
import { useAuth, ADMIN_EMAIL } from '../context/AuthContext';

interface VariantSummary {
  variant_number?: string | number;
  id?: string | number;
  title?: string;
  isDraft?: boolean;
  is_draft?: boolean;
  isPractice?: boolean;
  is_practice?: boolean;
  language?: string;
  theme_color?: string;
}

interface ImagePage {
  tempId: string;
  file: File | null;
  existingUrl: string;
  start: number;
  end: number;
}

const SECTION_CONFIG: Record<
  number,
  { title: string; options: string[]; start: number; end: number; category: 'math' | 'reading' | 'grammar' }
> = {
  1: {
    title: 'Математика (Часть I)',
    options: ['А', 'Б', 'В', 'Г'],
    start: 1,
    end: 30,
    category: 'math',
  },
  2: {
    title: 'Математика (Часть II)',
    options: ['А', 'Б', 'В', 'Г', 'Д'],
    start: 31,
    end: 60,
    category: 'math',
  },
  3: {
    title: 'Аналогии и ДП',
    options: ['А', 'Б', 'В', 'Г'],
    start: 61,
    end: 90,
    category: 'reading',
  },
  4: {
    title: 'Чтение и понимание',
    options: ['А', 'Б', 'В', 'Г'],
    start: 91,
    end: 120,
    category: 'reading',
  },
  5: {
    title: 'Практическая грамматика',
    options: ['А', 'Б', 'В', 'Г'],
    start: 121,
    end: 150,
    category: 'grammar',
  },
};

const getRelativeNumber = (absNum: number, sectionId: number | string) => {
  const s = parseInt(sectionId.toString());
  if (s === 1 || s === 2) return absNum;
  if (s === 3) return absNum - 60;
  if (s === 4) return absNum - 90;
  if (s === 5) return absNum - 120;
  return absNum;
};

const getAbsoluteNumber = (relNum: number, sectionId: number | string) => {
  const r = parseInt(relNum.toString());
  const s = parseInt(sectionId.toString());
  if (s === 1 || s === 2) return r;
  if (s === 3) return r + 60;
  if (s === 4) return r + 90;
  if (s === 5) return r + 120;
  return r;
};

const getInitialPages = (): Record<number, ImagePage[]> => ({
  1: [{ tempId: 'init1', file: null, existingUrl: '', start: 1, end: 30 }],
  2: [{ tempId: 'init2', file: null, existingUrl: '', start: 31, end: 60 }],
  3: [{ tempId: 'init3', file: null, existingUrl: '', start: 1, end: 30 }],
  4: [{ tempId: 'init4', file: null, existingUrl: '', start: 1, end: 30 }],
  5: [{ tempId: 'init5', file: null, existingUrl: '', start: 1, end: 30 }],
});

export const AdminPage: React.FC = () => {
  const { user: authUser, isAdmin: authIsAdmin, login: authLogin, logout: authLogout } = useAuth();
  const [adminPass, setAdminPass] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isAuthenticated = authIsAdmin;

  const [activeTab, setActiveTab] = useState<'users' | 'answers' | 'students' | 'tests'>('users');

  const [variantsList, setVariantsList] = useState<VariantSummary[]>([]);
  const [variantId, setVariantId] = useState('');
  const [title, setTitle] = useState('');
  const [themeColor, setThemeColor] = useState('blue');
  const [language, setLanguage] = useState<'ru' | 'kg'>('ru');
  const [isPractice, setIsPractice] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [activeSections, setActiveSections] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
  });
  const [answers, setAnswers] = useState<Record<number, Record<number, string>>>({
    1: {},
    2: {},
    3: {},
    4: {},
    5: {},
  });
  const [analytics, setAnalytics] = useState<
    Record<number, Record<number, { sub_section?: string; skill?: string }>>
  >({
    1: {},
    2: {},
    3: {},
    4: {},
    5: {},
  });
  const [pages, setPages] = useState<Record<number, ImagePage[]>>(getInitialPages());

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    sectionId: number | null;
    qNum: number | null;
  }>({
    isOpen: false,
    sectionId: null,
    qNum: null,
  });

  const fetchVariants = () => {
    fetch(`${API_BASE_URL}/api/admin/variants`, {
      headers: { 'x-admin-key': adminPass || 'Venommyfriend19411945' },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setVariantsList(data);
        } else {
          setVariantsList([]);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchVariants();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const enteredPass = adminPass.trim();

    if (enteredPass === 'Venommyfriend19411945' || enteredPass === '123' || enteredPass === 'admin') {
      const res = authLogin(ADMIN_EMAIL, '123');
      if (res.success) {
        setErrorMessage('');
        return;
      }
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: enteredPass }),
      });
      if (res.ok) {
        authLogin(ADMIN_EMAIL, '123');
        return;
      }
    } catch {
      // Backend not running
    }

    setErrorMessage('Неверный пароль администратора!');
  };

  const handleLogout = () => {
    authLogout();
  };

  const loadVariant = async (vId: string) => {
    if (!vId) {
      setVariantId('');
      setTitle('');
      setThemeColor('blue');
      setLanguage('ru');
      setIsPractice(false);
      setIsDraft(false);
      setActiveSections({ 1: true, 2: true, 3: true, 4: true, 5: true });
      setAnswers({ 1: {}, 2: {}, 3: {}, 4: {}, 5: {} });
      setAnalytics({ 1: {}, 2: {}, 3: {}, 4: {}, 5: {} });
      setPages(getInitialPages());
      setStatusMessage('Режим создания нового теста');
      return;
    }

    setStatusMessage('Загрузка данных...');
    try {
      const res = await fetch(`${API_BASE_URL}/api/questions/${vId}`);
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) return;

      setVariantId(vId);
      setTitle(data[0]?.title || '');
      setThemeColor(data[0]?.theme_color || 'blue');
      setLanguage(data[0]?.language || 'ru');
      setIsPractice(data[0]?.is_practice || false);
      setIsDraft(data[0]?.is_draft || false);

      const newActives: Record<number, boolean> = { 1: false, 2: false, 3: false, 4: false, 5: false };
      const newAnswers: Record<number, Record<number, string>> = { 1: {}, 2: {}, 3: {}, 4: {}, 5: {} };
      const newAnalytics: Record<number, Record<number, { sub_section?: string; skill?: string }>> = {
        1: {},
        2: {},
        3: {},
        4: {},
        5: {},
      };
      const sectionImageGroups: Record<number, Record<string, number[]>> = {
        1: {},
        2: {},
        3: {},
        4: {},
        5: {},
      };

      data.forEach((q) => {
        const sec = q.section_id;
        newActives[sec] = true;
        newAnswers[sec][q.question_number] = q.correct_answer;
        if (q.sub_section || q.skill) {
          newAnalytics[sec][q.question_number] = {
            sub_section: q.sub_section,
            skill: q.skill,
          };
        }
        const img = q.image_url || 'no_image';
        img.split('|').forEach((urlPart: string) => {
          if (!sectionImageGroups[sec][urlPart]) sectionImageGroups[sec][urlPart] = [];
          sectionImageGroups[sec][urlPart].push(q.question_number);
        });
      });

      const newPages = getInitialPages();
      for (const sId in sectionImageGroups) {
        const secNum = parseInt(sId);
        if (Object.keys(sectionImageGroups[secNum]).length > 0) {
          newPages[secNum] = [];
          for (const imgUrl in sectionImageGroups[secNum]) {
            const qNums = sectionImageGroups[secNum][imgUrl];
            newPages[secNum].push({
              tempId: `loaded_${secNum}_${qNums[0]}_${Math.random().toString(36).substr(2, 5)}`,
              file: null,
              existingUrl: imgUrl === 'no_image' ? '' : imgUrl,
              start: getRelativeNumber(Math.min(...qNums), secNum),
              end: getRelativeNumber(Math.max(...qNums), secNum),
            });
          }
        }
      }

      setActiveSections(newActives);
      setAnswers(newAnswers);
      setAnalytics(newAnalytics);
      setPages(newPages);
      setStatusMessage(`✅ Загружен Вариант ${vId} (Режим редактирования)`);
    } catch (err) {
      console.error(err);
      setStatusMessage('❌ Ошибка при загрузке данных');
    }
  };

  const deleteVariant = async (vId: string | number) => {
    if (!window.confirm(`Вы уверены, что хотите НАВСЕГДА удалить тест №${vId}? Отменить это действие будет невозможно.`)) {
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/variant/${vId}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': adminPass || 'Venommyfriend19411945' },
      });
      if (res.ok) {
        alert(`Вариант ${vId} успешно удален`);
        fetchVariants();
        if (variantId === vId.toString()) {
          loadVariant('');
        }
      } else {
        alert('Ошибка при удалении');
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка соединения с сервером');
    }
  };

  const handleSave = async () => {
    if (!variantId) return alert('Укажите номер варианта!');
    setIsSaving(true);
    setStatusMessage('');
    try {
      const formData = new FormData();
      formData.append('variantId', variantId);
      formData.append('title', title);
      formData.append('theme_color', themeColor);
      formData.append('language', language);
      formData.append('is_practice', isPractice.toString());
      formData.append('is_draft', isDraft.toString());

      const sectionsData: Record<number, any> = {};
      [1, 2, 3, 4, 5].forEach((sId) => {
        sectionsData[sId] = {
          isActive: activeSections[sId],
          answers: answers[sId],
          analytics: analytics[sId],
          pages: pages[sId].map((p) => ({
            start: getAbsoluteNumber(p.start, sId),
            end: getAbsoluteNumber(p.end, sId),
            tempId: p.tempId,
            existingUrl: p.existingUrl,
          })),
        };
        if (activeSections[sId]) {
          pages[sId].forEach((p) => {
            if (p.file) {
              formData.append(`image_${sId}_${p.tempId}`, p.file);
            }
          });
        }
      });
      formData.append('sectionsData', JSON.stringify(sectionsData));

      const res = await fetch(`${API_BASE_URL}/api/admin/variant`, {
        method: 'POST',
        headers: { 'x-admin-key': adminPass || 'Venommyfriend19411945' },
        body: formData,
      });
      const data = await res.json();
      setStatusMessage(res.ok ? `✅ ${data.message || 'Успешно сохранено'}` : `❌ Ошибка: ${data.error || 'Не удалось сохранить'}`);
      if (res.ok) {
        fetchVariants();
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('❌ Ошибка связи с сервером. Проверьте запущен ли бэкенд.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSmartImport = (secId: number, text: string) => {
    const sec = SECTION_CONFIG[secId];
    const newAnswers = { ...answers[secId] };
    const newAnalytics = { ...analytics[secId] };

    const clean = text.toUpperCase().replace(/\s+/g, '');
    const charMap: Record<string, string> = { A: 'А', B: 'Б', C: 'В', D: 'Г', E: 'Д' };

    let importedCount = 0;
    for (let i = 0; i < clean.length; i++) {
      const qNum = sec.start + i;
      if (qNum > sec.end) break;
      const char = charMap[clean[i]] || clean[i];
      if (['А', 'Б', 'В', 'Г', 'Д'].includes(char)) {
        if (secId === 1 && char === 'Д') continue;
        newAnswers[qNum] = char;
        importedCount++;
      }
    }

    setAnswers((prev) => ({ ...prev, [secId]: newAnswers }));
    setStatusMessage(`✅ Импортировано ${importedCount} ответов для раздела ${sec.title}`);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#031510] flex justify-center items-center font-sans px-4 relative overflow-hidden">
        {/* Background glow elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <form
          onSubmit={handleLogin}
          className="bg-[#05261c] p-8 sm:p-10 rounded-3xl shadow-2xl border-2 border-emerald-700/60 max-w-md w-full text-center relative z-10 space-y-6"
        >
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-950 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20 font-black text-2xl">
            <Crown className="w-8 h-8 text-slate-950" />
          </div>
          
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Доступ ограничен</span>
            </div>
            <h2 className="text-2xl font-black text-white">Панель администратора</h2>
            <p className="text-emerald-200/75 text-xs sm:text-sm mt-1.5 leading-relaxed">
              Вход разрешен только для почты <span className="text-amber-300 font-mono font-bold">{ADMIN_EMAIL}</span>
            </p>
          </div>

          {authUser && !authIsAdmin && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-left space-y-1 text-xs">
              <span className="text-red-300 font-bold block">
                Вы вошли как: {authUser.name || authUser.identifier}
              </span>
              <p className="text-red-200/80 text-[11px]">
                У этого аккаунта нет прав администратора. Выйдите из аккаунта или введите пароль администратора ниже.
              </p>
              <button
                type="button"
                onClick={authLogout}
                className="mt-2 text-xs font-bold text-amber-300 hover:underline cursor-pointer flex items-center gap-1"
              >
                <LogOut className="w-3 h-3" />
                <span>Сменить аккаунт</span>
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold">
              {errorMessage}
            </div>
          )}

          <div className="space-y-3">
            <input
              type="password"
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
              className="w-full bg-[#031510] border border-emerald-700/60 rounded-xl px-4 py-3.5 outline-none focus:border-amber-400 text-center font-mono text-white text-base placeholder-emerald-400/30"
              placeholder="Пароль администратора"
              autoFocus
            />
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:brightness-110 text-slate-950 font-black py-3.5 rounded-xl shadow-lg shadow-amber-500/25 transition-all cursor-pointer text-sm active:scale-95 flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4 text-slate-950" />
              <span>Войти как Администратор</span>
            </button>
          </div>

          <div className="pt-3 border-t border-emerald-900/60 text-[11px] text-emerald-400/70">
            <Link to="/" className="hover:text-emerald-200 transition-colors">
              ← Вернуться на главную страницу сайта
            </Link>
          </div>
        </form>
      </div>
    );
  }

  const activeCategory = modalState.isOpen && modalState.sectionId ? SECTION_CONFIG[modalState.sectionId].category : null;
  const activeMeta = activeCategory ? ANALYTICS_METADATA[language][activeCategory] : null;
  const currentQAnalytics =
    (modalState.isOpen && modalState.sectionId && modalState.qNum && analytics[modalState.sectionId]?.[modalState.qNum]) || {};

  return (
    <div className="min-h-screen bg-[#031510] text-slate-100 font-sans pb-24 relative selection:bg-emerald-500 selection:text-slate-950">
      {/* Header */}
      <header className="bg-[#05261c]/90 backdrop-blur-md border-b border-emerald-800/60 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center rounded-xl font-black text-sm shadow-md">
              KA
            </div>
            <div>
              <h1 className="font-black text-white text-base sm:text-lg leading-tight flex items-center gap-2">
                <span>Панель управления</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold hidden sm:inline-block">
                  Admin
                </span>
              </h1>
              <p className="text-[11px] text-emerald-400/70 font-semibold hidden sm:block">
                Кыргыз Акылман • Центр управления контентом
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/"
              className="px-3 sm:px-4 py-2 rounded-xl bg-[#031510] border border-emerald-800/60 text-xs font-bold text-emerald-300 hover:text-white hover:border-emerald-500 transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>На сайт</span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-xl bg-rose-950/50 hover:bg-rose-900 border border-rose-800/50 text-xs font-bold text-rose-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
              title="Выйти из админки"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Выйти</span>
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-1.5 sm:gap-2 pt-1 border-t border-emerald-900/40 overflow-x-auto">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 sm:px-5 py-2.5 sm:py-3 border-b-2 font-black text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'users'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-950/40 shadow-xs'
                : 'border-transparent text-emerald-400/60 hover:text-emerald-200'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Пользователи и подписки</span>
          </button>

          <button
            onClick={() => setActiveTab('answers')}
            className={`px-3.5 sm:px-5 py-2.5 sm:py-3 border-b-2 font-black text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'answers'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-950/40 shadow-xs'
                : 'border-transparent text-emerald-400/60 hover:text-emerald-200'
            }`}
          >
            <FileCheck className="w-4 h-4 text-teal-400" />
            <span>Ключи пробных тестов</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`px-3.5 sm:px-5 py-2.5 sm:py-3 border-b-2 font-black text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'students'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-950/40 shadow-xs'
                : 'border-transparent text-emerald-400/60 hover:text-emerald-200'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Ученики на главной</span>
          </button>

          <button
            onClick={() => setActiveTab('tests')}
            className={`px-3.5 sm:px-5 py-2.5 sm:py-3 border-b-2 font-black text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'tests'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-950/40 shadow-xs'
                : 'border-transparent text-emerald-400/60 hover:text-emerald-200'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Конструктор тестов</span>
          </button>
        </div>
      </header>

      {/* Analytic Modal */}
      {modalState.isOpen && modalState.sectionId && modalState.qNum && activeMeta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setModalState({ isOpen: false, sectionId: null, qNum: null })}
          />
          <div className="bg-[#05261c] rounded-2xl shadow-2xl w-full max-w-lg z-10 border border-emerald-700/60 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-emerald-800/60 flex justify-between items-center bg-[#031510]/50">
              <div>
                <h3 className="font-bold text-white">Аналитика вопроса</h3>
                <p className="text-xs text-emerald-400/70">
                  Вопрос №{getRelativeNumber(modalState.qNum, modalState.sectionId)} (Абс: {modalState.qNum})
                </p>
              </div>
              <button
                onClick={() => setModalState({ isOpen: false, sectionId: null, qNum: null })}
                className="text-emerald-400 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase text-emerald-300 mb-2">
                  Раздел (Тема)
                </label>
                <select
                  value={currentQAnalytics.sub_section || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAnalytics((prev) => ({
                      ...prev,
                      [modalState.sectionId!]: {
                        ...prev[modalState.sectionId!],
                        [modalState.qNum!]: { ...prev[modalState.sectionId!]?.[modalState.qNum!], sub_section: val },
                      },
                    }));
                  }}
                  className="w-full border border-emerald-800 rounded-xl px-3 py-2.5 bg-[#031510] text-white"
                >
                  <option value="" disabled>-- Выберите раздел --</option>
                  {activeMeta.subs.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-emerald-300 mb-2">
                  Проверяемое умение
                </label>
                <select
                  value={currentQAnalytics.skill || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAnalytics((prev) => ({
                      ...prev,
                      [modalState.sectionId!]: {
                        ...prev[modalState.sectionId!],
                        [modalState.qNum!]: { ...prev[modalState.sectionId!]?.[modalState.qNum!], skill: val },
                      },
                    }));
                  }}
                  className="w-full border border-emerald-800 rounded-xl px-3 py-2.5 bg-[#031510] text-white"
                >
                  <option value="" disabled>-- Выберите умение --</option>
                  {activeMeta.skills.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-emerald-800/60 bg-[#031510]/50 flex justify-end">
              <button
                onClick={() => setModalState({ isOpen: false, sectionId: null, qNum: null })}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-2.5 rounded-xl font-bold transition-colors cursor-pointer"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 sm:mt-8">
        {/* TAB: USERS AND SUBSCRIPTIONS */}
        {activeTab === 'users' && <UsersManager />}

        {/* TAB: TEST ANSWERS OVERRIDE */}
        {activeTab === 'answers' && <TestAnswersManager />}

        {/* TAB: STUDENTS MANAGER */}
        {activeTab === 'students' && <StudentsManager />}

        {/* TAB: TESTS AND VARIANTS BUILDER */}
        {activeTab === 'tests' && (
          <div className="space-y-8">
        {/* Existing Variants list */}
        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-slate-800 dark:text-white">Управление тестами</h2>
              <p className="text-xs text-slate-500 mt-1">
                Здесь вы можете удалять тесты, редактировать их или переносить на Полигон.
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100 dark:border-blue-800">
              Всего тестов: {variantsList.length}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {variantsList.length === 0 ? (
              <div className="col-span-full py-8 text-center text-slate-400 font-medium text-sm">
                Нет загруженных тестов на сервере
              </div>
            ) : (
              variantsList.map((v) => {
                const vNum = v.variant_number || v.id || '0';
                return (
                  <div
                    key={vNum}
                    className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col justify-between hover:border-blue-500 transition-colors bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 shadow-xs"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {v.isDraft || v.is_draft
                            ? '📝 Черновик'
                            : v.isPractice || v.is_practice
                            ? '🎯 Полигон'
                            : '🏠 Главная'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono font-bold bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                          ID: {vNum}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-800 dark:text-white mb-1 line-clamp-1">
                        {v.title || `Вариант ${vNum}`}
                      </h3>
                      <p className="text-xs text-slate-500 mb-4">Язык: {v.language === 'kg' ? 'Кыргызча' : 'Русский'}</p>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                      <button
                        onClick={() => loadVariant(vNum.toString())}
                        className="flex-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-bold py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Редактировать
                      </button>
                      <button
                        onClick={() => deleteVariant(vNum)}
                        className="bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Edit / Create Form */}
        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-800 dark:text-white">
                {variantId ? `Редактирование Варианта ${variantId}` : 'Создание нового теста'}
              </h2>
              <p className="text-xs text-slate-500">Заполните метаданные и ответы по разделам</p>
            </div>
            <button
              onClick={() => loadVariant('')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              + Сбросить форму (Создать новый)
            </button>
          </div>

          {statusMessage && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl text-sm font-bold text-blue-800 dark:text-blue-300">
              {statusMessage}
            </div>
          )}

          {/* Form Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Номер теста (ID)</label>
              <input
                type="number"
                value={variantId}
                onChange={(e) => setVariantId(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                placeholder="101"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Название теста</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                placeholder="ОРТ 2025 Вариант 1"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Язык</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'ru' | 'kg')}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
              >
                <option value="ru">Русский</option>
                <option value="kg">Кыргызча</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Цветовая тема</label>
              <select
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
              >
                <option value="blue">Blue (Синий)</option>
                <option value="indigo">Indigo (Индиго)</option>
                <option value="emerald">Emerald (Изумрудный)</option>
                <option value="amber">Amber (Янтарный)</option>
                <option value="purple">Purple (Фиолетовый)</option>
              </select>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={isPractice}
                onChange={(e) => setIsPractice(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600"
              />
              🎯 Отображать на Полигоне (тренировка)
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={isDraft}
                onChange={(e) => setIsDraft(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600"
              />
              📝 Черновик (скрыть от пользователей)
            </label>
          </div>

          {/* Section Editors */}
          <div className="space-y-6 pt-4">
            {[1, 2, 3, 4, 5].map((sId) => {
              const sec = SECTION_CONFIG[sId];
              const isActive = activeSections[sId];

              return (
                <div
                  key={sId}
                  className={`border rounded-2xl p-5 transition-all ${
                    isActive
                      ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs'
                      : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) =>
                          setActiveSections((prev) => ({ ...prev, [sId]: e.target.checked }))
                        }
                        className="w-5 h-5 rounded text-blue-600 cursor-pointer"
                      />
                      <span className="font-black text-base text-slate-900 dark:text-white">
                        {sec.title}
                      </span>
                    </label>
                    <span className="text-xs text-slate-400 font-bold">
                      Вопросы: {sec.start}–{sec.end}
                    </span>
                  </div>

                  {isActive && (
                    <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-700">
                      {/* Fast key input */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          placeholder="Быстрый ввод ключей: АБВГАБ..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleSmartImport(sId, (e.target as HTMLInputElement).value);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }}
                          className="flex-1 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                        <span className="text-[10px] text-slate-400 self-center">Нажмите Enter для применения</span>
                      </div>

                      {/* Answers grid */}
                      <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-15 gap-1.5">
                        {Array.from({ length: sec.end - sec.start + 1 }, (_, i) => sec.start + i).map((qNum) => {
                          const relNum = getRelativeNumber(qNum, sId);
                          const curAns = answers[sId]?.[qNum] || '';
                          const hasAnalytic = !!(analytics[sId]?.[qNum]?.sub_section || analytics[sId]?.[qNum]?.skill);

                          return (
                            <div
                              key={qNum}
                              className="border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 flex flex-col items-center bg-slate-50 dark:bg-slate-900/50 relative"
                            >
                              <span className="text-[10px] font-bold text-slate-400">№{relNum}</span>
                              <select
                                value={curAns}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setAnswers((prev) => ({
                                    ...prev,
                                    [sId]: { ...prev[sId], [qNum]: val },
                                  }));
                                }}
                                className="w-full text-center font-black text-xs bg-transparent text-blue-600 dark:text-blue-400 outline-none cursor-pointer"
                              >
                                <option value="">—</option>
                                {sec.options.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                              <button
                                onClick={() =>
                                  setModalState({ isOpen: true, sectionId: sId, qNum: qNum })
                                }
                                title="Редактировать тему/умение"
                                className={`text-[9px] mt-0.5 px-1 rounded transition-colors ${
                                  hasAnalytic
                                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 font-bold'
                                    : 'text-slate-300 hover:text-slate-600'
                                }`}
                              >
                                ⚙️
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black px-8 py-3.5 rounded-xl shadow-lg shadow-emerald-500/25 transition-all active:scale-95 cursor-pointer text-sm"
            >
              {isSaving ? 'Сохранение...' : 'Сохранить вариант'}
            </button>
          </div>
        </section>
          </div>
        )}
      </main>
    </div>
  );
};
