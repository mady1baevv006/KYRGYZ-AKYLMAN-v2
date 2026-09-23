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
  const [showFractionsList, setShowFractionsList] = useState(false);

  const handleOpenExercise = (exerciseId: string) => {
    setSelectedExerciseId(exerciseId);
    setIsModalOpen(true);
  };

  const handleStartFractions = () => {
    setShowFractionsList(true);
    // Scroll smoothly to exercises grid
    setTimeout(() => {
      document.getElementById('fractions-selection-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
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
                ? 'ЖРТ математикасына даярдануу үчүн тематикалык көнүгүүлөр: автоматтык мисалдар, деталдуу текшерүү, көрсөтмөлөр жана эрежелер.'
                : 'Генерация примеров, моментальная пошаговая проверка, инструкции и теория для эффективной подготовки к ОРТ.'}
            </p>
          </div>
        </div>
      </div>

      {/* Rectangular Blocks of Exercises */}
      <div className="space-y-6">
        {/* Block 1: ДРОБИ (Fractions) */}
        <div className="rounded-3xl bg-[#031510] border-2 border-emerald-500/40 p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden">
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
              onClick={handleStartFractions}
              className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm md:text-base shadow-xl shadow-emerald-950/60 transition-all flex items-center justify-center gap-2 self-start md:self-auto cursor-pointer hover:scale-105"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{lang === 'kg' ? 'Начать' : 'Начать'}</span>
            </button>
          </div>

          {/* Short Guide Box */}
          <div className="space-y-3">
            <div className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
              {lang === 'kg' ? 'Короткое руководство:' : 'Короткое руководство:'}
            </div>
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
                      : 'Каждый раз создаются уникальные числа с учетом всех правил математики.'}
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
                      : 'Анализирует правильность, несократимый вид, целые части и шаг решения.'}
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
                      : 'К каждому виду упражнения прикреплены правила, алгоритмы и теория.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 16 Exercise Sub-blocks Grid (Revealed after clicking "Начать") */}
          {showFractionsList && (
            <div id="fractions-selection-grid" className="pt-6 border-t border-emerald-500/20 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h4 className="text-sm md:text-base font-bold text-white">
                    {lang === 'kg' ? 'Дроби: көнүгүүнү тандаңыз' : 'Дроби: выберите упражнение'}
                  </h4>
                  <span className="text-xs text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                    16 {lang === 'kg' ? 'көнүгүү' : 'тем'}
                  </span>
                </div>
                <button
                  onClick={() => setShowFractionsList(false)}
                  className="text-xs text-white/50 hover:text-white transition-colors cursor-pointer"
                >
                  {lang === 'kg' ? 'Жабуу' : 'Свернуть'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {FRACTION_EXERCISES_LIST.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => handleOpenExercise(item.id)}
                    className="group text-left p-4 rounded-2xl bg-[#041d15] hover:bg-[#062c20] border border-emerald-500/20 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-3 shadow-md hover:shadow-emerald-950/50 hover:-translate-y-0.5 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </span>
                      <ChevronRight className="w-4 h-4 text-emerald-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </div>

                    <div className="space-y-1">
                      <h5 className="text-xs md:text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-emerald-300 transition-colors">
                        {lang === 'kg' ? item.titleKg.replace(/^Көнүгүүлөр\.\s*/, '') : item.title.replace(/^Упражнения\.\s*/, '')}
                      </h5>
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
          )}
        </div>

        {/* Additional Rectangular Blocks (Upcoming topics) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-3xl bg-[#031510]/60 border border-emerald-900/40 p-5 space-y-3 opacity-75 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Percent className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/10">
                {lang === 'kg' ? 'Жакында' : 'Скоро'}
              </span>
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                {lang === 'kg' ? 'Проценттер жана пропорция' : 'Проценты и пропорции'}
              </h4>
              <p className="text-xs text-white/50 mt-1 leading-relaxed">
                {lang === 'kg' ? 'Сандын процентин табуу, проценттик катыш жана татаал маселелер.' : 'Нахождение процента от числа, процентное отношение, пропорции и задачи на концентрацию.'}
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-[#031510]/60 border border-emerald-900/40 p-5 space-y-3 opacity-75 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Sigma className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/10">
                {lang === 'kg' ? 'Жакында' : 'Скоро'}
              </span>
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                {lang === 'kg' ? 'Теңдемелер жана барабарсыздыктар' : 'Уравнения и неравенства'}
              </h4>
              <p className="text-xs text-white/50 mt-1 leading-relaxed">
                {lang === 'kg' ? 'Сызыктуу жана квадраттык теңдемелер, системалар жана модуль.' : 'Линейные, дробно-рациональные и квадратные уравнения, системы и неравенства.'}
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-[#031510]/60 border border-emerald-900/40 p-5 space-y-3 opacity-75 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Binary className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/10">
                {lang === 'kg' ? 'Жакында' : 'Скоро'}
              </span>
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                {lang === 'kg' ? 'Даражалар жана тамырлар' : 'Степени и корни'}
              </h4>
              <p className="text-xs text-white/50 mt-1 leading-relaxed">
                {lang === 'kg' ? 'Даражалардын касиеттери, арифметикалык квадрат тамыр жана кыска көбөйтүү формулалары.' : 'Свойства степеней с целым и дробным показателем, извлечение корней и преобразования.'}
              </p>
            </div>
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
