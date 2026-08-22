import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  CheckCircle2,
  RotateCcw,
  Save,
  Sparkles,
  Layers,
  HelpCircle,
  AlertCircle,
  Check,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { FALLBACK_VARIANTS } from '../../data/fallbackVariants';
import { getFallbackQuestions } from '../../data/fallbackQuestions';
import {
  getCustomAnswerKeys,
  saveCustomAnswerKeys,
  resetCustomAnswersForVariant,
  CustomAnswerKeysRecord,
} from '../../data/testAnswersManager';
import { SECTION_NAMES } from '../../data/constants';

interface SectionConfig {
  id: number;
  name: string;
  startQ: number;
  endQ: number;
  options: ('А' | 'Б' | 'В' | 'Г' | 'Д')[];
}

const SECTIONS_CONFIG: SectionConfig[] = [
  {
    id: 1,
    name: 'Математика I (30 вопросов)',
    startQ: 1,
    endQ: 30,
    options: ['А', 'Б', 'В', 'Г'],
  },
  {
    id: 2,
    name: 'Математика II (30 вопросов)',
    startQ: 31,
    endQ: 60,
    options: ['А', 'Б', 'В', 'Г', 'Д'],
  },
  {
    id: 3,
    name: 'Аналогии и дополнения (30 вопросов)',
    startQ: 61,
    endQ: 90,
    options: ['А', 'Б', 'В', 'Г'],
  },
  {
    id: 4,
    name: 'Чтение и понимание (30 вопросов)',
    startQ: 91,
    endQ: 120,
    options: ['А', 'Б', 'В', 'Г'],
  },
  {
    id: 5,
    name: 'Практическая грамматика (30 вопросов)',
    startQ: 121,
    endQ: 150,
    options: ['А', 'Б', 'В', 'Г'],
  },
];

