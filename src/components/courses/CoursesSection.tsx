import React, { useState, useEffect } from 'react';
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
  BookOpen,
  Crown,
  ChevronRight,
  ArrowRight,
  Trash2,
  Layers,
  Info,
} from 'lucide-react';
import { AppLanguage } from '../../types';
import { CourseGroup, CourseSubject } from '../../types/courses';
import { COURSES_DATA, MOCK_STUDENT_COURSE_PROFILE } from '../../data/coursesData';
import { getStoredCourses, saveStoredCourses } from '../../data/coursesStorage';
import { CourseClassroom } from './CourseClassroom';
import { CourseEnrollModal } from './CourseEnrollModal';
import { CourseDetailModal } from './CourseDetailModal';
import { useAuth } from '../../context/AuthContext';

interface CoursesSectionProps {
  lang: AppLanguage;
}

const STORAGE_KEY = 'kyrgyz_akylman_courses_v3';

export const CoursesSection: React.FC<CoursesSectionProps> = ({ lang }) => {
  const { user, isVip, isPremium, isAdmin } = useAuth();
  const isKg = lang === 'kg';

  // Load courses from storage
  const [courses, setCourses] = useState<CourseGroup[]>(() => {
    return getStoredCourses();
  });

  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [activeClassroomCourse, setActiveClassroomCourse] = useState<CourseGroup | null>(null);
  const [enrollingCourse, setEnrollingCourse] = useState<CourseGroup | null>(null);
  const [detailedCourse, setDetailedCourse] = useState<CourseGroup | null>(null);

  // Enrolled course IDs
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kyrgyz_akylman_enrolled_courses');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  useEffect(() => {
    const handleCoursesUpdate = () => {
      setCourses(getStoredCourses());
    };
    window.addEventListener('kyrgyz_akylman_courses_updated', handleCoursesUpdate);
    return () => {
      window.removeEventListener('kyrgyz_akylman_courses_updated', handleCoursesUpdate);
    };
  }, []);

  // Save enrollments
  useEffect(() => {
    try {
      localStorage.setItem('kyrgyz_akylman_enrolled_courses', JSON.stringify(enrolledCourseIds));
    } catch (e) {
      console.error('Error saving enrollments:', e);
    }
  }, [enrolledCourseIds]);

  const handleDeleteCourse = (courseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = window.confirm(
      isKg
        ? 'Бул курсту өчүрүүнү каалайсызбы?'
        : 'Вы уверены, что хотите удалить этот курс?'
    );
    if (confirmed) {
      const updated = courses.filter((c) => c.id !== courseId);
      setCourses(updated);
      saveStoredCourses(updated);
    }
  };

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
    return matchesSubject;
  });

  const subjectFilters = [
    { id: 'all', labelRu: 'Все предметы', labelKg: 'Бардык сабактар' },
    { id: 'math', labelRu: 'Математика', labelKg: 'Математика' },
    { id: 'english', labelRu: 'Английский язык', labelKg: 'Англис тили' },
    { id: 'russian', labelRu: 'Русский язык', labelKg: 'Орус тили' },
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
      {/* Top Hero / Banner with Kyrgyzstan Map Background */}
      <div className="relative overflow-hidden border border-emerald-700/60 rounded-3xl p-6 sm:p-9 shadow-2xl bg-[#031912]">
        {/* Kyrgyzstan Map Background: scaled down and contained so all national borders are fully visible and recognizable */}
        <div className="absolute inset-y-0 right-0 w-full sm:w-[65%] lg:w-[55%] flex items-center justify-end p-3 sm:p-6 pointer-events-none select-none">
          <img
            src="/images/kyrgyzstan_map.jpg"
            alt="Кыргызстан картасы"
            className="w-full h-full max-h-[240px] sm:max-h-[290px] object-contain opacity-45 mix-blend-screen brightness-110 contrast-125 filter drop-shadow-xl"
          />
        </div>

        {/* Soft emerald gradient overlay to maintain crisp typography readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#031912] via-[#031912]/85 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black uppercase tracking-wider backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isKg ? 'Онлайн курстар & Мастер класстар' : 'Онлайн курсы & Мастер классы'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            {isKg
              ? 'ЖРТга онлайн топтордо & жекече даярдануу'
              : 'Подготовка к ОРТ онлайн в группах & индивидуально'}
          </h2>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-medium">
            {isKg
              ? 'Сүйүктүү мугалимдериңиз менен түз эфирде сабак өтүңүз, интерактивдүү тактада маселелерди чыгарыңыз жана чакан топтордо мыкты жыйынтыкка жетишиңиз.'
              : 'Занимайтесь в живом эфире с любимыми преподавателями, решайте задачи на интерактивной доске в небольших группах для максимального результата и высоких баллов.'}
          </p>

          {/* Quick Feature Badges (strictly 6-10 students) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-200 bg-[#031510]/90 px-3 py-1.5 rounded-xl border border-emerald-700/60 shadow-sm backdrop-blur-sm">
              <Video className="w-3.5 h-3.5 text-rose-400" />
              <span>{isKg ? 'Түз видео сабактар' : 'Живые видеоуроки'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-200 bg-[#031510]/90 px-3 py-1.5 rounded-xl border border-emerald-700/60 shadow-sm backdrop-blur-sm">
              <PenTool className="w-3.5 h-3.5 text-amber-400" />
              <span>{isKg ? 'Интерактивдүү такта' : 'Интерактивная доска'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-200 bg-[#031510]/90 px-3 py-1.5 rounded-xl border border-emerald-700/60 shadow-sm backdrop-blur-sm">
              <Users className="w-3.5 h-3.5 text-teal-400" />
              <span>{isKg ? 'Мини-топтор 6–10 окуучу' : 'Мини-группы 6–10 человек'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Filter Pills (Search Bar and Create Course button removed) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {subjectFilters.map((sub) => (
          <button
            key={sub.id}
            type="button"
            onClick={() => setSelectedSubject(sub.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
              selectedSubject === sub.id
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25'
                : 'bg-[#041a14] border border-emerald-800/60 text-emerald-200/80 hover:bg-emerald-900/40 hover:text-white'
            }`}
          >
            {isKg ? sub.labelKg : sub.labelRu}
          </button>
        ))}
      </div>

      {/* Course Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCourses.length === 0 ? (
          <div className="col-span-full py-12 px-4 text-center bg-[#041a14] border border-emerald-900/70 rounded-3xl space-y-3">
            <BookOpen className="w-12 h-12 text-emerald-600 mx-auto opacity-70" />
            <h3 className="text-base font-bold text-white">
              {isKg ? 'Курстар табылган жок' : 'Курсы не найдены'}
            </h3>
            <p className="text-xs text-emerald-200/60 max-w-sm mx-auto">
              {isKg
                ? 'Издөө параметрин же предмет чыпкасын өзгөртүп көрүңүз.'
                : 'Попробуйте изменить поисковый запрос или выбрать другой предмет.'}
            </p>
          </div>
        ) : (
          filteredCourses.map((course) => {
            const isEnrolled = enrolledCourseIds.includes(course.id);
            const spotsLeft = Math.max(0, course.totalSpots - course.enrolledCount);
            const fillPercentage = Math.min(
              100,
              Math.round((course.enrolledCount / course.totalSpots) * 100)
            );

            // Subject label & Module label
            const displaySubject = isKg ? course.subjectNameKg : (course.subjectNameRu || 'Математика');
            const displayModule = isKg
              ? (course.moduleNameKg || 'Негизги модуль')
              : (course.moduleNameRu || 'Базовый модуль');

            return (
              <div
                key={course.id}
                className="relative bg-gradient-to-b from-[#05261c] to-[#031510] border border-emerald-700/60 hover:border-emerald-500/80 rounded-3xl p-5 sm:p-6 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between group space-y-5"
              >
                <div className="space-y-4">
                  {/* Top Badges Row: "Предмет" & "Модуль" */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Badge 1: Предмет */}
                      <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                        <span>
                          {isKg ? 'Предмет:' : 'Предмет:'} {displaySubject}
                        </span>
                      </span>

                      {/* Badge 2: Модуль */}
                      <span className="px-3 py-1 rounded-full bg-teal-500/15 border border-teal-400/40 text-teal-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-teal-400" />
                        <span>
                          {isKg ? 'Модуль:' : 'Модуль:'} {displayModule}
                        </span>
                      </span>
                    </div>

                    {/* Admin Delete Action */}
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={(e) => handleDeleteCourse(course.id, e)}
                        className="p-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 hover:text-white transition-colors cursor-pointer"
                        title={isKg ? 'Курсту өчүрүү' : 'Удалить курс'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Course Title & Description */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-emerald-300 transition-colors leading-snug">
                      {isKg ? course.titleKg : course.titleRu}
                    </h3>
                    <p className="text-xs text-emerald-200/70 mt-2 line-clamp-2 leading-relaxed">
                      {isKg ? course.descriptionKg : course.descriptionRu}
                    </p>
                  </div>

                  {/* Teacher Info Card with Photo */}
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#020e0b]/80 border border-emerald-900/60">
                    <img
                      src={course.teacher.avatar}
                      alt={course.teacher.name}
                      className="w-12 h-12 rounded-xl object-cover border border-emerald-500/40 bg-emerald-950 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-black text-white truncate flex items-center gap-1.5">
                        <span className="truncate">{course.teacher.name}</span>
                        {course.teacher.ortScore && (
                          <span className="text-[10px] text-amber-300 font-bold px-1.5 py-0.2 rounded bg-amber-400/15 shrink-0">
                            {course.teacher.ortScore} {isKg ? 'балл ЖРТ' : 'б. ОРТ'}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-emerald-200/60 truncate">
                        {isKg ? course.teacher.titleKg : course.teacher.title}
                      </p>
                    </div>
                  </div>

                  {/* Capacity Progress Bar (6-10 students) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{isKg ? 'Топтун толушу (6–10):' : 'Набор в группу (6–10):'}</span>
                      </span>
                      <span className="text-emerald-300">
                        {course.enrolledCount} / {course.totalSpots} {isKg ? 'окуучу' : 'учеников'} (
                        {spotsLeft} {isKg ? 'бош орун' : 'мест осталось'})
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

                  {/* Schedule preview with Days format */}
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span className="truncate font-semibold">
                      📅 {course.daysScheduleFormat || 'Пн-Пт'} • {course.nextLessonTime || '18:00'} (Бишкек GMT+6)
                    </span>
                  </div>
                </div>

                {/* Card Footer: Price & Action Buttons ("Записаться" + "Подробнее") */}
                <div className="pt-4 border-t border-emerald-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-base sm:text-lg font-black text-amber-300">
                      {course.priceSom.toLocaleString('ru-RU')} сом
                    </div>
                    <div className="text-[10px] text-emerald-200/60">
                      {isKg ? course.periodLabelKg : course.periodLabelRu}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {/* "Подробнее" button */}
                    <button
                      type="button"
                      onClick={() => setDetailedCourse(course)}
                      className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-emerald-700/60 text-emerald-200 hover:text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer text-center"
                    >
                      {isKg ? 'Кененирээк' : 'Подробнее'}
                    </button>

                    {/* "Записаться" / "Войти в класс" button */}
                    {isEnrolled ? (
                      <button
                        type="button"
                        onClick={() => setActiveClassroomCourse(course)}
                        className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer text-center"
                      >
                        <span>{isKg ? 'Класска кирүү' : 'Войти в класс'}</span>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setEnrollingCourse(course)}
                        className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-[#031510] hover:bg-emerald-500 hover:text-slate-950 border border-emerald-500/60 text-emerald-300 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
                      >
                        <span>{isKg ? 'Жазылуу' : 'Записаться'}</span>
                        <ChevronRight className="w-4 h-4 shrink-0" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
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

      {/* Course Detail Modal */}
      {detailedCourse && (
        <CourseDetailModal
          course={detailedCourse}
          lang={lang}
          isEnrolled={enrolledCourseIds.includes(detailedCourse.id)}
          onClose={() => setDetailedCourse(null)}
          onEnroll={() => setEnrollingCourse(detailedCourse)}
          onEnterClassroom={() => setActiveClassroomCourse(detailedCourse)}
        />
      )}
    </div>
  );
};
