import React from 'react';
import {
  X,
  BookOpen,
  Calendar,
  Clock,
  Users,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Layers,
  Award,
  Video,
} from 'lucide-react';
import { AppLanguage } from '../../types';
import { CourseGroup } from '../../types/courses';

interface CourseDetailModalProps {
  course: CourseGroup;
  lang: AppLanguage;
  isEnrolled: boolean;
  onClose: () => void;
  onEnroll: () => void;
  onEnterClassroom: () => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  lang,
  isEnrolled,
  onClose,
  onEnroll,
  onEnterClassroom,
}) => {
  const isKg = lang === 'kg';
  const spotsLeft = course.totalSpots - course.enrolledCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#05261c] border border-emerald-700/80 rounded-3xl p-5 sm:p-8 shadow-2xl overflow-y-auto text-left space-y-6">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Badges: Предмет & Модуль */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isKg ? 'Предмет:' : 'Предмет:'} {isKg ? course.subjectNameKg : course.subjectNameRu}</span>
          </span>

          <span className="px-3 py-1 rounded-full bg-teal-500/15 border border-teal-400/40 text-teal-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            <span>{isKg ? 'Модуль:' : 'Модуль:'} {isKg ? (course.moduleNameKg || 'Негизги модуль') : (course.moduleNameRu || 'Базовый модуль')}</span>
          </span>
        </div>

        {/* Course Title & Description */}
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {isKg ? course.titleKg : course.titleRu}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-2 leading-relaxed">
            {isKg ? course.descriptionKg : course.descriptionRu}
          </p>
        </div>

        {/* Teacher Profile Card */}
        <div className="p-4 rounded-2xl bg-[#031510] border border-emerald-800/80 flex items-center gap-4">
          <img
            src={course.teacher.avatar}
            alt={course.teacher.name}
            className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border-2 border-emerald-400/70 shrink-0 bg-emerald-950 shadow-md"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-black text-white text-sm sm:text-base">{course.teacher.name}</h4>
              {course.teacher.ortScore && (
                <span className="text-[10px] text-amber-300 font-bold px-2 py-0.5 rounded-md bg-amber-400/20 border border-amber-400/40">
                  {course.teacher.ortScore} {isKg ? 'балл ЖРТ' : 'б. ОРТ'}
                </span>
              )}
            </div>
            <p className="text-xs text-emerald-300/80 mt-0.5">{isKg ? course.teacher.titleKg : course.teacher.title}</p>
            <p className="text-[11px] text-emerald-200/60 mt-1 line-clamp-2">
              {isKg ? (course.teacher.credentialsKg || course.teacher.credentials) : course.teacher.credentials}
            </p>
          </div>
        </div>

        {/* Key Parameters: Days, Group size 6-10, Time, Price */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#031510] border border-emerald-800/60 text-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold flex items-center gap-1">
              <Calendar className="w-3 h-3 text-emerald-400" />
              <span>{isKg ? 'Күндөр' : 'Дни'}</span>
            </span>
            <span className="font-black text-white text-sm mt-1 block">
              {course.daysScheduleFormat || 'Пн-Пт'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#031510] border border-emerald-800/60 text-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold flex items-center gap-1">
              <Clock className="w-3 h-3 text-teal-400" />
              <span>{isKg ? 'Убакыт' : 'Время'}</span>
            </span>
            <span className="font-black text-white text-sm mt-1 block">
              {course.nextLessonTime || '18:00'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#031510] border border-emerald-800/60 text-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold flex items-center gap-1">
              <Users className="w-3 h-3 text-emerald-400" />
              <span>{isKg ? 'Топ' : 'Группа'}</span>
            </span>
            <span className="font-black text-emerald-300 text-sm mt-1 block">
              {course.enrolledCount} / {course.totalSpots} ({spotsLeft} {isKg ? 'бош' : 'мест'})
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#031510] border border-emerald-800/60 text-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-amber-400" />
              <span>{isKg ? 'Баасы' : 'Стоимость'}</span>
            </span>
            <span className="font-black text-amber-300 text-sm mt-1 block">
              {course.priceSom.toLocaleString('ru-RU')} сом
            </span>
          </div>
        </div>

        {/* Benefits list */}
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 space-y-2 text-xs">
          <span className="text-emerald-300 font-bold uppercase tracking-wider text-[11px] block mb-1">
            {isKg ? 'Курска эмнелер кирет:' : 'Что входит в обучение:'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-emerald-200/90">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{isKg ? 'Түз эфирде 40 сабак' : '40 живых онлайн-уроков'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{isKg ? 'Интерактивдүү тактада чыгаруу' : 'Практика на интерактивной доске'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{isKg ? '6–10 адамдан турган чакан топ' : 'Мини-группа строго 6–10 человек'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{isKg ? 'Жеке үй тапшырмалар & текшерүү' : 'Проверка домашних заданий'}</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-2 border-t border-emerald-800/60 flex items-center justify-between gap-3">
          <div>
            <div className="text-lg font-black text-amber-300">
              {course.priceSom.toLocaleString('ru-RU')} сом
            </div>
            <div className="text-[10px] text-emerald-200/60">
              {isKg ? course.periodLabelKg : course.periodLabelRu}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs cursor-pointer"
            >
              {isKg ? 'Жабуу' : 'Закрыть'}
            </button>

            {isEnrolled ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEnterClassroom();
                }}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <span>{isKg ? 'Класска кирүү' : 'Войти в класс'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEnroll();
                }}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <span>{isKg ? 'Жазылуу' : 'Записаться'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
