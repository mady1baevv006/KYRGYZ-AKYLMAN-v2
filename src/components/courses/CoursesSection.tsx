import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  Calendar,
  Clock,
  Target,
  Video,
  PenTool,
  CheckCircle2,
  Sparkles,
  Search,
  BookOpen,
  Crown,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { AppLanguage } from '../../types';
import { CourseGroup, CourseSubject } from '../../types/courses';
import { COURSES_DATA, MOCK_STUDENT_COURSE_PROFILE } from '../../data/coursesData';
import { CourseClassroom } from './CourseClassroom';
import { CourseEnrollModal } from './CourseEnrollModal';
import { useAuth } from '../../context/AuthContext';

interface CoursesSectionProps {
  lang: AppLanguage;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({ lang }) => {
  const { user, isVip, isPremium, isAdmin } = useAuth();
  const isKg = lang === 'kg';

  const [courses, setCourses] = useState<CourseGroup[]>(COURSES_DATA);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeClassroomCourse, setActiveClassroomCourse] = useState<CourseGroup | null>(null);
  const [enrollingCourse, setEnrollingCourse] = useState<CourseGroup | null>(null);

  // In demo state, if user is VIP or logged in, the first course is automatically accessible
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(['course-math-220']);

  const handleEnrollSuccess = (courseId: string) => {
    setEnrolledCourseIds((prev) => Array.from(new Set([...prev, courseId])));
    setEnrollingCourse(null);
    const target = courses.find((c) => c.id === courseId);
    if (target) {
      setActiveClassroomCourse(target);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSubject = selectedSubject === 'all' || course.subject === selectedSubject;
    const matchesSearch =
      course.titleRu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.titleKg.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.descriptionRu.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const subjectFilters = [
    { id: 'all', labelRu: 'Все курсы', labelKg: 'Бардык курстар' },
    { id: 'math', labelRu: 'Математика', labelKg: 'Математика' },
    { id: 'analogies', labelRu: 'Аналогии', labelKg: 'Окшоштуктар' },
    { id: 'intensive', labelRu: 'Интенсив ОРТ', labelKg: 'ЖРТ Интенсив' },
    { id: 'reading', labelRu: 'Чтение текстов', labelKg: 'Текстти түшүнүү' },
  ];

  // If a user has clicked into a course, render the full Classroom view
  if (activeClassroomCourse) {
    return (
      <CourseClassroom
        course={activeClassroomCourse}
        studentProfile={MOCK_STUDENT_COURSE_PROFILE}
        lang={lang}
        onBackToCatalog={() => setActiveClassroomCourse(null)}
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Hero / Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#06291f] via-[#041a14] to-[#020e0b] border border-emerald-700/60 rounded-3xl p-6 sm:p-9 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isKg ? 'Онлайн курстар & Виртуалдык класс' : 'Онлайн-курсы & Виртуальные классы'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            {isKg
              ? 'ЖРТга топ менен даярдануу, видео сабактар жана интерактивдүү такта'
              : 'Подготовка к ОРТ в мини-группах с видеозвонками и интерактивной доской'}
          </h2>

          <p className="text-sm sm:text-base text-emerald-200/80 leading-relaxed">
            {isKg
              ? 'Мыкты мугалимдер менен түз эфирде сабак өтүңүз, маселелерди чогуу чыгарыңыз, үй тапшырмаларды тапшырып жана жеке прогрессиңизди көзөмөлдөңүз.'
              : 'Занимайтесь в живом эфире с лучшими преподавателями Кыргызстана, решайте задачи на общей доске, сдавайте ДЗ и отслеживайте персональный рейтинг.'}
          </p>

          {/* Quick Feature Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-[#031510]/80 px-3 py-1.5 rounded-xl border border-emerald-800/60">
              <Video className="w-3.5 h-3.5 text-rose-400" />
              <span>{isKg ? 'Түз видео сабактар' : 'Живые видеоуроки'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-[#031510]/80 px-3 py-1.5 rounded-xl border border-emerald-800/60">
              <PenTool className="w-3.5 h-3.5 text-amber-400" />
              <span>{isKg ? 'Интерактивдүү такта' : 'Интерактивная доска'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-[#031510]/80 px-3 py-1.5 rounded-xl border border-emerald-800/60">
              <Users className="w-3.5 h-3.5 text-teal-400" />
              <span>{isKg ? '12-15 окуучулуу чакан топтор' : 'Мини-группы 12-15 человек'}</span>
            </div>
          </div>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute right-4 -bottom-10 opacity-5 pointer-events-none text-white text-[160px] font-black select-none hidden lg:block">
          ОРТ
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Subject Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {subjectFilters.map((sub) => (
            <button
              key={sub.id}
              type="button"
              onClick={() => setSelectedSubject(sub.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                selectedSubject === sub.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25'
                  : 'bg-[#041a14] border border-emerald-800/60 text-emerald-200/80 hover:bg-emerald-900/40 hover:text-white'
              }`}
            >
              {isKg ? sub.labelKg : sub.labelRu}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-emerald-400/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isKg ? 'Курстардан издөө...' : 'Поиск по курсам и темам...'}
            className="w-full bg-[#041a14] border border-emerald-800/70 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
          />
        </div>
      </div>

      {/* Course Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCourses.map((course) => {
          const isEnrolled = enrolledCourseIds.includes(course.id) || isVip || isAdmin;
          const spotsLeft = course.totalSpots - course.enrolledCount;
          const fillPercentage = Math.round((course.enrolledCount / course.totalSpots) * 100);

          return (
            <div
              key={course.id}
              className="bg-[#052219] border border-emerald-800/60 hover:border-emerald-500/80 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-5 transition-all duration-200 group"
            >
              {/* Header Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-black uppercase tracking-wider">
                    {isKg ? course.subjectNameKg : course.subjectNameRu}
                  </span>

                  {/* Goal Badge */}
                  <span className="px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-[11px] font-black flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    <span>{isKg ? course.targetBadgeKg : course.targetBadgeRu}</span>
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-emerald-300 transition-colors leading-snug">
                  {isKg ? course.titleKg : course.titleRu}
                </h3>

                <p className="text-xs text-emerald-200/70 line-clamp-2 leading-relaxed">
                  {isKg ? course.descriptionKg : course.descriptionRu}
                </p>

                {/* Teacher Info */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#031510] border border-emerald-800/60">
                  <img
                    src={course.teacher.avatar}
                    alt={course.teacher.name}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-xl object-cover border border-emerald-400/40 shadow-sm"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-black text-white truncate flex items-center gap-1.5">
                      <span>{course.teacher.name}</span>
                      <span className="text-[10px] text-amber-300 font-bold px-1.5 py-0.2 rounded bg-amber-400/15">
                        {course.teacher.ortScore} {isKg ? 'балл ЖРТ' : 'б. ОРТ'}
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-200/60 truncate">
                      {isKg ? course.teacher.titleKg : course.teacher.title}
                    </p>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isKg ? 'Топтун толушу:' : 'Набор в группу:'}</span>
                    </span>
                    <span className="text-emerald-300">
                      {course.enrolledCount} / {course.totalSpots} {isKg ? 'окуучу' : 'учеников'} ({spotsLeft} {isKg ? 'бош' : 'осталось'})
                    </span>
                  </div>
                  <div className="w-full bg-[#020e0b] rounded-full h-2 overflow-hidden border border-emerald-950">
                    <div
                      className={`h-full rounded-full transition-all ${
                        fillPercentage >= 80 ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${fillPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Schedule preview */}
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span className="truncate">
                    {course.schedule.map((s) => (isKg ? s.dayNameKg : s.dayNameRu)).join(', ')} • {course.nextLessonTime}
                  </span>
                </div>
              </div>

              {/* Card Footer: Price & Action */}
              <div className="pt-4 border-t border-emerald-800/50 flex items-center justify-between gap-3">
                <div>
                  <div className="text-base sm:text-lg font-black text-emerald-300">
                    {course.priceSom.toLocaleString('ru-RU')} сом
                  </div>
                  <div className="text-[10px] text-emerald-200/60">
                    {isKg ? course.periodLabelKg : course.periodLabelRu}
                  </div>
                </div>

                {isEnrolled ? (
                  <button
                    type="button"
                    onClick={() => setActiveClassroomCourse(course)}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>{isKg ? 'Класска кирүү' : 'Войти в класс'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEnrollingCourse(course)}
                    className="px-5 py-2.5 rounded-2xl bg-[#031510] hover:bg-emerald-500 hover:text-slate-950 border border-emerald-500/60 text-emerald-300 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>{isKg ? 'Жазылуу' : 'Записаться'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Enrollment Modal */}
      {enrollingCourse && (
        <CourseEnrollModal
          course={enrollingCourse}
          lang={lang}
          onClose={() => setEnrollingCourse(null)}
          onEnrollSuccess={handleEnrollSuccess}
        />
      )}
    </div>
  );
};
