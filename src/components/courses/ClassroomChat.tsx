import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Pin,
  Smile,
  Paperclip,
  Crown,
  ShieldAlert,
  User,
  Sparkles,
} from 'lucide-react';
import { AppLanguage } from '../../types';
import { CourseGroup, CourseChatMessage } from '../../types/courses';
import { useAuth } from '../../context/AuthContext';

interface ClassroomChatProps {
  course: CourseGroup;
  lang: AppLanguage;
}

export const ClassroomChat: React.FC<ClassroomChatProps> = ({
  course,
  lang,
}) => {
  const { user, isVip, isAdmin } = useAuth();
  const isKg = lang === 'kg';

  const [messages, setMessages] = useState<CourseChatMessage[]>(course.chatMessages);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: CourseChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: user?.id || 'std-current',
      senderName: user?.name || (isKg ? 'Сиз' : 'Вы'),
      senderAvatar: user?.avatar || '',
      senderRole: isAdmin ? 'admin' : 'student',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  const pinnedMsg = messages.find((m) => m.isPinned);

  return (
    <div className="bg-[#052219] border border-emerald-800/60 rounded-3xl overflow-hidden shadow-xl flex flex-col h-[600px]">
      {/* Header */}
      <div className="p-4 bg-[#031510] border-b border-emerald-800/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white">{isKg ? 'Топтук чат' : 'Чат учебной группы'}</h4>
            <p className="text-[11px] text-emerald-300/70">{course.titleRu}</p>
          </div>
        </div>

        <div className="text-xs text-emerald-400 font-bold px-2.5 py-1 rounded-xl bg-emerald-950 border border-emerald-800/60">
          {messages.length} {isKg ? 'билдирүү' : 'сообщений'}
        </div>
      </div>

      {/* Pinned Announcement */}
      {pinnedMsg && (
        <div className="bg-gradient-to-r from-amber-950/70 to-[#041a14] border-b border-amber-400/30 p-3 px-4 flex items-start gap-2.5 text-xs text-amber-200">
          <Pin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <span className="font-bold text-amber-300 mr-1.5">{isKg ? 'Бекемделген кулактандыруу:' : 'Закреплено преподавателем:'}</span>
            <span className="text-amber-100/90">{pinnedMsg.text}</span>
          </div>
        </div>
      )}

      {/* Messages Timeline */}
      <div className="flex-1 p-4 space-y-3.5 overflow-y-auto bg-[#041a14]/60">
        {messages.map((msg) => {
          const isTeacher = msg.senderRole === 'teacher';
          const isCurrentAdmin = msg.senderRole === 'admin';
          const isMe = msg.senderId === user?.id || msg.senderName === user?.name;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className="shrink-0">
                {msg.senderAvatar ? (
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-8 h-8 rounded-xl object-cover border border-emerald-400/40"
                  />
                ) : (
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isTeacher
                        ? 'bg-amber-400 text-slate-950'
                        : isCurrentAdmin
                        ? 'bg-purple-500 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {msg.senderName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[78%] rounded-2xl p-3 text-xs space-y-1 ${
                  isTeacher
                    ? 'bg-amber-400/15 border border-amber-400/40 text-amber-100 shadow-md'
                    : isMe
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/20'
                    : 'bg-[#031510] border border-emerald-800/60 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className={isTeacher ? 'text-amber-300' : isMe ? 'text-emerald-100' : 'text-emerald-400'}>
                      {msg.senderName}
                    </span>
                    {isTeacher && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 text-[9px] font-black uppercase">
                        {isKg ? 'Мугалим' : 'Преподаватель'}
                      </span>
                    )}
                    {isCurrentAdmin && (
                      <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[9px] font-black uppercase">
                        Admin
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] opacity-60 shrink-0">{msg.timestamp}</span>
                </div>
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Sender */}
      <form onSubmit={handleSendMessage} className="p-3 bg-[#031510] border-t border-emerald-800/60 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isKg ? 'Топко билдирүү же суроо жазыңыз...' : 'Написать сообщение группе или задать вопрос...'}
          className="flex-1 bg-[#041a14] border border-emerald-800/80 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
        />
        <button
          type="submit"
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isKg ? 'Жөнөтүү' : 'Отправить'}</span>
        </button>
      </form>
    </div>
  );
};
