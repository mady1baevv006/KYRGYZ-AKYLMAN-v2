import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Play,
  FileText,
  CheckCircle2,
  AlertCircle,
  Video,
  ChevronRight,
  Download,
  Sparkles,
} from 'lucide-react';
import { AppLanguage } from '../../types';
import { CourseGroup, CourseLesson } from '../../types/courses';

interface ClassroomCalendarProps {
  course: CourseGroup;
  lang: AppLanguage;
  onJoinLiveLesson?: () => void;
}

export const ClassroomCalendar: React.FC<ClassroomCalendarProps> = ({
  course,
  lang,
  onJoinLiveLesson,
}) => {
  const isKg = lang === 'kg';
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson | null>(course.lessons[0] || null);

  return (
    <div className="space-y-6">
      {/* Top Banner: Weekly Schedule & Live Countdown */}
      <div className="bg-gradient-to-br from-[#06291f] to-[#041a14] border border-emerald-700/60 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-emerald-800/50">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-wider mb-2">
              <CalendarIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isKg ? 'Сабактардын жадыбалы' : 'Расписание живых занятий'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {course.titleRu}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200/70 mt-1">
              {isKg ? 'Бардык сабактар Бишкек убактысы боюнча өтүлөт (GMT+6)' : 'Все уроки проходят в прямом эфире по времени Бишкека (GMT+6)'}
            </p>
          </div>

          {/* Quick Schedule Tags */}
          <div className="flex flex-wrap gap-2">
            {course.schedule.map((sch, i) => (
              <div
                key={i}
                className="px-3 py-2 rounded-2xl bg-[#031510] border border-emerald-800/70 text-center"
              >
                <div className="text-[10px] uppercase font-bold text-emerald-400">
                  {isKg ? sch.dayNameKg : sch.dayNameRu}
                </div>
                <div className="text-xs font-black text-white">
                  {sch.startTime} - {sch.endTime}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Lesson Box */}
        <div className="mt-5 p-4 rounded-2xl bg-[#031510] border border-emerald-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                {isKg ? 'Кезектеги сабак:' : 'Следующий урок:'}
              </div>
              <div className="text-sm font-black text-white">
                {course.nextLessonDate} в {course.nextLessonTime} (Бишкек)
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onJoinLiveLesson}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Video className="w-4 h-4 text-slate-950" />
            <span>{isKg ? 'Түз эфирге кошулуу' : 'Войти в прямой эфир'}</span>
          </button>
        </div>
      </div>

      {/* Lesson List / Archive of Recordings */}
      <div className="bg-[#052219] border border-emerald-800/60 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4">
        <h4 className="text-sm font-black uppercase tracking-wider text-emerald-300 flex items-center gap-2">
          <Video className="w-4 h-4" />
          <span>{isKg ? 'Сабактардын тизмеси жана жазуулар архиви' : 'Список занятий и архив записей'}</span>
        </h4>

        <div className="grid grid-cols-1 gap-3">
          {course.lessons.map((lesson, idx) => {
            const isCompleted = lesson.status === 'completed';
            const isLive = lesson.status === 'live';
            const isUpcoming = lesson.status === 'upcoming';

            return (
              <div
                key={lesson.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  isLive
                    ? 'bg-[#093325] border-rose-500/60 shadow-lg shadow-rose-950/40 ring-1 ring-rose-500/40'
                    : isCompleted
                    ? 'bg-[#031510] border-emerald-800/60 hover:border-emerald-600'
                    : 'bg-[#031510]/60 border-slate-800 opacity-80'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                      isLive
                        ? 'bg-rose-500 text-white animate-pulse'
                        : isCompleted
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <h5 className="text-sm font-bold text-white truncate">
                        {isKg ? lesson.titleKg : lesson.titleRu}
                      </h5>
                      {isLive && (
                        <span className="px-2 py-0.5 rounded bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                          ЭФИРДЕ
                        </span>
                      )}
                      {isCompleted && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          {isKg ? 'Өтүлдү' : 'Пройден'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-emerald-200/70 line-clamp-1">
                      {isKg ? lesson.topicKg : lesson.topicRu}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span>📅 {lesson.date}</span>
                      <span>⏰ {lesson.time}</span>
                      <span>⏱️ {lesson.durationMinutes} мин</span>
                    </div>
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                  {isLive && (
                    <button
                      type="button"
                      onClick={onJoinLiveLesson}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{isKg ? 'Кирүү' : 'Смотреть эфир'}</span>
                    </button>
                  )}

                  {isCompleted && (
                    <button
                      type="button"
                      onClick={() => alert(isKg ? 'Жазуу жүктөлүүдө...' : 'Открытие видеозаписи занятия...')}
                      className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>{isKg ? 'Жазуусу' : 'Запись'}</span>
                    </button>
                  )}

                  {lesson.materialsPdfUrl && (
                    <button
                      type="button"
                      onClick={() => alert(isKg ? 'Материал жүктөлүүдө' : 'Скачивание материалов урока...')}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Скачать PDF материалы"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
