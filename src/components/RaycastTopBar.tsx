'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth, LanguageCode } from '@/context/AuthContext';
import {
  Search,
  HelpCircle,
  Languages,
  Key,
  ChevronDown,
  Check,
  Globe2,
} from 'lucide-react';

interface RaycastTopBarProps {
  onOpenKeyModal?: () => void;
}

const LANGUAGES_LIST: { code: LanguageCode; name: string; nativeName: string; flag: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'hinglish', name: 'Hinglish', nativeName: 'Hinglish', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
];

export const RaycastTopBar: React.FC<RaycastTopBarProps> = ({ onOpenKeyModal }) => {
  const {
    setIsCommandPaletteOpen,
    setIsShortcutsOpen,
    apiKey,
    language,
    setLanguage,
  } = useAuth();

  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLangObj = LANGUAGES_LIST.find((l) => l.code === language) || LANGUAGES_LIST[0];

  return (
    <header className="sticky top-0 z-30 w-full bg-[#080B12]/85 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
      {/* Search / Command Bar Trigger */}
      <div className="flex-1 max-w-xl">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          aria-label="Open command palette (⌘K)"
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-[#0F172A]/80 border border-white/10 hover:border-sky-400/50 text-slate-400 hover:text-white transition-all cursor-pointer shadow-sm group text-left"
        >
          <div className="flex items-center gap-2.5 text-xs">
            <Search className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Search commands, active cases, triage protocols...</span>
            <span className="sm:hidden">Search commands...</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 text-[10px] bg-white/5 border border-white/10 rounded text-slate-400 font-mono">⌘K</kbd>
          </div>
        </button>
      </div>

      {/* Top Right Controls: AI Engine, Major Languages Dropdown, Help */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Gemini Engine Status Pill */}
        <button
          type="button"
          onClick={onOpenKeyModal}
          aria-label={apiKey ? 'Gemini 2.5 Active — Configure API key' : 'AI Engine Ready — Configure API key'}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-950/70 border border-blue-500/30 hover:border-blue-400 transition-colors text-[11px] font-mono text-blue-300 cursor-pointer shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
          <span className="hidden xs:inline">{apiKey ? 'Gemini 2.5 Active' : 'AI Engine Ready'}</span>
          <span className="xs:hidden">AI</span>
          <Key className="w-3 h-3 text-blue-300/70" aria-hidden="true" />
        </button>

        {/* Major Languages Selector Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
            aria-expanded={isLangDropdownOpen}
            aria-haspopup="listbox"
            aria-label={`Select language. Current: ${currentLangObj.name}`}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0F172A]/90 border border-white/10 hover:border-sky-400/50 transition-all text-xs text-white cursor-pointer shadow-sm"
          >
            <Globe2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="text-sm leading-none">{currentLangObj.flag}</span>
            <span className="font-medium hidden sm:inline">{currentLangObj.name}</span>
            <span className="font-mono text-[10px] text-slate-400 sm:hidden uppercase">{currentLangObj.code}</span>
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Language Options Dropdown Menu */}
          {isLangDropdownOpen && (
            <div role="listbox" aria-label="Language options" className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0D1527]/95 backdrop-blur-2xl border border-sky-500/30 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1.5 border-b border-white/10 mb-1 flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Major Languages
                </span>
                <span className="text-[10px] text-sky-400 font-mono font-bold">
                  {LANGUAGES_LIST.length} Supported
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-1">
                {LANGUAGES_LIST.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                        isSelected
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40 font-semibold'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base leading-none">{lang.flag}</span>
                        <div className="truncate">
                          <span className="block truncate">{lang.name}</span>
                          <span className="text-[10px] text-slate-400 block font-normal">{lang.nativeName}</span>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Help Keyboard Shortcuts Trigger */}
        <button
          onClick={() => setIsShortcutsOpen(true)}
          aria-label="Keyboard shortcuts"
          className="p-1.5 rounded-xl bg-[#0F172A]/80 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs"
        >
          <HelpCircle className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
};
