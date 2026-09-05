import React, { useRef } from 'react';
import {
  Grid,
  Palette,
  Sparkles,
  Sliders,
  Image as ImageIcon,
  Check,
  Upload,
} from 'lucide-react';
import { BackgroundConfig, Language } from '../types';
import { translations } from '../translations';

interface BackgroundCustomizerProps {
  config: BackgroundConfig;
  onChange: (newConfig: BackgroundConfig) => void;
  language: Language;
}

const SOLID_PRESETS = [
  { label: 'White', color: '#ffffff', textColor: '#000000' },
  { label: 'Off-White', color: '#f8fafc', textColor: '#000000' },
  { label: 'Studio Dark', color: '#0f172a', textColor: '#ffffff' },
  { label: 'Passport Blue', color: '#1d4ed8', textColor: '#ffffff' },
  { label: 'Soft Gray', color: '#e2e8f0', textColor: '#000000' },
  { label: 'Amber Warm', color: '#fef3c7', textColor: '#000000' },
  { label: 'Vibrant Red', color: '#ef4444', textColor: '#ffffff' },
];

const GRADIENT_PRESETS = [
  { id: 'blue', name: 'Tech Azure', class: 'from-blue-600 to-blue-400' },
  { id: 'purple', name: 'Neon Purple', class: 'from-purple-600 to-pink-500' },
  { id: 'sunset', name: 'Sunset Glow', class: 'from-orange-500 to-rose-500' },
  { id: 'emerald', name: 'Emerald Forest', class: 'from-emerald-600 to-teal-400' },
  { id: 'dark', name: 'Deep Midnight', class: 'from-slate-700 to-slate-900' },
];

export const BackgroundCustomizer: React.FC<BackgroundCustomizerProps> = ({
  config,
  onChange,
  language,
}) => {
  const t = translations[language];
  const bgInputRef = useRef<HTMLInputElement>(null);

  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      onChange({
        ...config,
        type: 'image',
        imageUrl: url,
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 bg-neutral-900/90 border border-neutral-800 rounded-3xl p-5 space-y-6 shadow-xl backdrop-blur-md">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-800 pb-4">
        <span className="text-xs font-semibold text-neutral-400 mr-2 flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-amber-400" />
          {t.bgSettings}:
        </span>

        {/* Transparent */}
        <button
          onClick={() => onChange({ ...config, type: 'transparent' })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            config.type === 'transparent'
              ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
              : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-800'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>{t.bgTransparent}</span>
        </button>

        {/* Solid Color */}
        <button
          onClick={() => onChange({ ...config, type: 'solid' })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            config.type === 'solid'
              ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
              : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-800'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>{t.bgSolid}</span>
        </button>

        {/* Gradient */}
        <button
          onClick={() => onChange({ ...config, type: 'gradient' })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            config.type === 'gradient'
              ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
              : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.bgGradient}</span>
        </button>

        {/* Original Blur (Bokeh) */}
        <button
          onClick={() => onChange({ ...config, type: 'blur' })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            config.type === 'blur'
              ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
              : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-800'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{t.bgBlur}</span>
        </button>

        {/* Custom Image */}
        <button
          onClick={() => {
            if (!config.imageUrl) {
              bgInputRef.current?.click();
            } else {
              onChange({ ...config, type: 'image' });
            }
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            config.type === 'image'
              ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
              : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-800'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>{t.bgImage}</span>
        </button>
        <input
          type="file"
          ref={bgInputRef}
          onChange={handleCustomBgUpload}
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* Sub-panels for selected background mode */}
      <div className="pt-1">
        {/* Solid Colors Presets */}
        {config.type === 'solid' && (
          <div className="flex flex-wrap items-center gap-3">
            {SOLID_PRESETS.map((p) => (
              <button
                key={p.color}
                onClick={() => onChange({ ...config, color: p.color })}
                style={{ backgroundColor: p.color }}
                className="w-8 h-8 rounded-full border-2 border-neutral-700 flex items-center justify-center shadow hover:scale-110 transition relative"
                title={p.label}
              >
                {config.color.toLowerCase() === p.color.toLowerCase() && (
                  <Check
                    className="w-4 h-4"
                    style={{ color: p.textColor }}
                  />
                )}
              </button>
            ))}

            {/* Custom Color Picker */}
            <div className="flex items-center gap-2 pl-2 border-l border-neutral-800">
              <input
                type="color"
                value={config.color}
                onChange={(e) => onChange({ ...config, color: e.target.value })}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <span className="text-xs text-neutral-400 font-mono">
                {config.color.toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {/* Gradients Presets */}
        {config.type === 'gradient' && (
          <div className="flex flex-wrap items-center gap-3">
            {GRADIENT_PRESETS.map((g) => (
              <button
                key={g.id}
                onClick={() => onChange({ ...config, gradient: g.id })}
                className={`w-12 h-8 rounded-xl bg-gradient-to-r ${g.class} border-2 flex items-center justify-center shadow transition ${
                  config.gradient === g.id
                    ? 'border-white scale-105'
                    : 'border-transparent opacity-80 hover:opacity-100'
                }`}
                title={g.name}
              >
                {config.gradient === g.id && (
                  <Check className="w-4 h-4 text-white drop-shadow" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Blur Controls */}
        {config.type === 'blur' && (
          <div className="flex items-center gap-4 max-w-md">
            <span className="text-xs text-neutral-400 whitespace-nowrap">
              {t.blurIntensity}:
            </span>
            <input
              type="range"
              min="2"
              max="30"
              value={config.blurAmount}
              onChange={(e) =>
                onChange({ ...config, blurAmount: Number(e.target.value) })
              }
              className="w-full accent-amber-500"
            />
            <span className="text-xs text-neutral-300 font-mono w-10">
              {config.blurAmount}px
            </span>
          </div>
        )}

        {/* Custom Image Upload */}
        {config.type === 'image' && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => bgInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs transition"
            >
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.uploadCustomBg}</span>
            </button>
            {config.imageUrl && (
              <span className="text-xs text-emerald-400 font-medium">
                ✓ Background image active
              </span>
            )}
          </div>
        )}
      </div>

      {/* Drop Shadow Controls */}
      <div className="border-t border-neutral-800 pt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="shadowToggle"
            checked={config.shadowEnabled}
            onChange={(e) =>
              onChange({ ...config, shadowEnabled: e.target.checked })
            }
            className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
          />
          <label
            htmlFor="shadowToggle"
            className="text-xs font-semibold text-neutral-300 cursor-pointer select-none"
          >
            {t.enableShadow}
          </label>
        </div>

        {config.shadowEnabled && (
          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
            <div className="flex items-center gap-1.5">
              <span>{t.shadowBlurLabel}:</span>
              <input
                type="range"
                min="5"
                max="40"
                value={config.shadowBlur}
                onChange={(e) =>
                  onChange({ ...config, shadowBlur: Number(e.target.value) })
                }
                className="w-16 accent-amber-500"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span>{t.shadowOffsetLabel}:</span>
              <input
                type="range"
                min="2"
                max="30"
                value={config.shadowOffsetY}
                onChange={(e) =>
                  onChange({ ...config, shadowOffsetY: Number(e.target.value) })
                }
                className="w-16 accent-amber-500"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span>{t.shadowOpacityLabel}:</span>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.05"
                value={config.shadowOpacity}
                onChange={(e) =>
                  onChange({ ...config, shadowOpacity: Number(e.target.value) })
                }
                className="w-16 accent-amber-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
