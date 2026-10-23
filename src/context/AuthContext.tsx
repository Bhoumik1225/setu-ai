'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DispatchLogEntry, CaseTimelineItem } from '@/types/bridge';
import { SETU_DISPATCH_LOGS } from '@/data/setuDemoData';

export type LanguageCode =
  | 'en'
  | 'hi'
  | 'hinglish'
  | 'es'
  | 'fr'
  | 'de'
  | 'ar'
  | 'bn'
  | 'ja';
export type TextSize = 'normal' | 'lg' | 'xl';
export type BackgroundQuality = 'low' | 'balanced' | 'high';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

const INITIAL_CASES: CaseTimelineItem[] = [
  {
    id: 'CASE-8941',
    title: 'Senior Citizen Cardiac & Prescription Alert',
    category: 'MEDICAL',
    urgency: 'CRITICAL',
    status: 'Action Ready',
    timestamp: '8 mins ago',
    location: 'Sector 4, Green Valley',
    summary: 'Patient reports severe chest tightness. Digoxin and Metoprolol medication history flagged.',
    actionSummary: 'Dispatched Metro Trauma EMS Unit 4 and alerted on-call cardiologist.',
  },
  {
    id: 'CASE-8939',
    title: 'Highway Flash Flood & Trapped Commuters',
    category: 'WEATHER',
    urgency: 'URGENT',
    status: 'Escalated',
    timestamp: '24 mins ago',
    location: 'Underpass Mile 14',
    summary: 'Water level crossed 3 feet. 4 passenger sedans stalled with occupants inside.',
    actionSummary: 'Municipal drainage pump team deployed, traffic diversion route opened.',
  },
  {
    id: 'CASE-8935',
    title: 'Fallen High-Voltage Line Over Pedestrian Walkway',
    category: 'CIVIC',
    urgency: 'NEEDS_ATTENTION',
    status: 'Resolved',
    timestamp: '1 hour ago',
    location: 'Central Avenue Metro Station',
    summary: 'Live cable sparking after storm gust. High pedestrian footfall area.',
    actionSummary: 'Grid power cut within 4 minutes, safety perimeter established.',
  },
  {
    id: 'CASE-8928',
    title: 'Elderly Assistance & Insulin Cold Storage',
    category: 'GENERAL',
    urgency: 'ROUTINE',
    status: 'Resolved',
    timestamp: '3 hours ago',
    location: 'Sunrise Retirement Village',
    summary: 'Power outage threatened insulin supply temperature stability.',
    actionSummary: 'Volunteer team supplied portable solar refrigeration unit.',
  },
];

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (email: string) => void;
  logout: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  logs: DispatchLogEntry[];
  addLog: (log: Omit<DispatchLogEntry, 'id' | 'timestamp'>) => void;
  cases: CaseTimelineItem[];
  addCase: (item: Omit<CaseTimelineItem, 'id' | 'timestamp'>) => void;
  updateCaseStatus: (id: string, status: CaseTimelineItem['status']) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  ambientMotion: boolean;
  setAmbientMotion: (val: boolean) => void;
  backgroundQuality: BackgroundQuality;
  setBackgroundQuality: (quality: BackgroundQuality) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isShortcutsOpen: boolean;
  setIsShortcutsOpen: (open: boolean) => void;
  isContextPanelOpen: boolean;
  setIsContextPanelOpen: (open: boolean) => void;
  selectedContextCase: CaseTimelineItem | null;
  setSelectedContextCase: (item: CaseTimelineItem | null) => void;
  notifications: string[];
  toasts: ToastMessage[];
  addToast: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string | null>('judge.evaluator@google.com');
  const [apiKey, setApiKey] = useState<string>('');
  const [logs, setLogs] = useState<DispatchLogEntry[]>(SETU_DISPATCH_LOGS);
  const [cases, setCases] = useState<CaseTimelineItem[]>(INITIAL_CASES);
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [textSize, setTextSize] = useState<TextSize>('normal');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [ambientMotion, setAmbientMotion] = useState<boolean>(true);
  const [backgroundQuality, setBackgroundQuality] = useState<BackgroundQuality>('balanced');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [isContextPanelOpen, setIsContextPanelOpen] = useState<boolean>(false);
  const [selectedContextCase, setSelectedContextCase] = useState<CaseTimelineItem | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const notifications = [
    'SETU AI Engine active on Gemini 2.5 Flash',
    '3 nearby emergency services connected in sector',
    'Civic waterlogging alert verified in Basin 4',
  ];

  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem('setu_auth');
      if (storedAuth) {
        const parsed = JSON.parse(storedAuth);
        setIsAuthenticated(parsed.isAuthenticated);
        setUserEmail(parsed.userEmail);
      }
      const storedKey = localStorage.getItem('setu_api_key');
      if (storedKey) setApiKey(storedKey);

      const storedLang = localStorage.getItem('setu_lang') as LanguageCode;
      if (storedLang) setLanguage(storedLang);

      const storedLogs = localStorage.getItem('setu_dispatch_logs');
      if (storedLogs) setLogs(JSON.parse(storedLogs));

      const storedCases = localStorage.getItem('setu_timeline_cases');
      if (storedCases) setCases(JSON.parse(storedCases));

      const storedMotion = localStorage.getItem('setu_ambient_motion');
      if (storedMotion !== null) setAmbientMotion(storedMotion === 'true');
    } catch (e) {}
  }, []);

  // Global Keyboard Shortcuts (⌘K for command palette, ? for shortcuts panel)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when user is typing in form inputs, except for Cmd+K / Ctrl+K
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === '?' && !isInput) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsShortcutsOpen(false);
        setIsContextPanelOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const login = (email: string) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    addToast('Welcome to SETU AI Command Center', 'success');
    try {
      localStorage.setItem('setu_auth', JSON.stringify({ isAuthenticated: true, userEmail: email }));
    } catch (e) {}
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    addToast('Signed out of SETU AI', 'info');
    try {
      localStorage.removeItem('setu_auth');
    } catch (e) {}
  };

  const handleSetApiKey = (key: string) => {
    setApiKey(key);
    addToast(key ? 'Gemini API Key configured successfully' : 'Using SETU High-Fidelity Simulator', 'info');
    try {
      localStorage.setItem('setu_api_key', key);
    } catch (e) {}
  };

  const handleSetLanguage = (lang: LanguageCode) => {
    setLanguage(lang);
    try {
      localStorage.setItem('setu_lang', lang);
    } catch (e) {}
  };

  const handleSetAmbientMotion = (val: boolean) => {
    setAmbientMotion(val);
    try {
      localStorage.setItem('setu_ambient_motion', String(val));
    } catch (e) {}
  };

  const handleSetBackgroundQuality = (qual: BackgroundQuality) => {
    setBackgroundQuality(qual);
    try {
      localStorage.setItem('setu_bg_quality', qual);
    } catch (e) {}
  };

  const addLog = (logData: Omit<DispatchLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: DispatchLogEntry = {
      ...logData,
      id: `SETU-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
    };
    setLogs((prev) => {
      const updated = [newEntry, ...prev];
      try {
        localStorage.setItem('setu_dispatch_logs', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const addCase = (caseData: Omit<CaseTimelineItem, 'id' | 'timestamp'>) => {
    const newCase: CaseTimelineItem = {
      ...caseData,
      id: `CASE-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: 'Just now',
    };
    setCases((prev) => {
      const updated = [newCase, ...prev];
      try {
        localStorage.setItem('setu_timeline_cases', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const updateCaseStatus = (id: string, status: CaseTimelineItem['status']) => {
    setCases((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, status } : c));
      try {
        localStorage.setItem('setu_timeline_cases', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    addToast(`Case ${id} updated to ${status}`, 'info');
  };

  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userEmail,
        login,
        logout,
        apiKey,
        setApiKey: handleSetApiKey,
        logs,
        addLog,
        cases,
        addCase,
        updateCaseStatus,
        language,
        setLanguage: handleSetLanguage,
        textSize,
        setTextSize,
        highContrast,
        setHighContrast,
        ambientMotion,
        setAmbientMotion: handleSetAmbientMotion,
        backgroundQuality,
        setBackgroundQuality: handleSetBackgroundQuality,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isShortcutsOpen,
        setIsShortcutsOpen,
        isContextPanelOpen,
        setIsContextPanelOpen,
        selectedContextCase,
        setSelectedContextCase,
        notifications,
        toasts,
        addToast,
        removeToast,
      }}
    >
      <div className={`${highContrast ? 'high-contrast' : ''} ${textSize === 'lg' ? 'text-size-lg' : textSize === 'xl' ? 'text-size-xl' : ''}`}>
        {children}

        {/* Floating Toast Notification Container (Raycast style) */}
        <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none" role="status" aria-live="polite" aria-label="Notifications">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              role="alert"
              className={`pointer-events-auto px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-xl border text-xs font-medium flex items-center justify-between gap-3 transition-all ${
                toast.type === 'success'
                  ? 'bg-[#111827]/95 border-[#34D399]/40 text-[#34D399]'
                  : toast.type === 'error'
                  ? 'bg-[#111827]/95 border-[#FB7185]/40 text-[#FB7185]'
                  : toast.type === 'warning'
                  ? 'bg-[#111827]/95 border-[#FBBF24]/40 text-[#FBBF24]'
                  : 'bg-[#111827]/95 border-white/10 text-[#F8FAFC]'
              }`}
            >
              <span>{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                aria-label={`Dismiss notification: ${toast.message}`}
                className="opacity-60 hover:opacity-100 text-xs ml-2 cursor-pointer"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
