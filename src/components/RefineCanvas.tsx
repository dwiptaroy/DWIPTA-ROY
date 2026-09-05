import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Eraser, Paintbrush, RotateCcw, RotateCw, Check, Undo2 } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';
import { loadImage } from '../utils/imageProcessing';

interface RefineCanvasProps {
  originalUrl: string;
  cutoutUrl: string;
  language: Language;
  onApplyRefinements: (newCutoutUrl: string) => void;
  onCancel: () => void;
}

export const RefineCanvas: React.FC<RefineCanvasProps> = ({
  originalUrl,
  cutoutUrl,
  language,
  onApplyRefinements,
  onCancel,
}) => {
  const t = translations[language];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<'erase' | 'restore'>('erase');
  const [brushSize, setBrushSize] = useState<number>(30);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const origImageRef = useRef<HTMLImageElement | null>(null);

  // Initialize canvas with cutout image and preload original
  useEffect(() => {
    let active = true;

    async function init() {
      const cutout = await loadImage(cutoutUrl);
      const orig = await loadImage(originalUrl);
      if (!active) return;
      origImageRef.current = orig;

      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = cutout.naturalWidth;
      canvas.height = cutout.naturalHeight;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(cutout, 0, 0);

      const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory([initialData]);
      setHistoryIndex(0);
    }

    init();
    return () => {
      active = false;
    };
  }, [cutoutUrl, originalUrl]);

  const saveHistory = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => {
      const updated = prev.slice(0, historyIndex + 1);
      return [...updated, data];
    });
    setHistoryIndex((idx) => idx + 1);
  }, [historyIndex]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    draw(e);
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (ctx) saveHistory(ctx, canvas);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.save();
    if (tool === 'erase') {
      // Erase mode: destination-out clears alpha
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, brushSize, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Restore mode: draw original image restricted to brush circle
      if (origImageRef.current) {
        ctx.beginPath();
        ctx.arc(x, y, brushSize, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(origImageRef.current, 0, 0, canvas.width, canvas.height);
      }
    }
    ctx.restore();
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (ctx && history[newIndex]) {
        ctx.putImageData(history[newIndex], 0, 0);
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (ctx && history[newIndex]) {
        ctx.putImageData(history[newIndex], 0, 0);
      }
    }
  };

  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onApplyRefinements(dataUrl);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-4">
      {/* Brush controls toolbar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTool('erase')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              tool === 'erase'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>{t.eraseTool}</span>
          </button>

          <button
            onClick={() => setTool('restore')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              tool === 'restore'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            <Paintbrush className="w-3.5 h-3.5" />
            <span>{t.restoreTool}</span>
          </button>
        </div>

        {/* Brush size */}
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <span>{t.brushSize}:</span>
          <input
            type="range"
            min="5"
            max="100"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-24 accent-amber-500"
          />
          <span className="font-mono w-6">{brushSize}px</span>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 disabled:opacity-40 transition"
            title={t.undo}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 disabled:opacity-40 transition"
            title={t.redo}
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 rounded-xl text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition"
          >
            <Undo2 className="w-3.5 h-3.5 inline mr-1" />
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-md shadow-emerald-500/20 transition flex items-center gap-1"
          >
            <Check className="w-4 h-4" />
            {t.saveRefinements}
          </button>
        </div>
      </div>

      {/* Canvas view area */}
      <div className="w-full flex justify-center p-4 rounded-2xl border border-neutral-800 bg-neutral-950 bg-checkers overflow-auto max-h-[65vh]">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="max-h-[55vh] w-auto object-contain cursor-crosshair rounded-lg shadow-xl"
        />
      </div>
    </div>
  );
};
