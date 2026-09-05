import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, Sparkles, Clipboard, Shield } from 'lucide-react';
import { Language, SampleImage } from '../types';
import { translations } from '../translations';
import { SAMPLE_IMAGES } from '../utils/sampleImages';

interface DropZoneProps {
  language: Language;
  onSelectImage: (fileOrUrl: File | string) => void;
  isProcessing: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({
  language,
  onSelectImage,
  isProcessing,
}) => {
  const t = translations[language];
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Global paste handler (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            onSelectImage(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onSelectImage]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onSelectImage(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onSelectImage(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Upload Box */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 group ${
          isDragOver
            ? 'border-amber-500 bg-amber-500/10 scale-[1.01]'
            : 'border-neutral-800 hover:border-neutral-700 bg-neutral-900/40 hover:bg-neutral-900/60'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-neutral-800/80 border border-neutral-700 flex items-center justify-center group-hover:scale-110 group-hover:border-amber-500/50 transition-all duration-300 shadow-xl">
            <UploadCloud className="w-10 h-10 text-amber-400 group-hover:text-amber-300" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {t.uploadTitle}
            </h2>
            <p className="text-sm text-neutral-400 max-w-md mx-auto">
              {t.uploadDesc}
            </p>
          </div>

          {/* Quick paste indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-800/60 border border-neutral-700/60 text-xs text-neutral-300">
            <Clipboard className="w-3.5 h-3.5 text-neutral-400" />
            <span>{t.pasteHint}</span>
          </div>
        </div>
      </div>

      {/* Sample Images Section */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-neutral-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            {t.trySamples}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {SAMPLE_IMAGES.map((sample: SampleImage) => (
            <button
              key={sample.id}
              onClick={() => onSelectImage(sample.url)}
              disabled={isProcessing}
              className="group relative rounded-2xl overflow-hidden border border-neutral-800 hover:border-amber-500/60 transition-all text-left bg-neutral-900/60 hover:bg-neutral-800/60 p-2 focus:outline-none"
            >
              <div className="aspect-square rounded-xl overflow-hidden bg-neutral-950 relative">
                <img
                  src={sample.url}
                  alt={sample.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              </div>
              <div className="mt-2 px-1">
                <p className="text-xs font-semibold text-neutral-200 group-hover:text-amber-400 transition-colors truncate">
                  {language === 'bn' ? sample.titleBn : sample.titleEn}
                </p>
                <p className="text-[10px] text-neutral-400 truncate">
                  {sample.tag}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Trust & Privacy Notice */}
      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-neutral-500">
        <Shield className="w-4 h-4 text-emerald-500" />
        <span>{t.privacyNote}</span>
      </div>
    </div>
  );
};
