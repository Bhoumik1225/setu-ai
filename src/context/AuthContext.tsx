'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DispatchLogEntry } from '@/types/bridge';
import { SETU_DISPATCH_LOGS } from '@/data/setuDemoData';

export type LanguageCode = 'en' | 'hi' | 'hinglish';
export type TextSize = 'normal' | 'lg' | 'xl';
export type BackgroundQuality = 'low' | 'balanced' | 'high';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (email: string) => void;
  logout: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  logs: DispatchLogEntry[];
  addLog: (log: Omit<DispatchLogEntry, 'id' | 'timestamp'>) => void;
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
  notifications: string[];
  toasts: ToastMessage[];
  addToast: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string | null>('evaluator@setu.ai');
  const [apiKey, setApiKey] = useState<string>('');
  const [logs, setLogs] = useState<DispatchLogEntry[]>(SETU_DISPATCH_LOGS);
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [textSize, setTextSize] = useState<TextSize>('normal');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [ambientMotion, setAmbientMotion] = useState<boolean>(true);
  const [backgroundQuality, setBackgroundQuality] = useState<BackgroundQuality>('balanced');
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

      const storedMotion = localStorage.getItem('setu_ambient_motion');
      if (storedMotion !== null) setAmbientMotion(storedMotion === 'true');

      const storedQual = localStorage.getItem('setu_bg_quality') as BackgroundQuality;
      if (storedQual) setBackgroundQuality(storedQual);
    } catch (e) {}
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

  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
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
        notifications,
        toasts,
        addToast,
        removeToast,
      }}
    >
      <div className={`${highContrast ? 'high-contrast' : ''} ${textSize === 'lg' ? 'text-size-lg' : textSize === 'xl' ? 'text-size-xl' : ''}`}>
        {children}

        {/* Floating Toast Notification Container */}
        <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`pointer-events-auto px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border text-xs font-medium flex items-center justify-between gap-3 animate-fade-in ${
                toast.type === 'success'
                  ? 'bg-[#071A38]/95 border-[#06B6D4]/40 text-[#06B6D4]'
                  : toast.type === 'error'
                  ? 'bg-[#071A38]/95 border-[#FB7185]/40 text-[#FB7185]'
                  : toast.type === 'warning'
                  ? 'bg-[#071A38]/95 border-[#FBBF24]/40 text-[#FBBF24]'
                  : 'bg-[#071A38]/95 border-white/10 text-slate-200'
              }`}
            >
              <span>{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="opacity-70 hover:opacity-100 text-xs ml-2 cursor-pointer"
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
