import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface LoadingOverlayProps {
  language: Language;
  stage: string;
  percent: number;
  previewUrl?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  language,
  stage,
  percent,
  previewUrl,
}) => {
  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-zinc-100 text-center space-y-5">
        {/* Visual preview or icon */}
        <div className="relative mx-auto w-24 h-24 rounded-2xl overflow-hidden border-2 border-indigo-100 bg-zinc-50 shadow-inner flex items-center justify-center">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Processing"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover animate-pulse"
            />
          ) : (
            <Sparkles className="w-8 h-8 text-indigo-600 animate-spin" />
          )}

          <div className="absolute inset-0 bg-indigo-900/20 backdrop-blur-[1px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin drop-shadow-md" />
          </div>
        </div>

        {/* Title and stage info */}
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-zinc-900">
            {t.processing}
          </h3>
          <p className="text-xs font-medium text-indigo-600">
            {stage || t.processingStep2}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden p-0.5 border border-zinc-200/80">
            <div
              className="bg-gradient-to-r from-indigo-600 to-violet-600 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.max(8, percent)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
            <span>{language === 'bn' ? 'প্রসেসিং' : 'Progress'}</span>
            <span>{percent > 0 ? `${percent}%` : 'Calculating...'}</span>
          </div>
        </div>

        {/* Reassurance note */}
        <p className="text-[11px] text-zinc-400 leading-relaxed bg-zinc-50 rounded-xl p-2.5 border border-zinc-100">
          {t.processingNote}
        </p>
      </div>
    </div>
  );
};
