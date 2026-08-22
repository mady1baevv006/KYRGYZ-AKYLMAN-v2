import React, { useState, useMemo } from 'react';
import { Calculator, Award, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { AppLanguage } from '../types';
import { calculateOrtMainScore, calculateOrtSubjectScore, OrtSectionInput, SubjectType } from '../utils/ortCalculator';

interface OrtScoreCalculatorProps {
  lang?: AppLanguage;
}

export const OrtScoreCalculator: React.FC<OrtScoreCalculatorProps> = ({ lang = 'ru' }) => {
  const isKg = lang === 'kg';

  // 5 Main Section correct answers (0-30 each)
  const [sections, setSections] = useState<OrtSectionInput>({
    math1: 22,
    math2: 24,
    analogies: 23,
    reading: 24,
    grammar: 25,
  });

  // Up to 2 Subject Tests
  const [subject1Enabled, setSubject1Enabled] = useState(false);
  const [subject1Name, setSubject1Name] = useState<SubjectType>('english');
  const [subject1Correct, setSubject1Correct] = useState(30);

  const [subject2Enabled, setSubject2Enabled] = useState(false);
  const [subject2Name, setSubject2Name] = useState<SubjectType>('chemistry');
  const [subject2Correct, setSubject2Correct] = useState(28);

  const subject1Max = subject1Name === 'english' ? 50 : 40;
  const subject2Max = subject2Name === 'english' ? 50 : 40;

  const handleSectionChange = (field: keyof OrtSectionInput, value: number) => {
    setSections((prev) => ({
      ...prev,
      [field]: Math.max(0, Math.min(30, value)),
    }));
  };

  const handleSubject1Change = (name: SubjectType) => {
    setSubject1Name(name);
    const newMax = name === 'english' ? 50 : 40;
    setSubject1Correct((prev) => Math.min(prev, newMax));
  };

  const handleSubject2Change = (name: SubjectType) => {
    setSubject2Name(name);
    const newMax = name === 'english' ? 50 : 40;
    setSubject2Correct((prev) => Math.min(prev, newMax));
  };

  const mainResult = useMemo(() => calculateOrtMainScore(sections), [sections]);
  const subject1Result = useMemo(
    () => calculateOrtSubjectScore(subject1Correct, subject1Name),
    [subject1Correct, subject1Name]
  );
  const subject2Result = useMemo(
    () => calculateOrtSubjectScore(subject2Correct, subject2Name),
    [subject2Correct, subject2Name]
  );

  const subjectLabels: Record<SubjectType, { ru: string; kg: string }> = {
    english: { ru: 'Английский язык (50)', kg: 'Англис тили (50)' },
    chemistry: { ru: 'Химия (40)', kg: 'Химия (40)' },
    biology: { ru: 'Биология (40)', kg: 'Биология (40)' },
    physics: { ru: 'Физика (40)', kg: 'Физика (40)' },
    history: { ru: 'История (40)', kg: 'Тарых (40)' },
    math_ext: { ru: 'Математика проф. (40)', kg: 'Математика тереңд. (40)' },
  };

  return (
    <section
      id="ort-calculator"
      className="relative z-20 py-12 sm:py-16 px-3 sm:px-6 bg-transparent"
    >
      <div className="max-w-5xl mx-auto">
        {/* Card Container */}
        <div className="relative rounded-3xl bg-[#06261d] border border-emerald-700/60 p-5 sm:p-8 md:p-10 shadow-2xl shadow-emerald-950/80 overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 text-center max-w-2xl mx-auto mb-8 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-black uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isKg ? 'ОРТ Балл Калькулятору' : 'Калькулятор баллов ОРТ'}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {isKg ? (
                <>
                  Баллыңызды{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400">
                    так эсептеңиз
                  </span>
                </>
              ) : (
                <>
                  Рассчитай свой{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400">
                    точный балл ОРТ
                  </span>
                </>
              )}
            </h2>

            <p className="text-xs sm:text-sm text-emerald-200/75 leading-relaxed">
              {isKg
                ? 'ЦООМОнун шкаласы боюнча 5 негизги бөлүм жана предметтик тесттердин упайларын эсептөө.'
                : 'Алгоритм шкалирования ЦООМО по 5 разделам основного теста и предметным тестам.'}
            </p>
          </div>

          {/* Main Grid: Inputs (Left) & Live Results Display (Right) */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: 5 Main Sections Sliders & Subject Test Selectors */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-[#041a14] border border-emerald-800/60 rounded-2xl p-4 sm:p-5 space-y-4 shadow-inner">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-800/50">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                    {isKg ? 'Негизги тесттин 5 бөлүмү' : '5 разделов Основного теста'}
                  </span>
                  <span className="text-[11px] text-emerald-300/70 font-semibold">
                    {isKg ? 'Бөлүмдө 30дан суроо' : 'по 30 вопросов'}
                  </span>
                </div>

                {/* Section 1: Math 1 */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-300 text-[11px] font-black flex items-center justify-center">1</span>
                      {isKg ? 'Математика I бөлүк' : 'Математика I часть'}
                    </span>
                    <span className="font-black text-emerald-300 text-sm">
                      {sections.math1} <span className="text-emerald-400/50 text-xs font-normal">/ 30</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={sections.math1}
                    onChange={(e) => handleSectionChange('math1', Number(e.target.value))}
                    className="w-full accent-emerald-400 bg-emerald-950/80 h-2 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Section 2: Math 2 */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-300 text-[11px] font-black flex items-center justify-center">2</span>
                      {isKg ? 'Математика II бөлүк' : 'Математика II часть'}
                    </span>
                    <span className="font-black text-emerald-300 text-sm">
                      {sections.math2} <span className="text-emerald-400/50 text-xs font-normal">/ 30</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={sections.math2}
                    onChange={(e) => handleSectionChange('math2', Number(e.target.value))}
                    className="w-full accent-emerald-400 bg-emerald-950/80 h-2 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Section 3: Analogies */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-300 text-[11px] font-black flex items-center justify-center">3</span>
                      {isKg ? 'Окшоштуктар жана сүйлөм толуктоо' : 'Аналогии и дополнение предложений'}
                    </span>
                    <span className="font-black text-emerald-300 text-sm">
                      {sections.analogies} <span className="text-emerald-400/50 text-xs font-normal">/ 30</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={sections.analogies}
                    onChange={(e) => handleSectionChange('analogies', Number(e.target.value))}
                    className="w-full accent-emerald-400 bg-emerald-950/80 h-2 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Section 4: Reading */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-300 text-[11px] font-black flex items-center justify-center">4</span>
                      {isKg ? 'Окуу жана түшүнүү' : 'Чтение и понимание текста'}
                    </span>
                    <span className="font-black text-emerald-300 text-sm">
                      {sections.reading} <span className="text-emerald-400/50 text-xs font-normal">/ 30</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={sections.reading}
                    onChange={(e) => handleSectionChange('reading', Number(e.target.value))}
                    className="w-full accent-emerald-400 bg-emerald-950/80 h-2 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Section 5: Grammar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-300 text-[11px] font-black flex items-center justify-center">5</span>
                      {isKg ? 'Эне тилдин практикалык грамматикасы' : 'Практическая грамматика языка'}
                    </span>
                    <span className="font-black text-emerald-300 text-sm">
                      {sections.grammar} <span className="text-emerald-400/50 text-xs font-normal">/ 30</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={sections.grammar}
                    onChange={(e) => handleSectionChange('grammar', Number(e.target.value))}
                    className="w-full accent-emerald-400 bg-emerald-950/80 h-2 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Subject Test 1 */}
              <div className="bg-[#041a14] border border-emerald-800/60 rounded-2xl p-4 shadow-inner space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={subject1Enabled}
                      onChange={(e) => setSubject1Enabled(e.target.checked)}
                      className="w-4 h-4 rounded-md accent-emerald-400 cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {isKg ? `+ 1-предметтик тест (${subject1Max} суроо)` : `+ 1-й предметный тест (${subject1Max} вопр.)`}
                    </span>
                  </label>
                  {subject1Enabled && (
                    <span className="text-xs font-black text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-700/60">
                      {subject1Result.scaled} {isKg ? 'балл' : 'баллов'}
                    </span>
                  )}
                </div>

                {subject1Enabled && (
                  <div className="pt-2 border-t border-emerald-800/40 space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {(Object.keys(subjectLabels) as SubjectType[]).map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleSubject1Change(key)}
                          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-left transition-all cursor-pointer ${
                            subject1Name === key
                              ? 'bg-emerald-500 text-slate-950 shadow-sm'
                              : 'bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-200/80 border border-emerald-800/60'
                          }`}
                        >
                          {isKg ? subjectLabels[key].kg : subjectLabels[key].ru}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-emerald-200/80">
                          {isKg ? 'Туура жооптор:' : 'Правильных ответов:'}
                        </span>
                        <span className="font-black text-white">
                          {subject1Correct} <span className="text-emerald-400/50 text-[10px]">/ {subject1Max}</span>
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={subject1Max}
                        value={subject1Correct}
                        onChange={(e) => setSubject1Correct(Number(e.target.value))}
                        className="w-full accent-teal-400 bg-emerald-950/80 h-2 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Subject Test 2 */}
              <div className="bg-[#041a14] border border-emerald-800/60 rounded-2xl p-4 shadow-inner space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={subject2Enabled}
                      onChange={(e) => setSubject2Enabled(e.target.checked)}
                      className="w-4 h-4 rounded-md accent-teal-400 cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {isKg ? `+ 2-предметтик тест (${subject2Max} суроо)` : `+ 2-й предметный тест (${subject2Max} вопр.)`}
                    </span>
                  </label>
                  {subject2Enabled && (
                    <span className="text-xs font-black text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded-lg border border-teal-700/60">
                      {subject2Result.scaled} {isKg ? 'балл' : 'баллов'}
                    </span>
                  )}
                </div>

                {subject2Enabled && (
                  <div className="pt-2 border-t border-emerald-800/40 space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {(Object.keys(subjectLabels) as SubjectType[]).map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleSubject2Change(key)}
                          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-left transition-all cursor-pointer ${
                            subject2Name === key
                              ? 'bg-teal-500 text-slate-950 shadow-sm'
                              : 'bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-200/80 border border-emerald-800/60'
                          }`}
                        >
                          {isKg ? subjectLabels[key].kg : subjectLabels[key].ru}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-emerald-200/80">
                          {isKg ? 'Туура жооптор:' : 'Правильных ответов:'}
                        </span>
                        <span className="font-black text-white">
                          {subject2Correct} <span className="text-teal-400/50 text-[10px]">/ {subject2Max}</span>
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={subject2Max}
                        value={subject2Correct}
                        onChange={(e) => setSubject2Correct(Number(e.target.value))}
                        className="w-full accent-teal-400 bg-emerald-950/80 h-2 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Live Result Box (Emerald Styled) */}
            <div className="lg:col-span-5 bg-gradient-to-b from-[#07362a] via-[#05281e] to-[#041d16] border-2 border-emerald-400/70 rounded-3xl p-5 sm:p-6 shadow-xl shadow-emerald-500/10 space-y-5">
              {/* Score Header */}
              <div className="text-center space-y-1">
                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-300">
                  {isKg ? 'Негизги тесттин баллы' : 'Балл Основного теста'}
                </span>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl sm:text-6xl font-black text-white tracking-tight drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                    {mainResult.scaledScore}
                  </span>
                  <span className="text-sm font-bold text-emerald-300/70">
                    {isKg ? '/ 245 балл' : '/ 245 баллов'}
                  </span>
                </div>
              </div>

              {/* Progress and Stats */}
              <div className="space-y-3 text-xs">
                {/* Raw Answers & Accuracy */}
                <div className="flex items-center justify-between text-emerald-100 font-semibold pb-2 border-b border-emerald-800/50">
                  <span>{isKg ? 'Туура жооптор:' : 'Верных ответов:'}</span>
                  <span className="font-black text-white">
                    {mainResult.rawTotal} из 150 ({mainResult.percentage}%)
                  </span>
                </div>

                {/* Key Threshold Milestones */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-emerald-300/80 block">
                    {isKg ? 'Баллдык чектер:' : 'Пороговые значения:'}
                  </span>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${
                      mainResult.thresholds.contract
                        ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200'
                        : 'bg-black/30 border-emerald-900/40 text-emerald-500/60'
                    }`}>
                      <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${mainResult.thresholds.contract ? 'text-emerald-400' : 'text-emerald-800'}`} />
                      <span>{isKg ? 'Порог (110)' : 'Порог (110)'}</span>
                    </div>

                    <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${
                      mainResult.thresholds.budget
                        ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200'
                        : 'bg-black/30 border-emerald-900/40 text-emerald-500/60'
                    }`}>
                      <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${mainResult.thresholds.budget ? 'text-emerald-400' : 'text-emerald-800'}`} />
                      <span>{isKg ? 'Бюджет (180+)' : 'Бюджет (180+)'}</span>
                    </div>

                    <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${
                      mainResult.thresholds.prestige
                        ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200'
                        : 'bg-black/30 border-emerald-900/40 text-emerald-500/60'
                    }`}>
                      <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${mainResult.thresholds.prestige ? 'text-emerald-400' : 'text-emerald-800'}`} />
                      <span>{isKg ? 'Топ-ЖОЖ (200+)' : 'Топ-ВУЗ (200+)'}</span>
                    </div>

                    <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${
                      mainResult.thresholds.gold
                        ? 'bg-amber-950/50 border-amber-400/60 text-amber-200'
                        : 'bg-black/30 border-emerald-900/40 text-emerald-500/60'
                    }`}>
                      <Award className={`w-3.5 h-3.5 shrink-0 ${mainResult.thresholds.gold ? 'text-amber-300' : 'text-emerald-800'}`} />
                      <span>{isKg ? 'Алтын (230+)' : 'Золотой (230+)'}</span>
                    </div>
                  </div>
                </div>

                {/* Subject Test 1 Live Result */}
                {subject1Enabled && (
                  <div className="pt-2.5 border-t border-emerald-800/50 flex items-center justify-between text-xs text-emerald-200">
                    <span className="truncate pr-2 font-medium">
                      1. {isKg ? subjectLabels[subject1Name].kg : subjectLabels[subject1Name].ru}:
                    </span>
                    <span className="font-black text-white bg-emerald-900/70 px-2 py-0.5 rounded-md border border-emerald-600/60 shrink-0">
                      {subject1Result.scaled} / 150 {subject1Result.passed ? '✅' : '❌'}
                    </span>
                  </div>
                )}

                {/* Subject Test 2 Live Result */}
                {subject2Enabled && (
                  <div className="pt-2 border-t border-emerald-800/40 flex items-center justify-between text-xs text-teal-200">
                    <span className="truncate pr-2 font-medium">
                      2. {isKg ? subjectLabels[subject2Name].kg : subjectLabels[subject2Name].ru}:
                    </span>
                    <span className="font-black text-white bg-teal-900/70 px-2 py-0.5 rounded-md border border-teal-600/60 shrink-0">
                      {subject2Result.scaled} / 150 {subject2Result.passed ? '✅' : '❌'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
