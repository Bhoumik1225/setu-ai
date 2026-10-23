'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  X,
  Keyboard,
  Command,
  Search,
  Sparkles,
  HelpCircle,
  FolderOpen,
  Activity,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const KeyboardShortcutsModal: React.FC = () => {
  const { isShortcutsOpen, setIsShortcutsOpen, setIsCommandPaletteOpen } = useAuth();

  if (!isShortcutsOpen) return null;

  const shortcutGroups = [
    {
      title: 'Navigation & Commands',
      items: [
        { key: '⌘ K / Ctrl K', desc: 'Open SETU Global Command Palette' },
        { key: '?', desc: 'Toggle this keyboard shortcut helper' },
        { key: 'ESC', desc: 'Close open modal, palette, or context panel' },
      ],
    },
    {
      title: 'Command Center & Intake',
      items: [
        { key: '↵ (Enter)', desc: 'Run selected command or submit incident payload' },
        { key: '↑ / ↓', desc: 'Navigate through commands, cases, and logs' },
        { key: '⌘ Enter', desc: 'Trigger Gemini multimodal reasoning pipeline' },
      ],
    },
    {
      title: 'Accessibility & Display',
      items: [
        { key: 'Alt M', desc: 'Toggle calm / smooth ambient background motion' },
        { key: 'Alt L', desc: 'Cycle languages (English → Hindi → Hinglish)' },
        { key: 'Alt C', desc: 'Toggle high-contrast emergency mode' },
      ],
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={() => setIsShortcutsOpen(false)}
    >
      <div
        className="w-full max-w-lg bg-[#111827] border border-white/10 rounded-2xl shadow-2xl shadow-black/80 p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/8 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#4F8CFF]/15 text-[#4F8CFF]">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Keyboard Shortcuts</h2>
              <p className="text-xs text-[#94A3B8]">Fast keyboard-first interactions in SETU AI</p>
            </div>
          </div>
          <button
            onClick={() => setIsShortcutsOpen(false)}
            className="text-[#94A3B8] hover:text-white p-1 rounded-lg text-sm cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          {shortcutGroups.map((group) => (
            <div key={group.title} className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8] font-bold block">
                {group.title}
              </span>
              <div className="space-y-1.5">
                {group.items.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-[#172033]/60 border border-white/5"
                  >
                    <span className="text-xs text-slate-200">{item.desc}</span>
                    <kbd>{item.key}</kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-white/8 flex items-center justify-between text-xs text-[#94A3B8]">
          <span>Press <kbd>?</kbd> anytime to open</span>
          <button
            onClick={() => {
              setIsShortcutsOpen(false);
              setIsCommandPaletteOpen(true);
            }}
            className="text-[#4F8CFF] hover:underline flex items-center gap-1 font-medium cursor-pointer"
          >
            Open Command Palette <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
