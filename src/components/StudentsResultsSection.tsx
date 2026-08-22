import React, { useState, useEffect } from 'react';
import { Award, Star, School, Sparkles } from 'lucide-react';
import { AppLanguage, StudentResult } from '../types';
import { getStoredStudents } from '../data/studentsData';
import { getOptimizedStudentPhotoUrl } from '../utils/imageOptimization';

interface StudentsResultsSectionProps {
  lang?: AppLanguage;
}

export const StudentsResultsSection: React.FC<StudentsResultsSectionProps> = ({
  lang = 'ru',
}) => {
  const isKg = lang === 'kg';
  const [students, setStudents] = useState<StudentResult[]>(getStoredStudents);

  useEffect(() => {
    const handleUpdate = () => {
      setStudents(getStoredStudents());
    };

    window.addEventListener('ort_students_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('ort_students_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return (
    <section
      id="students-results-section"
      className="relative z-20 py-12 sm:py-20 px-3 sm:px-6 bg-transparent"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-black uppercase tracking-widest shadow-lg shadow-emerald-500/10">
            <Award className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>{isKg ? 'Жыйынтыктар' : 'Высокие результаты'}</span>
          </div>

          <h2 className="text-2xl min-[400px]:text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {isKg ? (
              <>
                Окуучулардын{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400">
                  жыйынтыктары
                </span>{' '}
                өздөрү сүйлөйт
              </>
            ) : (
              <>
                Результаты учеников{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400">
                  говорят сами за себя
                </span>
              </>
            )}
          </h2>

          <p className="text-sm sm:text-base text-emerald-200/75 max-w-2xl mx-auto leading-relaxed">
            {isKg
              ? 'Кыргызстандын жана чет өлкөлөрдүн алдыңкы ЖОЖдоруна бюджеттик жана гранттык орундарга ийгиликтүү өткөн бүтүрүүчүлөрдүн жыйынтыктары.'
              : 'Реальные результаты выпускников, успешно поступивших на бюджетные и грантовые места в ведущие университеты.'}
          </p>
        </div>

        {/* Students Cards Grid - 2 columns on mobile, scaling up cleanly */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 justify-center">
          {students.map((student, idx) => {
            const studentName = isKg && student.nameKg ? student.nameKg : student.name;
            const studentUni = isKg && student.universityKg ? student.universityKg : student.university;
            const isGold = student.isGoldCertificate || student.score >= 220;

            return (
              <div
                key={student.id}
                className={`relative flex flex-col justify-between rounded-2xl sm:rounded-3xl p-3 sm:p-5 transition-all duration-300 group hover:-translate-y-1.5 ${
                  isGold
                    ? 'bg-gradient-to-b from-[#073327] to-[#041d16] border-2 border-emerald-400/80 shadow-xl shadow-emerald-500/20'
                    : 'bg-[#06261d] border border-emerald-800/70 shadow-lg shadow-black/40 hover:border-emerald-500/80 hover:shadow-xl hover:shadow-emerald-950/60'
                }`}
              >
                <div>
                  {/* Photo Box: exact 1:1 square ratio */}
                  <div className="relative mb-2.5 sm:mb-3 w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-[#031510] border border-emerald-800/60 flex items-center justify-center group-hover:border-emerald-400/60 transition-colors shadow-inner">
                    {student.photoUrl ? (
                      <img
                        src={getOptimizedStudentPhotoUrl(student.photoUrl)}
                        alt={studentName}
                        className="w-full h-full object-cover transition-opacity duration-300"
                        loading={idx < 4 ? 'eager' : 'lazy'}
                        decoding="async"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="relative w-full h-full flex flex-col items-center justify-center p-3 bg-radial from-emerald-900/40 to-transparent">
                        <div
                          className={`w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-tr ${student.avatarColor || 'from-emerald-500 to-teal-400'} flex items-center justify-center font-black text-lg sm:text-2xl text-slate-950 shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform`}
                        >
                          {studentName.charAt(0)}
                        </div>
                      </div>
                    )}

                    {/* Score badge in bottom right corner of photo */}
                    <div className="absolute bottom-1.5 right-1.5 sm:bottom-2.5 sm:right-2.5 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl bg-black/80 backdrop-blur-md border border-emerald-400/50 text-[10px] sm:text-[11px] font-black text-emerald-300 shadow-md flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" />
                      <span>{student.score} {isKg ? 'балл' : 'баллов'}</span>
                    </div>

                    {/* Top corner star badge - shown ONLY for Gold Certificate holders */}
                    {isGold && (
                      <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-black/60 backdrop-blur-xs border border-amber-400/60 flex items-center justify-center text-amber-300 shadow-sm">
                        <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-300 text-amber-300" />
                      </div>
                    )}
                  </div>

                  {/* 1. Фамилия Имя */}
                  <h3 className="text-xs sm:text-base md:text-lg font-black text-white tracking-tight leading-snug group-hover:text-emerald-300 transition-colors line-clamp-2">
                    {studentName}
                  </h3>

                  {/* 2. ВУЗ */}
                  <div className="flex items-start gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-semibold text-emerald-200/75 leading-tight mt-1 sm:mt-1.5">
                    <School className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="break-words">{studentUni}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
