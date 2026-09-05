import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Eye, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { BackgroundConfig, Language } from '../types';
import { translations } from '../translations';

interface ComparisonSliderProps {
  originalUrl: string;
  cutoutUrl: string;
  backgroundConfig: BackgroundConfig;
  language: Language;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({
  originalUrl,
  cutoutUrl,
  backgroundConfig,
  language,
}) => {
  const t = translations[language];
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);
  const [showOriginalOverride, setShowOriginalOverride] = useState(false);
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updateSlider(e.clientX);
  };

  const updateSlider = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPos(percent);
  }, []);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      updateSlider(e.clientX);
    };
    const handlePointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, updateSlider]);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Zoom and view quick actions */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2">
          <button
            onMouseDown={() => setShowOriginalOverride(true)}
            onMouseUp={() => setShowOriginalOverride(false)}
            onTouchStart={() => setShowOriginalOverride(true)}
            onTouchEnd={() => setShowOriginalOverride(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 active:bg-amber-500/20 active:text-amber-400 border border-neutral-700 text-xs text-neutral-300 transition select-none cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-neutral-400" />
            <span>{t.holdToSeeOriginal}</span>
          </button>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-lg p-1">
          <button
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
            className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition"
            title={t.zoomOut}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-neutral-400 px-1 font-mono">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(2.5, z + 0.25))}
            className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition"
            title={t.zoomIn}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition"
            title={t.resetZoom}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport with Slider */}
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 shadow-2xl flex items-center justify-center p-4">
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          className="relative max-w-full max-h-[70vh] aspect-auto rounded-xl overflow-hidden select-none cursor-ew-resize bg-checkers"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          }}
        >
          {/* Layer 1: Background & Cutout (Right / After) */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Custom Background Layer */}
            {backgroundConfig.type === 'solid' && (
              <div
                className="absolute inset-0"
                style={{ backgroundColor: backgroundConfig.color }}
              />
            )}
            {backgroundConfig.type === 'gradient' && (
              <div
                className="absolute inset-0"
                style={{
                  background: backgroundConfig.gradient.includes('blue')
                    ? 'linear-gradient(135deg, #2563eb, #60a5fa)'
                    : backgroundConfig.gradient.includes('purple')
                    ? 'linear-gradient(135deg, #7c3aed, #ec4899)'
                    : backgroundConfig.gradient.includes('sunset')
                    ? 'linear-gradient(135deg, #f97316, #f43f5e)'
                    : backgroundConfig.gradient.includes('emerald')
                    ? 'linear-gradient(135deg, #059669, #10b981)'
                    : 'linear-gradient(135deg, #334155, #0f172a)',
                }}
              />
            )}
            {backgroundConfig.type === 'blur' && (
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={originalUrl}
                  alt="Blurred background"
                  className="w-full h-full object-cover scale-110"
                  style={{ filter: `blur(${backgroundConfig.blurAmount}px)` }}
                />
              </div>
            )}
            {backgroundConfig.type === 'image' && backgroundConfig.imageUrl && (
              <div className="absolute inset-0">
                <img
                  src={backgroundConfig.imageUrl}
                  alt="Custom background"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Cutout Image */}
            <img
              src={cutoutUrl}
              alt="Cutout foreground"
              className="max-h-[60vh] w-auto object-contain block relative z-10 pointer-events-none"
              style={{
                filter: backgroundConfig.shadowEnabled
                  ? `drop-shadow(0px ${backgroundConfig.shadowOffsetY}px ${backgroundConfig.shadowBlur}px rgba(0,0,0,${backgroundConfig.shadowOpacity}))`
                  : 'none',
              }}
            />
          </div>

          {/* Layer 2: Original Image (Left / Before - clipped by slider) */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none z-20"
            style={{
              clipPath: showOriginalOverride
                ? 'inset(0 0 0 0)'
                : `inset(0 ${100 - sliderPos}% 0 0)`,
            }}
          >
            <img
              src={originalUrl}
              alt="Original"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Slider Line & Handle */}
          {!showOriginalOverride && (
            <div
              className="absolute top-0 bottom-0 z-30 pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-0 bottom-0 -left-px w-0.5 bg-white shadow-lg" />
              <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 rounded-full bg-white text-neutral-900 flex items-center justify-center shadow-xl border-2 border-neutral-900 cursor-ew-resize">
                <span className="text-[10px] font-bold tracking-tighter">⇄</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
