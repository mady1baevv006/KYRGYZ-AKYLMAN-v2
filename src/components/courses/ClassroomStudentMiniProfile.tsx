import React from 'react';
import {
  Award,
  Calendar,
  Flame,
  GraduationCap,
  Target,
  TrendingUp,
  BookOpen,
  Crown,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { AppLanguage } from '../../types';
import { CourseGroup, StudentCourseProfile } from '../../types/courses';
import { useAuth } from '../../context/AuthContext';

interface ClassroomStudentMiniProfileProps {
  course: CourseGroup;
  studentProfile: StudentCourseProfile;
  lang: AppLanguage;
}

export const ClassroomStudentMiniProfile: React.FC<ClassroomStudentMiniProfileProps> = ({
  course,
  studentProfile,
  lang,
}) => {
  const { user, isVip, isAdmin } = useAuth();
  const isKg = lang === 'kg';

  const displayName = user?.name || studentProfile.studentName;
  const targetScore = user?.targetScore || studentProfile.targetScore;

  return (
    <div className="bg-[#052219] border border-emerald-800/60 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
      {/* Header Banner with Student Info & VIP status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-emerald-800/50">
        <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
          <div className="relative shrink-0">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={displayName}
                referrerPolicy="no-referrer"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-md shadow-emerald-500/20"
              />
            ) : (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 flex items-center justify-center font-black text-xl sm:text-2xl shadow-md">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            {isVip && (
              <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-amber-400 to-amber-200 text-slate-950 p-1 rounded-full shadow-md border border-[#052219]">
                <Crown className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className={`text-lg sm:text-2xl font-black truncate ${
                  isVip
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]'
                    : 'text-white'
                }`}
              >
                {displayName}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                {isKg ? 'Курстун окуучусу' : 'Ученик курса'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-200/70 truncate mt-0.5">
              {course.titleRu} • {course.teacher.name}
            </p>
          </div>
        </div>

        {/* Group Position & Streak */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
          <div className="px-3 py-2 rounded-2xl bg-[#031510] border border-emerald-800/70 text-center flex-1 sm:flex-initial">
            <div className="text-[10px] uppercase font-bold text-emerald-400/80">
              {isKg ? 'Рейтинг' : 'В группе'}
            </div>
            <div className="text-sm font-black text-amber-300">
              #{studentProfile.groupRank} <span className="text-xs text-slate-400">/ {studentProfile.totalStudentsInGroup}</span>
            </div>
          </div>

          <div className="px-3 py-2 rounded-2xl bg-[#031510] border border-emerald-800/70 text-center flex-1 sm:flex-initial">
            <div className="text-[10px] uppercase font-bold text-emerald-400/80 flex items-center justify-center gap-1">
              <Flame className="w-3 h-3 text-rose-400 fill-rose-400" />
              <span>{isKg ? 'Стрик' : 'Серия'}</span>
            </div>
            <div className="text-sm font-black text-rose-300">
              {studentProfile.streakDays} {isKg ? 'күн' : 'дней'}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Attendance */}
        <div className="bg-[#031510] border border-emerald-800/50 rounded-2xl p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-300/80">
            <span>{isKg ? 'Катышуу' : 'Посещаемость'}</span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{studentProfile.attendanceRate}%</div>
          <div className="w-full bg-emerald-950 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all"
              style={{ width: `${studentProfile.attendanceRate}%` }}
            />
          </div>
          <p className="text-[10px] text-emerald-200/60">
            {studentProfile.lessonsAttended} {isKg ? 'сабактын' : 'из'} {studentProfile.totalLessons} {isKg ? 'катышты' : 'уроков'}
          </p>
        </div>

        {/* Homework Rate */}
        <div className="bg-[#031510] border border-emerald-800/50 rounded-2xl p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-300/80">
            <span>{isKg ? 'Үй тапшырма' : 'Сдача ДЗ'}</span>
            <BookOpen className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-teal-300">{studentProfile.homeworkCompletionRate}%</div>
          <div className="w-full bg-teal-950 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-teal-400 h-full rounded-full transition-all"
              style={{ width: `${studentProfile.homeworkCompletionRate}%` }}
            />
          </div>
          <p className="text-[10px] text-emerald-200/60">
            {isKg ? 'Орточо баа: 95/100' : 'Средний балл: 95/100'}
          </p>
        </div>

        {/* Target Score */}
        <div className="bg-[#031510] border border-emerald-800/50 rounded-2xl p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-300/80">
            <span>{isKg ? 'Максат балл' : 'Цель ОРТ'}</span>
            <Target className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">{targetScore}</div>
          <div className="flex items-center gap-1 text-[10px] text-amber-200/70">
            <span>{isKg ? 'Болжолдуу:' : 'Прогноз:'}</span>
            <span className="font-bold text-white">{studentProfile.currentEstimatedScore}</span>
            <span className="text-emerald-400 font-bold">(+18)</span>
          </div>
        </div>

        {/* Status */}
        <div className="bg-[#031510] border border-emerald-800/50 rounded-2xl p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-300/80">
            <span>{isKg ? 'Статус' : 'Доступ'}</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg sm:text-xl font-black text-emerald-300 truncate">
            {isKg ? 'Активдүү' : 'Активен'}
          </div>
          <p className="text-[10px] text-emerald-200/60 truncate">
            {isKg ? 'Бардык сабактарга кирүү бар' : 'Полный доступ к урокам'}
          </p>
        </div>
      </div>

      {/* Badges and Achievements */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400/80 mb-2.5 flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5" />
          <span>{isKg ? 'Окуучунун жетишкендиктери' : 'Достижения в группе'}</span>
        </h4>
        <div className="flex flex-wrap gap-2">
          {studentProfile.badges.map((badge) => (
            <div
              key={badge.id}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-sm ${badge.color}`}
            >
              <span>{badge.icon}</span>
              <span>{isKg ? badge.titleKg : badge.titleRu}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
