import React, { useState } from 'react';
import {
  ShieldAlert,
  Crown,
  Users,
  Video,
  PenTool,
  PlusCircle,
  CheckCircle2,
  Lock,
  Unlock,
  VolumeX,
  Volume2,
  FilePlus,
  Send,
  Sparkles,
} from 'lucide-react';
import { AppLanguage } from '../../types';
import { CourseGroup } from '../../types/courses';
import { useAuth } from '../../context/AuthContext';

interface ClassroomTeacherToolsProps {
  course: CourseGroup;
  lang: AppLanguage;
  onStartLiveLesson?: () => void;
}

const MOCK_ENROLLED_STUDENTS = [
  { id: 's-1', name: 'Султан Мадыбаев', phone: '+996 700 123456', score: 218, attendance: '100%', hwStatus: 'Сдано (95 б.)', isVip: true },
  { id: 's-2', name: 'Айбек Темиров', phone: '+996 555 987654', score: 205, attendance: '92%', hwStatus: 'Сдано (90 б.)', isVip: false },
  { id: 's-3', name: 'Нурсултан Кадыров', phone: '+996 772 456789', score: 195, attendance: '85%', hwStatus: 'На проверке', isVip: false },
  { id: 's-4', name: 'Динара Асанова', phone: '+996 703 112233', score: 224, attendance: '95%', hwStatus: 'Сдано (100 б.)', isVip: true },
  { id: 's-5', name: 'Алина Бекболотова', phone: '+996 500 334455', score: 210, attendance: '90%', hwStatus: 'Сдано (88 б.)', isVip: false },
  { id: 's-6', name: 'Бакыт Эсенбеков', phone: '+996 708 556677', score: 188, attendance: '80%', hwStatus: 'Не сдано', isVip: false },
];

