import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  MonitorUp,
  Hand,
  PhoneOff,
  MessageSquare,
  Users,
  Settings,
  Sparkles,
  Maximize2,
  Volume2,
  Smile,
  Crown,
  Share2,
} from 'lucide-react';
import { AppLanguage } from '../../types';
import { CourseGroup } from '../../types/courses';
import { useAuth } from '../../context/AuthContext';

interface ClassroomVideoCallProps {
  course: CourseGroup;
  lang: AppLanguage;
  isTeacherMode?: boolean;
}

const PARTICIPANTS_MOCK = [
  { id: 'p-1', name: 'Султан Мусаев', role: 'teacher', isSpeaking: true, hasVideo: true, hasMic: true, isHandRaised: false, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80' },
  { id: 'p-2', name: 'Айбек Темиров', role: 'student', isSpeaking: false, hasVideo: true, hasMic: false, isHandRaised: false, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80' },
  { id: 'p-3', name: 'Нурсултан Кадыров', role: 'student', isSpeaking: false, hasVideo: false, hasMic: false, isHandRaised: true, avatar: '' },
  { id: 'p-4', name: 'Динара Асанова', role: 'student', isSpeaking: false, hasVideo: true, hasMic: true, isHandRaised: false, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80' },
  { id: 'p-5', name: 'Алина Бекболотова', role: 'student', isSpeaking: false, hasVideo: false, hasMic: false, isHandRaised: false, avatar: '' },
];

export const ClassroomVideoCall: React.FC<ClassroomVideoCallProps> = ({
  course,
  lang,
  isTeacherMode = false,
}) => {
  const { user, isVip, isAdmin } = useAuth();
  const isKg = lang === 'kg';

  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [showInCallChat, setShowInCallChat] = useState(false);
  const [showParticipantsList, setShowParticipantsList] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState('p-1');
  const [reactions, setReactions] = useState<Array<{ id: number; emoji: string; x: number }>>([]);
  const [inCallMessage, setInCallMessage] = useState('');
  const [inCallMessages, setInCallMessages] = useState<Array<{ sender: string; text: string; time: string; isTeacher?: boolean }>>([
    { sender: 'Султан Мусаев', text: 'Всем привет! Начинаем разбор 3-й части задач по планиметрии.', time: '18:31', isTeacher: true },
    { sender: 'Айбек Темиров', text: 'Звук отличный, видно доску!', time: '18:32' },
  ]);

  const sendReaction = (emoji: string) => {
    const newReaction = {
      id: Date.now() + Math.random(),
      emoji,
      x: 30 + Math.random() * 40,
    };
    setReactions((prev) => [...prev, newReaction]);
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
    }, 2500);
  };

  const handleSendInCallMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inCallMessage.trim()) return;
    setInCallMessages((prev) => [
      ...prev,
      {
        sender: user?.name || (isKg ? 'Сиз' : 'Вы'),
        text: inCallMessage.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInCallMessage('');
  };

  return (
    <div className="bg-[#031510] border border-emerald-800/60 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative min-h-[580px]">
      {/* Top Meeting Header */}
      <div className="bg-[#041a14] border-b border-emerald-800/50 p-3 sm:p-4 flex items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping shrink-0" />
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-black text-white truncate flex items-center gap-2">
              <span>{course.titleRu}</span>
              <span className="px-2 py-0.5 rounded-md bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] uppercase font-black tracking-wider">
                LIVE
              </span>
            </h3>
            <p className="text-xs text-emerald-300/70 truncate">
              {isKg ? 'Мугалим:' : 'Преподаватель:'} {course.teacher.name} • {PARTICIPANTS_MOCK.length + 1} {isKg ? 'катышуучу эфирде' : 'участников'}
            </p>
          </div>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowParticipantsList((prev) => !prev)}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              showParticipantsList ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-white/5 hover:bg-white/10 text-emerald-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">{PARTICIPANTS_MOCK.length + 1}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowInCallChat((prev) => !prev)}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              showInCallChat ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-white/5 hover:bg-white/10 text-emerald-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">{isKg ? 'Чат' : 'Чат'}</span>
          </button>
        </div>
      </div>

      {/* Main Video Viewport & Sidebars */}
      <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden bg-[#020e0b]">
        {/* Main Center Stream: Teacher Video / Screen Share */}
        <div className="flex-1 flex flex-col p-3 sm:p-4 min-h-[380px] relative justify-between">
          {/* Main Stage Video */}
          <div className="relative w-full flex-1 rounded-2xl bg-[#052219] border border-emerald-800/60 overflow-hidden flex items-center justify-center shadow-inner">
            {isScreenSharing ? (
              /* Simulated Screen Sharing View */
              <div className="w-full h-full p-6 flex flex-col justify-between bg-[#041a14] text-emerald-100">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-800/60">
                  <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-2">
                    <MonitorUp className="w-4 h-4" />
                    <span>{isKg ? 'Экран көрсөтүлүүдө: ОРТ 2026 Математика Планшет' : 'Демонстрация экрана: Вариант №3 ЦООМО'}</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    HD 1080p 60fps
                  </span>
                </div>
                <div className="my-auto text-center space-y-3">
                  <div className="text-5xl">📐</div>
                  <div className="font-mono text-base sm:text-lg font-bold text-emerald-200">
                    S = ½ · (a + b) · h
                  </div>
                  <p className="text-xs text-emerald-400/80 max-w-md mx-auto">
                    {isKg ? 'Мугалим экранда геометриялык чиймелерди түшүндүрүүдө' : 'Преподаватель объясняет нахождение высоты трапеции через радиус окружности'}
                  </p>
                </div>
                <div className="text-[11px] text-slate-400 text-right">
                  {isKg ? 'Султан Мусаевдин экраны' : 'Экран Султана Мусаева'}
                </div>
              </div>
            ) : (
              /* Teacher Video Stream Camera */
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={course.teacher.avatar}
                  alt={course.teacher.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-90 filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020e0b]/90 via-transparent to-[#020e0b]/40" />

                {/* Teacher Name Tag */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#031510]/85 backdrop-blur-md border border-emerald-700/60 shadow-lg text-white">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-black">{course.teacher.name}</span>
                  <span className="text-[10px] text-amber-300 font-bold px-1.5 py-0.5 rounded bg-amber-400/15">
                    {isKg ? 'Мугалим' : 'Преподаватель'}
                  </span>
                </div>
              </div>
            )}

            {/* Floating Reactions Floating Up */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {reactions.map((r) => (
                <div
                  key={r.id}
                  className="absolute bottom-10 text-3xl animate-bounce transition-all duration-1000"
                  style={{ left: `${r.x}%`, transform: 'translateY(-120px)' }}
                >
                  {r.emoji}
                </div>
              ))}
            </div>
          </div>

          {/* Student Webcams Grid Strip (Bottom or side) */}
          <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {/* Current User Card */}
            <div className="relative rounded-xl bg-[#041a14] border border-emerald-500/50 p-2 flex flex-col items-center justify-center h-20 sm:h-24 overflow-hidden group">
              {isVideoOn && user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="You"
                  className="w-full h-full object-cover rounded-lg opacity-90"
                />
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center">
                  {(user?.name || 'Вы').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[10px] font-bold text-white">
                <span className="truncate">{user?.name || (isKg ? 'Сиз' : 'Вы')}</span>
                {isMicOn ? (
                  <Mic className="w-3 h-3 text-emerald-400" />
                ) : (
                  <MicOff className="w-3 h-3 text-rose-400" />
                )}
              </div>
              {isHandRaised && (
                <span className="absolute top-1 right-1 bg-amber-400 text-slate-950 p-1 rounded-full text-[10px] shadow">
                  ✋
                </span>
              )}
            </div>

            {/* Other Mock Students */}
            {PARTICIPANTS_MOCK.slice(1, 4).map((p) => (
              <div
                key={p.id}
                className="relative rounded-xl bg-[#041a14] border border-emerald-900/60 p-2 flex flex-col items-center justify-center h-20 sm:h-24 overflow-hidden"
              >
                {p.hasVideo && p.avatar ? (
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="w-full h-full object-cover rounded-lg opacity-85"
                  />
                ) : (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-800 text-slate-300 font-bold text-xs sm:text-sm flex items-center justify-center">
                    {p.name.charAt(0)}
                  </div>
                )}
                <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[10px] font-bold text-white">
                  <span className="truncate">{p.name}</span>
                  {p.hasMic ? (
                    <Mic className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <MicOff className="w-3 h-3 text-rose-400" />
                  )}
                </div>
                {p.isHandRaised && (
                  <span className="absolute top-1 right-1 bg-amber-400 text-slate-950 p-1 rounded-full text-[10px] shadow animate-bounce">
                    ✋
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Side Panel: In-Call Chat or Participants */}
        {showInCallChat && (
          <div className="w-full lg:w-80 bg-[#041a14] border-t lg:border-t-0 lg:border-l border-emerald-800/60 flex flex-col h-72 lg:h-auto">
            <div className="p-3 border-b border-emerald-800/50 flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{isKg ? 'Сабактын түз чаты' : 'Чат видеоурока'}</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowInCallChat(false)}
                className="text-xs font-bold text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 p-3 space-y-2.5 overflow-y-auto">
              {inCallMessages.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl text-xs ${
                    m.isTeacher
                      ? 'bg-amber-400/15 border border-amber-400/30 text-amber-100'
                      : 'bg-[#031510] border border-emerald-900/60 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className={`font-bold ${m.isTeacher ? 'text-amber-300' : 'text-emerald-300'}`}>
                      {m.sender}
                    </span>
                    <span className="text-[10px] text-slate-400">{m.time}</span>
                  </div>
                  <p className="text-xs leading-relaxed">{m.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendInCallMessage} className="p-2 border-t border-emerald-800/50 flex gap-1.5">
              <input
                type="text"
                value={inCallMessage}
                onChange={(e) => setInCallMessage(e.target.value)}
                placeholder={isKg ? 'Суроо жазыңыз...' : 'Задать вопрос...'}
                className="flex-1 bg-[#020e0b] border border-emerald-800/60 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
              >
                →
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="bg-[#031510] border-t border-emerald-800/60 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 z-20">
        {/* Left: Reaction Emojis */}
        <div className="flex items-center gap-1.5">
          {['👍', '💡', '👏', '🎯', '❤️'].map((em) => (
            <button
              key={em}
              type="button"
              onClick={() => sendReaction(em)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-base sm:text-lg transition-transform hover:scale-125 active:scale-95 cursor-pointer"
            >
              {em}
            </button>
          ))}
        </div>

        {/* Center: Main Media Controls */}
        <div className="flex items-center gap-2 sm:gap-3 mx-auto">
          {/* Mic */}
          <button
            type="button"
            onClick={() => setIsMicOn((prev) => !prev)}
            className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer ${
              isMicOn
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/30'
                : 'bg-rose-500/15 border-rose-500/40 text-rose-300 hover:bg-rose-500/25'
            }`}
            title={isMicOn ? 'Выключить микрофон' : 'Включить микрофон'}
          >
            {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          {/* Camera */}
          <button
            type="button"
            onClick={() => setIsVideoOn((prev) => !prev)}
            className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer ${
              isVideoOn
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/30'
                : 'bg-rose-500/15 border-rose-500/40 text-rose-300 hover:bg-rose-500/25'
            }`}
            title={isVideoOn ? 'Выключить камеру' : 'Включить камеру'}
          >
            {isVideoOn ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* Screen Share */}
          <button
            type="button"
            onClick={() => setIsScreenSharing((prev) => !prev)}
            className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer ${
              isScreenSharing
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-400/30'
                : 'bg-white/5 border-emerald-800/60 text-slate-300 hover:bg-white/10'
            }`}
            title={isScreenSharing ? 'Остановить показ экрана' : 'Поделиться экраном'}
          >
            <MonitorUp className="w-5 h-5" />
          </button>

          {/* Raise Hand */}
          <button
            type="button"
            onClick={() => setIsHandRaised((prev) => !prev)}
            className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer ${
              isHandRaised
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-400/30 animate-pulse'
                : 'bg-white/5 border-emerald-800/60 text-slate-300 hover:bg-white/10'
            }`}
            title={isHandRaised ? 'Опустить руку' : 'Поднять руку для вопроса'}
          >
            <Hand className="w-5 h-5" />
          </button>
        </div>

        {/* Right: Leave Call */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => alert(isKg ? 'Сабактан чыгуу' : 'Завершить участие в видеозвонке')}
            className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all active:scale-95 cursor-pointer"
          >
            <PhoneOff className="w-4 h-4" />
            <span className="hidden sm:inline">{isKg ? 'Чыгуу' : 'Выйти'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