export const TestAnswersManager: React.FC = () => {
  const [selectedVariantId, setSelectedVariantId] = useState<number>(1);
  const [selectedSectionId, setSelectedSectionId] = useState<number>(1);
  const [currentKeys, setCurrentKeys] = useState<Record<number, string>>({});
  const [originalDefaultKeys, setOriginalDefaultKeys] = useState<Record<number, string>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load questions and answers for selected variant
  useEffect(() => {
    const rawQuestions = getFallbackQuestions(selectedVariantId);
    const defaults: Record<number, string> = {};
    rawQuestions.forEach((q) => {
      defaults[q.question_number] = q.correct_answer;
    });
    setOriginalDefaultKeys(defaults);

    const allCustom = getCustomAnswerKeys();
    const vCustom = allCustom[selectedVariantId.toString()] || {};

    const merged: Record<number, string> = {};
    for (let i = 1; i <= 150; i++) {
      merged[i] = vCustom[i] || defaults[i] || (i > 30 && i <= 60 ? 'А' : 'А');
    }
    setCurrentKeys(merged);
    setHasUnsavedChanges(false);
  }, [selectedVariantId]);

  const activeSection =
    SECTIONS_CONFIG.find((s) => s.id === selectedSectionId) || SECTIONS_CONFIG[0];

  const handleSelectOption = (qNum: number, letter: string) => {
    setCurrentKeys((prev) => {
      const next = { ...prev, [qNum]: letter };
      return next;
    });
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    const allCustom = getCustomAnswerKeys();
    const vKey = selectedVariantId.toString();
    allCustom[vKey] = { ...currentKeys };
    saveCustomAnswerKeys(allCustom);

    setHasUnsavedChanges(false);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);
  };

  const handleResetToDefault = () => {
    if (
      !window.confirm(
        `Сбросить все ответы для Варианта ЦООМО №${selectedVariantId} к заводским ключам?`
      )
    ) {
      return;
    }

    resetCustomAnswersForVariant(selectedVariantId);
    const rawQuestions = getFallbackQuestions(selectedVariantId);
    const defaults: Record<number, string> = {};
    rawQuestions.forEach((q) => {
      defaults[q.question_number] = q.correct_answer;
    });
    setCurrentKeys(defaults);
    setHasUnsavedChanges(false);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2000);
  };

  // Count how many questions in active section are customized
  const sectionQuestions: number[] = [];
  for (let q = activeSection.startQ; q <= activeSection.endQ; q++) {
    sectionQuestions.push(q);
  }

  const customCountInVariant = Object.keys(currentKeys).filter(
    (qNum) =>
      originalDefaultKeys[Number(qNum)] &&
      currentKeys[Number(qNum)] !== originalDefaultKeys[Number(qNum)]
  ).length;

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="rounded-3xl bg-[#06261d] border border-emerald-800/60 p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-black uppercase tracking-wider mb-2">
              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Редактор ключей пробных тестов</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Правильные ответы пробных вариантов ОРТ
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/70 mt-1 max-w-2xl">
              Здесь вы можете изменить правильный ответ (ключ) для любого вопроса любого варианта. Изменения мгновенно применяются при прохождении теста и подсчете баллов учеников.
            </p>
          </div>

          {/* Quick Action buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-rose-950/40 border border-emerald-700/50 hover:border-rose-500/50 text-xs font-bold text-slate-300 hover:text-rose-300 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Сбросить к исходным</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className={`px-5 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 shadow-lg cursor-pointer active:scale-95 ${
                hasUnsavedChanges
                  ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 text-slate-950 shadow-amber-500/25 animate-pulse'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{hasUnsavedChanges ? 'Сохранить изменения *' : 'Сохранить ключи'}</span>
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Ключи ответов успешно сохранены! Все тесты будут проверяться по новым ответам.</span>
          </div>
        )}
      </div>

      {/* Variant Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-emerald-300/80 mr-1">Вариант:</span>
        {FALLBACK_VARIANTS.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setSelectedVariantId(Number(v.id))}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              selectedVariantId === Number(v.id)
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20 scale-[1.02]'
                : 'bg-[#06261d] text-emerald-200/80 hover:text-white border border-emerald-800/70 hover:border-emerald-600'
            }`}
          >
            <span>{v.title}</span>
            {selectedVariantId === Number(v.id) && (
              <span className="w-2 h-2 rounded-full bg-slate-950" />
            )}
          </button>
        ))}
      </div>

      {/* Section Selector Sub-tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
        {SECTIONS_CONFIG.map((sec) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => setSelectedSectionId(sec.id)}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedSectionId === sec.id
                ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-md'
                : 'bg-[#041a14] border-emerald-900/60 text-emerald-200/70 hover:text-white hover:border-emerald-700/60'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">
              Раздел {sec.id}
            </span>
            <div className="font-bold text-xs leading-tight">{sec.name}</div>
          </button>
        ))}
      </div>

      {/* Answer Key Grid for Selected Section */}
      <div className="bg-[#06261d] border border-emerald-800/60 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-emerald-800/60">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>{activeSection.name}</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-lg border border-emerald-800">
                Вопросы {activeSection.startQ} – {activeSection.endQ}
              </span>
            </h3>
            <p className="text-xs text-emerald-200/60 mt-0.5">
              Нажмите на букву (А, Б, В, Г, Д), чтобы установить её как правильный ответ:
            </p>
          </div>

          {customCountInVariant > 0 && (
            <div className="text-xs text-amber-300 font-bold bg-amber-400/15 border border-amber-400/30 px-3 py-1 rounded-xl">
              Изменено ответов: {customCountInVariant}
            </div>
          )}
        </div>

        {/* Questions Answers Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {sectionQuestions.map((qNum) => {
            const currentSelected = currentKeys[qNum] || 'А';
            const defaultKey = originalDefaultKeys[qNum];
            const isModified = defaultKey && currentSelected !== defaultKey;

            return (
              <div
                key={qNum}
                className={`p-3 rounded-2xl border transition-all ${
                  isModified
                    ? 'bg-amber-950/20 border-amber-400/60 shadow-xs'
                    : 'bg-[#031510] border-emerald-900/80 hover:border-emerald-700/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-lg bg-emerald-950 border border-emerald-700/60 text-emerald-300 font-black text-xs flex items-center justify-center">
                      {qNum}
                    </span>
                    <span className="text-[11px] font-bold text-slate-300">Вопрос</span>
                  </div>

                  <span className="text-xs font-black text-emerald-400">
                    {currentSelected}
                    {isModified && (
                      <span className="ml-1 text-[10px] text-amber-400 font-bold" title="Изменено админом">
                        (изм.)
                      </span>
                    )}
                  </span>
                </div>

                {/* Option letter buttons */}
                <div className="grid grid-cols-4 gap-1.5">
                  {activeSection.options.map((opt) => {
                    const isChosen = currentSelected === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleSelectOption(qNum, opt)}
                        className={`py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                          isChosen
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20 scale-105'
                            : 'bg-white/5 hover:bg-white/10 text-emerald-200/80 hover:text-white border border-emerald-900/60'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Save Bar */}
        <div className="mt-6 pt-4 border-t border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-emerald-200/60">
            После сохранения все результаты тестирования учеников будут автоматически пересчитываться с учетом новых ключей.
          </span>
          <button
            type="button"
            onClick={handleSave}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Сохранить ключи ответов</span>
          </button>
        </div>
      </div>
    </div>
  );
};
