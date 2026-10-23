'use client';

import React from 'react';
import { PRESET_SCENARIOS, PresetScenario } from '@/data/presets';
import { Activity, AlertTriangle, Zap, ArrowRight } from 'lucide-react';

interface PresetSelectorProps {
  onSelectPreset: (preset: PresetScenario, autoProcess?: boolean) => void;
  disabled?: boolean;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({ onSelectPreset, disabled }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Activity':
        return <Activity className="w-4 h-4 text-pink-400" />;
      case 'Zap':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'AlertTriangle':
      default:
        return <AlertTriangle className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-300 via-indigo-300 to-pink-300 bg-clip-text text-transparent">
            Quick-Load Scenario Presets (Judge Benchmarks)
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
          Click any preset to auto-populate multimodal sensory streams
        </span>
      </div>

      {/* Preset Buttons Row with Glassmorphism and Neon Hover Glow */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {PRESET_SCENARIOS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelectPreset(preset, false)}
            className="group relative text-left bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-indigo-500/60 rounded-2xl p-3.5 transition-all duration-300 shadow-xl shadow-indigo-500/5 hover:shadow-indigo-500/20 hover:scale-[1.01] flex items-center justify-between gap-3 cursor-pointer disabled:opacity-50"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/10 shrink-0 group-hover:border-cyan-400/50 group-hover:shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all">
                {getIcon(preset.icon)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                    {preset.title}
                  </h4>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${preset.badgeColor}`}>
                    {preset.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5 font-sans">
                  {preset.subtitle}
                </p>
              </div>
            </div>

            <div className="shrink-0 p-1.5 rounded-lg text-slate-400 group-hover:text-cyan-300 group-hover:bg-cyan-950/40 transition-all">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
