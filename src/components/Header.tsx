import React from 'react';
import { Sparkles, Globe, ShieldCheck, Zap } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onNewUpload?: () => void;
  hasActiveImage?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  onNewUpload,
  hasActiveImage,
}) => {
  const t = translations[language];

  return (
    <header className="w-full border-b border-neutral-800/80 bg-neutral-900/60 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white font-black text-lg">
            <Sparkles className="w-5 h-5 text-amber-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                {t.appTitle}
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Zap className="w-3 h-3 mr-1" /> HD AI
              </span>
            </div>
            <p className="text-xs text-neutral-400 hidden sm:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {hasActiveImage && (
            <button
              onClick={onNewUpload}
              className="px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition"
            >
              {t.uploadNew}
            </button>
          )}

          {/* Privacy badge */}
          <div className="hidden md:flex items-center text-xs text-neutral-400 gap-1 bg-neutral-800/50 px-2.5 py-1.5 rounded-lg border border-neutral-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Private</span>
          </div>

          {/* Language Selector */}
          <button
            onClick={() => onLanguageChange(language === 'bn' ? 'en' : 'bn')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700/80 text-xs sm:text-sm font-medium text-neutral-200 transition"
            title="Toggle Language / ভাষা পরিবর্তন"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
