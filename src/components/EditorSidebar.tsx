import React, { useRef } from 'react';
import {
  Layers,
  Sparkles,
  Paintbrush,
  Download,
  Copy,
  Check,
  Upload,
  Sun,
  Sliders,
  Eraser,
  RotateCcw,
  Plus,
} from 'lucide-react';
import {
  BackgroundSettings,
  ShadowSettings,
  SubjectAdjustments,
  BrushSettings,
  Language,
} from '../types';
import { translations } from '../translations';
import { PRESET_COLORS, PRESET_GRADIENTS, PRESET_BACKGROUND_IMAGES } from '../data/samples';

interface EditorSidebarProps {
  language: Language;
  activeTab: 'bg' | 'effects' | 'refine';
  setActiveTab: (tab: 'bg' | 'effects' | 'refine') => void;
  bgSettings: BackgroundSettings;
  setBgSettings: React.Dispatch<React.SetStateAction<BackgroundSettings>>;
  shadowSettings: ShadowSettings;
  setShadowSettings: React.Dispatch<React.SetStateAction<ShadowSettings>>;
  adjustments: SubjectAdjustments;
  setAdjustments: React.Dispatch<React.SetStateAction<SubjectAdjustments>>;
  brushSettings: BrushSettings;
  setBrushSettings: React.Dispatch<React.SetStateAction<BrushSettings>>;
  onDownload: (format: 'png' | 'jpeg') => void;
  onCopyClipboard: () => void;
  isCopied: boolean;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  language,
  activeTab,
  setActiveTab,
  bgSettings,
  setBgSettings,
  shadowSettings,
  setShadowSettings,
  adjustments,
  setAdjustments,
  brushSettings,
  setBrushSettings,
  onDownload,
  onCopyClipboard,
  isCopied,
}) => {
  const t = translations[language];
  const bgUploadInputRef = useRef<HTMLInputElement>(null);

  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setBgSettings((prev) => ({
        ...prev,
        type: 'image',
        imageUrl: url,
      }));
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border border-zinc-200/80 rounded-2xl shadow-xs overflow-hidden">
      {/* Sidebar Top Tabs */}
      <div className="flex border-b border-zinc-200 bg-zinc-50/70 p-1.5 gap-1">
        <button
          id="tab-bg-btn"
          type="button"
          onClick={() => setActiveTab('bg')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'bg'
              ? 'bg-white text-indigo-700 shadow-xs border border-zinc-200/70'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{t.background}</span>
        </button>

        <button
          id="tab-effects-btn"
          type="button"
          onClick={() => setActiveTab('effects')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'effects'
              ? 'bg-white text-indigo-700 shadow-xs border border-zinc-200/70'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.effects}</span>
        </button>

        <button
          id="tab-refine-btn"
          type="button"
          onClick={() => setActiveTab('refine')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'refine'
              ? 'bg-white text-indigo-700 shadow-xs border border-zinc-200/70'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70'
          }`}
        >
          <Paintbrush className="w-3.5 h-3.5" />
          <span>{t.refine}</span>
        </button>
      </div>

      {/* Tab Contents Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* ==================== TAB 1: BACKGROUND ==================== */}
        {activeTab === 'bg' && (
          <div className="space-y-4">
            {/* Background Category Selector */}
            <div className="grid grid-cols-2 gap-2">
              <button
                id="bg-transparent-btn"
                type="button"
                onClick={() => setBgSettings((s) => ({ ...s, type: 'transparent' }))}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 text-xs font-medium transition-all ${
                  bgSettings.type === 'transparent'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-semibold'
                    : 'border-zinc-200 hover:border-zinc-300 text-zinc-700'
                }`}
              >
                <div
                  className="w-6 h-6 rounded-md border border-zinc-300 shrink-0"
                  style={{
                    backgroundImage: `
                      linear-gradient(45deg, #ccc 25%, transparent 25%), 
                      linear-gradient(-45deg, #ccc 25%, transparent 25%), 
                      linear-gradient(45deg, transparent 75%, #ccc 75%), 
                      linear-gradient(-45deg, transparent 75%, #ccc 75%)
                    `,
                    backgroundSize: '8px 8px',
                    backgroundColor: '#fff',
                  }}
                />
                <span>{t.bgTransparent}</span>
              </button>

              <button
                id="bg-blur-btn"
                type="button"
                onClick={() => setBgSettings((s) => ({ ...s, type: 'blur_original' }))}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 text-xs font-medium transition-all ${
                  bgSettings.type === 'blur_original'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-semibold'
                    : 'border-zinc-200 hover:border-zinc-300 text-zinc-700'
                }`}
              >
                <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-amber-200 via-rose-300 to-sky-300 blur-[2px] shrink-0 border border-zinc-200" />
                <span>{language === 'bn' ? 'আসল ব্লার (Bokeh)' : 'Blur Original'}</span>
              </button>
            </div>

            {/* Blur Slider if Blur Original is chosen */}
            {bgSettings.type === 'blur_original' && (
              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-zinc-700">{t.blurAmount}</span>
                  <span className="text-zinc-500 font-mono">{bgSettings.blurRadius}px</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="35"
                  value={bgSettings.blurRadius}
                  onChange={(e) =>
                    setBgSettings((s) => ({ ...s, blurRadius: Number(e.target.value) }))
                  }
                  className="w-full accent-indigo-600 h-1.5 bg-zinc-200 rounded-lg cursor-pointer"
                />
              </div>
            )}

            {/* Solid Colors Presets */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-700">
                  {t.bgSolid}
                </label>
                {/* Custom Color Input */}
                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <span className="text-[11px]">{t.customColor}:</span>
                  <input
                    type="color"
                    value={bgSettings.color}
                    onChange={(e) =>
                      setBgSettings((s) => ({ ...s, type: 'color', color: e.target.value }))
                    }
                    className="w-5 h-5 rounded cursor-pointer border-0 p-0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1.5">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    title={c.label}
                    onClick={() =>
                      setBgSettings((s) => ({ ...s, type: 'color', color: c.value }))
                    }
                    className={`w-full aspect-square rounded-lg border transition-all ${
                      bgSettings.type === 'color' && bgSettings.color.toLowerCase() === c.value.toLowerCase()
                        ? 'ring-2 ring-indigo-600 ring-offset-1 scale-105'
                        : 'border-zinc-200 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
            </div>

            {/* Gradients Presets */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-700">
                {t.bgGradient}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_GRADIENTS.map((g, idx) => (
                  <button
                    key={idx}
                    type="button"
                    title={g.label}
                    onClick={() =>
                      setBgSettings((s) => ({ ...s, type: 'gradient', gradient: g.value }))
                    }
                    className={`w-full aspect-video rounded-lg border transition-all ${
                      bgSettings.type === 'gradient' && bgSettings.gradient === g.value
                        ? 'ring-2 ring-indigo-600 ring-offset-1 scale-105'
                        : 'border-zinc-200 hover:scale-105'
                    }`}
                    style={{ background: g.value }}
                  />
                ))}
              </div>
            </div>

            {/* Background Images Presets */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-700">
                  {t.bgCustomImg}
                </label>
                <button
                  type="button"
                  onClick={() => bgUploadInputRef.current?.click()}
                  className="flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800"
                >
                  <Upload className="w-3 h-3" />
                  <span>{t.uploadBgImage}</span>
                </button>
                <input
                  ref={bgUploadInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCustomBgUpload}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {PRESET_BACKGROUND_IMAGES.map((img) => (
                  <button
                    key={img.id}
                    type="button"
                    title={img.label}
                    onClick={() =>
                      setBgSettings((s) => ({ ...s, type: 'image', imageUrl: img.url }))
                    }
                    className={`relative w-full aspect-video rounded-lg overflow-hidden border transition-all ${
                      bgSettings.type === 'image' && bgSettings.imageUrl === img.url
                        ? 'ring-2 ring-indigo-600 ring-offset-1'
                        : 'border-zinc-200 hover:opacity-90'
                    }`}
                  >
                    <img
                      src={img.thumb}
                      alt={img.label}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: EFFECTS ==================== */}
        {activeTab === 'effects' && (
          <div className="space-y-4">
            {/* Drop Shadow Switch */}
            <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-800">
                  {t.enableShadow}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shadowSettings.enabled}
                    onChange={(e) =>
                      setShadowSettings((s) => ({ ...s, enabled: e.target.checked }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {shadowSettings.enabled && (
                <div className="space-y-3 pt-2 border-t border-zinc-200/70">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-zinc-600">
                      <span>{t.shadowBlur}</span>
                      <span className="font-mono">{shadowSettings.blur}px</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="50"
                      value={shadowSettings.blur}
                      onChange={(e) =>
                        setShadowSettings((s) => ({ ...s, blur: Number(e.target.value) }))
                      }
                      className="w-full accent-indigo-600 h-1.5 bg-zinc-200 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-zinc-600">
                      <span>{t.shadowOpacity}</span>
                      <span className="font-mono">
                        {Math.round(shadowSettings.opacity * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="0.9"
                      step="0.05"
                      value={shadowSettings.opacity}
                      onChange={(e) =>
                        setShadowSettings((s) => ({
                          ...s,
                          opacity: Number(e.target.value),
                        }))
                      }
                      className="w-full accent-indigo-600 h-1.5 bg-zinc-200 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-zinc-600">
                      <span>{t.shadowOffset}</span>
                      <span className="font-mono">{shadowSettings.offsetY}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      value={shadowSettings.offsetY}
                      onChange={(e) =>
                        setShadowSettings((s) => ({
                          ...s,
                          offsetY: Number(e.target.value),
                          offsetX: Math.round(Number(e.target.value) * 0.3),
                        }))
                      }
                      className="w-full accent-indigo-600 h-1.5 bg-zinc-200 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Edge Feather Smoothing */}
            <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-zinc-800">{t.edgeFeather}</span>
                <span className="text-zinc-500 font-mono">{adjustments.feather}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={adjustments.feather}
                onChange={(e) =>
                  setAdjustments((a) => ({ ...a, feather: Number(e.target.value) }))
                }
                className="w-full accent-indigo-600 h-1.5 bg-zinc-200 rounded-lg cursor-pointer"
              />
              <p className="text-[10px] text-zinc-400">
                {language === 'bn' ? 'কাটআউটের ধারগুলো আরও মোলায়েম ও প্রাকৃতিক করতে বাড়ান।' : 'Softens cut edges for seamless background blending.'}
              </p>
            </div>

            {/* Subject Brightness & Contrast */}
            <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-zinc-700">
                  <span className="font-medium">{t.brightness}</span>
                  <span className="font-mono text-zinc-500">{adjustments.brightness}</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={adjustments.brightness}
                  onChange={(e) =>
                    setAdjustments((a) => ({ ...a, brightness: Number(e.target.value) }))
                  }
                  className="w-full accent-indigo-600 h-1.5 bg-zinc-200 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-zinc-700">
                  <span className="font-medium">{t.contrast}</span>
                  <span className="font-mono text-zinc-500">{adjustments.contrast}</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={adjustments.contrast}
                  onChange={(e) =>
                    setAdjustments((a) => ({ ...a, contrast: Number(e.target.value) }))
                  }
                  className="w-full accent-indigo-600 h-1.5 bg-zinc-200 rounded-lg cursor-pointer"
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  setAdjustments({ brightness: 0, contrast: 0, saturation: 0, feather: 0 })
                }
                className="text-[11px] text-zinc-500 hover:text-zinc-800 underline block text-right pt-1"
              >
                {t.reset}
              </button>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: REFINE BRUSH ==================== */}
        {activeTab === 'refine' && (
          <div className="space-y-4">
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900 leading-relaxed">
              {language === 'bn'
                ? 'ব্রাশ দিয়ে ছবির যে কোনো অংশ ইরেজ বা মুছে ফেলতে পারেন, অথবা অরিজিনাল ছবি থেকে ফিরিয়ে আনতে পারেন।'
                : 'Paint on the canvas to manually erase unwanted background remnants or restore clipped details.'}
            </div>

            {/* Brush Mode Toggle */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setBrushSettings((b) => ({ ...b, mode: 'erase' }))}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                  brushSettings.mode === 'erase'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                    : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <Eraser className="w-4 h-4 text-red-500" />
                <span>{t.brushModeErase}</span>
              </button>

              <button
                type="button"
                onClick={() => setBrushSettings((b) => ({ ...b, mode: 'restore' }))}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                  brushSettings.mode === 'restore'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                    : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <Paintbrush className="w-4 h-4 text-emerald-600" />
                <span>{t.brushModeRestore}</span>
              </button>
            </div>

            {/* Brush Size */}
            <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-zinc-800">{t.brushSize}</span>
                <span className="text-zinc-500 font-mono">{brushSettings.size}px</span>
              </div>
              <input
                type="range"
                min="6"
                max="80"
                value={brushSettings.size}
                onChange={(e) =>
                  setBrushSettings((b) => ({ ...b, size: Number(e.target.value) }))
                }
                className="w-full accent-indigo-600 h-1.5 bg-zinc-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Brush Hardness */}
            <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-zinc-800">{t.brushHardness}</span>
                <span className="text-zinc-500 font-mono">
                  {Math.round(brushSettings.hardness * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={brushSettings.hardness}
                onChange={(e) =>
                  setBrushSettings((b) => ({ ...b, hardness: Number(e.target.value) }))
                }
                className="w-full accent-indigo-600 h-1.5 bg-zinc-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Export & Actions Footer */}
      <div className="border-t border-zinc-200 p-4 bg-zinc-50/70 space-y-2">
        {/* Main Download PNG button */}
        <button
          id="download-png-btn"
          type="button"
          onClick={() => onDownload('png')}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] shadow-sm shadow-indigo-600/25 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>{t.downloadPng}</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          {/* Download JPG button */}
          <button
            id="download-jpg-btn"
            type="button"
            onClick={() => onDownload('jpeg')}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-medium text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-zinc-500" />
            <span>{t.downloadJpg}</span>
          </button>

          {/* Copy to Clipboard */}
          <button
            id="copy-clipboard-btn"
            type="button"
            onClick={onCopyClipboard}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-medium transition-all ${
              isCopied
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                : 'text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.copiedSuccess}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-500" />
                <span>{t.copyClipboard}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
