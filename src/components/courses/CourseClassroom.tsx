import React, { useState } from 'react';
import {
  ArrowLeft,
  Video,
  PenTool,
  User,
  Calendar,
  BookOpen,
  MessageSquare,
  Crown,
  Sparkles,
  Users,
  ShieldAlert,
} from 'lucide-react';
import { AppLanguage } from '../../types';
import { CourseGroup, StudentCourseProfile } from '../../types/courses';
import { ClassroomStudentMiniProfile } from './ClassroomStudentMiniProfile';
import { ClassroomWhiteboard } from './ClassroomWhiteboard';
import { ClassroomVideoCall } from './ClassroomVideoCall';
import { ClassroomCalendar } from './ClassroomCalendar';
import { ClassroomHomework } from './ClassroomHomework';
import { ClassroomChat } from './ClassroomChat';
import { ClassroomTeacherTools } from './ClassroomTeacherTools';
import { useAuth } from '../../context/AuthContext';

interface CourseClassroomProps {
  course: CourseGroup;
  studentProfile: StudentCourseProfile;
  lang: AppLanguage;
  onBackToCatalog: () => void;
}

export type ClassroomTab = 'video' | 'whiteboard' | 'profile' | 'calendar' | 'homework' | 'chat' | 'teacher_tools';

export const CourseClassroom: React.FC<CourseClassroomProps> = ({
  course,
  studentProfile,
  lang,
  onBackToCatalog,
}) => {
  const { user, isAdmin, isVip } = useAuth();
  const isKg = lang === 'kg';

  const [activeTab, setActiveTab] = useState<ClassroomTab>('video');

  const navTabs: Array<{ id: ClassroomTab; labelRu: string; labelKg: string; icon: any; isSpecial?: boolean }> = [
    { id: 'video', labelRu: 'Видеозвонок', labelKg: 'Видео сабак', icon: Video },
    { id: 'whiteboard', labelRu: 'Интерактивная доска', labelKg: 'Интерактивдүү такта', icon: PenTool },
    { id: 'profile', labelRu: 'Мини-профиль', labelKg: 'Мини-профиль', icon: User },
    { id: 'calendar', labelRu: 'Расписание & Архив', labelKg: 'Жадыбал & Архив', icon: Calendar },
    { id: 'homework', labelRu: 'Домашние задания', labelKg: 'Үй тапшырмалар', icon: BookOpen },
    { id: 'chat', labelRu: 'Чат группы', labelKg: 'Топтук чат', icon: MessageSquare },
    { id: 'teacher_tools', labelRu: 'Преподаватель & Админ', labelKg: 'Мугалим & Админ', icon: Crown, isSpecial: true },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Course Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#041a14] border border-emerald-800/60 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-3.5 min-w-0">
          <button
            type="button"
            onClick={onBackToCatalog}
            className="w-10 h-10 rounded-2xl bg-[#031510] border border-emerald-800/70 hover:border-emerald-500 text-emerald-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
            title={isKg ? 'Бардык курстарга кайтуу' : 'Назад ко всем курсам'}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                {isKg ? course.subjectNameKg : course.subjectNameRu}
              </span>
              {course.isLiveNow && (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                  {isKg ? 'ТҮЗ ЭФИР' : 'ПРЯМОЙ ЭФИР'}
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white truncate mt-1">
              {isKg ? course.titleKg : course.titleRu}
            </h2>
          </div>
        </div>

        {/* Teacher Mini Badge */}
        <div className="flex items-center gap-3 bg-[#031510] border border-emerald-800/60 px-4 py-2 rounded-2xl shrink-0 self-stretch md:self-auto justify-between md:justify-start">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-emerald-400/80 block">
              {isKg ? 'Мугалим:' : 'Преподаватель:'}
            </span>
            <span className="text-xs font-black text-white">{course.teacher.name}</span>
          </div>
          <img
            src={course.teacher.avatar}
            alt={course.teacher.name}
            referrerPolicy="no-referrer"
            className="w-9 h-9 rounded-xl object-cover border border-emerald-400/50"
          />
        </div>
      </div>

      {/* Classroom Horizontal Navigation Tabs */}
      <div className="bg-[#031510] p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl border border-emerald-800/60 flex items-center gap-1.5 overflow-x-auto shadow-lg scrollbar-thin">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 sm:px-4 py-2.5 rounded-xl sm:rounded-2xl text-xs font-black flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? tab.isSpecial
                    ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : tab.isSpecial
                  ? 'text-amber-300 hover:bg-amber-400/10'
                  : 'text-emerald-200/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{isKg ? tab.labelKg : tab.labelRu}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <div className="transition-all duration-200">
        {activeTab === 'video' && (
          <ClassroomVideoCall
            course={course}
            lang={lang}
            isTeacherMode={isAdmin}
          />
        )}

        {activeTab === 'whiteboard' && (
          <ClassroomWhiteboard
            course={course}
            lang={lang}
            isTeacherMode={isAdmin}
          />
        )}

        {activeTab === 'profile' && (
          <ClassroomStudentMiniProfile
            course={course}
            studentProfile={studentProfile}
            lang={lang}
          />
        )}

        {activeTab === 'calendar' && (
          <ClassroomCalendar
            course={course}
            lang={lang}
            onJoinLiveLesson={() => setActiveTab('video')}
          />
        )}

        {activeTab === 'homework' && (
          <ClassroomHomework
            course={course}
            lang={lang}
          />
        )}

        {activeTab === 'chat' && (
          <ClassroomChat
            course={course}
            lang={lang}
          />
        )}

        {activeTab === 'teacher_tools' && (
          <ClassroomTeacherTools
            course={course}
            lang={lang}
            onStartLiveLesson={() => setActiveTab('video')}
          />
        )}
      </div>
    </div>
  );
};
