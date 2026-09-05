import React, { useState, useEffect } from 'react';
import {
  School,
  Plus,
  Edit2,
  Trash2,
  Users,
  Calendar,
  Clock,
  Video,
  BookOpen,
  CheckCircle2,
  X,
  Save,
  RotateCcw,
  Sparkles,
  Search,
  ExternalLink,
  Award,
  Phone,
  Mail,
  UserPlus,
  FileText,
  Radio,
  Crown,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { CourseGroup, CourseLesson, CourseHomework, CourseScheduleItem } from '../../types/courses';
import {
  getStoredCourses,
  saveStoredCourses,
  resetStoredCourses,
  getStoredStudents,
  saveStoredStudents,
  EnrolledStudentRecord,
} from '../../data/coursesStorage';
import { COURSE_TEMPLATE_PREVIEW } from '../../data/coursesData';

export const CoursesAdminManager: React.FC = () => {
  const [courses, setCourses] = useState<CourseGroup[]>([]);
  const [students, setStudents] = useState<EnrolledStudentRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dedicated Preview Template State
  const [previewTemplate, setPreviewTemplate] = useState<CourseGroup>(() => COURSE_TEMPLATE_PREVIEW);
  const [templateToast, setTemplateToast] = useState<string | null>(null);

  // Modals
  const [editingCourse, setEditingCourse] = useState<CourseGroup | null>(null);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [activeCourseForLessons, setActiveCourseForLessons] = useState<CourseGroup | null>(null);
  const [activeCourseForStudents, setActiveCourseForStudents] = useState<CourseGroup | null>(null);
  const [activeCourseForHomeworks, setActiveCourseForHomeworks] = useState<CourseGroup | null>(null);

  // Sub-modal states
  const [editingLesson, setEditingLesson] = useState<{ lesson: CourseLesson; isNew: boolean } | null>(null);
  const [editingStudent, setEditingStudent] = useState<{ student: EnrolledStudentRecord; isNew: boolean } | null>(null);
  const [editingHomework, setEditingHomework] = useState<{ hw: CourseHomework; isNew: boolean } | null>(null);

  const loadData = () => {
    setCourses(getStoredCourses());
    setStudents(getStoredStudents());
  };

  useEffect(() => {
    loadData();
    const handleCoursesUpdate = () => loadData();
    window.addEventListener('kyrgyz_akylman_courses_updated', handleCoursesUpdate);
    window.addEventListener('kyrgyz_akylman_students_updated', handleCoursesUpdate);
    return () => {
      window.removeEventListener('kyrgyz_akylman_courses_updated', handleCoursesUpdate);
      window.removeEventListener('kyrgyz_akylman_students_updated', handleCoursesUpdate);
    };
  }, []);

  const handleSaveCourse = (courseData: CourseGroup) => {
    let updated: CourseGroup[];
    if (isCreatingCourse) {
      updated = [...courses, { ...courseData, id: `course-${Date.now()}` }];
    } else {
      updated = courses.map((c) => (c.id === courseData.id ? courseData : c));
    }
    saveStoredCourses(updated);
    setCourses(updated);
    setEditingCourse(null);
    setIsCreatingCourse(false);
  };

  const handleDeleteCourse = (courseId: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот курс?')) return;
    const updated = courses.filter((c) => c.id !== courseId);
    saveStoredCourses(updated);
    setCourses(updated);
  };

  const handleResetToDefault = () => {
    if (!window.confirm('Сбросить список курсов к исходному состоянию?')) return;
    const defaultData = resetStoredCourses();
    setCourses(defaultData);
  };

  const handlePublishFromTemplate = () => {
    const newCourse: CourseGroup = {
      ...previewTemplate,
      id: `course-${Date.now()}`,
      enrolledCount: 0,
      lessons: previewTemplate.lessons && previewTemplate.lessons.length > 0 ? previewTemplate.lessons : [],
      homeworks: previewTemplate.homeworks && previewTemplate.homeworks.length > 0 ? previewTemplate.homeworks : [],
      chatMessages: [],
    };
    const updated = [newCourse, ...courses];
    saveStoredCourses(updated);
    setCourses(updated);
    setTemplateToast(`Курс «${newCourse.titleRu}» успешно создан и опубликован в каталоге!`);
    setTimeout(() => setTemplateToast(null), 4000);
  };

  // Lesson actions
  const handleSaveLesson = (lesson: CourseLesson, isNew: boolean) => {
    if (!activeCourseForLessons) return;
    let updatedLessons: CourseLesson[];
    if (isNew) {
      updatedLessons = [...activeCourseForLessons.lessons, { ...lesson, id: `lesson-${Date.now()}` }];
    } else {
      updatedLessons = activeCourseForLessons.lessons.map((l) => (l.id === lesson.id ? lesson : l));
    }
    const updatedCourse = { ...activeCourseForLessons, lessons: updatedLessons };
    const updatedAll = courses.map((c) => (c.id === updatedCourse.id ? updatedCourse : c));
    saveStoredCourses(updatedAll);
    setCourses(updatedAll);
    setActiveCourseForLessons(updatedCourse);
    setEditingLesson(null);
  };

  const handleDeleteLesson = (lessonId: string) => {
    if (!activeCourseForLessons || !window.confirm('Удалить этот урок?')) return;
    const updatedLessons = activeCourseForLessons.lessons.filter((l) => l.id !== lessonId);
    const updatedCourse = { ...activeCourseForLessons, lessons: updatedLessons };
    const updatedAll = courses.map((c) => (c.id === updatedCourse.id ? updatedCourse : c));
    saveStoredCourses(updatedAll);
    setCourses(updatedAll);
    setActiveCourseForLessons(updatedCourse);
  };

  const handleToggleLessonLive = (lessonId: string) => {
    if (!activeCourseForLessons) return;
    const updatedLessons = activeCourseForLessons.lessons.map((l) => {
      if (l.id === lessonId) {
        return {
          ...l,
          status: (l.status === 'live' ? 'completed' : 'live') as CourseLesson['status'],
        };
      }
      return l;
    });
    const hasLive = updatedLessons.some((l) => l.status === 'live');
    const updatedCourse = { ...activeCourseForLessons, lessons: updatedLessons, isLiveNow: hasLive };
    const updatedAll = courses.map((c) => (c.id === updatedCourse.id ? updatedCourse : c));
    saveStoredCourses(updatedAll);
    setCourses(updatedAll);
    setActiveCourseForLessons(updatedCourse);
  };

  // Student actions
  const handleSaveStudent = (student: EnrolledStudentRecord, isNew: boolean) => {
    let updated: EnrolledStudentRecord[];
    if (isNew) {
      updated = [
        ...students,
        { ...student, id: `std-${Date.now()}`, enrolledAt: new Date().toISOString().slice(0, 10) },
      ];
    } else {
      updated = students.map((s) => (s.id === student.id ? student : s));
    }
    saveStoredStudents(updated);
    setStudents(updated);
    setEditingStudent(null);
  };

  const handleDeleteStudent = (studentId: string) => {
    if (!window.confirm('Удалить ученика из группы?')) return;
    const updated = students.filter((s) => s.id !== studentId);
    saveStoredStudents(updated);
    setStudents(updated);
  };

  // Homework actions
  const handleSaveHomework = (hw: CourseHomework, isNew: boolean) => {
    if (!activeCourseForHomeworks) return;
    let updatedHws: CourseHomework[];
    if (isNew) {
      updatedHws = [...activeCourseForHomeworks.homeworks, { ...hw, id: `hw-${Date.now()}` }];
    } else {
      updatedHws = activeCourseForHomeworks.homeworks.map((h) => (h.id === hw.id ? hw : h));
    }
    const updatedCourse = { ...activeCourseForHomeworks, homeworks: updatedHws };
    const updatedAll = courses.map((c) => (c.id === updatedCourse.id ? updatedCourse : c));
    saveStoredCourses(updatedAll);
    setCourses(updatedAll);
    setActiveCourseForHomeworks(updatedCourse);
    setEditingHomework(null);
  };

  const handleDeleteHomework = (hwId: string) => {
    if (!activeCourseForHomeworks || !window.confirm('Удалить домашнее задание?')) return;
    const updatedHws = activeCourseForHomeworks.homeworks.filter((h) => h.id !== hwId);
    const updatedCourse = { ...activeCourseForHomeworks, homeworks: updatedHws };
    const updatedAll = courses.map((c) => (c.id === updatedCourse.id ? updatedCourse : c));
    saveStoredCourses(updatedAll);
    setCourses(updatedAll);
    setActiveCourseForHomeworks(updatedCourse);
  };

  const totalLessonsCount = courses.reduce((sum, c) => sum + (c.lessons?.length || 0), 0);
  const totalHomeworksCount = courses.reduce((sum, c) => sum + (c.homeworks?.length || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner & Fast Actions */}
      <div className="bg-[#05261c] border border-emerald-800/60 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
                <School className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Управление онлайн-курсами и учебными группами
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-emerald-300/80">
              Создание курсов, расписание 40 уроков, списки записанных учеников, живые эфиры и проверка домашних заданий.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-3.5 py-2.5 rounded-xl border border-emerald-700/60 bg-emerald-950/60 hover:bg-emerald-900/60 text-xs font-bold text-emerald-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
              title="Сбросить список курсов"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Сбросить курсы</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsCreatingCourse(true);
                setEditingCourse({
                  ...COURSE_TEMPLATE_PREVIEW,
                  id: `course-${Date.now()}`,
                  titleRu: 'Новый курс ОРТ',
                  titleKg: 'Жаңы ЖРТ курсу',
                  enrolledCount: 0,
                  lessons: [],
                  homeworks: [],
                });
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-95 hover:brightness-105"
            >
              <Plus className="w-4 h-4" />
              <span>Создать курс вручную</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-emerald-800/60">
          <div className="bg-[#031510] border border-emerald-800/40 rounded-2xl p-3.5">
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Всего курсов в каталоге</div>
            <div className="text-2xl font-black text-white mt-1">{courses.length}</div>
          </div>
          <div className="bg-[#031510] border border-emerald-800/40 rounded-2xl p-3.5">
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Учеников в списках</div>
            <div className="text-2xl font-black text-white mt-1">{students.length}</div>
          </div>
          <div className="bg-[#031510] border border-emerald-800/40 rounded-2xl p-3.5">
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Всего уроков</div>
            <div className="text-2xl font-black text-white mt-1">{totalLessonsCount}</div>
          </div>
          <div className="bg-[#031510] border border-emerald-800/40 rounded-2xl p-3.5">
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Домашних заданий</div>
            <div className="text-2xl font-black text-white mt-1">{totalHomeworksCount}</div>
          </div>
        </div>
      </div>

      {/* --- DEDICATED ADMIN BLOCK: COURSE PREVIEW TEMPLATE --- */}
      <div className="bg-gradient-to-br from-[#06291f] via-[#041d16] to-[#02140f] border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Специальный блок для курсов • Шаблон предпросмотра</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Шаблон прямоугольного предварительного просмотра курса
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200/80 max-w-2xl leading-relaxed">
              Настройте параметры шаблона (Предмет, Модуль, Преподаватель, График, Цена) и сразу проверьте, как карточка будет смотреться у учеников. Опубликуйте курс в каталог в один клик.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setPreviewTemplate(COURSE_TEMPLATE_PREVIEW)}
              className="px-3.5 py-2.5 rounded-xl border border-emerald-700/60 bg-[#031510] hover:bg-emerald-900/50 text-emerald-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Сбросить шаблон к эталонному виду"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Сбросить к эталону</span>
            </button>
            <button
              type="button"
              onClick={handlePublishFromTemplate}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Опубликовать в каталог</span>
            </button>
          </div>
        </div>

        {templateToast && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{templateToast}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Template Parameters Form (7 cols) */}
          <div className="lg:col-span-6 bg-[#031510]/90 border border-emerald-800/70 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-900/80">
              <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">
                Параметры шаблона курса
              </span>
              <span className="text-[11px] text-emerald-300/70">Редактируйте на лету</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Предмет */}
              <div>
                <label className="block text-[11px] font-bold text-emerald-300/80 mb-1">
                  Предмет курса
                </label>
                <select
                  value={previewTemplate.subject}
                  onChange={(e) => {
                    const subj = e.target.value as any;
                    const subjectNames: Record<string, { ru: string; kg: string }> = {
                      math: { ru: 'Математика', kg: 'Математика' },
                      kyrgyz: { ru: 'Кыргыз тили', kg: 'Кыргыз тили' },
                      english: { ru: 'Английский язык', kg: 'Англис тили' },
                      russian: { ru: 'Русский язык', kg: 'Орус тили' },
                      history: { ru: 'История Кыргызстана', kg: 'Кыргызстан тарыхы' },
                      chemistry: { ru: 'Химия', kg: 'Химия' },
                      biology: { ru: 'Биология', kg: 'Биология' },
                    };
                    const match = subjectNames[subj] || { ru: 'Математика', kg: 'Математика' };
                    setPreviewTemplate((prev) => ({
                      ...prev,
                      subject: subj,
                      subjectNameRu: match.ru,
                      subjectNameKg: match.kg,
                    }));
                  }}
                  className="w-full bg-[#020e0b] border border-emerald-800/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="math">Математика</option>
                  <option value="kyrgyz">Кыргыз тили</option>
                  <option value="english">Английский язык</option>
                  <option value="russian">Русский язык</option>
                  <option value="history">История</option>
                  <option value="chemistry">Химия</option>
                  <option value="biology">Биология</option>
                </select>
              </div>

              {/* Модуль */}
              <div>
                <label className="block text-[11px] font-bold text-emerald-300/80 mb-1">
                  Модуль курса
                </label>
                <input
                  type="text"
                  value={previewTemplate.moduleNameRu}
                  onChange={(e) =>
                    setPreviewTemplate((prev) => ({
                      ...prev,
                      moduleNameRu: e.target.value,
                      moduleNameKg: e.target.value,
                    }))
                  }
                  placeholder="Интенсивный модуль / Базовый / 220+"
                  className="w-full bg-[#020e0b] border border-emerald-800/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Название курса */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-emerald-300/80 mb-1">
                  Название курса (Заголовок карточки)
                </label>
                <input
                  type="text"
                  value={previewTemplate.titleRu}
                  onChange={(e) =>
                    setPreviewTemplate((prev) => ({
                      ...prev,
                      titleRu: e.target.value,
                      titleKg: e.target.value,
                    }))
                  }
                  placeholder="Математика: Интенсивная подготовка к ОРТ"
                  className="w-full bg-[#020e0b] border border-emerald-800/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Преподаватель */}
              <div>
                <label className="block text-[11px] font-bold text-emerald-300/80 mb-1">
                  Преподаватель (ФИО)
                </label>
                <input
                  type="text"
                  value={previewTemplate.teacher.name}
                  onChange={(e) =>
                    setPreviewTemplate((prev) => ({
                      ...prev,
                      teacher: { ...prev.teacher, name: e.target.value, nameKg: e.target.value },
                    }))
                  }
                  placeholder="Мадылбаев Абдраим Турусбекович"
                  className="w-full bg-[#020e0b] border border-emerald-800/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Регалии преподавателя */}
              <div>
                <label className="block text-[11px] font-bold text-emerald-300/80 mb-1">
                  Должность / Регалии
                </label>
                <input
                  type="text"
                  value={previewTemplate.teacher.title}
                  onChange={(e) =>
                    setPreviewTemplate((prev) => ({
                      ...prev,
                      teacher: { ...prev.teacher, title: e.target.value, titleKg: e.target.value },
                    }))
                  }
                  placeholder="Главный преподаватель и эксперт ОРТ"
                  className="w-full bg-[#020e0b] border border-emerald-800/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Фото преподавателя */}
              <div>
                <label className="block text-[11px] font-bold text-emerald-300/80 mb-1">
                  Фото преподавателя (URL или Загрузить файл)
                </label>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl overflow-hidden border border-emerald-700/60 bg-[#020e0b] shrink-0 flex items-center justify-center">
                    {previewTemplate.teacher.avatar ? (
                      <img
                        src={previewTemplate.teacher.avatar}
                        alt="Преподаватель"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-emerald-400/50" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={previewTemplate.teacher.avatar}
                    onChange={(e) =>
                      setPreviewTemplate((prev) => ({
                        ...prev,
                        teacher: { ...prev.teacher, avatar: e.target.value },
                      }))
                    }
                    placeholder="URL фото (Cloudinary / прямая ссылка)"
                    className="flex-1 min-w-0 bg-[#020e0b] border border-emerald-800/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                  <label className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-emerald-800/60 hover:bg-emerald-700/70 border border-emerald-600/60 text-emerald-200 text-xs font-bold cursor-pointer transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Файл</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setPreviewTemplate((prev) => ({
                                ...prev,
                                teacher: { ...prev.teacher, avatar: event.target.result as string },
                              }));
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* График занятий */}
              <div>
                <label className="block text-[11px] font-bold text-emerald-300/80 mb-1">
                  Дни занятий (График)
                </label>
                <input
                  type="text"
                  value={previewTemplate.daysScheduleFormat}
                  onChange={(e) =>
                    setPreviewTemplate((prev) => ({
                      ...prev,
                      daysScheduleFormat: e.target.value,
                    }))
                  }
                  placeholder="Пн-Ср-Пт или Пн-Пт"
                  className="w-full bg-[#020e0b] border border-emerald-800/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Время урока */}
              <div>
                <label className="block text-[11px] font-bold text-emerald-300/80 mb-1">
                  Время занятий
                </label>
                <input
                  type="text"
                  value={previewTemplate.nextLessonTime}
                  onChange={(e) =>
                    setPreviewTemplate((prev) => ({
                      ...prev,
                      nextLessonTime: e.target.value,
                    }))
                  }
                  placeholder="18:00"
                  className="w-full bg-[#020e0b] border border-emerald-800/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Стоимость курса */}
              <div>
                <label className="block text-[11px] font-bold text-emerald-300/80 mb-1">
                  Стоимость (сом)
                </label>
                <input
                  type="number"
                  value={previewTemplate.priceSom}
                  onChange={(e) =>
                    setPreviewTemplate((prev) => ({
                      ...prev,
                      priceSom: Number(e.target.value) || 0,
                    }))
                  }
                  placeholder="4000"
                  className="w-full bg-[#020e0b] border border-emerald-800/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Лимит мест */}
              <div>
                <label className="block text-[11px] font-bold text-emerald-300/80 mb-1">
                  Лимит мест в мини-группе
                </label>
                <input
                  type="number"
                  value={previewTemplate.totalSpots}
                  onChange={(e) =>
                    setPreviewTemplate((prev) => ({
                      ...prev,
                      totalSpots: Number(e.target.value) || 10,
                    }))
                  }
                  placeholder="10"
                  className="w-full bg-[#020e0b] border border-emerald-800/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Целевой балл */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-emerald-300/80 mb-1">
                  Целевой бейдж (Баллы ОРТ)
                </label>
                <input
                  type="text"
                  value={previewTemplate.targetBadgeRu}
                  onChange={(e) =>
                    setPreviewTemplate((prev) => ({
                      ...prev,
                      targetBadgeRu: e.target.value,
                      targetBadgeKg: e.target.value,
                    }))
                  }
                  placeholder="Цель: 220+ баллов на ОРТ"
                  className="w-full bg-[#020e0b] border border-emerald-800/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Rectangular Live Preview Card (6 cols) */}
          <div className="lg:col-span-6 space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black uppercase text-amber-300 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Прямоугольный предпросмотр (как на сайте)</span>
              </span>
              <span className="text-[10px] text-emerald-300/60 font-mono">100% LIVE PREVIEW</span>
            </div>

            {/* The exact rectangular card template */}
            <div className="relative flex flex-col justify-between bg-gradient-to-b from-[#05261d] to-[#031711] border-2 border-emerald-500/80 rounded-3xl p-6 shadow-2xl space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 uppercase tracking-wide">
                  {previewTemplate.moduleNameRu || 'Интенсивный модуль'}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30">
                  {previewTemplate.targetBadgeRu || 'Цель: 220+ баллов'}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-[#020e0b] text-emerald-400 border border-emerald-800/60 ml-auto uppercase">
                  {previewTemplate.subjectNameRu || 'Математика'}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h4 className="text-lg sm:text-xl font-black text-white">
                  {previewTemplate.titleRu || 'Математика: Интенсивная подготовка к ОРТ'}
                </h4>
                <p className="text-xs text-emerald-200/70 mt-2 line-clamp-2 leading-relaxed">
                  {previewTemplate.descriptionRu}
                </p>
              </div>

              {/* Teacher Info */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#031510]/90 border border-emerald-800/60">
                <img
                  src={previewTemplate.teacher.avatar}
                  alt={previewTemplate.teacher.name}
                  className="w-12 h-12 rounded-xl object-cover border border-emerald-400/40 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h5 className="text-xs sm:text-sm font-black text-white truncate">
                      {previewTemplate.teacher.name || 'Мадылбаев Абдраим Турусбекович'}
                    </h5>
                    <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  </div>
                  <p className="text-[11px] text-emerald-300/80 truncate">
                    {previewTemplate.teacher.title || 'Главный преподаватель и эксперт ОРТ'}
                  </p>
                  <p className="text-[10px] text-emerald-400 font-semibold">
                    ОРТ: {previewTemplate.teacher.ortScore} балл • {previewTemplate.teacher.experienceYears} лет стажа
                  </p>
                </div>
              </div>

              {/* Highlights (Schedule, Time) */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#031510]/70 border border-emerald-900/60 text-emerald-200/90">
                  <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate font-semibold">{previewTemplate.daysScheduleFormat || 'Пн-Ср-Пт'}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#031510]/70 border border-emerald-900/60 text-emerald-200/90">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate font-semibold">{previewTemplate.nextLessonTime || '18:00'} (1 час)</span>
                </div>
              </div>

              {/* Spots Progress Bar (strictly 6-10 students) */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-emerald-300/80 font-bold flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Мини-группа:</span>
                  </span>
                  <span className="font-black text-white">
                    0 из {previewTemplate.totalSpots || 10} мест
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#020e0b] border border-emerald-900 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                    style={{ width: '0%' }}
                  />
                </div>
                <p className="text-[10px] text-emerald-400/80 text-right">
                  Осталось {previewTemplate.totalSpots || 10} мест (набор открыт)
                </p>
              </div>

              {/* Bottom Price & Button */}
              <div className="pt-4 border-t border-emerald-800/60 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-black text-white">
                      {previewTemplate.priceSom.toLocaleString('ru-RU')} сом
                    </span>
                    <span className="text-[10px] text-emerald-300/70">за весь курс</span>
                  </div>
                  {previewTemplate.isFreeForPremium && (
                    <span className="text-[10px] font-bold text-amber-300 flex items-center gap-1 mt-0.5">
                      <Crown className="w-3 h-3 text-amber-400" />
                      <span>Для Premium — бесплатно</span>
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handlePublishFromTemplate}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Создать курс</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses List */}
      <div className="space-y-4">
        {courses.map((course) => {
          const courseStudents = students.filter((s) => s.courseId === course.id);
          return (
            <div
              key={course.id}
              className="bg-[#06261d] border border-emerald-800/60 rounded-3xl p-5 sm:p-7 shadow-xl hover:border-emerald-700 transition-all space-y-6"
            >
              {/* Course Top Info */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase">
                      {course.subjectNameRu}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black">
                      {course.targetBadgeRu}
                    </span>
                    {course.isLiveNow && (
                      <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-black flex items-center gap-1.5 animate-pulse">
                        <Radio className="w-3.5 h-3.5" />
                        <span>В ЭФИРЕ</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-2xl font-black text-white leading-tight">
                    {course.titleRu}
                  </h3>

                  <p className="text-xs sm:text-sm text-emerald-200/80 max-w-4xl line-clamp-2">
                    {course.descriptionRu}
                  </p>
                </div>

                {/* Price & Action Buttons */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0">
                  <div className="text-left lg:text-right">
                    <div className="text-2xl sm:text-3xl font-black text-white">
                      {course.priceSom.toLocaleString('ru-RU')} сом
                    </div>
                    <div className="text-[11px] text-emerald-400/80 font-semibold">{course.periodLabelRu}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingCourse(false);
                        setEditingCourse(course);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-bold border border-emerald-700/60 transition-all flex items-center gap-1.5 cursor-pointer"
                      title="Редактировать параметры курса"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Параметры</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-2 rounded-xl bg-rose-950/50 hover:bg-rose-900 text-rose-300 border border-rose-800/60 transition-all cursor-pointer"
                      title="Удалить курс"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Course Meta Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#031510] border border-emerald-800/40 rounded-2xl p-4 text-xs">
                <div>
                  <div className="text-emerald-400/70 font-semibold">Преподаватель:</div>
                  <div className="text-white font-black mt-0.5">{course.teacher.name}</div>
                </div>
                <div>
                  <div className="text-emerald-400/70 font-semibold">Старт занятий:</div>
                  <div className="text-white font-black mt-0.5">{course.nextLessonDate} ({course.nextLessonTime})</div>
                </div>
                <div>
                  <div className="text-emerald-400/70 font-semibold">Количество уроков:</div>
                  <div className="text-white font-black mt-0.5">{course.lessons?.length || 0} уроков (по 60 мин)</div>
                </div>
                <div>
                  <div className="text-emerald-400/70 font-semibold">Заполненность:</div>
                  <div className="text-white font-black mt-0.5">
                    {courseStudents.length || course.enrolledCount} из {course.totalSpots} мест
                  </div>
                </div>
              </div>

              {/* Management Tabs */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveCourseForLessons(course)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-200 text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>Уроки и расписание ({course.lessons?.length || 0})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCourseForStudents(course)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-200 text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Users className="w-4 h-4 text-teal-400" />
                  <span>Список учеников ({courseStudents.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCourseForHomeworks(course)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-200 text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Домашние задания ({course.homeworks?.length || 0})</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= MODAL: COURSE EDIT / CREATE ================= */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#05261c] border border-emerald-700/70 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-emerald-800/60 pb-4">
              <div className="flex items-center gap-2">
                <School className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-black text-white">
                  {isCreatingCourse ? 'Создать новый курс' : 'Редактировать курс'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingCourse(null)}
                className="p-1.5 rounded-xl hover:bg-emerald-900/60 text-emerald-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Название курса (RU)</label>
                  <input
                    type="text"
                    value={editingCourse.titleRu}
                    onChange={(e) => setEditingCourse({ ...editingCourse, titleRu: e.target.value })}
                    className="w-full bg-[#031510] border border-emerald-700/60 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Название курса (KG)</label>
                  <input
                    type="text"
                    value={editingCourse.titleKg}
                    onChange={(e) => setEditingCourse({ ...editingCourse, titleKg: e.target.value })}
                    className="w-full bg-[#031510] border border-emerald-700/60 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">ФИО Преподавателя</label>
                  <input
                    type="text"
                    value={editingCourse.teacher.name}
                    onChange={(e) =>
                      setEditingCourse({
                        ...editingCourse,
                        teacher: { ...editingCourse.teacher, name: e.target.value, nameKg: e.target.value },
                      })
                    }
                    className="w-full bg-[#031510] border border-emerald-700/60 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Стоимость курса (сом)</label>
                  <input
                    type="number"
                    value={editingCourse.priceSom}
                    onChange={(e) => setEditingCourse({ ...editingCourse, priceSom: Number(e.target.value) })}
                    className="w-full bg-[#031510] border border-emerald-700/60 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Всего мест в группе</label>
                  <input
                    type="number"
                    value={editingCourse.totalSpots}
                    onChange={(e) => setEditingCourse({ ...editingCourse, totalSpots: Number(e.target.value) })}
                    className="w-full bg-[#031510] border border-emerald-700/60 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Дата старта (ГГГГ-ММ-ДД)</label>
                  <input
                    type="date"
                    value={editingCourse.nextLessonDate}
                    onChange={(e) => setEditingCourse({ ...editingCourse, nextLessonDate: e.target.value })}
                    className="w-full bg-[#031510] border border-emerald-700/60 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Время занятий (напр. 18:00)</label>
                  <input
                    type="text"
                    value={editingCourse.nextLessonTime}
                    onChange={(e) => setEditingCourse({ ...editingCourse, nextLessonTime: e.target.value })}
                    className="w-full bg-[#031510] border border-emerald-700/60 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">Описание курса (RU)</label>
                <textarea
                  rows={3}
                  value={editingCourse.descriptionRu}
                  onChange={(e) => setEditingCourse({ ...editingCourse, descriptionRu: e.target.value })}
                  className="w-full bg-[#031510] border border-emerald-700/60 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">Регалии и опыт преподавателя</label>
                <input
                  type="text"
                  value={editingCourse.teacher.credentials}
                  onChange={(e) =>
                    setEditingCourse({
                      ...editingCourse,
                      teacher: { ...editingCourse.teacher, credentials: e.target.value },
                    })
                  }
                  className="w-full bg-[#031510] border border-emerald-700/60 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-400"
                />
              </div>

              {/* Фото преподавателя */}
              <div className="p-4 rounded-2xl bg-[#020e0b] border border-emerald-700/70 space-y-3">
                <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wide">
                  Фото преподавателя
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3.5">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-500/60 bg-[#041a14] shrink-0 shadow-lg flex items-center justify-center">
                    {editingCourse.teacher.avatar ? (
                      <img
                        src={editingCourse.teacher.avatar}
                        alt={editingCourse.teacher.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';
                        }}
                      />
                    ) : (
                      <ImageIcon className="w-7 h-7 text-emerald-400/50" />
                    )}
                  </div>
                  <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingCourse.teacher.avatar || ''}
                        onChange={(e) =>
                          setEditingCourse({
                            ...editingCourse,
                            teacher: { ...editingCourse.teacher, avatar: e.target.value },
                          })
                        }
                        placeholder="Вставьте URL фото преподавателя (Cloudinary / ссылка)"
                        className="flex-1 bg-[#031510] border border-emerald-700/60 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-emerald-400"
                      />
                      <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700/50 hover:bg-emerald-600/60 border border-emerald-500/60 text-emerald-200 text-xs font-bold cursor-pointer transition-colors whitespace-nowrap shadow-sm">
                        <Upload className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Загрузить фото</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  setEditingCourse({
                                    ...editingCourse,
                                    teacher: {
                                      ...editingCourse.teacher,
                                      avatar: event.target.result as string,
                                    },
                                  });
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-emerald-400/70">
                      <span>Примеры:</span>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingCourse({
                            ...editingCourse,
                            teacher: {
                              ...editingCourse.teacher,
                              avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80',
                            },
                          })
                        }
                        className="hover:underline text-emerald-300 cursor-pointer"
                      >
                        Женский профиль
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingCourse({
                            ...editingCourse,
                            teacher: {
                              ...editingCourse.teacher,
                              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
                            },
                          })
                        }
                        className="hover:underline text-emerald-300 cursor-pointer"
                      >
                        Мужской профиль
                      </button>
                      {editingCourse.teacher.avatar && (
                        <>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={() =>
                              setEditingCourse({
                                ...editingCourse,
                                teacher: {
                                  ...editingCourse.teacher,
                                  avatar: '',
                                },
                              })
                            }
                            className="hover:underline text-rose-400 cursor-pointer"
                          >
                            Очистить
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-emerald-800/60">
              <button
                type="button"
                onClick={() => setEditingCourse(null)}
                className="px-4 py-2.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 text-xs font-bold cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={() => handleSaveCourse(editingCourse)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md hover:brightness-105"
              >
                <Save className="w-4 h-4" />
                <span>Сохранить курс</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: LESSONS MANAGEMENT ================= */}
      {activeCourseForLessons && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#05261c] border border-emerald-700/70 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col p-6 sm:p-8 space-y-5 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-emerald-800/60 pb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  <span>Уроки и расписание курса ({activeCourseForLessons.lessons.length} занятий)</span>
                </h3>
                <p className="text-xs text-emerald-300/80 mt-0.5">{activeCourseForLessons.titleRu}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setEditingLesson({
                      lesson: {
                        id: `lesson-${Date.now()}`,
                        titleRu: `Урок ${activeCourseForLessons.lessons.length + 1}`,
                        titleKg: `${activeCourseForLessons.lessons.length + 1}-сабак`,
                        topicRu: 'Новая тема',
                        topicKg: 'Жаңы тема',
                        date: new Date().toISOString().slice(0, 10),
                        time: '18:00',
                        durationMinutes: 60,
                        status: 'upcoming',
                      },
                      isNew: true,
                    })
                  }
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md hover:bg-emerald-400"
                >
                  <Plus className="w-4 h-4" />
                  <span>Добавить урок</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCourseForLessons(null)}
                  className="p-2 rounded-xl hover:bg-emerald-900 text-emerald-300 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Lessons List Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {activeCourseForLessons.lessons.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    lesson.status === 'live'
                      ? 'bg-rose-950/40 border-rose-600/70 shadow-lg shadow-rose-950/30'
                      : 'bg-[#031510] border-emerald-800/50 hover:border-emerald-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-xs font-black flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <h4 className="text-sm font-black text-white">{lesson.titleRu}</h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          lesson.status === 'live'
                            ? 'bg-rose-500 text-white animate-pulse'
                            : lesson.status === 'completed'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/50'
                            : 'bg-teal-950 text-teal-300 border border-teal-700/50'
                        }`}
                      >
                        {lesson.status === 'live'
                          ? '🔴 В ЭФИРЕ'
                          : lesson.status === 'completed'
                          ? 'Завершен'
                          : 'Предстоит'}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-300/80 pl-8">{lesson.topicRu}</p>
                    <div className="text-[11px] text-emerald-400/60 font-mono pl-8 flex items-center gap-3">
                      <span>📅 {lesson.date}</span>
                      <span>⏰ {lesson.time} ({lesson.durationMinutes} мин)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleLessonLive(lesson.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        lesson.status === 'live'
                          ? 'bg-rose-600 text-white hover:bg-rose-700'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900'
                      }`}
                    >
                      {lesson.status === 'live' ? 'Завершить эфир' : 'Запустить эфир'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingLesson({ lesson, isNew: false })}
                      className="p-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60 cursor-pointer"
                      title="Редактировать урок"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteLesson(lesson.id)}
                      className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900 text-rose-300 border border-rose-800/50 cursor-pointer"
                      title="Удалить урок"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= SUB-MODAL: LESSON EDIT ================= */}
      {editingLesson && (
        <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#05261c] border border-emerald-600 rounded-3xl max-w-lg w-full p-6 space-y-4 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
              <h4 className="text-base font-black text-white">
                {editingLesson.isNew ? 'Новый урок' : 'Редактировать урок'}
              </h4>
              <button
                type="button"
                onClick={() => setEditingLesson(null)}
                className="p-1 rounded-lg hover:bg-emerald-900 text-emerald-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-emerald-300 font-bold mb-1">Название урока</label>
                <input
                  type="text"
                  value={editingLesson.lesson.titleRu}
                  onChange={(e) =>
                    setEditingLesson({
                      ...editingLesson,
                      lesson: { ...editingLesson.lesson, titleRu: e.target.value, titleKg: e.target.value },
                    })
                  }
                  className="w-full bg-[#031510] border border-emerald-700/60 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">Тема и тезисы</label>
                <input
                  type="text"
                  value={editingLesson.lesson.topicRu}
                  onChange={(e) =>
                    setEditingLesson({
                      ...editingLesson,
                      lesson: { ...editingLesson.lesson, topicRu: e.target.value, topicKg: e.target.value },
                    })
                  }
                  className="w-full bg-[#031510] border border-emerald-700/60 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Дата</label>
                  <input
                    type="date"
                    value={editingLesson.lesson.date}
                    onChange={(e) =>
                      setEditingLesson({
                        ...editingLesson,
                        lesson: { ...editingLesson.lesson, date: e.target.value },
                      })
                    }
                    className="w-full bg-[#031510] border border-emerald-700/60 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Время</label>
                  <input
                    type="text"
                    value={editingLesson.lesson.time}
                    onChange={(e) =>
                      setEditingLesson({
                        ...editingLesson,
                        lesson: { ...editingLesson.lesson, time: e.target.value },
                      })
                    }
                    className="w-full bg-[#031510] border border-emerald-700/60 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">Ссылка на PDF материалы</label>
                <input
                  type="text"
                  value={editingLesson.lesson.materialsPdfUrl || ''}
                  onChange={(e) =>
                    setEditingLesson({
                      ...editingLesson,
                      lesson: { ...editingLesson.lesson, materialsPdfUrl: e.target.value },
                    })
                  }
                  placeholder="https://..."
                  className="w-full bg-[#031510] border border-emerald-700/60 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-emerald-800/60">
              <button
                type="button"
                onClick={() => setEditingLesson(null)}
                className="px-3.5 py-2 rounded-xl bg-emerald-950 text-emerald-300 text-xs font-bold cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={() => handleSaveLesson(editingLesson.lesson, editingLesson.isNew)}
                className="px-4 py-2 rounded-xl bg-emerald-400 text-slate-950 font-black text-xs cursor-pointer shadow-md hover:bg-emerald-300"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: STUDENTS MANAGEMENT ================= */}
      {activeCourseForStudents && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#05261c] border border-emerald-700/70 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col p-6 sm:p-8 space-y-5 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-emerald-800/60 pb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-400" />
                  <span>Список учеников группы</span>
                </h3>
                <p className="text-xs text-emerald-300/80 mt-0.5">{activeCourseForStudents.titleRu}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setEditingStudent({
                      student: {
                        id: `std-${Date.now()}`,
                        courseId: activeCourseForStudents.id,
                        name: '',
                        email: '',
                        phone: '+996 ',
                        targetScore: 220,
                        enrolledAt: new Date().toISOString().slice(0, 10),
                        status: 'active',
                        paymentStatus: 'paid',
                        attendanceCount: 0,
                        homeworkScore: 100,
                      },
                      isNew: true,
                    })
                  }
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Добавить ученика</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCourseForStudents(null)}
                  className="p-2 rounded-xl hover:bg-emerald-900 text-emerald-300 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Students Table */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {students
                .filter((s) => s.courseId === activeCourseForStudents.id)
                .map((student, idx) => (
                  <div
                    key={`course_student_${student.id}_${idx}`}
                    className="p-4 rounded-2xl bg-[#031510] border border-emerald-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-sm shrink-0">
                        {student.name.slice(0, 2).toUpperCase() || 'УЧ'}
                      </div>
                      <div>
                        <div className="text-sm font-black text-white flex items-center gap-2">
                          <span>{student.name || 'Новый ученик'}</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700/50 text-[10px] font-bold">
                            Цель: {student.targetScore} б
                          </span>
                        </div>
                        <div className="text-emerald-300/80 flex flex-wrap items-center gap-3 mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-emerald-400" /> {student.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-teal-400" /> {student.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-900/60 text-emerald-200 text-[11px] font-bold border border-emerald-700/40">
                        {student.paymentStatus === 'paid'
                          ? 'Оплачено (4000 сом)'
                          : student.paymentStatus === 'free_vip'
                          ? 'VIP Премиум'
                          : 'Ожидает оплаты'}
                      </span>

                      <button
                        type="button"
                        onClick={() => setEditingStudent({ student, isNew: false })}
                        className="p-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60 cursor-pointer"
                        title="Редактировать ученика"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteStudent(student.id)}
                        className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900 text-rose-300 border border-rose-800/50 cursor-pointer"
                        title="Удалить из группы"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= SUB-MODAL: STUDENT EDIT ================= */}
      {editingStudent && (
        <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#05261c] border border-emerald-600 rounded-3xl max-w-lg w-full p-6 space-y-4 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
              <h4 className="text-base font-black text-white">
                {editingStudent.isNew ? 'Добавить ученика в группу' : 'Редактировать данные ученика'}
              </h4>
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="p-1 rounded-lg hover:bg-emerald-900 text-emerald-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-emerald-300 font-bold mb-1">ФИО ученика</label>
                <input
                  type="text"
                  value={editingStudent.student.name}
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      student: { ...editingStudent.student, name: e.target.value },
                    })
                  }
                  className="w-full bg-[#031510] border border-emerald-700/60 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-400"
                  placeholder="Имя и фамилия"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Email</label>
                  <input
                    type="email"
                    value={editingStudent.student.email}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        student: { ...editingStudent.student, email: e.target.value },
                      })
                    }
                    className="w-full bg-[#031510] border border-emerald-700/60 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-400"
                    placeholder="student@example.com"
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Телефон / WhatsApp</label>
                  <input
                    type="text"
                    value={editingStudent.student.phone}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        student: { ...editingStudent.student, phone: e.target.value },
                      })
                    }
                    className="w-full bg-[#031510] border border-emerald-700/60 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-400"
                    placeholder="+996 ..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Целевой балл ОРТ</label>
                  <input
                    type="number"
                    value={editingStudent.student.targetScore}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        student: { ...editingStudent.student, targetScore: Number(e.target.value) },
                      })
                    }
                    className="w-full bg-[#031510] border border-emerald-700/60 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Статус оплаты</label>
                  <select
                    value={editingStudent.student.paymentStatus}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        student: {
                          ...editingStudent.student,
                          paymentStatus: e.target.value as EnrolledStudentRecord['paymentStatus'],
                        },
                      })
                    }
                    className="w-full bg-[#031510] border border-emerald-700/60 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-400"
                  >
                    <option value="paid">Оплачено (4 000 сом)</option>
                    <option value="free_vip">VIP Премиум (Бесплатно)</option>
                    <option value="pending">Ожидает оплаты</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-emerald-800/60">
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="px-3.5 py-2 rounded-xl bg-emerald-950 text-emerald-300 text-xs font-bold cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={() => handleSaveStudent(editingStudent.student, editingStudent.isNew)}
                className="px-4 py-2 rounded-xl bg-emerald-400 text-slate-950 font-black text-xs cursor-pointer shadow-md hover:bg-emerald-300"
              >
                Сохранить ученика
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: HOMEWORKS MANAGEMENT ================= */}
      {activeCourseForHomeworks && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#05261c] border border-emerald-700/70 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col p-6 sm:p-8 space-y-5 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-emerald-800/60 pb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" />
                  <span>Домашние задания группы ({activeCourseForHomeworks.homeworks?.length || 0})</span>
                </h3>
                <p className="text-xs text-emerald-300/80 mt-0.5">{activeCourseForHomeworks.titleRu}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setEditingHomework({
                      hw: {
                        id: `hw-${Date.now()}`,
                        lessonId: activeCourseForHomeworks.lessons[0]?.id || 'lesson-1',
                        titleRu: `ДЗ #${(activeCourseForHomeworks.homeworks?.length || 0) + 1}`,
                        titleKg: `Үй тапшырма #${(activeCourseForHomeworks.homeworks?.length || 0) + 1}`,
                        descriptionRu: '',
                        descriptionKg: '',
                        dueDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
                        taskCount: 15,
                        maxScore: 100,
                        status: 'pending',
                      },
                      isNew: true,
                    })
                  }
                  className="px-3.5 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md hover:bg-amber-300"
                >
                  <Plus className="w-4 h-4" />
                  <span>Добавить ДЗ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCourseForHomeworks(null)}
                  className="p-2 rounded-xl hover:bg-emerald-900 text-emerald-300 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Homeworks List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {activeCourseForHomeworks.homeworks?.map((hw) => (
                <div
                  key={hw.id}
                  className="p-4 rounded-2xl bg-[#031510] border border-emerald-800/50 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-white">{hw.titleRu}</h4>
                    <p className="text-emerald-300/80">{hw.descriptionRu || 'Тестовые задания по пройденному уроку'}</p>
                    <div className="text-[11px] text-emerald-400/70 flex items-center gap-3">
                      <span>Дедлайн: {hw.dueDate}</span>
                      <span>Кол-во задач: {hw.taskCount}</span>
                      <span>Макс. балл: {hw.maxScore}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingHomework({ hw, isNew: false })}
                      className="p-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteHomework(hw.id)}
                      className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900 text-rose-300 border border-rose-800/50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= SUB-MODAL: HOMEWORK EDIT ================= */}
      {editingHomework && (
        <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#05261c] border border-emerald-600 rounded-3xl max-w-lg w-full p-6 space-y-4 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
              <h4 className="text-base font-black text-white">
                {editingHomework.isNew ? 'Новое домашнее задание' : 'Редактировать ДЗ'}
              </h4>
              <button
                type="button"
                onClick={() => setEditingHomework(null)}
                className="p-1 rounded-lg hover:bg-emerald-900 text-emerald-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-emerald-300 font-bold mb-1">Заголовок ДЗ</label>
                <input
                  type="text"
                  value={editingHomework.hw.titleRu}
                  onChange={(e) =>
                    setEditingHomework({
                      ...editingHomework,
                      hw: { ...editingHomework.hw, titleRu: e.target.value, titleKg: e.target.value },
                    })
                  }
                  className="w-full bg-[#031510] border border-emerald-700/60 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">Описание и инструкция</label>
                <textarea
                  rows={2}
                  value={editingHomework.hw.descriptionRu}
                  onChange={(e) =>
                    setEditingHomework({
                      ...editingHomework,
                      hw: { ...editingHomework.hw, descriptionRu: e.target.value },
                    })
                  }
                  className="w-full bg-[#031510] border border-emerald-700/60 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Дедлайн</label>
                  <input
                    type="date"
                    value={editingHomework.hw.dueDate}
                    onChange={(e) =>
                      setEditingHomework({
                        ...editingHomework,
                        hw: { ...editingHomework.hw, dueDate: e.target.value },
                      })
                    }
                    className="w-full bg-[#031510] border border-emerald-700/60 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Кол-во задач</label>
                  <input
                    type="number"
                    value={editingHomework.hw.taskCount}
                    onChange={(e) =>
                      setEditingHomework({
                        ...editingHomework,
                        hw: { ...editingHomework.hw, taskCount: Number(e.target.value) },
                      })
                    }
                    className="w-full bg-[#031510] border border-emerald-700/60 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Макс. балл</label>
                  <input
                    type="number"
                    value={editingHomework.hw.maxScore}
                    onChange={(e) =>
                      setEditingHomework({
                        ...editingHomework,
                        hw: { ...editingHomework.hw, maxScore: Number(e.target.value) },
                      })
                    }
                    className="w-full bg-[#031510] border border-emerald-700/60 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-emerald-800/60">
              <button
                type="button"
                onClick={() => setEditingHomework(null)}
                className="px-3.5 py-2 rounded-xl bg-emerald-950 text-emerald-300 text-xs font-bold cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={() => handleSaveHomework(editingHomework.hw, editingHomework.isNew)}
                className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs cursor-pointer shadow-md hover:bg-amber-300"
              >
                Сохранить ДЗ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
