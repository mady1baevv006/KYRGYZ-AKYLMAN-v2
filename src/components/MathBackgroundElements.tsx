import React from 'react';

interface MathBackgroundElementsProps {
  opacity?: string;
  variant?: 'algebra' | 'geometry' | 'math' | 'banner' | 'card' | 'full';
}

export const MathBackgroundElements: React.FC<MathBackgroundElementsProps> = ({
  opacity = 'opacity-20',
  variant = 'math',
}) => {
  const isAlgebra = variant === 'algebra';
  const isGeometry = variant === 'geometry';
  const isMixed = !isAlgebra && !isGeometry; // 'math', 'banner', 'card', 'full'

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${opacity}`}
      aria-hidden="true"
    >
      {/* SVG Vector Mathematical Blueprint Mesh */}
      <svg
        className="absolute w-full h-full inset-0"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <defs>
          <pattern
            id={`math-grid-pattern-${variant}`}
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

        <rect width="100%" height="100%" fill={`url(#math-grid-pattern-${variant})`} />

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

        {/* ---------------- MIXED VECTORS (Carefully Spaced) ---------------- */}
        {isMixed && (
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

      {/* ---------------- ALGEBRA TYPOGRAPHY WATERMARKS (Distributed) ---------------- */}
      {isAlgebra && (
        <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-3 gap-6 p-6 pointer-events-none">
          <div className="font-mono text-xs md:text-sm font-bold text-white/20">
            Δ = b² - 4ac
          </div>
          <div className="font-mono text-xs md:text-sm font-bold text-white/15 text-center">
            logₐ(x·y) = logₐx + logₐy
          </div>
          <div className="font-mono text-xs md:text-sm font-bold text-white/20 text-right">
            x = (-b ± √Δ) / 2a
          </div>
          <div className="font-mono text-xs md:text-sm font-semibold text-white/15 self-end">
            (a + b)² = a² + 2ab + b²
          </div>
          <div className="font-mono text-xs md:text-sm font-black text-white/20 text-center self-end">
            ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ
          </div>
          <div className="font-mono text-xs md:text-sm font-bold text-white/15 text-right self-end">
            √x² = |x|
          </div>
        </div>
      )}

      {/* ---------------- GEOMETRY TYPOGRAPHY WATERMARKS (Distributed) ---------------- */}
      {isGeometry && (
        <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-3 gap-6 p-6 pointer-events-none">
          <div className="font-mono text-xs md:text-sm font-bold text-white/20">
            a² + b² = c²
          </div>
          <div className="font-mono text-xs md:text-sm font-bold text-white/15 text-center">
            S = ½ · a · hₐ
          </div>
          <div className="font-mono text-xs md:text-sm font-bold text-white/20 text-right">
            sin²α + cos²α = 1
          </div>
          <div className="font-mono text-xs md:text-sm font-semibold text-white/15 self-end">
            α + β + γ = 180°
          </div>
          <div className="font-mono text-xs md:text-sm font-black text-white/20 text-center self-end">
            S = πr²
          </div>
          <div className="font-mono text-xs md:text-sm font-bold text-white/15 text-right self-end">
            π ≈ 3.14159...
          </div>
        </div>
      )}

      {/* ---------------- MIXED (GENERAL MATHEMATICS) WATERMARKS ---------------- */}
      {isMixed && (
        <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-3 gap-6 p-6 pointer-events-none">
          <div className="font-mono text-xs md:text-sm font-bold text-white/20">
            Δ = b² - 4ac
          </div>
          <div className="font-mono text-xs md:text-sm font-bold text-white/15 text-center">
            a² + b² = c²
          </div>
          <div className="font-mono text-xs md:text-sm font-bold text-white/20 text-right">
            sin²α + cos²α = 1
          </div>
          <div className="font-mono text-xs md:text-sm font-semibold text-white/15 self-end">
            ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ
          </div>
          <div className="font-mono text-xs md:text-sm font-black text-white/20 text-center self-end">
            √x² = |x|
          </div>
          <div className="font-mono text-xs md:text-sm font-bold text-white/15 text-right self-end">
            π ≈ 3.14159...
          </div>
        </div>
      )}
    </div>
  );
};
