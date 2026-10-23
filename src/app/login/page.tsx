'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import {
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Zap,
  Lock,
  Mail,
  Eye,
  EyeOff,
  HeartHandshake,
  CheckCircle2,
  Activity,
  Layers,
  Cpu,
  Shield,
  FileText,
  Mic,
  Camera,
} from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      login(email);
      router.push('/dashboard');
    }, 450);
  };

  const handleJudgeAccess = () => {
    setLoading(true);
    setTimeout(() => {
      login('hackathon.judge@google.com');
      router.push('/dashboard');
    }, 350);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 text-[#F8FAFC] font-sans overflow-hidden">
      {/* Main Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden border border-white/10 bg-[#08142A]/65 backdrop-blur-2xl shadow-2xl shadow-[#030712] transition-all duration-300 hover:border-white/20 hover:shadow-cyan-500/10">
        {/* Left Side: Brand Story, Workflow Diagram & Trust Badges */}
        <div className="p-8 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 bg-gradient-to-br from-[#112C45]/60 to-transparent space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#061826] border border-[#06B6D4]/40 flex items-center justify-center shadow-lg shadow-[#06B6D4]/10">
                <span className="font-black text-lg text-[#06B6D4]">SEतु</span>
              </div>
              <div>
                <h2 className="text-xl font-black text-white">SETU AI</h2>
                <span className="text-xs text-[#06B6D4] font-medium tracking-wide">
                  From human distress to coordinated action.
                </span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Turning chaotic human distress into coordinated, verified safe action.
            </h1>

            <p className="text-xs sm:text-sm text-[#94A3B8] mt-3 leading-relaxed">
              In real crises, people don't file structured incident tickets. They send panicked voice notes, shaky photos of flooded roads, or wave crumpled medical charts. 
              SETU AI acts as an emergency-grade bridge—extracting facts, explaining uncertainties, and deploying safe next steps.
            </p>

            {/* Workflow Diagram Panel: Voice + Photos + Documents → Gemini Intelligence → Verified Action */}
            <div className="mt-6 p-4 rounded-2xl bg-[#061826]/80 border border-white/10 space-y-2.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#06B6D4] font-bold block">
                The Universal Bridge Workflow:
              </span>
              <div className="flex items-center justify-between text-xs font-semibold text-white">
                <span className="flex items-center gap-1.5 text-slate-200">
                  <Mic className="w-3.5 h-3.5 text-[#06B6D4]" />
                  Voice / Photo / Docs
                </span>
                <span className="text-[#06B6D4]">→</span>
                <span className="flex items-center gap-1.5 text-purple-300">
                  <Sparkles className="w-3.5 h-3.5 text-[#6D28D9]" />
                  Gemini Intelligence
                </span>
                <span className="text-[#06B6D4]">→</span>
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Verified Action
                </span>
              </div>
            </div>
          </div>

          {/* 3 Signature Trust Badges: Privacy First, AI-Assisted, Human-Centered */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px] bg-white/5 px-2.5 py-1 rounded-xl border border-white/5">
              <Shield className="w-3.5 h-3.5 text-[#06B6D4]" />
              Privacy First
            </span>
            <span className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px] bg-white/5 px-2.5 py-1 rounded-xl border border-white/5">
              <Cpu className="w-3.5 h-3.5 text-[#6D28D9]" />
              AI-Assisted
            </span>
            <span className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px] bg-white/5 px-2.5 py-1 rounded-xl border border-white/5">
              <HeartHandshake className="w-3.5 h-3.5 text-[#FB7185]" />
              Human-Centered
            </span>
          </div>
        </div>

        {/* Right Side: Judge Access & Operator Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6D28D9]/20 border border-[#6D28D9]/40 text-purple-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" />
              Hackathon Evaluation Gateway
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Access SETU AI Command Center
            </h3>
            <p className="text-xs text-[#94A3B8] mt-1">
              Select one-click Judge Demo Access or log in with credentials.
            </p>
          </div>

          {/* Judge Demo Access Button */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#06B6D4]/15 via-[#6D28D9]/15 to-[#2563EB]/15 border border-[#06B6D4]/35 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#06B6D4] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 fill-current" />
                Hackathon Judge Pre-Authorization
              </span>
              <span className="text-[10px] font-mono text-[#06B6D4] bg-[#06B6D4]/15 px-2 py-0.5 rounded-full font-bold">
                Zero Setup
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Instant evaluation access preloaded with benchmark medical prescriptions, disaster triage, and system pulse telemetry.
            </p>
            <button
              type="button"
              onClick={handleJudgeAccess}
              disabled={loading}
              className="cursor-pointer w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#2563EB] via-[#6D28D9] to-[#06B6D4] hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#2563EB]/25 active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Judge Demo Access</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#0D2235] px-3 text-[11px] font-mono text-[#94A3B8] uppercase tracking-widest">
              or operator sign in
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#06B6D4]" />
                Official Email / Dispatch ID
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="evaluator@setu.ai"
                className="w-full bg-[#061826] border border-white/10 focus:border-[#06B6D4] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 transition-all font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#6D28D9]" />
                Security Access Token
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#061826] border border-white/10 focus:border-[#6D28D9] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 transition-all pr-10 font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/20 bg-[#061826] text-[#06B6D4] focus:ring-0"
                />
                <span>Remember me</span>
              </label>
              <Link href="/dashboard" className="text-[#06B6D4] hover:underline">
                Explore without login
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#2563EB] via-[#6D28D9] to-[#06B6D4] hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-lg shadow-[#2563EB]/25"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Enter SETU Command Center</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
