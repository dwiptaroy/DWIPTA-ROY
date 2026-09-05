import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Wand2,
  Columns,
  Eye,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BackgroundConfig, Language, ToolMode } from '../types';
import { translations } from '../translations';
import { compositeImage, loadImage } from '../utils/imageProcessing';

interface ActionToolbarProps {
  originalUrl: string;
  cutoutUrl: string;
  backgroundConfig: BackgroundConfig;
  language: Language;
  toolMode: ToolMode;
  onToolModeChange: (mode: ToolMode) => void;
}

export const ActionToolbar: React.FC<ActionToolbarProps> = ({
  originalUrl,
  cutoutUrl,
  backgroundConfig,
  language,
  toolMode,
  onToolModeChange,
}) => {
  const t = translations[language];
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Trigger celebratory confetti on download
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899'],
    });
  };

  // Download Transparent PNG directly
  const handleDownloadTransparent = async () => {
    setIsExporting(true);
    try {
      const img = await loadImage(cutoutUrl);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `cutout-transparent-${Date.now()}.png`;
            a.click();
            URL.revokeObjectURL(url);
            triggerConfetti();
          }
        }, 'image/png');
      }
    } finally {
      setIsExporting(false);
    }
  };

  // Download JPG or PNG with composite background
  const handleDownloadComposited = async () => {
    setIsExporting(true);
    try {
      const img = await loadImage(cutoutUrl);
      const canvas = await compositeImage(
        cutoutUrl,
        originalUrl,
        backgroundConfig,
        img.naturalWidth,
        img.naturalHeight
      );

      const mimeType =
        backgroundConfig.type === 'transparent' ? 'image/png' : 'image/jpeg';
      const ext = backgroundConfig.type === 'transparent' ? 'png' : 'jpg';

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `background-remover-${Date.now()}.${ext}`;
            a.click();
            URL.revokeObjectURL(url);
            triggerConfetti();
          }
        },
        mimeType,
        0.95
      );
    } finally {
      setIsExporting(false);
    }
  };

  // Copy PNG image to system clipboard
  const handleCopyClipboard = async () => {
    try {
      const img = await loadImage(cutoutUrl);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(async (blob) => {
        if (blob && navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        }
      }, 'image/png');
    } catch (e) {
      console.error('Clipboard copy failed:', e);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-4 flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-neutral-900/80 border border-neutral-800">
      {/* Mode selectors */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-950/80 border border-neutral-800/80">
        <button
          onClick={() => onToolModeChange('preview')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            toolMode === 'preview'
              ? 'bg-neutral-800 text-white shadow'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{t.modePreview}</span>
        </button>

        <button
          onClick={() => onToolModeChange('compare')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            toolMode === 'compare'
              ? 'bg-neutral-800 text-white shadow'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Columns className="w-3.5 h-3.5" />
          <span>{t.modeCompare}</span>
        </button>

        <button
          onClick={() => onToolModeChange('erase')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            toolMode === 'erase' || toolMode === 'restore'
              ? 'bg-amber-500 text-neutral-950 font-bold shadow'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>{t.modeRefine}</span>
        </button>
      </div>

      {/* Export / Download Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Copy to clipboard */}
        <button
          onClick={handleCopyClipboard}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs font-medium transition active:scale-95"
          title={t.copyToClipboard}
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Copy className="w-4 h-4 text-neutral-400" />
          )}
          <span>{copied ? t.copiedSuccess : t.copyToClipboard}</span>
        </button>

        {/* Download Transparent PNG */}
        <button
          onClick={handleDownloadTransparent}
          disabled={isExporting}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-100 text-xs font-semibold shadow transition active:scale-95 disabled:opacity-50"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>{t.downloadPng}</span>
        </button>

        {/* Download Composite HD */}
        <button
          onClick={handleDownloadComposited}
          disabled={isExporting}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-neutral-950 text-xs font-bold shadow-lg shadow-orange-500/20 transition active:scale-95 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>
            {backgroundConfig.type === 'transparent'
              ? t.downloadPng
              : t.downloadJpg}
          </span>
        </button>
      </div>
    </div>
  );
};
