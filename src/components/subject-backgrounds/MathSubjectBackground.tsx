import React from 'react';

interface SubjectBackgroundProps {
  className?: string;
}

export const MathSubjectBackground: React.FC<SubjectBackgroundProps> = ({ className = '' }) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      {/* Blueprint Grid */}
      <svg
        className="absolute w-full h-full inset-0"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <defs>
          <pattern
            id="math-blueprint-grid-clean"
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

        <rect width="100%" height="100%" fill="url(#math-blueprint-grid-clean)" />

        {/* Minimalist Coordinate Plane with Parabola (Left) */}
        <g transform="translate(30, 25)" stroke="white" strokeWidth="1" strokeOpacity="0.35">
          <line x1="0" y1="55" x2="110" y2="55" />
          <line x1="55" y1="95" x2="55" y2="10" />
          <polygon points="110,55 104,52 104,58" fill="white" fillOpacity="0.5" stroke="none" />
          <polygon points="55,10 52,16 58,16" fill="white" fillOpacity="0.5" stroke="none" />
          <text x="102" y="48" fill="white" fillOpacity="0.6" fontSize="9" fontFamily="monospace" stroke="none">x</text>
          <text x="60" y="18" fill="white" fillOpacity="0.6" fontSize="9" fontFamily="monospace" stroke="none">y</text>
          <path
            d="M 20 20 Q 55 85 90 20"
            fill="none"
            stroke="#34d399"
            strokeWidth="1.5"
            strokeOpacity="0.6"
          />
        </g>

        {/* Right Triangle / Pythagorean Theorem (Right) */}
        <g transform="translate(800, 25)" stroke="white" strokeWidth="1" strokeOpacity="0.3">
          <path d="M 10 75 L 85 75 L 85 15 Z" fill="#047857" fillOpacity="0.12" />
          <path d="M 75 75 L 75 65 L 85 65" strokeOpacity="0.5" />
          <text x="35" y="40" fill="#34d399" fillOpacity="0.7" fontSize="10" fontFamily="serif" fontStyle="italic" stroke="none">c = √(a²+b²)</text>
        </g>

        {/* Integral symbol watermark */}
        <g transform="translate(450, 30)" fill="white" fillOpacity="0.18" stroke="none">
          <text x="0" y="40" fontSize="32" fontFamily="serif" fontStyle="italic">∫</text>
          <text x="18" y="32" fontSize="11" fontFamily="monospace">f(x)dx</text>
        </g>
      </svg>

      {/* Minimal Watermark Formulas */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none select-none">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-white/30">
          <span>Δ = b² - 4ac</span>
          <span className="hidden sm:inline">sin²α + cos²α = 1</span>
        </div>
        <div className="flex items-center justify-between text-xs font-mono text-emerald-200/30">
          <span>(a + b)² = a² + 2ab + b²</span>
          <span className="hidden sm:inline">S = πr²</span>
        </div>
      </div>
    </div>
  );
};

