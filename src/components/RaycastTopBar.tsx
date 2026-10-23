'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Search,
  Command,
  Sliders,
  Sparkles,
  HelpCircle,
  Radio,
  Bell,
  Languages,
  CheckCircle2,
  Shield,
  Key,
} from 'lucide-react';

interface RaycastTopBarProps {
  onOpenKeyModal?: () => void;
}

export const RaycastTopBar: React.FC<RaycastTopBarProps> = ({ onOpenKeyModal }) => {
  const {
    setIsCommandPaletteOpen,
    setIsShortcutsOpen,
    setIsContextPanelOpen,
    apiKey,
    language,
    setLanguage,
    ambientMotion,
    setAmbientMotion,
    cases,
  } = useAuth();

  const handleCycleLanguage = () => {
    const nextLang = language === 'en' ? 'hi' : language === 'hi' ? 'hinglish' : 'en';
    setLanguage(nextLang);
  };

  return (
    <header className="sticky top-0 z-20 w-full bg-[#080B12]/80 backdrop-blur-xl border-b border-white/8 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
      {/* Search / Command Bar Trigger */}
      <div className="flex-1 max-w-xl">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-[#111827]/80 border border-white/8 hover:border-[#4F8CFF]/40 text-[#94A3B8] hover:text-white transition-all cursor-pointer shadow-sm group text-left"
        >
          <div className="flex items-center gap-2.5 text-xs">
            <Search className="w-3.5 h-3.5 text-[#4F8CFF] group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Search commands, active cases, triage protocols...</span>
            <span className="sm:hidden">Search commands...</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd>⌘K</kbd>
          </div>
        </button>
      </div>

      {/* Top Right Quick Settings & Telemetry */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Gemini Engine Status Pill */}
        <div
          onClick={onOpenKeyModal}
          className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#111827] border border-white/8 hover:border-[#4F8CFF]/40 transition-colors text-[11px] font-mono text-[#4F8CFF] cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
          <span>{apiKey ? 'Gemini 2.5 Active' : 'SETU Engine Simulator'}</span>
          <Key className="w-3 h-3 text-[#94A3B8]" />
        </div>

        {/* Language Cycle Pill */}
        <button
          onClick={handleCycleLanguage}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#111827] border border-white/8 hover:border-white/20 transition-colors text-[11px] font-mono text-[#F8FAFC] cursor-pointer"
          title="Cycle Language (EN / HI / Hinglish)"
        >
          <Languages className="w-3 h-3 text-[#A78BFA]" />
          <span>{language.toUpperCase()}</span>
        </button>

        {/* Ambient Motion Toggle */}
        <button
          onClick={() => setAmbientMotion(!ambientMotion)}
          className={`p-1.5 rounded-lg border transition-colors cursor-pointer text-xs ${
            ambientMotion
              ? 'bg-[#4F8CFF]/15 border-[#4F8CFF]/30 text-[#4F8CFF]'
              : 'bg-[#111827] border-white/8 text-[#94A3B8]'
          }`}
          title={`Ambient Background Motion: ${ambientMotion ? 'ON' : 'OFF'}`}
        >
          <Sparkles className="w-3.5 h-3.5" />
        </button>

        {/* Smart Context Panel Trigger */}
        <button
          onClick={() => setIsContextPanelOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#111827] border border-white/8 hover:border-[#34D399]/40 transition-colors text-[11px] text-[#34D399] cursor-pointer font-medium"
        >
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span className="hidden sm:inline">Signals</span>
          <span className="px-1 py-0.2 rounded text-[9px] bg-[#34D399]/15 font-bold">
            {cases.length}
          </span>
        </button>

        {/* Help Keyboard Shortcuts Trigger */}
        <button
          onClick={() => setIsShortcutsOpen(true)}
          className="p-1.5 rounded-lg bg-[#111827] border border-white/8 hover:border-white/20 text-[#94A3B8] hover:text-white transition-colors cursor-pointer text-xs"
          title="Keyboard Shortcuts (?)"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
