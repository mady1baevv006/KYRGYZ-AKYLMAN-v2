import React, { useState, useEffect } from 'react';
import {
  FRACTION_EXERCISES_LIST,
  FractionExerciseItem
} from '../data/fractionExercisesData';
import {
  generateFractionProblem,
  verifyFractionProblem,
  ExerciseProblem,
  VerificationResult
} from '../utils/fractionEngine';
import {
  Calculator,
  ArrowRight,
  BookOpen,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronLeft,
  GraduationCap,
  Sparkles,
  Award,
  Layers,
  ArrowRightLeft
} from 'lucide-react';

interface FractionExercisesModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ru' | 'kg';
  initialExerciseId?: string;
}

export const FractionExercisesModal: React.FC<FractionExercisesModalProps> = ({
  isOpen,
  onClose,
  lang,
  initialExerciseId
}) => {
  const [selectedExercise, setSelectedExercise] = useState<FractionExerciseItem | null>(null);
  const [currentProblem, setCurrentProblem] = useState<ExerciseProblem | null>(null);
  const [activeTab, setActiveTab] = useState<'practice' | 'instruction' | 'theory'>('practice');

  // User input states
  const [inputC, setInputC] = useState('');
  const [inputN, setInputN] = useState('');
  const [inputD, setInputD] = useState('');
  const [inputOp, setInputOp] = useState<'<' | '=' | '>' | ''>('');
  const [inputN2, setInputN2] = useState('');
  const [inputD2, setInputD2] = useState('');

  // Stats
  const [solvedCount, setSolvedCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [maxPossibleScore, setMaxPossibleScore] = useState(0);

  // Result state
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialExerciseId) {
        const item = FRACTION_EXERCISES_LIST.find((e) => e.id === initialExerciseId);
        if (item) {
          handleSelectExercise(item);
          return;
        }
      }
      if (!selectedExercise) {
        handleSelectExercise(FRACTION_EXERCISES_LIST[0]);
      }
    }
  }, [isOpen, initialExerciseId]);

  const handleSelectExercise = (item: FractionExerciseItem) => {
    setSelectedExercise(item);
    setActiveTab('practice');
    setResult(null);
    setSolvedCount(0);
    setTotalAttempts(0);
    setTotalScore(0);
    setMaxPossibleScore(0);
    loadNextProblem(item.id);
  };

  const loadNextProblem = (exerciseId: string) => {
    const p = generateFractionProblem(exerciseId);
    setCurrentProblem(p);
    setInputC('');
    setInputN('');
    setInputD('');
    setInputOp('');
    setInputN2('');
    setInputD2('');
    setResult(null);
    setIsChecking(false);
  };

  const handleNext = () => {
    if (!selectedExercise) return;
    loadNextProblem(selectedExercise.id);
  };

  const handleVerify = () => {
    if (!currentProblem) return;

    const res = verifyFractionProblem(currentProblem, {
      c: inputC,
      n: inputN,
      d: inputD,
      op: inputOp,
      n2: inputN2,
      d2: inputD2
    });

    setResult(res);
    setTotalAttempts((prev) => prev + 1);
    if (res.isCorrect) {
      setSolvedCount((prev) => prev + 1);
    }
    setTotalScore((prev) => prev + res.score);
    setMaxPossibleScore((prev) => prev + res.maxScore);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 animate-fade-in">
      <div className="relative w-full max-w-5xl bg-[#031510] border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-500/20 bg-gradient-to-r from-emerald-950/40 via-[#042017]/60 to-emerald-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
                  {lang === 'kg' ? 'Математикалык көнүгүүлөр' : 'Математические упражнения'}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  OnlineMSchool Engine
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white leading-tight">
                {selectedExercise ? (lang === 'kg' ? selectedExercise.titleKg : selectedExercise.title) : (lang === 'kg' ? 'Бөлчөктөр' : 'Дроби')}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Sidebar with all 16 exercises */}
          <div className="lg:col-span-4 border-r border-emerald-500/10 bg-[#02100c]/80 overflow-y-auto max-h-[220px] lg:max-h-none p-3 space-y-1.5 custom-scrollbar">
            <div className="px-3 py-1.5 text-xs font-semibold text-white/50 uppercase tracking-wider">
              {lang === 'kg' ? 'Көнүгүүлөр тизмеси (16)' : 'Темы упражнений (16)'}
            </div>
            {FRACTION_EXERCISES_LIST.map((item, index) => {
              const isSelected = selectedExercise?.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectExercise(item)}
                  className={`w-full text-left p-3 rounded-2xl transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-600/30 to-emerald-500/10 border border-emerald-500/40 text-white shadow-lg shadow-emerald-950/50'
                      : 'hover:bg-white/5 text-white/70 hover:text-white border border-transparent'
                  }`}
                >
                  <span
                    className={`flex-shrink-0 w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                      isSelected
                        ? 'bg-emerald-500 text-black'
                        : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs md:text-sm font-semibold truncate">
                      {lang === 'kg' ? item.titleKg.replace(/^Көнүгүүлөр\.\s*/, '') : item.title.replace(/^Упражнения\.\s*/, '')}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Main workspace */}
          <div className="lg:col-span-8 overflow-y-auto p-4 md:p-6 flex flex-col justify-between space-y-4">
            {/* Nav tabs: Practice / Instruction / Theory */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-2xl border border-white/10">
                <button
                  onClick={() => setActiveTab('practice')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'practice'
                      ? 'bg-emerald-500 text-black shadow-md font-bold'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Calculator className="w-3.5 h-3.5" />
                  {lang === 'kg' ? 'Тапшырма' : 'Задание'}
                </button>
                <button
                  onClick={() => setActiveTab('instruction')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'instruction'
                      ? 'bg-emerald-500 text-black shadow-md font-bold'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  {lang === 'kg' ? 'Көрсөтмө' : 'Инструкция'}
                </button>
                <button
                  onClick={() => setActiveTab('theory')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'theory'
                      ? 'bg-emerald-500 text-black shadow-md font-bold'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  {lang === 'kg' ? 'Теория' : 'Теория'}
                </button>
              </div>

              {/* Solved stats badge */}
              <div className="flex items-center gap-3 text-xs md:text-sm bg-emerald-950/30 px-3 py-1.5 rounded-2xl border border-emerald-500/20">
                <div>
                  <span className="text-white/60">{lang === 'kg' ? 'Чыгарылды' : 'Решено'}: </span>
                  <span className="font-bold text-emerald-400">{solvedCount}</span>
                  <span className="text-white/40"> / {totalAttempts}</span>
                </div>
                {maxPossibleScore > 0 && (
                  <div className="border-l border-white/10 pl-3">
                    <span className="text-white/60">{lang === 'kg' ? 'Балл' : 'Баллы'}: </span>
                    <span className="font-bold text-emerald-300">{totalScore}</span>
                    <span className="text-white/40"> / {maxPossibleScore}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tab: Instruction */}
            {activeTab === 'instruction' && selectedExercise && (
              <div className="bg-[#05261c]/50 border border-emerald-500/20 rounded-3xl p-6 text-white space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                  <HelpCircle className="w-5 h-5" />
                  {lang === 'kg' ? 'Тапшырманы аткаруу боюнча колдонмо' : 'Инструкция по решению упражнения'}
                </div>
                <p className="text-sm md:text-base leading-relaxed text-white/90 whitespace-pre-line">
                  {lang === 'kg' ? selectedExercise.instructionKg : selectedExercise.instruction}
                </p>
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs md:text-sm flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-400" />
                  <span>
                    {lang === 'kg'
                      ? 'Көңүл буруңуз: «Кийинки мисал» баскычын баскандан кийин учурдагы мисал жабылат жана ага кайтуу мүмкүн эмес.'
                      : 'Внимание: При переходе к новому заданию кнопкой «Следующий пример» этот пример станет недоступным.'}
                  </span>
                </div>
              </div>
            )}

            {/* Tab: Theory */}
            {activeTab === 'theory' && selectedExercise && (
              <div className="bg-[#05261c]/50 border border-emerald-500/20 rounded-3xl p-6 text-white space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                  <BookOpen className="w-5 h-5" />
                  {lang === 'kg' ? 'Эрежелер жана аныктамалар' : 'Правила и теоретический материал'}
                </div>
                <div className="text-sm md:text-base leading-relaxed text-white/90 whitespace-pre-line font-mono bg-black/30 p-5 rounded-2xl border border-white/5">
                  {lang === 'kg' ? selectedExercise.theoryKg : selectedExercise.theory}
                </div>
              </div>
            )}

            {/* Tab: Practice Workspace */}
            {activeTab === 'practice' && currentProblem && selectedExercise && (
              <div className="space-y-6">
                {/* Task brief prompt */}
                <div className="text-sm md:text-base text-white/80 bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                  <span>{lang === 'kg' ? selectedExercise.shortDescKg : selectedExercise.shortDesc}</span>
                  <span className="text-xs text-emerald-400 font-medium hidden sm:inline">
                    {lang === 'kg' ? 'Жоопту жазып, текшериңиз' : 'Запишите ответ и нажмите проверить'}
                  </span>
                </div>

                {/* Mathematical Canvas Card */}
                <div className="bg-gradient-to-b from-[#062c20] to-[#041a13] border border-emerald-500/30 rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center min-h-[220px] shadow-inner">
                  {renderProblemFormula(
                    currentProblem,
                    selectedExercise.id,
                    {
                      inputC,
                      setInputC,
                      inputN,
                      setInputN,
                      inputD,
                      setInputD,
                      inputOp,
                      setInputOp,
                      inputN2,
                      setInputN2,
                      inputD2,
                      setInputD2
                    },
                    result !== null
                  )}
                </div>

                {/* Verification result notification */}
                {result && (
                  <div
                    className={`p-4 md:p-5 rounded-2xl border transition-all ${
                      result.isCorrect
                        ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
                        : 'bg-red-950/70 border-red-500/50 text-red-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {result.isCorrect ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="font-bold text-base md:text-lg flex items-center justify-between">
                          <span>{result.message}</span>
                          <span className="text-xs px-2.5 py-1 rounded-full bg-white/10">
                            {lang === 'kg' ? 'Балл' : 'Баллы'}: {result.score} / {result.maxScore}
                          </span>
                        </div>
                        {result.notes && result.notes.length > 0 && (
                          <ul className="mt-2 text-xs md:text-sm list-disc list-inside space-y-1 text-white/80">
                            {result.notes.map((note, idx) => (
                              <li key={idx}>{note}</li>
                            ))}
                          </ul>
                        )}
                        {result.correctAnswerStr && (
                          <div className="mt-2 text-xs md:text-sm font-semibold text-white/90">
                            {lang === 'kg' ? 'Туура жооп' : 'Правильный ответ'}:{' '}
                            <span className="font-mono text-emerald-300 font-bold bg-black/40 px-2 py-0.5 rounded">
                              {result.correctAnswerStr}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    onClick={handleVerify}
                    disabled={result !== null}
                    className="flex-1 sm:flex-none px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-bold text-sm md:text-base shadow-lg shadow-emerald-950/60 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {lang === 'kg' ? 'Текшерүү' : 'Проверить'}
                  </button>

                  <button
                    onClick={handleNext}
                    className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm md:text-base border border-white/15 transition-all flex items-center justify-center gap-2"
                  >
                    <span>{lang === 'kg' ? 'Кийинки мисал' : 'Следующий пример'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Formula rendering matching OnlineMSchool math rendering
 */
function renderProblemFormula(
  problem: ExerciseProblem,
  exerciseId: string,
  inputs: {
    inputC: string;
    setInputC: (v: string) => void;
    inputN: string;
    setInputN: (v: string) => void;
    inputD: string;
    setInputD: (v: string) => void;
    inputOp: '<' | '=' | '>' | '';
    setInputOp: (v: '<' | '=' | '>' | '') => void;
    inputN2: string;
    setInputN2: (v: string) => void;
    inputD2: string;
    setInputD2: (v: string) => void;
  },
  disabled: boolean
) {
  // 1. Comparison modes
  if (exerciseId === 'comparison1' || exerciseId === 'comparison') {
    return (
      <div className="flex items-center gap-4 text-xl md:text-2xl font-bold text-white">
        {renderFractionDisplay(problem.fr1)}
        <select
          value={inputs.inputOp}
          onChange={(e) => inputs.setInputOp(e.target.value as any)}
          disabled={disabled}
          className="w-16 h-12 rounded-xl bg-black/60 border border-emerald-500/50 text-emerald-300 font-bold text-center text-xl focus:outline-none focus:border-emerald-400"
        >
          <option value="">?</option>
          <option value="<">&lt;</option>
          <option value="=">=</option>
          <option value=">">&gt;</option>
        </select>
        {problem.fr2 && renderFractionDisplay(problem.fr2)}
      </div>
    );
  }

  // 2. LCD (Приведение к общему знаменателю)
  if (exerciseId === 'lcd') {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-6 text-xl md:text-2xl font-bold text-white">
          {renderFractionDisplay(problem.fr1)}
          <span className="text-white/60 text-base font-normal">и</span>
          {problem.fr2 && renderFractionDisplay(problem.fr2)}
        </div>
        <div className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
          = Общий знаменатель =
        </div>
        <div className="flex items-center gap-6">
          {/* Fraction 1 inputs */}
          <div className="flex flex-col items-center">
            <input
              type="text"
              inputMode="numeric"
              placeholder="?"
              value={inputs.inputN}
              onChange={(e) => inputs.setInputN(e.target.value)}
              disabled={disabled}
              className="w-14 h-10 rounded-lg bg-black/60 border border-emerald-500/40 text-emerald-300 font-bold text-center text-lg focus:outline-none focus:border-emerald-400 mb-1"
            />
            <div className="w-16 h-[2px] bg-white/70" />
            <input
              type="text"
              inputMode="numeric"
              placeholder="?"
              value={inputs.inputD}
              onChange={(e) => inputs.setInputD(e.target.value)}
              disabled={disabled}
              className="w-14 h-10 rounded-lg bg-black/60 border border-emerald-500/40 text-emerald-300 font-bold text-center text-lg focus:outline-none focus:border-emerald-400 mt-1"
            />
          </div>
          <span className="text-white/60 text-base font-normal">и</span>
          {/* Fraction 2 inputs */}
          <div className="flex flex-col items-center">
            <input
              type="text"
              inputMode="numeric"
              placeholder="?"
              value={inputs.inputN2}
              onChange={(e) => inputs.setInputN2(e.target.value)}
              disabled={disabled}
              className="w-14 h-10 rounded-lg bg-black/60 border border-emerald-500/40 text-emerald-300 font-bold text-center text-lg focus:outline-none focus:border-emerald-400 mb-1"
            />
            <div className="w-16 h-[2px] bg-white/70" />
            <input
              type="text"
              inputMode="numeric"
              placeholder="?"
              value={inputs.inputD2}
              onChange={(e) => inputs.setInputD2(e.target.value)}
              disabled={disabled}
              className="w-14 h-10 rounded-lg bg-black/60 border border-emerald-500/40 text-emerald-300 font-bold text-center text-lg focus:outline-none focus:border-emerald-400 mt-1"
            />
          </div>
        </div>
      </div>
    );
  }

  // 3. Simplify (Сокращение дробей)
  if (exerciseId === 'simplify') {
    return (
      <div className="flex items-center gap-5 text-xl md:text-2xl font-bold text-white">
        {renderFractionDisplay(problem.fr1)}
        <span className="text-emerald-400">=</span>
        <div className="flex flex-col items-center">
          <input
            type="text"
            inputMode="numeric"
            placeholder="?"
            value={inputs.inputN}
            onChange={(e) => inputs.setInputN(e.target.value)}
            disabled={disabled}
            className="w-14 h-10 rounded-lg bg-black/60 border border-emerald-500/40 text-emerald-300 font-bold text-center text-lg focus:outline-none focus:border-emerald-400 mb-1"
          />
          <div className="w-16 h-[2px] bg-white/70" />
          <input
            type="text"
            inputMode="numeric"
            placeholder="?"
            value={inputs.inputD}
            onChange={(e) => inputs.setInputD(e.target.value)}
            disabled={disabled}
            className="w-14 h-10 rounded-lg bg-black/60 border border-emerald-500/40 text-emerald-300 font-bold text-center text-lg focus:outline-none focus:border-emerald-400 mt-1"
          />
        </div>
      </div>
    );
  }

  // 4. Equal denominators addition/subtraction (calk)
  if (exerciseId === 'calk') {
    return (
      <div className="flex items-center gap-4 text-xl md:text-2xl font-bold text-white">
        {renderFractionDisplay(problem.fr1)}
        <span className="text-emerald-400 font-bold text-2xl">{problem.op}</span>
        {problem.fr2 && renderFractionDisplay(problem.fr2)}
        <span className="text-emerald-400 font-bold text-2xl">=</span>
        <div className="flex flex-col items-center">
          <input
            type="text"
            inputMode="numeric"
            placeholder="?"
            value={inputs.inputN}
            onChange={(e) => inputs.setInputN(e.target.value)}
            disabled={disabled}
            className="w-14 h-10 rounded-lg bg-black/60 border border-emerald-500/40 text-emerald-300 font-bold text-center text-lg focus:outline-none focus:border-emerald-400 mb-1"
          />
          <div className="w-16 h-[2px] bg-white/70" />
          <input
            type="text"
            inputMode="numeric"
            placeholder="?"
            value={inputs.inputD}
            onChange={(e) => inputs.setInputD(e.target.value)}
            disabled={disabled}
            className="w-14 h-10 rounded-lg bg-black/60 border border-emerald-500/40 text-emerald-300 font-bold text-center text-lg focus:outline-none focus:border-emerald-400 mt-1"
          />
        </div>
      </div>
    );
  }

  // 5. Transform2 (Десятичная в обыкновенную)
  if (exerciseId === 'transform2') {
    return (
      <div className="flex items-center gap-5 text-xl md:text-2xl font-bold text-white">
        <span className="font-mono text-2xl md:text-3xl text-emerald-300 bg-black/40 px-3 py-1.5 rounded-xl border border-emerald-500/20">
          {problem.decimalStr}
        </span>
        <span className="text-emerald-400 font-bold text-2xl">=</span>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="целая"
            value={inputs.inputC}
            onChange={(e) => inputs.setInputC(e.target.value)}
            disabled={disabled}
            className="w-14 h-14 rounded-xl bg-black/60 border border-emerald-500/40 text-emerald-300 font-bold text-center text-lg focus:outline-none focus:border-emerald-400"
          />
          <div className="flex flex-col items-center">
            <input
              type="text"
              inputMode="numeric"
              placeholder="числ."
              value={inputs.inputN}
              onChange={(e) => inputs.setInputN(e.target.value)}
              disabled={disabled}
              className="w-14 h-10 rounded-lg bg-black/60 border border-emerald-500/40 text-emerald-300 font-bold text-center text-lg focus:outline-none focus:border-emerald-400 mb-1"
            />
            <div className="w-16 h-[2px] bg-white/70" />
            <input
              type="text"
              inputMode="numeric"
              placeholder="знам."
              value={inputs.inputD}
              onChange={(e) => inputs.setInputD(e.target.value)}
              disabled={disabled}
              className="w-14 h-10 rounded-lg bg-black/60 border border-emerald-500/40 text-emerald-300 font-bold text-center text-lg focus:outline-none focus:border-emerald-400 mt-1"
            />
          </div>
        </div>
      </div>
    );
  }

  // 6. Transform1 (Смешанная в неправильную)
  if (exerciseId === 'transform1') {
    return (
      <div className="flex items-center gap-5 text-xl md:text-2xl font-bold text-white">
        {renderFractionDisplay(problem.fr1)}
        <span className="text-emerald-400 font-bold text-2xl">=</span>
        <div className="flex flex-col items-center">
          <input
            type="text"
            inputMode="numeric"
            placeholder="числ."
            value={inputs.inputN}
            onChange={(e) => inputs.setInputN(e.target.value)}
            disabled={disabled}
            className="w-14 h-10 rounded-lg bg-black/60 border border-emerald-500/40 text-emerald-300 font-bold text-center text-lg focus:outline-none focus:border-emerald-400 mb-1"
          />
          <div className="w-16 h-[2px] bg-white/70" />
          <input
            type="text"
            inputMode="numeric"
            placeholder="знам."
            value={inputs.inputD}
            onChange={(e) => inputs.setInputD(e.target.value)}
            disabled={disabled}
            className="w-14 h-10 rounded-lg bg-black/60 border border-emerald-500/40 text-emerald-300 font-bold text-center text-lg focus:outline-none focus:border-emerald-400 mt-1"
          />
        </div>
      </div>
    );
  }

  // 7. General Mixed/Fraction operations (transform, calk3, calk4, calk1, multiplication, division, calk2, multiplication1, division1)
  return (
    <div className="flex items-center gap-4 text-xl md:text-2xl font-bold text-white flex-wrap justify-center">
      {renderFractionDisplay(problem.fr1)}
      {problem.op && (
        <span className="text-emerald-400 font-bold text-2xl px-1">{problem.op}</span>
      )}
      {problem.fr2 && (
        <div className="flex items-center">
          {problem.paren2 && <span className="text-2xl font-bold text-white mr-1">(</span>}
          {renderFractionDisplay(problem.fr2)}
          {problem.paren2 && <span className="text-2xl font-bold text-white ml-1">)</span>}
        </div>
      )}
      <span className="text-emerald-400 font-bold text-2xl">=</span>

      {/* Mixed or Simple input */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="целая"
          value={inputs.inputC}
          onChange={(e) => inputs.setInputC(e.target.value)}
          disabled={disabled}
          className="w-14 h-14 rounded-xl bg-black/60 border border-emerald-500/40 text-emerald-300 font-bold text-center text-lg focus:outline-none focus:border-emerald-400"
        />
        <div className="flex flex-col items-center">
          <input
            type="text"
            inputMode="numeric"
            placeholder="числ."
            value={inputs.inputN}
            onChange={(e) => inputs.setInputN(e.target.value)}
            disabled={disabled}
            className="w-14 h-10 rounded-lg bg-black/60 border border-emerald-500/40 text-emerald-300 font-bold text-center text-lg focus:outline-none focus:border-emerald-400 mb-1"
          />
          <div className="w-16 h-[2px] bg-white/70" />
          <input
            type="text"
            inputMode="numeric"
            placeholder="знам."
            value={inputs.inputD}
            onChange={(e) => inputs.setInputD(e.target.value)}
            disabled={disabled}
            className="w-14 h-10 rounded-lg bg-black/60 border border-emerald-500/40 text-emerald-300 font-bold text-center text-lg focus:outline-none focus:border-emerald-400 mt-1"
          />
        </div>
      </div>
    </div>
  );
}

function renderFractionDisplay(fr: { c?: number | string; n: number | string; d: number | string }) {
  const hasWhole = fr.c !== undefined && fr.c !== '' && fr.c !== 0;
  return (
    <div className="inline-flex items-center gap-2">
      {hasWhole && (
        <span className="text-2xl md:text-3xl font-bold text-white leading-none">
          {fr.c}
        </span>
      )}
      <div className="inline-flex flex-col items-center">
        <span className="text-lg md:text-xl font-bold text-white leading-tight px-1">
          {fr.n}
        </span>
        <div className="w-full min-w-[20px] h-[2px] bg-white/80 my-0.5" />
        <span className="text-lg md:text-xl font-bold text-white leading-tight px-1">
          {fr.d}
        </span>
      </div>
    </div>
  );
}
