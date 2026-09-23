import React, { useState } from 'react';
import { FRACTION_EXERCISES_LIST, FractionExerciseItem } from '../data/fractionExercisesData';
import { FractionExercisesModal } from './FractionExercisesModal';
import {
  Calculator,
  Play,
  BookOpen,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Layers,
  ChevronRight,
  GraduationCap,
  Percent,
  Sigma,
  Binary
} from 'lucide-react';

interface ExercisesSectionProps {
  lang: 'ru' | 'kg';
}

export const ExercisesSection: React.FC<ExercisesSectionProps> = ({ lang }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('calk');

  const handleOpenExercise = (exerciseId: string) => {
    setSelectedExerciseId(exerciseId);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner / Heading */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#042017] via-[#063325] to-[#042017] border border-emerald-500/30 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              {lang === 'kg' ? 'Интерактивдик машыктыргыч' : 'Интерактивный тренажер'}
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {lang === 'kg' ? 'Математикалык көнүгүүлөр' : 'Практические упражнения'}
            </h2>
            <p className="text-white/80 text-sm md:text-base leading-relaxed">
              {lang === 'kg'
                ? 'ЖРТ математикасына даярдануу үчүн ар кандай темалар боюнча мисалдарды чыгаруу, авто-текшерүү жана толук теориялык түшүндүрмөлөр.'
                : 'Генерация примеров, моментальная пошаговая проверка, подсказки, инструкции и теория для эффективной подготовки к ОРТ.'}
            </p>
          </div>

          <button
            onClick={() => handleOpenExercise('calk')}
            className="self-start md:self-center px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-bold text-sm md:text-base shadow-lg shadow-emerald-950/60 transition-all flex items-center gap-2 group flex-shrink-0"
          >
            <Play className="w-4 h-4 fill-current transition-transform group-hover:scale-110" />
            <span>{lang === 'kg' ? 'Бардык көнүгүүлөрдү баштоо' : 'Начать все упражнения'}</span>
          </button>
        </div>
      </div>

      {/* Main Topic Card: ДРОБИ (Fractions) */}
      <div className="rounded-3xl bg-[#031510] border border-emerald-500/30 p-6 md:p-8 space-y-6 shadow-xl">
        {/* Main Card Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-500/20 pb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0 shadow-lg shadow-emerald-950/40">
              <Calculator className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
                  {lang === 'kg' ? '1-блок' : 'Блок 1'}
                </span>
                <span className="text-xs text-white/40">• 16 {lang === 'kg' ? 'көнүгүү' : 'упражнений'}</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mt-0.5">
                {lang === 'kg' ? 'Дроби (Бөлчөктөр)' : 'Дроби'}
              </h3>
              <p className="text-xs md:text-sm text-white/70 mt-1 max-w-2xl">
                {lang === 'kg'
                  ? 'Бөлчөктөрдү кошуу, кемитүү, көбөйтүү, бөлүү, кыскартуу, жалпы бөлүмгө келтирүү, аралаш сандар жана ондук бөлчөктөр менен иштөө.'
                  : 'Сложение, вычитание, умножение и деление обыкновенных и смешанных дробей, сокращение, приведение к общему знаменателю и десятичные дроби.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => handleOpenExercise('calk')}
            className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-lg shadow-emerald-950/60 transition-all flex items-center justify-center gap-2 self-start md:self-auto"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{lang === 'kg' ? 'Баштоо' : 'Начать'}</span>
          </button>
        </div>

        {/* Short Guide Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#042017]/70 border border-emerald-500/20 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs md:text-sm font-bold text-white">
                {lang === 'kg' ? 'Автоматтык мисалдар' : 'Генерация примеров'}
              </h4>
              <p className="text-xs text-white/60 mt-0.5 leading-relaxed">
                {lang === 'kg'
                  ? 'Ар бир жолу жаңы математикалык сандар жана шарттар чыгарылат.'
                  : 'Каждый раз создаются уникальные числа с учетом всех правил.'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#042017]/70 border border-emerald-500/20 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs md:text-sm font-bold text-white">
                {lang === 'kg' ? 'Так текшерүү жана балл' : 'Проверка и баллы'}
              </h4>
              <p className="text-xs text-white/60 mt-0.5 leading-relaxed">
                {lang === 'kg'
                  ? 'Кыскартылбаган бөлчөк же туура эмес белги болсо эскертүү берилет.'
                  : 'Анализирует правильность, несократимый вид и целые части.'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#042017]/70 border border-emerald-500/20 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs md:text-sm font-bold text-white">
                {lang === 'kg' ? 'Теория жана эрежелер' : 'Инструкция и теория'}
              </h4>
              <p className="text-xs text-white/60 mt-0.5 leading-relaxed">
                {lang === 'kg'
                  ? 'Ар бир көнүгүүдө деталдуу математикалык формулалар жана эрежелер бар.'
                  : 'К каждому виду упражнения прикреплены правила и алгоритмы.'}
              </p>
            </div>
          </div>
        </div>

        {/* 16 Exercise Sub-blocks Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-white/60 uppercase tracking-wider px-1">
            <span>{lang === 'kg' ? 'Көнүгүүлөр тизмесинен тандаңыз:' : 'Выберите конкретное упражнение:'}</span>
            <span>16 {lang === 'kg' ? 'көнүгүү' : 'тем'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {FRACTION_EXERCISES_LIST.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleOpenExercise(item.id)}
                className="group text-left p-4 rounded-2xl bg-[#041d15] hover:bg-[#062c20] border border-emerald-500/20 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-3 shadow-md hover:shadow-emerald-950/50 hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </span>
                  <ChevronRight className="w-4 h-4 text-emerald-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs md:text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-emerald-300 transition-colors">
                    {lang === 'kg' ? item.titleKg.replace(/^Көнүгүүлөр\.\s*/, '') : item.title.replace(/^Упражнения\.\s*/, '')}
                  </h4>
                  <p className="text-[11px] text-white/50 line-clamp-2 leading-relaxed">
                    {lang === 'kg' ? item.shortDescKg : item.shortDesc}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-semibold text-emerald-400">
                  <span>{lang === 'kg' ? 'Чыгаруу' : 'Решать'}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Modal */}
      <FractionExercisesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lang={lang}
        initialExerciseId={selectedExerciseId}
      />
    </div>
  );
};
