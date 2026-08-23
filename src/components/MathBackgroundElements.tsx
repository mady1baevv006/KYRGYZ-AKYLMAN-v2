import React from 'react';

interface MathBackgroundElementsProps {
  opacity?: string;
  variant?: 'algebra' | 'geometry' | 'math' | 'banner' | 'card' | 'full' | 'russian' | 'literature' | 'english';
}

export const MathBackgroundElements: React.FC<MathBackgroundElementsProps> = ({
  opacity = 'opacity-20',
  variant = 'math',
}) => {
  const isAlgebra = variant === 'algebra';
  const isGeometry = variant === 'geometry';
  const isRussian = variant === 'russian' || variant === 'literature';
  const isEnglish = variant === 'english';
  const isMathMixed = !isAlgebra && !isGeometry && !isRussian && !isEnglish;

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${opacity}`}
      aria-hidden="true"
    >
      {/* SVG Vector Blueprint Mesh */}
      <svg
        className="absolute w-full h-full inset-0"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <defs>
          <pattern
            id={`bg-grid-pattern-${variant}`}
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
              strokeOpacity="0.05"
            />
            <circle cx="0" cy="0" r="1" fill="white" fillOpacity="0.1" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill={`url(#bg-grid-pattern-${variant})`} />

        {/* ---------------- RUSSIAN / LITERATURE VECTORS (Quill pen, open book, scroll, quotes) ---------------- */}
        {isRussian && (
          <>
            {/* Writer's Quill Pen & Ink Pot (Left side) */}
            <g transform="translate(30, 20)" stroke="white" strokeWidth="0.9" strokeOpacity="0.28">
              {/* Feather quill */}
              <path
                d="M 20 80 Q 40 40 70 10 Q 55 25 45 45 Q 35 60 20 80 Z"
                fill="black"
                fillOpacity="0.15"
              />
              <path d="M 20 80 L 70 10" stroke="white" strokeWidth="1.2" strokeOpacity="0.4" />
              <path d="M 40 38 Q 50 35 58 30" />
              <path d="M 32 50 Q 42 47 50 42" />
              <path d="M 26 62 Q 35 59 42 54" />
              {/* Nib tip */}
              <path d="M 20 80 L 15 88 L 22 86 Z" fill="white" fillOpacity="0.3" stroke="none" />
              {/* Ink lines */}
              <path d="M 12 90 Q 28 86 48 90" stroke="white" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.3" />
            </g>

            {/* Open Book Vector (Right side) */}
            <g transform="translate(740, 25)" stroke="white" strokeWidth="0.9" strokeOpacity="0.25">
              {/* Book Spine */}
              <line x1="45" y1="15" x2="45" y2="70" stroke="white" strokeWidth="1.5" strokeOpacity="0.35" />
              {/* Left Page */}
              <path d="M 45 15 C 30 10 15 12 5 15 L 5 70 C 15 67 30 65 45 70 Z" fill="black" fillOpacity="0.1" />
              {/* Right Page */}
              <path d="M 45 15 C 60 10 75 12 85 15 L 85 70 C 75 67 60 65 45 70 Z" fill="black" fillOpacity="0.1" />
              {/* Text Lines on Left */}
              <line x1="12" y1="28" x2="38" y2="28" strokeOpacity="0.2" />
              <line x1="12" y1="38" x2="38" y2="38" strokeOpacity="0.2" />
              <line x1="12" y1="48" x2="30" y2="48" strokeOpacity="0.2" />
              {/* Text Lines on Right */}
              <line x1="52" y1="28" x2="78" y2="28" strokeOpacity="0.2" />
              <line x1="52" y1="38" x2="78" y2="38" strokeOpacity="0.2" />
              <line x1="52" y1="48" x2="70" y2="48" strokeOpacity="0.2" />
            </g>
          </>
        )}

        {/* ---------------- ENGLISH SUBJECT VECTORS ---------------- */}
        {isEnglish && (
          <>
            {/* Open Dictionary & Bookmark (Left side) */}
            <g transform="translate(30, 20)" stroke="white" strokeWidth="0.9" strokeOpacity="0.28">
              <path d="M 40 15 C 25 10 12 12 5 15 L 5 65 C 12 62 25 60 40 65 C 55 60 68 62 75 65 L 75 15 C 68 12 55 10 40 15 Z" fill="black" fillOpacity="0.15" />
              <line x1="40" y1="15" x2="40" y2="65" stroke="white" strokeWidth="1.5" strokeOpacity="0.35" />
              <text x="12" y="32" fill="white" fillOpacity="0.4" fontSize="10" fontFamily="serif" stroke="none">A B C</text>
              <text x="48" y="32" fill="white" fillOpacity="0.4" fontSize="10" fontFamily="serif" stroke="none">D E F</text>
            </g>

            {/* Grammar Tree / Structure Icon (Right side) */}
            <g transform="translate(740, 25)" stroke="white" strokeWidth="0.9" strokeOpacity="0.25">
              <rect x="20" y="15" width="55" height="24" rx="4" fill="black" fillOpacity="0.1" />
              <text x="27" y="31" fill="white" fillOpacity="0.45" fontSize="8" fontFamily="monospace" stroke="none">[ S + V + O ]</text>
              <path d="M 47 39 L 47 52 L 25 52 L 25 62 M 47 52 L 70 52 L 70 62" strokeOpacity="0.2" />
            </g>
          </>
        )}

        {/* ---------------- ALGEBRA ONLY VECTORS ---------------- */}
        {isAlgebra && (
          <>
            {/* Cartesian Coordinate Axes with Parabola y = ax^2 + bx + c */}
            <g transform="translate(40, 20)" stroke="white" strokeWidth="1" strokeOpacity="0.25">
              <line x1="0" y1="50" x2="100" y2="50" />
              <line x1="50" y1="90" x2="50" y2="10" />
              <polygon points="100,50 95,47 95,53" fill="white" fillOpacity="0.4" stroke="none" />
              <polygon points="50,10 47,15 53,15" fill="white" fillOpacity="0.4" stroke="none" />
              <path d="M 15 15 Q 50 80 85 15" fill="none" stroke="white" strokeWidth="1.3" strokeOpacity="0.35" />
              <text x="92" y="44" fill="white" fillOpacity="0.5" fontSize="8" fontFamily="monospace" stroke="none">x</text>
              <text x="54" y="18" fill="white" fillOpacity="0.5" fontSize="8" fontFamily="monospace" stroke="none">y</text>
            </g>
          </>
        )}

        {/* ---------------- GEOMETRY ONLY VECTORS ---------------- */}
        {isGeometry && (
          <>
            {/* Right-angled triangle & Pythagorean notation */}
            <g transform="translate(40, 20)" stroke="white" strokeWidth="1" strokeOpacity="0.25">
              <path d="M 0 60 L 70 60 L 70 0 Z" fill="black" fillOpacity="0.1" />
              <path d="M 62 60 L 62 52 L 70 52" />
              <text x="30" y="72" fill="white" fillOpacity="0.45" fontSize="9" fontFamily="monospace" stroke="none">a</text>
              <text x="76" y="32" fill="white" fillOpacity="0.45" fontSize="9" fontFamily="monospace" stroke="none">b</text>
              <text x="26" y="26" fill="white" fillOpacity="0.45" fontSize="9" fontFamily="monospace" stroke="none">c</text>
            </g>
          </>
        )}

        {/* ---------------- MIXED MATH VECTORS ---------------- */}
        {isMathMixed && (
          <>
            {/* Coordinate System in Top Left */}
            <g transform="translate(30, 25)" stroke="white" strokeWidth="0.8" strokeOpacity="0.22">
              <line x1="0" y1="40" x2="80" y2="40" />
              <line x1="40" y1="70" x2="40" y2="10" />
              <path d="M 10 15 Q 40 60 70 15" fill="none" stroke="white" strokeWidth="1.2" strokeOpacity="0.3" />
              <text x="74" y="36" fill="white" fillOpacity="0.4" fontSize="8" fontFamily="monospace" stroke="none">x</text>
              <text x="44" y="16" fill="white" fillOpacity="0.4" fontSize="8" fontFamily="monospace" stroke="none">y</text>
            </g>

            {/* Geometric Triangle in Bottom Right */}
            <g transform="translate(750, 40)" stroke="white" strokeWidth="0.8" strokeOpacity="0.2">
              <path d="M 0 50 L 60 50 L 60 0 Z" fill="black" fillOpacity="0.08" />
              <path d="M 52 50 L 52 42 L 60 42" />
              <text x="25" y="62" fill="white" fillOpacity="0.35" fontSize="8" fontFamily="monospace" stroke="none">a</text>
              <text x="65" y="28" fill="white" fillOpacity="0.35" fontSize="8" fontFamily="monospace" stroke="none">b</text>
            </g>
          </>
        )}
      </svg>

      {/* ---------------- RUSSIAN / LITERATURE TYPOGRAPHY WATERMARKS ---------------- */}
      {isRussian && (
        <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 pointer-events-none">
          <div className="flex justify-between items-center text-[10px] sm:text-xs md:text-sm font-serif font-bold text-white/18 tracking-wider">
            <span>«Слово : Значение»</span>
            <span className="hidden sm:inline font-mono text-white/15">Аналогии & Логика ОРТ</span>
            <span>«Контекст & Подтекст»</span>
          </div>
          <div className="flex justify-between items-center text-[10px] sm:text-xs md:text-sm font-serif font-bold text-white/12">
            <span>А Б В Г Д ... Я</span>
            <span className="hidden md:inline font-sans text-white/15">Практическая грамматика & Синтаксис</span>
            <span>«Причина → Следствие»</span>
          </div>
        </div>
      )}

      {/* ---------------- ENGLISH TYPOGRAPHY WATERMARKS ---------------- */}
      {isEnglish && (
        <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 pointer-events-none">
          <div className="flex justify-between items-center text-[10px] sm:text-xs md:text-sm font-mono font-bold text-white/18 tracking-wider">
            <span>Present • Past • Future Perfect</span>
            <span className="hidden sm:inline">Active & Passive Voice</span>
            <span>Reading Comprehension</span>
          </div>
          <div className="flex justify-between items-center text-[10px] sm:text-xs md:text-sm font-mono font-bold text-white/12">
            <span>Conditionals (0, 1, 2, 3)</span>
            <span className="hidden md:inline font-sans text-white/15">Error Identification & Vocabulary</span>
            <span>Subject + Verb Agreement</span>
          </div>
        </div>
      )}

      {/* ---------------- ALGEBRA TYPOGRAPHY WATERMARKS ---------------- */}
      {isAlgebra && (
        <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 pointer-events-none">
          <div className="flex justify-between items-center text-[10px] sm:text-xs md:text-sm font-mono font-bold text-white/15">
            <span>Δ = b² - 4ac</span>
            <span className="hidden sm:inline">logₐ(x·y) = logₐx + logₐy</span>
            <span>x = (-b ± √Δ) / 2a</span>
          </div>
          <div className="flex justify-between items-center text-[10px] sm:text-xs md:text-sm font-mono font-bold text-white/10">
            <span>(a + b)² = a² + 2ab + b²</span>
            <span className="hidden md:inline font-black text-white/15">ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ</span>
            <span>√x² = |x|</span>
          </div>
        </div>
      )}

      {/* ---------------- GEOMETRY TYPOGRAPHY WATERMARKS ---------------- */}
      {isGeometry && (
        <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 pointer-events-none">
          <div className="flex justify-between items-center text-[10px] sm:text-xs md:text-sm font-mono font-bold text-white/15">
            <span>a² + b² = c²</span>
            <span className="hidden sm:inline">S = ½ · a · hₐ</span>
            <span>sin²α + cos²α = 1</span>
          </div>
          <div className="flex justify-between items-center text-[10px] sm:text-xs md:text-sm font-mono font-bold text-white/10">
            <span>α + β + γ = 180°</span>
            <span className="hidden md:inline font-black text-white/15">S = πr²</span>
            <span>π ≈ 3.14159...</span>
          </div>
        </div>
      )}

      {/* ---------------- MIXED (GENERAL MATHEMATICS) WATERMARKS ---------------- */}
      {isMathMixed && (
        <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 pointer-events-none">
          <div className="flex justify-between items-center text-[10px] sm:text-xs md:text-sm font-mono font-bold text-white/15">
            <span>Δ = b² - 4ac</span>
            <span className="hidden sm:inline">a² + b² = c²</span>
            <span>sin²α + cos²α = 1</span>
          </div>
          <div className="flex justify-between items-center text-[10px] sm:text-xs md:text-sm font-mono font-bold text-white/10">
            <span>ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ</span>
            <span className="hidden md:inline font-black text-white/15">√x² = |x|</span>
            <span>π ≈ 3.14159...</span>
          </div>
        </div>
      )}
    </div>
  );
};

