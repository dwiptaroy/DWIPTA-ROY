import React, { useState, useRef, useCallback } from 'react';
import { Eye } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface CompareSliderProps {
  originalUrl: string;
  cutoutCanvasOrUrl: string;
  language: Language;
}

export const CompareSlider: React.FC<CompareSliderProps> = ({
  originalUrl,
  cutoutCanvasOrUrl,
  language,
}) => {
  const t = translations[language];
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 to 100
  const [isHoldingOriginal, setIsHoldingOriginal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percent);
  }, []);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div className="relative flex flex-col items-center select-none">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        className="relative w-full aspect-4/3 sm:aspect-16/10 max-h-[65vh] rounded-xl overflow-hidden shadow-md border border-zinc-200 cursor-ew-resize bg-zinc-100"
      >
        {/* Background Layer: Transparent Checkerboard */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(45deg, #e4e4e7 25%, transparent 25%), 
              linear-gradient(-45deg, #e4e4e7 25%, transparent 25%), 
              linear-gradient(45deg, transparent 75%, #e4e4e7 75%), 
              linear-gradient(-45deg, transparent 75%, #e4e4e7 75%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            backgroundColor: '#fafafa',
          }}
        />

        {/* Right / Base Image: Cutout (Background Removed) */}
        <img
          src={cutoutCanvasOrUrl}
          alt="Cutout background removed"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />

        {/* Left / Clipped Image: Original */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
          style={{
            clipPath: isHoldingOriginal
              ? 'inset(0 0 0 0)'
              : `inset(0 ${100 - sliderPos}% 0 0)`,
          }}
        >
          <img
            src={originalUrl}
            alt="Original"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          />
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-1 rounded-md">
            {language === 'bn' ? 'আসল ছবি' : 'Original'}
          </div>
        </div>

        {/* Cutout Label (Right side) */}
        {!isHoldingOriginal && (
          <div className="absolute top-3 right-3 bg-indigo-600/90 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-1 rounded-md pointer-events-none">
            {language === 'bn' ? 'কাটআউট' : 'Cutout'}
          </div>
        )}

        {/* Slider Divider Bar & Handle */}
        {!isHoldingOriginal && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-auto"
            style={{ left: `${sliderPos}%` }}
            onMouseDown={handleMouseDown}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg border border-zinc-200 flex items-center justify-center text-zinc-600 hover:scale-110 active:scale-95 transition-transform cursor-grab active:cursor-grabbing">
              <div className="flex gap-0.5">
                <span className="text-[10px] font-bold">‹</span>
                <span className="text-[10px] font-bold">›</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Helper Bar */}
      <div className="mt-3 flex items-center justify-between w-full text-xs text-zinc-500 px-1">
        <span>
          {language === 'bn' ? 'তুলনা করতে স্লাইডারটি ডানে-বামে টানুন' : 'Drag divider left/right to compare'}
        </span>
        <button
          id="hold-original-btn"
          type="button"
          onMouseDown={() => setIsHoldingOriginal(true)}
          onMouseUp={() => setIsHoldingOriginal(false)}
          onTouchStart={() => setIsHoldingOriginal(true)}
          onTouchEnd={() => setIsHoldingOriginal(false)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-200/70 hover:bg-zinc-200 active:bg-zinc-300 text-zinc-700 font-medium transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{t.holdOriginal}</span>
        </button>
      </div>
    </div>
  );
};
