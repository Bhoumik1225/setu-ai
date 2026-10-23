'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Activity,
  ShieldCheck,
  Command,
  HelpCircle,
  Settings,
  Sparkles,
  Radio,
  Sliders,
  LogOut,
  ChevronRight,
  Zap,
} from 'lucide-react';

interface AppShellSidebarProps {
  children?: React.ReactNode;
}

export const AppShellSidebar: React.FC<AppShellSidebarProps> = () => {
  const pathname = usePathname();
  const {
    userEmail,
    logout,
    setIsCommandPaletteOpen,
    setIsShortcutsOpen,
    setIsContextPanelOpen,
    cases,
  } = useAuth();

  const isLoginPage = pathname === '/login';

  const navLinks = [
    {
      href: '/dashboard',
      label: 'Command Center',
      icon: LayoutDashboard,
      active: pathname === '/dashboard' || pathname === '/',
      badge: cases.length.toString(),
    },
    {
      href: '/logs',
      label: 'System Pulse Logs',
      icon: Activity,
      active: pathname === '/logs',
      badge: 'Live',
    },
    {
      href: '/login',
      label: 'Judge Access',
      icon: ShieldCheck,
      active: pathname === '/login',
    },
  ];

  if (isLoginPage) {
    return null;
  }

  return (
    <>
      {/* Desktop Slim Collapsible Left Sidebar */}
      <aside aria-label="Main sidebar navigation" className="hidden lg:flex w-64 flex-col justify-between h-screen fixed left-0 top-0 border-r border-white/8 bg-[#080B12]/95 backdrop-blur-xl z-30 select-none">
        {/* Top Branding & Search Trigger */}
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4F8CFF] to-[#A78BFA] p-0.5 flex items-center justify-center shadow-lg shadow-[#4F8CFF]/20">
                <div className="w-full h-full bg-[#080B12] rounded-[10px] flex items-center justify-center">
                  <span className="font-black text-sm text-[#4F8CFF] tracking-tighter">SEतु</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-sm font-extrabold text-white tracking-tight">SETU AI</h1>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                </div>
                <span className="text-[10px] text-[#94A3B8] font-mono block">OS v2.5 • Gemini</span>
              </div>
            </Link>
          </div>

          {/* Raycast-style Command Trigger Button in Sidebar */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#111827] border border-white/8 hover:border-[#4F8CFF]/40 text-[#94A3B8] hover:text-white transition-all cursor-pointer shadow-sm group"
          >
            <span className="flex items-center gap-2 text-xs">
              <Command className="w-3.5 h-3.5 text-[#4F8CFF] group-hover:scale-110 transition-transform" />
              <span>Commands...</span>
            </span>
            <kbd className="text-[10px]">⌘K</kbd>
          </button>

          {/* Navigation Items */}
          <nav aria-label="Main navigation" className="space-y-1 pt-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8]/70 px-2 block font-semibold mb-1">
              Platform
            </span>
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    link.active
                      ? 'bg-[#172033] border border-[#4F8CFF]/30 text-white shadow-sm'
                      : 'text-[#94A3B8] hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                  aria-current={link.active ? 'page' : undefined}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${link.active ? 'text-[#4F8CFF]' : 'text-[#94A3B8]'}`} />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                        link.active
                          ? 'bg-[#4F8CFF]/20 text-[#4F8CFF]'
                          : 'bg-white/5 text-[#94A3B8]'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Context Panel Trigger */}
          <div className="pt-3">
            <button
              onClick={() => setIsContextPanelOpen(true)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#172033]/60 to-[#111827] border border-white/6 hover:border-[#4F8CFF]/30 text-xs text-[#94A3B8] hover:text-white transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-[#34D399] animate-pulse" />
                <span>Live Context Panel</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
            </button>
          </div>
        </div>

        {/* Bottom User & Help Section */}
        <div className="p-4 border-t border-white/8 space-y-3 bg-[#080B12]/60">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsShortcutsOpen(true)}
              className="flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Shortcuts</span>
              <kbd>?</kbd>
            </button>

            <span className="text-[10px] font-mono text-[#34D399] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" /> Online
            </span>
          </div>

          {/* User Profile Card */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#4F8CFF] to-[#A78BFA] flex items-center justify-center text-xs font-bold text-white shrink-0">
                {userEmail ? userEmail.charAt(0).toUpperCase() : 'J'}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-medium text-white truncate block">
                  {userEmail || 'Evaluator'}
                </span>
                <span className="text-[10px] text-[#94A3B8] block truncate">Incident Dispatcher</span>
              </div>
            </div>

            <button
              onClick={logout}
              aria-label="Sign out"
              className="p-1.5 text-[#94A3B8] hover:text-[#FB7185] rounded-md transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav aria-label="Mobile navigation" className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080B12]/95 backdrop-blur-xl border-t border-white/10 px-4 py-2 flex items-center justify-around">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
                link.active ? 'text-[#4F8CFF]' : 'text-[#94A3B8]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}

        {/* Floating Ask SETU Command Button for Mobile */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          aria-label="Open command palette"
          className="p-2.5 rounded-full bg-[#4F8CFF] text-white shadow-lg shadow-[#4F8CFF]/30 cursor-pointer active:scale-95 transition-transform"
        >
          <Command className="w-4 h-4" aria-hidden="true" />
        </button>
      </nav>
    </>
  );
};
