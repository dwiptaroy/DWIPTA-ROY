import React from 'react';
import { Sparkles, Image as ImageIcon, ShieldCheck, Languages, Upload } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface NavbarProps {
  language: Language;
  onToggleLanguage: () => void;
  hasActiveImage: boolean;
  onNewImageClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onToggleLanguage,
  hasActiveImage,
  onNewImageClick,
}) => {
  const t = translations[language];

  return (
    <header className="border-b border-zinc-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-lg text-zinc-900 tracking-tight leading-none">
                {t.appTitle}
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                AI Fast
              </span>
            </div>
            <p className="text-xs text-zinc-500 hidden sm:block mt-0.5">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Privacy badge */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50/80 border border-emerald-200/60 px-2.5 py-1 rounded-full font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% On-Device & Private</span>
          </div>

          {/* New Image button */}
          {hasActiveImage && (
            <button
              id="navbar-new-image-btn"
              onClick={onNewImageClick}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{t.newImage}</span>
            </button>
          )}

          {/* Language Toggle */}
          <button
            id="language-toggle-btn"
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-colors shadow-xs"
            title="Switch Language / ভাষা পরিবর্তন করুন"
          >
            <Languages className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold">
              {language === 'bn' ? 'বাংলা' : 'English'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
