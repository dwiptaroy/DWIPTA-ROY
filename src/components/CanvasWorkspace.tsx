import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Undo2, Redo2, RotateCcw } from 'lucide-react';
import {
  BackgroundSettings,
  ShadowSettings,
  SubjectAdjustments,
  BrushSettings,
  Language,
} from '../types';
import { translations } from '../translations';
import { renderCompositeCanvas, loadImageElement } from '../utils/imageProcessing';

interface CanvasWorkspaceProps {
  originalUrl: string;
  initialCutoutBlob: Blob;
  width: number;
  height: number;
  bgSettings: BackgroundSettings;
  shadowSettings: ShadowSettings;
  adjustments: SubjectAdjustments;
  brushSettings: BrushSettings;
  isRefineMode: boolean;
  language: Language;
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
}

export const CanvasWorkspace: React.FC<CanvasWorkspaceProps> = ({
  originalUrl,
  initialCutoutBlob,
  width,
  height,
  bgSettings,
  shadowSettings,
  adjustments,
  brushSettings,
  isRefineMode,
  language,
  onCanvasReady,
}) => {
  const t = translations[language];

  // Working editable cutout layer canvas
  const cutoutCanvasRef = useRef<HTMLCanvasElement | null>(null);
  // Display composite canvas element in DOM
  const displayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  // Cache original HTMLImageElement
  const originalImgRef = useRef<HTMLImageElement | null>(null);

  // Undo/Redo history of cutout layer
  const historyRef = useRef<ImageData[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Zoom scale
  const [zoom, setZoom] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

  // 1. Initialize cutoutCanvas from initialCutoutBlob and load original image
  useEffect(() => {
    let active = true;

    async function initCanvases() {
      try {
        const [cutoutImg, origImg] = await Promise.all([
          loadImageElement(initialCutoutBlob),
          loadImageElement(originalUrl),
        ]);

        if (!active) return;

        originalImgRef.current = origImg;

        // Create internal cutoutCanvas
        const c = document.createElement('canvas');
        c.width = width;
        c.height = height;
        const ctx = c.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(cutoutImg, 0, 0, width, height);
          cutoutCanvasRef.current = c;

          // Initialize history
          const initialData = ctx.getImageData(0, 0, width, height);
          historyRef.current = [initialData];
          historyIndexRef.current = 0;
          setCanUndo(false);
          setCanRedo(false);

          updateComposite();
        }
      } catch (err) {
        console.error('Failed to load images into canvas:', err);
      }
    }

    initCanvases();

    return () => {
      active = false;
    };
  }, [initialCutoutBlob, originalUrl, width, height]);

  // 2. Render composite to display canvas whenever dependencies change
  const updateComposite = useCallback(async () => {
    if (!cutoutCanvasRef.current || !displayCanvasRef.current) return;

    try {
      const compCanvas = await renderCompositeCanvas(
        cutoutCanvasRef.current,
        originalImgRef.current,
        width,
        height,
        bgSettings,
        shadowSettings,
        adjustments
      );

      const displayCtx = displayCanvasRef.current.getContext('2d');
      if (displayCtx) {
        displayCanvasRef.current.width = width;
        displayCanvasRef.current.height = height;
        displayCtx.clearRect(0, 0, width, height);
        displayCtx.drawImage(compCanvas, 0, 0);

        onCanvasReady(displayCanvasRef.current);
      }
    } catch (e) {
      console.error('Composite rendering error:', e);
    }
  }, [width, height, bgSettings, shadowSettings, adjustments, onCanvasReady]);

  useEffect(() => {
    updateComposite();
  }, [updateComposite]);

  // History save helper
  const saveHistoryStep = () => {
    if (!cutoutCanvasRef.current) return;
    const ctx = cutoutCanvasRef.current.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const data = ctx.getImageData(0, 0, width, height);
    const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    newHistory.push(data);
    // limit history depth to 15
    if (newHistory.length > 15) newHistory.shift();

    historyRef.current = newHistory;
    historyIndexRef.current = newHistory.length - 1;
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);
  };

  const handleUndo = () => {
    if (historyIndexRef.current > 0 && cutoutCanvasRef.current) {
      historyIndexRef.current -= 1;
      const ctx = cutoutCanvasRef.current.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.putImageData(historyRef.current[historyIndexRef.current], 0, 0);
        setCanUndo(historyIndexRef.current > 0);
        setCanRedo(true);
        updateComposite();
      }
    }
  };

  const handleRedo = () => {
    if (
      historyIndexRef.current < historyRef.current.length - 1 &&
      cutoutCanvasRef.current
    ) {
      historyIndexRef.current += 1;
      const ctx = cutoutCanvasRef.current.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.putImageData(historyRef.current[historyIndexRef.current], 0, 0);
        setCanUndo(true);
        setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
        updateComposite();
      }
    }
  };

  const handleResetMask = () => {
    if (historyRef.current.length > 0 && cutoutCanvasRef.current) {
      const ctx = cutoutCanvasRef.current.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.putImageData(historyRef.current[0], 0, 0);
        saveHistoryStep();
        updateComposite();
      }
    }
  };

  // Brush drawing logic on the working cutout canvas
  const paintAt = (clientX: number, clientY: number) => {
    if (!cutoutCanvasRef.current || !displayCanvasRef.current) return;
    const rect = displayCanvasRef.current.getBoundingClientRect();
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    const ctx = cutoutCanvasRef.current.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, brushSettings.size / 2, 0, Math.PI * 2);

    if (brushSettings.mode === 'erase') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = `rgba(0,0,0,${brushSettings.hardness})`;
      ctx.fill();
    } else {
      // Restore mode: draw from original image restricted to brush circle
      if (originalImgRef.current) {
        ctx.clip();
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(originalImgRef.current, 0, 0, width, height);
      }
    }
    ctx.restore();

    updateComposite();
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isRefineMode) return;
    setIsDrawing(true);
    paintAt(e.clientX, e.clientY);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = displayCanvasRef.current?.getBoundingClientRect();
    if (rect) {
      setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
    if (!isRefineMode || !isDrawing) return;
    paintAt(e.clientX, e.clientY);
  };

  const handleCanvasMouseUp = () => {
    if (!isRefineMode || !isDrawing) return;
    setIsDrawing(false);
    saveHistoryStep();
  };

  const handleCanvasMouseLeave = () => {
    setCursorPos(null);
    if (isDrawing) {
      setIsDrawing(false);
      saveHistoryStep();
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Canvas view container with zoom transform */}
      <div className="relative w-full aspect-4/3 sm:aspect-16/10 max-h-[65vh] rounded-xl overflow-hidden shadow-sm border border-zinc-200 bg-zinc-100 flex items-center justify-center">
        {/* Transparent Checkerboard Pattern */}
        {bgSettings.type === 'transparent' && (
          <div
            className="absolute inset-0 w-full h-full pointer-events-none"
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
        )}

        {/* Display Canvas */}
        <div
          className="relative transition-transform duration-100 flex items-center justify-center max-w-full max-h-full"
          style={{ transform: `scale(${zoom})` }}
        >
          <canvas
            ref={displayCanvasRef}
            id="editor-composite-canvas"
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseLeave}
            className={`max-w-full max-h-[62vh] object-contain rounded-lg shadow-sm ${
              isRefineMode ? 'cursor-crosshair' : 'cursor-default'
            }`}
          />

          {/* Brush visual indicator ring */}
          {isRefineMode && cursorPos && (
            <div
              className="pointer-events-none absolute rounded-full border border-indigo-500 bg-indigo-500/15 -translate-x-1/2 -translate-y-1/2"
              style={{
                left: cursorPos.x,
                top: cursorPos.y,
                width: brushSettings.size,
                height: brushSettings.size,
              }}
            />
          )}
        </div>
      </div>

      {/* Canvas Toolbars */}
      <div className="mt-3 flex flex-wrap items-center justify-between w-full gap-2 px-1">
        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-white border border-zinc-200 rounded-lg p-1 shadow-xs text-xs text-zinc-600">
          <button
            id="zoom-out-btn"
            type="button"
            onClick={() => setZoom((z) => Math.max(0.4, Number((z - 0.2).toFixed(1))))}
            className="p-1.5 hover:bg-zinc-100 rounded transition-colors"
            title={t.zoomOut}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="w-12 text-center font-medium font-mono text-[11px]">
            {Math.round(zoom * 100)}%
          </span>
          <button
            id="zoom-in-btn"
            type="button"
            onClick={() => setZoom((z) => Math.min(2.5, Number((z + 0.2).toFixed(1))))}
            className="p-1.5 hover:bg-zinc-100 rounded transition-colors"
            title={t.zoomIn}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-3.5 bg-zinc-200 mx-0.5" />
          <button
            id="zoom-fit-btn"
            type="button"
            onClick={() => setZoom(1)}
            className="p-1.5 hover:bg-zinc-100 rounded transition-colors"
            title={t.fitScreen}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Refine mode specific controls (Undo / Redo / Reset) */}
        {isRefineMode && (
          <div className="flex items-center gap-1 bg-white border border-zinc-200 rounded-lg p-1 shadow-xs text-xs text-zinc-600">
            <button
              id="refine-undo-btn"
              type="button"
              onClick={handleUndo}
              disabled={!canUndo}
              className="flex items-center gap-1 px-2 py-1 hover:bg-zinc-100 rounded disabled:opacity-40 transition-colors"
              title={t.undo}
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium">{t.undo}</span>
            </button>
            <button
              id="refine-redo-btn"
              type="button"
              onClick={handleRedo}
              disabled={!canRedo}
              className="flex items-center gap-1 px-2 py-1 hover:bg-zinc-100 rounded disabled:opacity-40 transition-colors"
              title={t.redo}
            >
              <Redo2 className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium">{t.redo}</span>
            </button>
            <div className="w-px h-3.5 bg-zinc-200 mx-0.5" />
            <button
              id="refine-reset-btn"
              type="button"
              onClick={handleResetMask}
              className="flex items-center gap-1 px-2 py-1 hover:bg-zinc-100 text-red-600 rounded transition-colors"
              title={t.reset}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium">{t.reset}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
