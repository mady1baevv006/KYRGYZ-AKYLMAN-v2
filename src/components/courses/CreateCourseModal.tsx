import React, { useState } from 'react';
import {
  X,
  Plus,
  Sparkles,
  BookOpen,
  Calendar,
  Clock,
  Users,
  DollarSign,
  UserCheck,
  Image as ImageIcon,
  Check,
  Layers,
} from 'lucide-react';
import { AppLanguage } from '../../types';
import { CourseGroup, CourseSubject, CourseModuleType } from '../../types/courses';
import { UserProfile } from '../../context/AuthContext';

interface CreateCourseModalProps {
  isOpen: boolean;
  lang: AppLanguage;
  currentUser: UserProfile | null;
  onClose: () => void;
  onCreateCourse: (course: CourseGroup) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
];

export const CreateCourseModal: React.FC<CreateCourseModalProps> = ({
  isOpen,
  lang,
  currentUser,
  onClose,
  onCreateCourse,
}) => {
  const isKg = lang === 'kg';

  const [selectedSubject, setSelectedSubject] = useState<'math' | 'english' | 'russian'>('math');
  const [selectedMathModule, setSelectedMathModule] = useState<'base' | 'advanced' | 'extra'>('base');
  
  const [titleRu, setTitleRu] = useState('Математика: Базовый модуль ОРТ');
  const [titleKg, setTitleKg] = useState('Математика: ЖРТ негизги модулу');
  const [descriptionRu, setDescriptionRu] = useState(
    'Интенсивная онлайн-подготовка в мини-группе: разбор ключевых тем, решение задач на интерактивной доске и домашние задания.'
  );
  const [daysScheduleFormat, setDaysScheduleFormat] = useState('Пн-Пт');
  const [lessonTime, setLessonTime] = useState('18:00');
  const [priceSom, setPriceSom] = useState(4000);
  const [totalSpots, setTotalSpots] = useState(10);
  const [enrolledCount, setEnrolledCount] = useState(6);
  const [targetScore, setTargetScore] = useState(220);

  // Teacher fields
  const [teacherName, setTeacherName] = useState(currentUser?.name || 'Мадылбаев Абдраим Турусбекович');
  const [teacherTitle, setTeacherTitle] = useState('Главный преподаватель и эксперт ОРТ');
  const [avatarSource, setAvatarSource] = useState<'profile' | 'custom' | 'preset'>('profile');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [selectedPresetAvatar, setSelectedPresetAvatar] = useState(PRESET_AVATARS[0]);

  if (!isOpen) return null;

  const handleSubjectChange = (subj: 'math' | 'english' | 'russian') => {
    setSelectedSubject(subj);
    if (subj === 'math') {
      setTitleRu('Математика: Базовый модуль ОРТ');
      setTitleKg('Математика: ЖРТ негизги модулу');
    } else if (subj === 'english') {
      setTitleRu('Английский язык: Подготовка к ОРТ и тестам');
      setTitleKg('Англис тили: ЖРТ жана тесттерге даярдануу');
    } else {
      setTitleRu('Русский язык: Практическая грамотность ОРТ');
      setTitleKg('Орус тили: ЖРТ практикалык сабаттуулук');
    }
  };

  const handleMathModuleChange = (mod: 'base' | 'advanced' | 'extra') => {
    setSelectedMathModule(mod);
    if (mod === 'base') {
      setTitleRu('Математика: Базовый модуль ОРТ');
      setTitleKg('Математика: ЖРТ негизги модулу');
    } else if (mod === 'advanced') {
      setTitleRu('Математика: Продвинутый модуль ОРТ');
      setTitleKg('Математика: ЖРТ тереңдетилген модулу');
    } else {
      setTitleRu('Математика: Дополнительный модуль (Сложные задачи)');
      setTitleKg('Математика: ЖРТ кошумча модулу (Татаал маселелер)');
    }
  };

  const getEffectiveAvatar = () => {
    if (avatarSource === 'profile' && currentUser?.avatar) {
      return currentUser.avatar;
    }
    if (avatarSource === 'custom' && customAvatarUrl.trim()) {
      return customAvatarUrl.trim();
    }
    return selectedPresetAvatar;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let subjectNameRu = 'Математика';
    let subjectNameKg = 'Математика';
    if (selectedSubject === 'english') {
      subjectNameRu = 'Английский язык';
      subjectNameKg = 'Англис тили';
    } else if (selectedSubject === 'russian') {
      subjectNameRu = 'Русский язык';
      subjectNameKg = 'Орус тили';
    }

    let moduleType: CourseModuleType = 'in_development';
    let moduleNameRu = 'В разработке';
    let moduleNameKg = 'Даярдалууда';

    if (selectedSubject === 'math') {
      moduleType = selectedMathModule;
      if (selectedMathModule === 'base') {
        moduleNameRu = 'Базовый модуль';
        moduleNameKg = 'Негизги модуль';
      } else if (selectedMathModule === 'advanced') {
        moduleNameRu = 'Продвинутый модуль';
        moduleNameKg = 'Тереңдетилген модуль';
      } else {
        moduleNameRu = 'Дополнительный модуль';
        moduleNameKg = 'Кошумча модуль';
      }
    }

    const effectiveAvatar = getEffectiveAvatar();

    const newCourse: CourseGroup = {
      id: `course-${selectedSubject}-${Date.now()}`,
      titleRu,
      titleKg: isKg ? titleKg : titleRu,
      subject: selectedSubject,
      subjectNameRu,
      subjectNameKg,
      moduleType,
      moduleNameRu,
      moduleNameKg,
      targetBadgeRu: `Цель: ${targetScore}+ баллов на ОРТ`,
      targetBadgeKg: `Максат: ${targetScore}+ балл ЖРТ`,
      targetScore,
      descriptionRu,
      descriptionKg: isKg ? descriptionRu : descriptionRu,
      daysScheduleFormat,
      teacher: {
        id: `teacher-${Date.now()}`,
        name: teacherName,
        nameKg: teacherName,
        title: teacherTitle,
        titleKg: teacherTitle,
        avatar: effectiveAvatar,
        credentials: 'Преподаватель курса ОРТ',
        credentialsKg: 'ЖРТ курсунун окутуучусу',
        ortScore: 235,
        experienceYears: 8,
      },
      totalSpots: Math.min(Math.max(totalSpots, 6), 10),
      enrolledCount: Math.min(enrolledCount, totalSpots),
      priceSom,
      periodLabelRu: `за весь курс (${daysScheduleFormat}, ${lessonTime})`,
      periodLabelKg: `толук курс үчүн (${daysScheduleFormat}, ${lessonTime})`,
      isFreeForPremium: false,
      schedule: [
        {
          dayOfWeek: 1,
          dayNameRu: 'Понедельник',
          dayNameKg: 'Дүйшөмбү',
          startTime: lessonTime,
          endTime: `${parseInt(lessonTime.split(':')[0] || '18') + 1}:00`,
          timezone: 'Бишкек (GMT+6)',
        },
      ],
      nextLessonDate: '2026-09-21',
      nextLessonTime: lessonTime,
      isLiveNow: false,
      tags: [subjectNameRu, moduleNameRu, daysScheduleFormat, `Группа ${totalSpots} чел.`],
      lessons: [],
      homeworks: [],
      chatMessages: [
        {
          id: `msg-${Date.now()}`,
          senderId: 'admin',
          senderName: teacherName,
          senderRole: 'teacher',
          text: `Салам, урматтуу окуучулар! Добро пожаловать на курс «${titleRu}». Готовьтесь к высоким результатам!`,
          timestamp: '2026-09-01 12:00',
          isPinned: true,
        },
      ],
      isCustom: true,
    };

    onCreateCourse(newCourse);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#05261c] border border-emerald-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-y-auto text-left space-y-6">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div>
          <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 w-fit">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isKg ? 'Администратор панели' : 'Панель Администратора'}</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
            {isKg ? 'Жаңы курс түзүү' : 'Создать новый онлайн-курс'}
          </h2>
          <p className="text-xs text-emerald-200/70 mt-1">
            {isKg
              ? 'Предметти, модулду, бааны жана мугалимдин сүрөтүн тандаңыз'
              : 'Выберите предмет, модуль, формат расписания, стоимость и фото преподавателя'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Step 1: Subject Selection */}
          <div className="space-y-2">
            <label className="block text-slate-200 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isKg ? '1. Предметти тандаңыз:' : '1. Выберите предмет:'}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'math', labelRu: 'Математика', labelKg: 'Математика', ready: true },
                { id: 'english', labelRu: 'Английский язык', labelKg: 'Англис тили', ready: false },
                { id: 'russian', labelRu: 'Русский язык', labelKg: 'Орус тили', ready: false },
              ].map((subj) => (
                <button
                  key={subj.id}
                  type="button"
                  onClick={() => handleSubjectChange(subj.id as any)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    selectedSubject === subj.id
                      ? 'bg-emerald-500/25 border-emerald-400 text-white font-black shadow-md shadow-emerald-500/20'
                      : 'bg-[#031510] border-emerald-900/80 text-emerald-200/70 hover:border-emerald-700/80'
                  }`}
                >
                  <div className="font-bold text-xs sm:text-sm">{isKg ? subj.labelKg : subj.labelRu}</div>
                  {!subj.ready && (
                    <span className="text-[10px] text-amber-300 font-medium block mt-0.5">
                      {isKg ? 'Жакында' : 'В разработке'}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Module Selection (if Math) */}
          <div className="space-y-2">
            <label className="block text-slate-200 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-400" />
              <span>{isKg ? '2. Модулду тандаңыз:' : '2. Выберите модуль:'}</span>
            </label>

            {selectedSubject === 'math' ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'base', labelRu: 'Базовый модуль', desc: '1 и 2 части ОРТ' },
                  { id: 'advanced', labelRu: 'Продвинутый модуль', desc: 'Геометрия & Сравнения' },
                  { id: 'extra', labelRu: 'Дополнительный модуль', desc: 'Олимпиадные задачи' },
                ].map((mod) => (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => handleMathModuleChange(mod.id as any)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedMathModule === mod.id
                        ? 'bg-gradient-to-r from-emerald-600/40 to-teal-600/40 border-emerald-400 text-white font-black shadow-md'
                        : 'bg-[#031510] border-emerald-900/80 text-emerald-200/70 hover:border-emerald-700/80'
                    }`}
                  >
                    <div className="font-bold text-xs">{mod.labelRu}</div>
                    <div className="text-[10px] text-emerald-300/70 mt-0.5">{mod.desc}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
                {isKg
                  ? 'Англис жана орус тилдери боюнча модулдар даярдалууда. Курсту алдын ала түзсөңүз болот.'
                  : 'Модули для английского и русского языков находятся в разработке. Вы можете создать предзаказную группу.'}
              </div>
            )}
          </div>

          {/* Step 3: Title & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                {isKg ? 'Курстун аталышы (RU)' : 'Название курса (RU)'}
              </label>
              <input
                type="text"
                required
                value={titleRu}
                onChange={(e) => setTitleRu(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#031510] border border-emerald-800 text-white text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                {isKg ? 'Курстун аталышы (KG)' : 'Название курса (KG)'}
              </label>
              <input
                type="text"
                required
                value={titleKg}
                onChange={(e) => setTitleKg(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#031510] border border-emerald-800 text-white text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">
              {isKg ? 'Курс жөнүндө түшүндүрмө' : 'Описание курса'}
            </label>
            <textarea
              rows={2}
              value={descriptionRu}
              onChange={(e) => setDescriptionRu(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#031510] border border-emerald-800 text-white text-xs focus:outline-none focus:border-emerald-400"
            />
          </div>

          {/* Step 4: Schedule format, Price, Group size (6-10) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isKg ? 'Өткөрүү күндөрү' : 'Дни проведения'}</span>
              </label>
              <div className="flex gap-1.5 mb-1.5 flex-wrap">
                {['Пн-Пт', 'Пн-Ср-Пт', 'Вт-Чт-Сб'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDaysScheduleFormat(preset)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                      daysScheduleFormat === preset
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'bg-[#031510] text-emerald-200/70 border-emerald-900 hover:border-emerald-700'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={daysScheduleFormat}
                onChange={(e) => setDaysScheduleFormat(e.target.value)}
                placeholder="Пн-Пт же башка"
                className="w-full px-3 py-2 rounded-xl bg-[#031510] border border-emerald-800 text-white text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-teal-400" />
                <span>{isKg ? 'Топтун өлчөмү (6–10)' : 'Размер группы (6–10)'}</span>
              </label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  min={6}
                  max={10}
                  value={totalSpots}
                  onChange={(e) => setTotalSpots(Number(e.target.value))}
                  className="w-20 px-3 py-2 rounded-xl bg-[#031510] border border-emerald-800 text-white text-xs font-bold text-center"
                />
                <span className="text-emerald-300 font-bold text-xs">{isKg ? 'окуучу' : 'человек'}</span>
              </div>
              <div className="text-[10px] text-emerald-200/60 mt-1">
                {isKg ? 'Толгон орундар:' : 'Занято мест:'}{' '}
                <input
                  type="number"
                  min={0}
                  max={totalSpots}
                  value={enrolledCount}
                  onChange={(e) => setEnrolledCount(Number(e.target.value))}
                  className="w-12 px-1.5 py-0.5 rounded bg-[#031510] border border-emerald-900 text-white text-[10px] text-center ml-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                <span>{isKg ? 'Баасы (сом)' : 'Стоимость (сом)'}</span>
              </label>
              <input
                type="number"
                step={100}
                value={priceSom}
                onChange={(e) => setPriceSom(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#031510] border border-emerald-800 text-amber-300 font-black text-sm focus:outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-emerald-200/60 block mt-1">
                {isKg ? 'Толук курс үчүн' : 'За весь курс'}
              </span>
            </div>
          </div>

          {/* Step 5: Teacher Photo & Details */}
          <div className="p-4 rounded-2xl bg-[#031510] border border-emerald-800/80 space-y-3">
            <div className="font-bold text-white text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isKg ? 'Мугалимдин маалыматы & Сүрөтү' : 'Информация и фото преподавателя'}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  {isKg ? 'Мугалимдин аты-жөнү' : 'ФИО Преподавателя'}
                </label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#05261c] border border-emerald-800 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  {isKg ? 'Кызматы / Наамы' : 'Должность / Квалификация'}
                </label>
                <input
                  type="text"
                  value={teacherTitle}
                  onChange={(e) => setTeacherTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#05261c] border border-emerald-800 text-white text-xs"
                />
              </div>
            </div>

            {/* Teacher Photo Selection */}
            <div className="space-y-2 pt-1 border-t border-emerald-900/60">
              <label className="block text-[11px] font-bold text-slate-300">
                {isKg ? 'Мугалимдин сүрөтү:' : 'Фото преподавателя:'}
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAvatarSource('profile')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    avatarSource === 'profile'
                      ? 'bg-emerald-500/25 border-emerald-400 text-white font-bold'
                      : 'bg-[#05261c] border-emerald-900 text-emerald-200/70 hover:border-emerald-700'
                  }`}
                >
                  <div className="text-[11px]">{isKg ? 'Менин профилимдеги сүрөт' : 'Фото из моего профиля'}</div>
                </button>

                <button
                  type="button"
                  onClick={() => setAvatarSource('custom')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    avatarSource === 'custom'
                      ? 'bg-emerald-500/25 border-emerald-400 text-white font-bold'
                      : 'bg-[#05261c] border-emerald-900 text-emerald-200/70 hover:border-emerald-700'
                  }`}
                >
                  <div className="text-[11px]">{isKg ? 'Сүрөттүн шилтемеси (URL)' : 'Вставить ссылку (URL)'}</div>
                </button>

                <button
                  type="button"
                  onClick={() => setAvatarSource('preset')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    avatarSource === 'preset'
                      ? 'bg-emerald-500/25 border-emerald-400 text-white font-bold'
                      : 'bg-[#05261c] border-emerald-900 text-emerald-200/70 hover:border-emerald-700'
                  }`}
                >
                  <div className="text-[11px]">{isKg ? 'Тандалган аватарлар' : 'Готовые аватары'}</div>
                </button>
              </div>

              {avatarSource === 'custom' && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#05261c] border border-emerald-800 text-white text-xs"
                  />
                  {customAvatarUrl && (
                    <img
                      src={customAvatarUrl}
                      alt="Preview"
                      className="w-9 h-9 rounded-xl object-cover border border-emerald-400 shrink-0"
                    />
                  )}
                </div>
              )}

              {avatarSource === 'preset' && (
                <div className="flex items-center gap-2.5 pt-1">
                  {PRESET_AVATARS.map((avatar, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPresetAvatar(avatar)}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedPresetAvatar === avatar ? 'border-amber-400 scale-105 shadow-md shadow-amber-500/30' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={avatar} alt="Preset" className="w-10 h-10 object-cover" />
                      {selectedPresetAvatar === avatar && (
                        <div className="absolute inset-0 bg-amber-400/20 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Current effective photo preview */}
              <div className="flex items-center gap-3 pt-2">
                <img
                  src={getEffectiveAvatar()}
                  alt="Teacher Preview"
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-400 shadow-md bg-emerald-950"
                />
                <div className="text-xs">
                  <span className="text-white font-bold block">{teacherName}</span>
                  <span className="text-emerald-300/80 text-[11px]">{teacherTitle}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-emerald-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
            >
              {isKg ? 'Жокко чыгаруу' : 'Отмена'}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isKg ? 'Курсту жарыялоо' : 'Опубликовать курс'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
