'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, LanguageCode, BackgroundQuality } from '@/context/AuthContext';
import {
  Globe2,
  LayoutDashboard,
  Activity,
  LogOut,
  Key,
  LogIn,
  Bell,
  Contrast,
  Sliders,
  Check,
  HelpCircle,
  Sparkles,
  Waves,
} from 'lucide-react';

interface NavbarProps {
  onOpenKeyModal?: () => void;
  onOpenTour?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenKeyModal, onOpenTour }) => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    isAuthenticated,
    userEmail,
    logout,
    apiKey,
    language,
    setLanguage,
    textSize,
    setTextSize,
    highContrast,
    setHighContrast,
    ambientMotion,
    setAmbientMotion,
    backgroundQuality,
    setBackgroundQuality,
    notifications,
  } = useAuth();

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccessMenu, setShowAccessMenu] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const labels = {
    en: {
      dashboard: 'Command Center',
      logs: 'System Pulse',
      tagline: 'From human distress to safe action',
      engine: 'SETU Neural Core: ONLINE',
      demoAccess: 'Judge Access',
    },
    hi: {
      dashboard: 'कमांड सेंटर',
      logs: 'सिस्टम पल्स',
      tagline: 'अव्यवस्था से सुरक्षित कदम',
      engine: 'सेतु न्यूरल कोर: सक्रिय',
      demoAccess: 'जज एक्सेस',
    },
    hinglish: {
      dashboard: 'Command Center',
      logs: 'System Pulse',
      tagline: 'Distress se safe action tak',
      engine: 'SETU Neural Core: ONLINE',
      demoAccess: 'Judge Access',
    },
  }[language];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#030712]/75 border-b border-white/10 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* SETU AI Brand Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[#06B6D4]/40 via-[#2563EB]/40 to-[#A78BFA]/40 rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition duration-300" />
            <div className="relative w-10 h-10 rounded-2xl bg-[#071A38] border border-[#06B6D4]/40 p-1 flex items-center justify-center shadow-lg shadow-[#030712]">
              <span className="font-black text-sm tracking-tight text-[#06B6D4]">SEतु</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                SETU AI
                <span className="text-xs font-normal text-[#06B6D4] hidden sm:inline font-mono">| सेतु</span>
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#06B6D4]/15 border border-[#06B6D4]/35 text-[#06B6D4] font-semibold">
                Neural Safety
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8] hidden sm:block font-sans">
              {labels.tagline}
            </p>
          </div>
        </Link>

        {/* Route Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 bg-[#071A38]/70 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
          <Link
            href="/dashboard"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              pathname === '/dashboard' || pathname === '/'
                ? 'bg-[#06B6D4]/20 text-[#06B6D4] border border-[#06B6D4]/45 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                : 'text-[#94A3B8] hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>{labels.dashboard}</span>
          </Link>

          <Link
            href="/logs"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              pathname === '/logs'
                ? 'bg-[#A78BFA]/20 text-[#A78BFA] border border-[#A78BFA]/45 shadow-[0_0_15px_rgba(167,139,250,0.2)]'
                : 'text-[#94A3B8] hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{labels.logs}</span>
          </Link>
        </nav>

        {/* Action Controls & Utilities */}
        <div className="flex items-center gap-2">
          {/* Engine Status Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#071A38] border border-[#06B6D4]/30 text-xs text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#06B6D4] opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#06B6D4]" />
            </span>
            <span className="font-mono text-[11px] text-[#06B6D4] font-semibold">
              {labels.engine}
            </span>
          </div>

          {/* Onboarding Tour Trigger */}
          {onOpenTour && (
            <button
              onClick={onOpenTour}
              title="Interactive Platform Tour"
              className="p-2 rounded-xl text-[#94A3B8] hover:text-white hover:bg-white/5 border border-white/10 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-[#06B6D4]" />
            </button>
          )}

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              title="Select Language"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-mono font-medium text-slate-300 hover:text-white bg-[#071A38] border border-white/10 transition-colors cursor-pointer"
            >
              <Globe2 className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span className="uppercase">{language}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-[#071A38] border border-white/15 p-2 shadow-2xl z-50 text-xs space-y-1">
                <span className="text-[10px] uppercase font-mono text-slate-400 px-2 block pt-1">
                  Language / भाषा
                </span>
                <button
                  onClick={() => { setLanguage('en'); setShowLangMenu(false); }}
                  className="w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between hover:bg-white/5 cursor-pointer text-slate-200"
                >
                  <span>English (Default)</span>
                  {language === 'en' && <Check className="w-3 h-3 text-[#06B6D4]" />}
                </button>
                <button
                  onClick={() => { setLanguage('hi'); setShowLangMenu(false); }}
                  className="w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between hover:bg-white/5 cursor-pointer text-slate-200"
                >
                  <span>हिन्दी (Hindi)</span>
                  {language === 'hi' && <Check className="w-3 h-3 text-[#06B6D4]" />}
                </button>
                <button
                  onClick={() => { setLanguage('hinglish'); setShowLangMenu(false); }}
                  className="w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between hover:bg-white/5 cursor-pointer text-slate-200"
                >
                  <span>Hinglish (Colloquial)</span>
                  {language === 'hinglish' && <Check className="w-3 h-3 text-[#06B6D4]" />}
                </button>
              </div>
            )}
          </div>

          {/* Accessibility & 3D Ambient Motion Settings Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAccessMenu(!showAccessMenu)}
              title="Display & 3D Neural Motion Controls"
              className="p-2 rounded-xl text-slate-300 hover:text-white bg-[#071A38] border border-white/10 transition-colors cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-[#A78BFA]" />
            </button>

            {showAccessMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#071A38] border border-white/15 p-3.5 shadow-2xl z-50 text-xs space-y-3.5">
                <span className="text-[10px] uppercase font-mono text-slate-400 block border-b border-white/10 pb-1.5">
                  Display & Neural Motion Settings
                </span>

                {/* Ambient Motion Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-200 flex items-center gap-1.5">
                    <Waves className="w-3.5 h-3.5 text-[#06B6D4]" />
                    Ambient 3D Motion
                  </span>
                  <button
                    onClick={() => setAmbientMotion(!ambientMotion)}
                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                      ambientMotion ? 'bg-[#06B6D4]' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`block w-3.5 h-3.5 rounded-full bg-[#030712] transition-transform ${
                        ambientMotion ? 'translate-x-4' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* 3D Scene Quality */}
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block mb-1">Neural Network Quality</span>
                  <div className="grid grid-cols-3 gap-1">
                    {(['low', 'balanced', 'high'] as const).map((q) => (
                      <button
                        key={q}
                        onClick={() => setBackgroundQuality(q)}
                        className={`py-1 rounded-lg text-center font-mono text-[10px] cursor-pointer border ${
                          backgroundQuality === q
                            ? 'bg-[#06B6D4]/25 text-[#06B6D4] border-[#06B6D4]/50'
                            : 'bg-white/5 text-slate-400 border-transparent hover:text-white'
                        }`}
                      >
                        {q.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text Size */}
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block mb-1">Text Size</span>
                  <div className="grid grid-cols-3 gap-1">
                    {(['normal', 'lg', 'xl'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setTextSize(s)}
                        className={`py-1 rounded-lg text-center font-mono text-[10px] cursor-pointer border ${
                          textSize === s
                            ? 'bg-[#A78BFA]/25 text-[#A78BFA] border-[#A78BFA]/50'
                            : 'bg-white/5 text-slate-400 border-transparent hover:text-white'
                        }`}
                      >
                        {s.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* High Contrast */}
                <div className="flex items-center justify-between pt-1 border-t border-white/10">
                  <span className="text-[11px] text-slate-300 flex items-center gap-1.5">
                    <Contrast className="w-3.5 h-3.5" /> High Contrast
                  </span>
                  <button
                    onClick={() => setHighContrast(!highContrast)}
                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                      highContrast ? 'bg-[#06B6D4]' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`block w-3.5 h-3.5 rounded-full bg-[#030712] transition-transform ${
                        highContrast ? 'translate-x-4' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notification Center */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-300 hover:text-white bg-[#071A38] border border-white/10 transition-colors relative cursor-pointer"
            >
              <Bell className="w-4 h-4 text-[#FBBF24]" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FB7185] animate-ping" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FB7185]" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#071A38] border border-white/15 p-3 shadow-2xl z-50 text-xs space-y-2">
                <span className="text-[10px] uppercase font-mono text-slate-400 block border-b border-white/10 pb-1">
                  Active Dispatch Alerts
                </span>
                {notifications.map((n, i) => (
                  <div key={i} className="p-2 rounded-xl bg-white/5 text-slate-300 text-[11px] leading-relaxed">
                    • {n}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Gemini API Key Config */}
          {onOpenKeyModal && (
            <button
              onClick={onOpenKeyModal}
              title="Configure Custom Gemini Key"
              className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#071A38] hover:bg-[#0D2235] border border-white/10 text-slate-300 hover:text-white transition-all"
            >
              <Key className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span className="hidden sm:inline font-mono text-[11px]">{apiKey ? 'Gemini Ready' : 'API Key'}</span>
            </button>
          )}

          {/* Auth Button */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              title={`Logged in as ${userEmail || 'Evaluator'}`}
              className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FB7185]/10 hover:bg-[#FB7185]/20 border border-[#FB7185]/30 text-[#FB7185] transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="cursor-pointer flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#06B6D4] hover:bg-[#0891b2] text-[#030712] transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{labels.demoAccess}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
