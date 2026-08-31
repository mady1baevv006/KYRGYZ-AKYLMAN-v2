import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Upload,
  AlertCircle,
  FileCheck,
  Award,
  Sparkles,
  MessageCircle,
  ChevronRight,
  Camera,
  X,
} from 'lucide-react';
import { AppLanguage } from '../../types';
import { CourseGroup, CourseHomework } from '../../types/courses';

interface ClassroomHomeworkProps {
  course: CourseGroup;
  lang: AppLanguage;
}

export const ClassroomHomework: React.FC<ClassroomHomeworkProps> = ({
  course,
  lang,
}) => {
  const isKg = lang === 'kg';
  const [selectedHw, setSelectedHw] = useState<CourseHomework | null>(null);
  const [solutionText, setSolutionText] = useState('');
  const [attachedPhoto, setAttachedPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleOpenSubmitModal = (hw: CourseHomework) => {
    setSelectedHw(hw);
    setSolutionText('');
    setAttachedPhoto(null);
    setSubmitSuccess(false);
  };

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSelectedHw(null);
      }, 1500);
    }, 800);
  };

  return (
    <div className="bg-[#052219] border border-emerald-800/60 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-emerald-800/50">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-wider mb-1.5">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isKg ? 'Үй тапшырмалар' : 'Домашние задания'}</span>
          </div>
          <h3 className="text-xl font-black text-white">
            {isKg ? 'Тапшырмаларды тапшыруу жана мугалимдин текшерүүсү' : 'Сдача заданий и проверка преподавателя'}
          </h3>
        </div>
      </div>

      {/* Homework List */}
      <div className="grid grid-cols-1 gap-3">
        {course.homeworks.length === 0 ? (
          <div className="p-8 text-center bg-[#031510] rounded-2xl border border-emerald-800/40 text-slate-400">
            {isKg ? 'Бул курста азырынча үй тапшырмалар жок' : 'В этом курсе пока нет домашних заданий'}
          </div>
        ) : (
          course.homeworks.map((hw) => {
            const isGraded = hw.status === 'graded';
            const isSubmitted = hw.status === 'submitted';
            const isPending = hw.status === 'pending';

            return (
              <div
                key={hw.id}
                className="p-4 rounded-2xl bg-[#031510] border border-emerald-800/60 hover:border-emerald-600 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-white">
                      {isKg ? hw.titleKg : hw.titleRu}
                    </h4>
                    {isGraded && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border border-emerald-500/40">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{hw.studentScore} / {hw.maxScore} {isKg ? 'балл' : 'баллов'}</span>
                      </span>
                    )}
                    {isPending && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400/15 text-amber-300 text-[10px] font-bold border border-amber-400/30">
                        {isKg ? 'Тапшыруу керек' : 'Требуется сдать'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-emerald-200/70">
                    {isKg ? hw.descriptionKg : hw.descriptionRu}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                    <span>📝 {hw.taskCount} {isKg ? 'суроо' : 'задач'}</span>
                    <span>⏳ {isKg ? 'Мөөнөтү:' : 'Дедлайн:'} {hw.dueDate}</span>
                  </div>

                  {/* Teacher Feedback Note if graded */}
                  {hw.teacherFeedback && (
                    <div className="mt-2 p-2.5 rounded-xl bg-[#052219] border border-emerald-700/50 text-xs text-emerald-100 flex items-start gap-2">
                      <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-emerald-300 mr-1">
                          {isKg ? 'Мугалимдин пикири:' : 'Комментарий преподавателя:'}
                        </span>
                        <span>{hw.teacherFeedback}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="self-stretch md:self-auto flex items-center justify-end">
                  {isPending ? (
                    <button
                      type="button"
                      onClick={() => handleOpenSubmitModal(hw)}
                      className="w-full md:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isKg ? 'Чыгарылышын жөнөтүү' : 'Сдать решение'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenSubmitModal(hw)}
                      className="w-full md:w-auto px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isKg ? 'Жоопту көрүү' : 'Посмотреть ответ'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Submit Homework Solution Modal */}
      {selectedHw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-[#06261d] border border-emerald-700/80 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-800/50">
              <h4 className="text-base font-black text-white">
                {isKg ? selectedHw.titleKg : selectedHw.titleRu}
              </h4>
              <button
                type="button"
                onClick={() => setSelectedHw(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-6 text-center space-y-2 bg-emerald-950/60 border border-emerald-500 rounded-2xl text-emerald-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h5 className="font-black text-white text-base">
                  {isKg ? 'Үй тапшырма жөнөтүлдү!' : 'Домашнее задание успешно отправлено!'}
                </h5>
                <p className="text-xs text-emerald-200/80">
                  {isKg ? 'Мугалим текшерип, баа жана комментарий коёт.' : 'Преподаватель проверит решения и выставит баллы.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSimulateSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-emerald-300 mb-1">
                    {isKg ? 'Тексттик жооп же чечимдин түшүндүрмөсү:' : 'Текстовый ответ или ход решения:'}
                  </label>
                  <textarea
                    rows={4}
                    value={solutionText}
                    onChange={(e) => setSolutionText(e.target.value)}
                    placeholder={isKg ? '1-суроо: жообу 42, 2-суроо: жообу 15...' : '1-задача: x = 4, 2-задача: S = 120...'}
                    className="w-full bg-[#031510] border border-emerald-800/80 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                {/* Photo attachment simulation */}
                <div>
                  <label className="block text-xs font-bold text-emerald-300 mb-1">
                    {isKg ? 'Дептердеги чыгарылыштын сүрөтүн тиркөө:' : 'Прикрепить фото решения из тетради:'}
                  </label>
                  <div
                    onClick={() => setAttachedPhoto('photo_attached')}
                    className={`p-4 rounded-2xl border border-dashed flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                      attachedPhoto
                        ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300'
                        : 'bg-[#031510] border-emerald-800/70 text-slate-400 hover:border-emerald-500'
                    }`}
                  >
                    <Camera className="w-5 h-5" />
                    <span className="text-xs font-bold">
                      {attachedPhoto ? (isKg ? '✓ Сүрөт тиркелди (solution_1.jpg)' : '✓ Фото прикреплено (solution_1.jpg)') : (isKg ? 'Сүрөт жүктөө' : 'Загрузить фото листа')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedHw(null)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold"
                  >
                    {isKg ? 'Жокко чыгаруу' : 'Отмена'}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg active:scale-95"
                  >
                    {isSubmitting ? (isKg ? 'Жөнөтүлүүдө...' : 'Отправка...') : (isKg ? 'Мугалимге жөнөтүү' : 'Отправить на проверку')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
