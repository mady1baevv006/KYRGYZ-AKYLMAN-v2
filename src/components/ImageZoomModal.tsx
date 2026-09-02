import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageZoomModalProps {
  imageUrl: string;
  altText?: string;
  currentPageIdx: number;
  totalPages: number;
  sectionPages: string[];
  onPrevPage: () => void;
  onNextPage: () => void;
  onSelectPage: (idx: number) => void;
  onClose: () => void;
  getFallbackImageUrl?: (rawUrl: string) => string;
  pageLabel?: string;
  ofLabel?: string;
}

export const ImageZoomModal: React.FC<ImageZoomModalProps> = ({
  imageUrl,
  altText = 'Страница теста',
  currentPageIdx,
  totalPages,
  sectionPages,
  onPrevPage,
  onNextPage,
  onSelectPage,
  onClose,
  getFallbackImageUrl,
  pageLabel = 'Страница',
  ofLabel = 'из',
}) => {
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastTouchDistRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset zoom & pan when page changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [imageUrl, currentPageIdx]);

  // Keyboard navigation & escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && currentPageIdx > 0) {
        onPrevPage();
      } else if (e.key === 'ArrowRight' && currentPageIdx < totalPages - 1) {
        onNextPage();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleResetZoom();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPageIdx, totalPages, onClose, onPrevPage, onNextPage]);

  // Zoom helpers
  const handleZoomIn = () => {
    setScale((prev) => Math.min(4, Number((prev + 0.35).toFixed(2))));
  };

  const handleZoomOut = () => {
    setScale((prev) => {
      const next = Math.max(1, Number((prev - 0.35).toFixed(2)));
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleToggleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (scale > 1) {
      handleResetZoom();
    } else {
      setScale(2.2);
    }
  };

  // Wheel Zoom (Mouse / Trackpad)
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const zoomDelta = e.deltaY * -0.0025;
    setScale((prevScale) => {
      const newScale = Math.min(4, Math.max(1, Number((prevScale + zoomDelta).toFixed(2))));
      if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newScale;
    });
  }, []);

  // Mouse Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for Mobile (Pinch-to-zoom & 1-finger pan)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // 2 fingers: pinch zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      lastTouchDistRef.current = dist;
    } else if (e.touches.length === 1 && scale > 1) {
      // 1 finger: pan
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistRef.current !== null) {
      // Pinch to zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      const diff = (dist - lastTouchDistRef.current) * 0.008;

      setScale((prevScale) => {
        const next = Math.min(4, Math.max(1, Number((prevScale + diff).toFixed(2))));
        if (next === 1) setPosition({ x: 0, y: 0 });
        return next;
      });

      lastTouchDistRef.current = dist;
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      // Drag pan
      const touch = e.touches[0];
      const newX = touch.clientX - dragStartRef.current.x;
      const newY = touch.clientY - dragStartRef.current.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleTouchEnd = () => {
    lastTouchDistRef.current = null;
    setIsDragging(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/95 backdrop-blur-md z-[300] flex flex-col items-center justify-between p-2 sm:p-4 select-none touch-none"
      onClick={onClose}
    >
      {/* Zoom Modal Header Toolbar */}
      <div
        className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-2.5 text-white z-10 bg-slate-900/95 px-4 py-2.5 rounded-2xl border border-slate-700/80 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Page counter and zoom level info */}
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-bold text-xs sm:text-sm">
            {pageLabel} {currentPageIdx + 1} {ofLabel} {totalPages}
          </span>
          <span className="bg-slate-800 text-slate-300 font-mono text-[11px] font-bold px-2 py-0.5 rounded-md border border-slate-700">
            {Math.round(scale * 100)}%
          </span>
        </div>

        {/* Page Flipping Buttons */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 max-w-[60%] sm:max-w-none scrollbar-none touch-pan-x">
            <button
              type="button"
              onClick={onPrevPage}
              disabled={currentPageIdx <= 0}
              className="p-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all border border-slate-700 active:scale-95 flex items-center justify-center"
              title="Мурунку бет / Предыдущая страница"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1">
              {sectionPages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectPage(idx)}
                  className={`h-7 min-w-[28px] px-2 rounded-lg text-xs font-black transition-all cursor-pointer active:scale-95 ${
                    idx === currentPageIdx
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 scale-105 shadow-md shadow-emerald-600/40'
                      : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={onNextPage}
              disabled={currentPageIdx >= totalPages - 1}
              className="p-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all border border-slate-700 active:scale-95 flex items-center justify-center"
              title="Кийинки бет / Следующая страница"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Zoom & Close Toolbar Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={scale <= 1}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white disabled:opacity-35 disabled:cursor-not-allowed border border-slate-700 cursor-pointer transition-all active:scale-95"
            title="Отдалить / Zoom out (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleResetZoom}
            disabled={scale === 1 && position.x === 0 && position.y === 0}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white disabled:opacity-35 disabled:cursor-not-allowed border border-slate-700 cursor-pointer transition-all active:scale-95"
            title="Сбросить масштаб / Reset zoom (100%)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleZoomIn}
            disabled={scale >= 4}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white disabled:opacity-35 disabled:cursor-not-allowed border border-slate-700 cursor-pointer transition-all active:scale-95"
            title="Приблизить / Zoom in (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-6 bg-slate-700 mx-1" />

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-white border border-slate-700 hover:border-rose-500 cursor-pointer transition-colors active:scale-95"
            title="Закрыть / Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Zoomable Canvas Area */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleToggleZoom}
        className={`flex-1 w-full flex items-center justify-center p-2 overflow-hidden ${
          scale > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            transformOrigin: 'center center',
          }}
          className="will-change-transform max-w-full max-h-full flex items-center justify-center"
        >
          <img
            key={imageUrl}
            src={imageUrl}
            alt={altText}
            draggable={false}
            onError={(e) => {
              if (getFallbackImageUrl) {
                const target = e.currentTarget;
                const fallback = getFallbackImageUrl(imageUrl);
                if (target.src !== fallback) {
                  target.src = fallback;
                }
              }
            }}
            className="max-w-[90vw] max-h-[82vh] sm:max-h-[86vh] object-contain rounded-2xl shadow-2xl border border-slate-800 select-none pointer-events-none"
          />
        </div>
      </div>

      {/* Hint pill at bottom */}
      <div className="bg-slate-900/80 backdrop-blur-xs text-slate-400 text-[11px] font-medium px-3.5 py-1.5 rounded-full border border-slate-800 flex items-center gap-2 pointer-events-none mb-1">
        <span>💡</span>
        <span>
          Компьютер: колесо мыши или перетаскивание • Телефон: зум двумя пальцами
        </span>
      </div>
    </div>
  );
};
