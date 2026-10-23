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
    <div className="min-h-screen relative flex items-center justify-center p-4 text-[#F8FAFC] font-sans">
      {/* Centered Compact Raycast-Inspired Login Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-[#111827] border border-white/10 shadow-2xl shadow-black/80 p-6 sm:p-8 space-y-6">
        {/* Brand Header */}
        <div className="space-y-3 text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4F8CFF] to-[#A78BFA] p-0.5 mx-auto flex items-center justify-center shadow-lg shadow-[#4F8CFF]/20">
            <div className="w-full h-full bg-[#080B12] rounded-[10px] flex items-center justify-center">
              <span className="font-black text-lg text-[#4F8CFF]">SEतु</span>
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-extrabold text-white tracking-tight">SETU AI</h1>
            <p className="text-xs text-[#94A3B8]">
              From human signals to coordinated safe action.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-2.5 rounded-lg bg-[#FB7185]/15 border border-[#FB7185]/30 text-xs text-[#FB7185]">
              {errorMessage}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">Judge / Responder Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="judge.evaluator@google.com"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#172033] border border-white/10 text-xs text-white placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#4F8CFF]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">Passcode / PIN</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#172033] border border-white/10 text-xs text-white placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#4F8CFF]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-[#94A3B8] hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-[#4F8CFF] hover:bg-[#3B72E0] text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-[#4F8CFF]/20 flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In to Command Center'}
            {!loading && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-white/8 w-full" />
          <span className="bg-[#111827] px-2 text-[10px] font-mono text-[#94A3B8] uppercase absolute">
            Evaluation Gateway
          </span>
        </div>

        {/* One-Click Judge Demo Access Button */}
        <button
          type="button"
          onClick={handleJudgeAccess}
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-[#172033] hover:bg-[#1E293B] border border-[#4F8CFF]/30 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 group"
        >
          <Sparkles className="w-4 h-4 text-[#4F8CFF] group-hover:scale-110 transition-transform" />
          <span>Judge Demo Access (Instant)</span>
        </button>

        {/* Compact Feature Highlights */}
        <div className="pt-2 border-t border-white/8 space-y-2">
          {featurePillars.map((p) => (
            <div key={p.title} className="flex items-start gap-2 text-[11px] text-[#94A3B8]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399] mt-0.5 shrink-0" />
              <div>
                <strong className="text-white">{p.title}:</strong> {p.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
