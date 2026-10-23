'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  Cpu,
  Layers,
  Activity,
  FileText,
  Command,
} from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter an email address.');
      return;
    }
    setLoading(true);
    login(email);
    window.location.href = '/dashboard';
  };

  const handleJudgeAccess = () => {
    setLoading(true);
    login('judge.hackathon@google.com');
    window.location.href = '/dashboard';
  };

  const featurePillars = [
    { title: 'Multimodal Input', desc: 'Accept messy voice, folded prescriptions, and photos' },
    { title: 'Gemini Reasoning', desc: '5-stage facts & uncertainty evaluation' },
    { title: 'Verification-First', desc: 'RFC-8259 structured safe action payloads' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 text-white font-sans overflow-y-auto min-h-screen">
      {/* Luminous & Clear Aesthetic Wallpaper Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src="/assets/aesthetic-hero-bridge.jpg"
          alt="Aesthetic Cyber Bridge Nexus Background"
          className="w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.08] saturate-[1.12]"
        />
        {/* Soft Ambient Cyan/Blue Gradient & Subtle Vignette (Much Lighter) */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-sky-950/15 to-slate-900/30" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-slate-950/45" />
      </div>

      {/* Radiant Glowing Ambient Lights */}
      <div className="absolute top-12 left-10 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none animate-pulse-soft" />
      <div className="absolute bottom-12 right-10 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none animate-subtle-glow" />

      {/* Centered Clean Modern White Card (Responsive for Mobile, Tablet, Laptop) */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md rounded-2xl sm:rounded-3xl bg-white shadow-2xl shadow-black/80 border border-slate-100 p-5 sm:p-8 md:p-9 space-y-5 sm:space-y-6 my-auto text-slate-900">
        {/* 3D AI Bridge Visual Header with Floating Animation */}
        <div className="relative mx-auto w-full h-28 sm:h-32 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 shadow-md group">
          <img
            src="/assets/setu-3d-bridge.jpg"
            alt="SETU 3D AI Bridge"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex items-end p-2.5 sm:p-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] sm:text-[11px] font-mono font-semibold text-white tracking-wide truncate">
                SETU Autonomous AI Bridge Active
              </span>
            </div>
          </div>
        </div>

        {/* Brand Header */}
        <div className="space-y-1 sm:space-y-2 text-center">
          <div className="space-y-0.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">SETU AI</h1>
            <p className="text-[11px] sm:text-xs font-medium text-slate-500">
              From human signals to coordinated safe action.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-600 font-medium">
              {errorMessage}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Judge / Responder Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="judge.evaluator@google.com"
                className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Passcode / PIN</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            {loading ? 'Authenticating...' : 'Sign In to Command Center'}
            {!loading && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-2.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase absolute">
            Evaluation Gateway
          </span>
        </div>

        {/* One-Click Judge Demo Access Button */}
        <button
          type="button"
          onClick={handleJudgeAccess}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-700 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 group shadow-sm active:scale-[0.99]"
        >
          <Sparkles className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          <span>Judge Demo Access (Instant 1-Click)</span>
        </button>

        {/* Compact Feature Highlights */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          {featurePillars.map((p) => (
            <div key={p.title} className="flex items-start gap-2 text-[11px] text-slate-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <strong className="text-slate-800">{p.title}:</strong> {p.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
