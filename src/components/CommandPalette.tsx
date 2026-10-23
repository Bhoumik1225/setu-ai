'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Search,
  Command,
  AlertTriangle,
  FileText,
  CloudRain,
  Car,
  HeartHandshake,
  UploadCloud,
  Share2,
  FolderOpen,
  Languages,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  CornerDownLeft,
  X,
  History,
  Activity,
  Zap,
} from 'lucide-react';

interface PaletteItem {
  id: string;
  category: 'Actions' | 'Tools' | 'Cases & Logs' | 'Preferences';
  title: string;
  subtitle: string;
  icon: React.ElementType;
  badge?: string;
  action: () => void;
}

export const CommandPalette: React.FC = () => {
  const router = useRouter();
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    cases,
    logs,
    language,
    setLanguage,
    ambientMotion,
    setAmbientMotion,
    addToast,
    setIsContextPanelOpen,
    setSelectedContextCase,
  } = useAuth();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const baseItems: PaletteItem[] = [
    {
      id: 'report-emergency',
      category: 'Actions',
      title: 'Report an emergency',
      subtitle: 'Immediate distress triage, ambulance & trauma dispatch',
      icon: ShieldAlert,
      badge: 'Urgent',
      action: () => {
        setIsCommandPaletteOpen(false);
        router.push('/dashboard');
        window.dispatchEvent(new CustomEvent('setu-preset-select', { detail: { text: 'EMERGENCY: Immediate medical triage and ambulance needed. Patient in acute distress.' } }));
      },
    },
    {
      id: 'analyse-medical',
      category: 'Actions',
      title: 'Analyse a medical document',
      subtitle: 'Scan folded prescriptions, lab sheets, and drug interaction risks',
      icon: FileText,
      badge: 'Gemini OCR',
      action: () => {
        setIsCommandPaletteOpen(false);
        router.push('/dashboard');
        window.dispatchEvent(new CustomEvent('setu-preset-select', { detail: { text: 'Reviewing folded handwritten medical prescriptions and lab reports for potential drug interactions.' } }));
      },
    },
    {
      id: 'check-weather',
      category: 'Actions',
      title: 'Check weather risk & flooding',
      subtitle: 'Flash flood alert assessment and safe transit routing',
      icon: CloudRain,
      action: () => {
        setIsCommandPaletteOpen(false);
        router.push('/dashboard');
        window.dispatchEvent(new CustomEvent('setu-preset-select', { detail: { text: 'FLASH FLOOD ALERT: Waterlogging rising over 3 feet near transit corridor. Commuters trapped.' } }));
      },
    },
    {
      id: 'report-traffic',
      category: 'Actions',
      title: 'Report traffic & road accident',
      subtitle: 'Roadway obstruction, collision triage, and DOT detour payload',
      icon: Car,
      action: () => {
        setIsCommandPaletteOpen(false);
        router.push('/dashboard');
        window.dispatchEvent(new CustomEvent('setu-preset-select', { detail: { text: 'ROAD HAZARD: Multi-vehicle accident blocking two lanes on Expressway. Fuel spill detected.' } }));
      },
    },
    {
      id: 'find-help',
      category: 'Tools',
      title: 'Find nearby help & shelters',
      subtitle: 'Open the smart context panel with nearest operational facilities',
      icon: HeartHandshake,
      badge: 'Live',
      action: () => {
        setIsCommandPaletteOpen(false);
        setIsContextPanelOpen(true);
        addToast('Smart context panel opened with local emergency resources', 'info');
      },
    },
    {
      id: 'upload-multimodal',
      category: 'Tools',
      title: 'Upload photo or document',
      subtitle: 'Attach messy audio, photos, or PDF records for multimodal reasoning',
      icon: UploadCloud,
      action: () => {
        setIsCommandPaletteOpen(false);
        router.push('/dashboard');
        window.dispatchEvent(new CustomEvent('setu-trigger-upload'));
      },
    },
    {
      id: 'view-cases',
      category: 'Cases & Logs',
      title: 'View active case timeline',
      subtitle: `${cases.length} active societal impact cases registered`,
      icon: FolderOpen,
      action: () => {
        setIsCommandPaletteOpen(false);
        router.push('/dashboard');
        const timelineEl = document.getElementById('case-timeline-section');
        timelineEl?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'system-logs',
      category: 'Cases & Logs',
      title: 'Open System Pulse Logs',
      subtitle: 'Inspect real-time RFC-8259 telemetry and CAD dispatch payloads',
      icon: Activity,
      action: () => {
        setIsCommandPaletteOpen(false);
        router.push('/logs');
      },
    },
    {
      id: 'toggle-motion',
      category: 'Preferences',
      title: 'Toggle ambient motion',
      subtitle: `Currently: ${ambientMotion ? 'Enabled (Smooth)' : 'Disabled (Calm)'}`,
      icon: Sparkles,
      action: () => {
        setAmbientMotion(!ambientMotion);
        addToast(`Ambient background motion ${!ambientMotion ? 'enabled' : 'disabled'}`, 'info');
      },
    },
    {
      id: 'change-language',
      category: 'Preferences',
      title: 'Change language',
      subtitle: `Current: ${language.toUpperCase()} (English / Hindi / Hinglish)`,
      icon: Languages,
      action: () => {
        const nextLang = language === 'en' ? 'hi' : language === 'hi' ? 'hinglish' : 'en';
        setLanguage(nextLang);
        addToast(`Interface language switched to ${nextLang.toUpperCase()}`, 'info');
      },
    },
  ];

  // Dynamic Case & Log Results based on query
  const dynamicCaseItems: PaletteItem[] = cases
    .filter((c) => c.title.toLowerCase().includes(query.toLowerCase()) || c.id.toLowerCase().includes(query.toLowerCase()))
    .map((c) => ({
      id: c.id,
      category: 'Cases & Logs',
      title: `${c.id} — ${c.title}`,
      subtitle: `${c.status} • ${c.timestamp} • ${c.location || 'Unknown'}`,
      icon: History,
      badge: c.urgency,
      action: () => {
        setIsCommandPaletteOpen(false);
        setSelectedContextCase(c);
        setIsContextPanelOpen(true);
      },
    }));

  const filteredItems = [
    ...baseItems.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    ),
    ...(query ? dynamicCaseItems : []),
  ];

  // Keyboard navigation inside palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      setIsCommandPaletteOpen(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={() => setIsCommandPaletteOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-[#111827] border border-white/10 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Command Search Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/8 gap-3 bg-[#172033]/60">
          <Search className="w-5 h-5 text-[#4F8CFF] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, search active cases, or ask SETU..."
            className="w-full bg-transparent text-sm text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="text-[#94A3B8] hover:text-white p-1 rounded-md text-xs cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex">ESC</kbd>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-[#94A3B8] space-y-2">
              <Command className="w-8 h-8 mx-auto text-[#94A3B8]/40" />
              <p className="text-sm">No commands or cases found for &quot;{query}&quot;</p>
              <p className="text-xs text-[#94A3B8]/60">Try searching &quot;emergency&quot;, &quot;medical&quot;, &quot;flood&quot;, or &quot;cases&quot;</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#172033] border border-[#4F8CFF]/30 text-white' : 'text-[#94A3B8] hover:bg-[#172033]/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isSelected ? 'bg-[#4F8CFF]/20 text-[#4F8CFF]' : 'bg-white/5 text-[#94A3B8]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#F8FAFC] truncate">{item.title}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#4F8CFF]/15 text-[#4F8CFF] border border-[#4F8CFF]/30">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#94A3B8] truncate">{item.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-3 shrink-0">
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-[#4F8CFF]">
                        Run <CornerDownLeft className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className="px-4 py-2 border-t border-white/8 bg-[#0B101D] flex items-center justify-between text-[11px] text-[#94A3B8]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd>↑</kbd> <kbd>↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd>↵</kbd> Select
            </span>
            <span className="flex items-center gap-1">
              <kbd>ESC</kbd> Close
            </span>
          </div>
          <span className="text-xs font-medium text-[#4F8CFF] flex items-center gap-1">
            <Zap className="w-3 h-3" /> SETU FastCommand
          </span>
        </div>
      </div>
    </div>
  );
};
