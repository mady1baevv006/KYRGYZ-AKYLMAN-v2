import React from 'react';

interface SubjectBackgroundProps {
  className?: string;
}

export const EnglishSubjectBackground: React.FC<SubjectBackgroundProps> = ({ className = '' }) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      {/* Subtle English Grid */}
      <svg
        className="absolute w-full h-full inset-0"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <defs>
          <pattern
            id="eng-clean-grid"
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

        <rect width="100%" height="100%" fill="url(#eng-clean-grid)" />

        {/* Minimal Big Ben Silhouette (Left) */}
        <g transform="translate(40, 20)" stroke="white" strokeWidth="1" strokeOpacity="0.35">
          <polygon points="25,5 21,24 29,24" fill="#042f2e" fillOpacity="0.3" />
          <rect x="15" y="36" width="20" height="20" rx="2" fill="#022c22" fillOpacity="0.4" />
          <circle cx="25" cy="46" r="7" fill="none" stroke="#2dd4bf" strokeWidth="1" />
          <line x1="25" y1="46" x2="25" y2="41" stroke="#ffffff" strokeWidth="1" />
          <line x1="25" y1="46" x2="29" y2="46" stroke="#ffffff" strokeWidth="1" />
          <rect x="17" y="58" width="16" height="30" fill="#042f2e" fillOpacity="0.3" />
        </g>

        {/* Minimal London Bridge / Open Book motif (Right) */}
        <g transform="translate(800, 25)" stroke="white" strokeWidth="1" strokeOpacity="0.35">
          <line x1="45" y1="10" x2="45" y2="70" stroke="#2dd4bf" strokeWidth="1.5" strokeOpacity="0.6" />
          <path
            d="M 45 10 C 30 5 15 7 5 10 L 5 65 C 15 62 30 60 45 65 Z"
            fill="#042f2e"
            fillOpacity="0.2"
          />
          <path
            d="M 45 10 C 60 5 75 7 85 10 L 85 65 C 75 62 60 60 45 65 Z"
            fill="#042f2e"
            fillOpacity="0.2"
          />
        </g>

        {/* Latin Letters Accent */}
        <g transform="translate(430, 30)" fill="white" fillOpacity="0.15" stroke="none" fontFamily="serif" fontWeight="bold">
          <text x="0" y="35" fontSize="32">A</text>
          <text x="40" y="35" fontSize="26">B</text>
          <text x="75" y="35" fontSize="30">C</text>
        </g>
      </svg>

      {/* Minimal Grammar Watermarks */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none select-none">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-white/30">
          <span>[ S + V + O ]</span>
          <span className="hidden sm:inline">Reading • Grammar • Error ID</span>
        </div>
        <div className="flex items-center justify-between text-xs font-mono text-teal-200/30">
          <span>Passive & Conditionals</span>
          <span className="hidden sm:inline">ORT English Section</span>
        </div>
      </div>
    </div>
  );
};

