import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, Zap, Shield, ArrowRight } from 'lucide-react';
import { Language, SampleImage } from '../types';
import { translations } from '../translations';
import { SAMPLE_IMAGES } from '../data/samples';

interface DropzoneProps {
  language: Language;
  onFileSelect: (file: File | Blob, name?: string) => void;
  onSelectSample: (sample: SampleImage) => void;
  isLoading: boolean;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  language,
  onFileSelect,
  onSelectSample,
  isLoading,
}) => {
  const t = translations[language];
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Global clipboard paste listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (isLoading) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            onFileSelect(blob, 'pasted_image.png');
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onFileSelect, isLoading]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onFileSelect(file, file.name);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onFileSelect(file, file.name);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Hero Headline */}
      <div className="text-center mb-8 space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'সরাসরি ব্রাউজারে এআই ব্যাকগ্রাউন্ড রিমুভাল' : 'Instant In-Browser AI Cutout'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">
          {language === 'bn' ? 'ছবি থেকে ব্যাকগ্রাউন্ড রিমুভ করুন সহজে' : 'Remove Image Background in Seconds'}
        </h2>
        <p className="text-zinc-600 text-sm sm:text-base max-w-xl mx-auto">
          {t.appSubtitle}
        </p>
      </div>

      {/* Main Upload Box */}
      <div
        id="dropzone-container"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-50/50 scale-[1.005]'
            : 'border-zinc-300 hover:border-indigo-400 bg-white hover:bg-zinc-50/50 shadow-xs'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp, image/jpg"
          className="hidden"
          onChange={handleInputChange}
          disabled={isLoading}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-semibold text-zinc-800">
              {t.uploadTitle}
            </h3>
            <p className="text-sm text-zinc-500">
              {t.uploadDesc}
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition-all pointer-events-none"
          >
            <ImageIcon className="w-4 h-4" />
            <span>{language === 'bn' ? 'ফাইল সিলেক্ট করুন' : 'Choose Photo'}</span>
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-2 text-xs text-zinc-400 pt-2 border-t border-zinc-100 w-full justify-center">
            <span>{t.pasteHint}</span>
            <span className="hidden sm:inline">•</span>
            <span>{t.supportedFormats}</span>
          </div>
        </div>
      </div>

      {/* Samples section */}
      <div className="mt-8">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 text-center sm:text-left">
          {t.trySample}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SAMPLE_IMAGES.map((sample) => (
            <button
              key={sample.id}
              id={`sample-btn-${sample.id}`}
              type="button"
              onClick={() => onSelectSample(sample)}
              disabled={isLoading}
              className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-2 hover:border-indigo-400 hover:shadow-md transition-all text-left flex items-center gap-3 disabled:opacity-50"
            >
              <img
                src={sample.thumbnailUrl}
                alt={sample.nameEn}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-lg object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-zinc-800 truncate">
                  {language === 'bn' ? sample.nameBn : sample.nameEn}
                </p>
                <p className="text-[11px] text-zinc-400 flex items-center gap-1 group-hover:text-indigo-600 transition-colors">
                  <span>{language === 'bn' ? 'চেক করুন' : 'Try sample'}</span>
                  <ArrowRight className="w-3 h-3" />
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Trust & Features highlights */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-zinc-200 pt-8 text-center sm:text-left">
        <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
          <div className="p-2 rounded-lg bg-indigo-100/60 text-indigo-700">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-zinc-800">
              {language === 'bn' ? '১-ক্লিকে ১০০% স্বয়ংক্রিয়' : '1-Click Auto Cutout'}
            </h4>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              {language === 'bn' ? 'মানুষ, প্রোডাক্ট, পোষা প্রাণী বা গাড়ি যে কোনো ছবি নিখুঁত কাটআউট।' : 'Pixel-perfect separation of complex edges, hair, and soft details.'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
          <div className="p-2 rounded-lg bg-emerald-100/60 text-emerald-700">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-zinc-800">
              {language === 'bn' ? 'সম্পূর্ণ নিরাপদ ও গোপনীয়' : '100% Private & Local'}
            </h4>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              {language === 'bn' ? 'ছবি কোনো সার্ভারে পাঠানো হয় না, আপনার ডিভাইসেই কাজ সম্পন্ন হয়।' : 'Images process inside your browser, safeguarding privacy.'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
          <div className="p-2 rounded-lg bg-amber-100/60 text-amber-700">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-zinc-800">
              {language === 'bn' ? 'স্টুডিও এডিটর ও শ্যাডো' : 'Studio Editor & Shadows'}
            </h4>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              {language === 'bn' ? 'সাদা ব্যাকগ্রাউন্ড, গ্রেডিয়েন্ট, প্রাকৃতিক দৃশ্য ও রিয়্যালিস্টিক শ্যাডো।' : 'Add solid backgrounds, realistic drop shadows, or bokeh blurs.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
