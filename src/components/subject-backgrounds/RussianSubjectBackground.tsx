import React from 'react';

interface SubjectBackgroundProps {
  className?: string;
}

export const RussianSubjectBackground: React.FC<SubjectBackgroundProps> = ({ className = '' }) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      {/* Subtle Literature Grid */}
      <svg
        className="absolute w-full h-full inset-0"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <defs>
          <pattern
            id="rus-clean-grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
              strokeOpacity="0.08"
            />
            <circle cx="0" cy="0" r="1" fill="white" fillOpacity="0.2" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#rus-clean-grid)" />

        {/* Vintage Feather Quill Outline (Left) */}
        <g transform="translate(35, 20)" stroke="white" strokeWidth="1" strokeOpacity="0.35">
          <path
            d="M 20 85 Q 45 40 75 10 Q 58 28 46 50 Q 35 68 20 85 Z"
            fill="#064e3b"
            fillOpacity="0.2"
          />
          <path d="M 20 85 L 75 10" stroke="#34d399" strokeWidth="1.4" strokeOpacity="0.6" />
          <path d="M 20 85 L 14 94 L 23 91 Z" fill="#ffffff" fillOpacity="0.6" stroke="none" />
        </g>

        {/* Minimalist Open Book (Right) */}
        <g transform="translate(800, 25)" stroke="white" strokeWidth="1" strokeOpacity="0.35">
          <line x1="45" y1="10" x2="45" y2="70" stroke="#34d399" strokeWidth="1.5" strokeOpacity="0.6" />
          <path
            d="M 45 10 C 30 5 15 7 5 10 L 5 65 C 15 62 30 60 45 65 Z"
            fill="#064e3b"
            fillOpacity="0.2"
          />
          <path
            d="M 45 10 C 60 5 75 7 85 10 L 85 65 C 75 62 60 60 45 65 Z"
            fill="#064e3b"
            fillOpacity="0.2"
          />
          <line x1="12" y1="24" x2="38" y2="24" strokeOpacity="0.3" />
          <line x1="12" y1="34" x2="38" y2="34" strokeOpacity="0.3" />
          <line x1="52" y1="24" x2="78" y2="24" strokeOpacity="0.3" />
          <line x1="52" y1="34" x2="78" y2="34" strokeOpacity="0.3" />
        </g>

        {/* Cyrillic Letters Accent */}
        <g transform="translate(430, 30)" fill="white" fillOpacity="0.15" stroke="none" fontFamily="serif" fontWeight="bold">
          <text x="0" y="35" fontSize="32">А</text>
          <text x="40" y="35" fontSize="26">Б</text>
          <text x="75" y="35" fontSize="30">В</text>
        </g>
      </svg>

      {/* Minimal Literary Watermarks */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none select-none">
        <div className="flex items-center justify-between text-xs font-serif font-bold text-white/30">
          <span>«Слово и Контекст»</span>
          <span className="hidden sm:inline">Аналогии • Чтение • Грамматика</span>
        </div>
        <div className="flex items-center justify-between text-xs font-serif text-emerald-200/30">
          <span>Синтаксис & Пунктуация</span>
          <span className="hidden sm:inline">ОРТ Русский язык</span>
        </div>
      </div>
    </div>
  );
};