export const ClassroomTeacherTools: React.FC<ClassroomTeacherToolsProps> = ({
  course,
  lang,
  onStartLiveLesson,
}) => {
  const { user, isAdmin } = useAuth();
  const isKg = lang === 'kg';

  const [isWhiteboardLocked, setIsWhiteboardLocked] = useState(false);
  const [isMuteAll, setIsMuteAll] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementSent, setAnnouncementSent] = useState(false);

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    setAnnouncementSent(true);
    setTimeout(() => {
      setAnnouncementText('');
      setAnnouncementSent(false);
    }, 2000);
  };

  return (
    <div className="bg-[#052219] border-2 border-amber-400/60 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
      {/* Top Banner: Teacher & Master Admin Mode */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-emerald-800/50">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/60 shadow-lg shadow-amber-500/20 shrink-0">
            <Crown className="w-6 h-6 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg sm:text-xl font-black text-white">
                {isKg ? 'Мугалимдин жана Админдин башкаруу панели' : 'Панель преподавателя и Администратора'}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                TEACHER & ADMIN
              </span>
            </div>
            <p className="text-xs text-amber-200/80 mt-0.5">
              {course.titleRu} • {course.enrolledCount} {isKg ? 'окуучу катталган' : 'учеников в группе'}
            </p>
          </div>
        </div>

        {/* Live Broadcast Launcher */}
        <button
          type="button"
          onClick={onStartLiveLesson}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/30 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Video className="w-4 h-4 text-slate-950" />
          <span>{isKg ? 'Түз эфирди баштоо (Мугалим)' : 'Запустить эфир урока'}</span>
        </button>
      </div>

      {/* Quick Classroom Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Lock/Unlock Student Drawing on Whiteboard */}
        <div className="p-4 rounded-2xl bg-[#031510] border border-emerald-800/60 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <PenTool className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isKg ? 'Тактаны кулпулоо' : 'Доска для учеников'}</span>
            </div>
            <p className="text-[10px] text-emerald-200/60">
              {isWhiteboardLocked ? (isKg ? 'Окуучулар тарта албайт' : 'Рисование запрещено') : (isKg ? 'Баарына ачык' : 'Разрешено рисовать')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsWhiteboardLocked((prev) => !prev)}
            className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              isWhiteboardLocked
                ? 'bg-rose-500 text-white border-rose-400 shadow-md'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}
          >
            {isWhiteboardLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>
        </div>

        {/* Mute All Microphones */}
        <div className="p-4 rounded-2xl bg-[#031510] border border-emerald-800/60 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-teal-400" />
              <span>{isKg ? 'Бардык микрофондор' : 'Микрофоны группы'}</span>
            </div>
            <p className="text-[10px] text-emerald-200/60">
              {isMuteAll ? (isKg ? 'Бардыгы өчүрүлдү' : 'Все заглушены') : (isKg ? 'Окуучулар сүйлөй алат' : 'Свободный микрофон')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsMuteAll((prev) => !prev)}
            className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              isMuteAll
                ? 'bg-rose-500 text-white border-rose-400 shadow-md'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}
          >
            {isMuteAll ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Add Homework Fast Button */}
        <div className="p-4 rounded-2xl bg-[#031510] border border-emerald-800/60 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <FilePlus className="w-3.5 h-3.5 text-amber-400" />
              <span>{isKg ? 'Жаңы тапшырма' : 'Добавить ДЗ'}</span>
            </div>
            <p className="text-[10px] text-emerald-200/60">
              {isKg ? 'Тест же маселе түзүү' : 'Опубликовать задачи'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => alert(isKg ? 'Тапшырма түзүү терезеси' : 'Создание нового домашнего задания...')}
            className="p-2.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/50 text-xs font-bold transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Post Official Announcement */}
      <div className="p-4 rounded-2xl bg-[#031510] border border-emerald-800/60 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
          <Send className="w-3.5 h-3.5" />
          <span>{isKg ? 'Топко расмий кулактандыруу жарыялоо' : 'Опубликовать объявление для всей группы'}</span>
        </h4>
        <form onSubmit={handlePostAnnouncement} className="flex gap-2">
          <input
            type="text"
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            placeholder={isKg ? 'Мисалы: "Эртеңки сабакка чейин 3-параграфты окуп келгиле"...' : 'Например: "В четверг разбор геометрических задач, подготовьте циркуль и линейку"...'}
            className="flex-1 bg-[#041a14] border border-emerald-800/80 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
          >
            {announcementSent ? (isKg ? 'Жарыяланды!' : 'Опубликовано!') : (isKg ? 'Жарыялоо' : 'Опубликовать')}
          </button>
        </form>
      </div>

      {/* Enrolled Students Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>{isKg ? 'Катталган окуучулардын тизмеси' : 'Список учеников группы'}</span>
          </h4>
          <span className="text-xs text-slate-400">
            {MOCK_ENROLLED_STUDENTS.length} / {course.totalSpots} {isKg ? 'орун' : 'мест'}
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-emerald-800/60 bg-[#031510]">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#020e0b] text-[11px] uppercase font-black text-emerald-400/80 border-b border-emerald-800/60">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">{isKg ? 'Окуучу' : 'Ученик'}</th>
                <th className="p-3">{isKg ? 'Байланыш' : 'Телефон'}</th>
                <th className="p-3">{isKg ? 'ЖРТ божомолу' : 'Прогноз ОРТ'}</th>
                <th className="p-3">{isKg ? 'Катышуу' : 'Посещаемость'}</th>
                <th className="p-3">{isKg ? 'Үй тапшырма' : 'Домашнее задание'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/40 font-medium">
              {MOCK_ENROLLED_STUDENTS.map((std, idx) => (
                <tr key={std.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 font-bold text-slate-400">{idx + 1}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5 font-bold text-white">
                      <span>{std.name}</span>
                      {std.isVip && (
                        <Crown className="w-3 h-3 text-amber-400" />
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-slate-400 font-mono text-[11px]">{std.phone}</td>
                  <td className="p-3 font-black text-amber-300">{std.score} б.</td>
                  <td className="p-3 text-emerald-300 font-bold">{std.attendance}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 text-[10px] font-bold">
                      {std.hwStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
