import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { DropZone } from './components/DropZone';
import { ComparisonSlider } from './components/ComparisonSlider';
import { RefineCanvas } from './components/RefineCanvas';
import { BackgroundCustomizer } from './components/BackgroundCustomizer';
import { ActionToolbar } from './components/ActionToolbar';
import { BackgroundConfig, Language, ToolMode } from './types';
import { translations } from './translations';
import { removeBackgroundAI } from './utils/imageProcessing';
import { Loader2, Heart } from 'lucide-react';

export const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('bn');
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [cutoutUrl, setCutoutUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [toolMode, setToolMode] = useState<ToolMode>('preview');

  const [backgroundConfig, setBackgroundConfig] = useState<BackgroundConfig>({
    type: 'transparent',
    color: '#ffffff',
    gradient: 'blue',
    imageUrl: null,
    blurAmount: 12,
    shadowEnabled: false,
    shadowBlur: 16,
    shadowOffsetY: 10,
    shadowOpacity: 0.35,
  });

  const t = translations[language];

  // Process selected image with AI background removal
  const handleSelectImage = useCallback(async (fileOrUrl: File | string) => {
    try {
      setIsProcessing(true);
      setProgress(10);

      let origUrl = '';
      if (typeof fileOrUrl === 'string') {
        origUrl = fileOrUrl;
      } else {
        origUrl = URL.createObjectURL(fileOrUrl);
      }

      setOriginalUrl(origUrl);
      setCutoutUrl(null);

      // AI background removal
      const result = await removeBackgroundAI(origUrl, (p) => setProgress(p));
      setCutoutUrl(result);
      setToolMode('preview');
    } catch (err) {
      console.error('Background removal failed:', err);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, []);

  const handleReset = () => {
    setOriginalUrl(null);
    setCutoutUrl(null);
    setToolMode('preview');
  };

  const handleApplyRefinements = (newCutoutUrl: string) => {
    setCutoutUrl(newCutoutUrl);
    setToolMode('preview');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-amber-500 selection:text-neutral-950">
      {/* Top Navigation Bar */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        onNewUpload={handleReset}
        hasActiveImage={Boolean(cutoutUrl)}
      />

      {/* Main Body */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 w-full max-w-7xl mx-auto">
        {/* State 1: Upload DropZone */}
        {!originalUrl && !isProcessing && (
          <DropZone
            language={language}
            onSelectImage={handleSelectImage}
            isProcessing={isProcessing}
          />
        )}

        {/* State 2: Processing Spinner & Progress */}
        {isProcessing && (
          <div className="flex flex-col items-center justify-center p-12 text-center max-w-md mx-auto space-y-5 bg-neutral-900/60 border border-neutral-800 rounded-3xl backdrop-blur-xl">
            <div className="relative">
              <Loader2 className="w-14 h-14 text-amber-400 animate-spin" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white tracking-tight">
                {t.processing}
              </h3>
              <p className="text-xs text-neutral-400">
                {t.processingSubtitle}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${Math.max(15, progress)}%` }}
              />
            </div>
            <span className="text-xs font-mono text-neutral-400">
              {progress}%
            </span>
          </div>
        )}

        {/* State 3: Active Workspace */}
        {cutoutUrl && originalUrl && !isProcessing && (
          <div className="w-full flex flex-col items-center">
            {/* Viewport: Either Refine Brush mode OR Slider/Preview mode */}
            {toolMode === 'erase' || toolMode === 'restore' ? (
              <RefineCanvas
                originalUrl={originalUrl}
                cutoutUrl={cutoutUrl}
                language={language}
                onApplyRefinements={handleApplyRefinements}
                onCancel={() => setToolMode('preview')}
              />
            ) : (
              <ComparisonSlider
                originalUrl={originalUrl}
                cutoutUrl={cutoutUrl}
                backgroundConfig={backgroundConfig}
                language={language}
              />
            )}

            {/* Action Bar (Download & Modes) */}
            <ActionToolbar
              originalUrl={originalUrl}
              cutoutUrl={cutoutUrl}
              backgroundConfig={backgroundConfig}
              language={language}
              toolMode={toolMode}
              onToolModeChange={setToolMode}
            />

            {/* Background Customizer Studio */}
            {toolMode !== 'erase' && toolMode !== 'restore' && (
              <BackgroundCustomizer
                config={backgroundConfig}
                onChange={setBackgroundConfig}
                language={language}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-800/60 py-4 text-center text-xs text-neutral-500 flex items-center justify-center gap-1.5">
        <span>{t.devTag}</span>
        <span>•</span>
        <span className="flex items-center gap-1">
          Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for creators
        </span>
      </footer>
    </div>
  );
};

export default App;
