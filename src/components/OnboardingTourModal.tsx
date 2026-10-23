'use client';

import React from 'react';
import { Sparkles, HelpCircle, ArrowRight, ShieldCheck, Check } from 'lucide-react';

interface OnboardingTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingTourModal: React.FC<OnboardingTourModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0D1B2A] border border-white/15 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#22D3C5]/20 border border-[#22D3C5]/40 flex items-center justify-center text-[#22D3C5] font-black text-xs">
              SEतु
            </div>
            <div>
              <h3 className="text-base font-bold text-white">How SETU AI Works</h3>
              <p className="text-xs text-[#94A3B8]">From chaotic inputs to verified safe actions</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#10263B] border border-white/5">
            <span className="w-6 h-6 rounded-full bg-[#22D3C5]/20 text-[#22D3C5] font-bold flex items-center justify-center shrink-0">1</span>
            <div>
              <h4 className="font-bold text-white">Submit in Your Own Words</h4>
              <p className="text-[#94A3B8] mt-0.5">Use voice notes, photos, or prescriptions. You do not need to know technical emergency codes.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#10263B] border border-white/5">
            <span className="w-6 h-6 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] font-bold flex items-center justify-center shrink-0">2</span>
            <div>
              <h4 className="font-bold text-white">Multimodal Gemini Reasoning</h4>
              <p className="text-[#94A3B8] mt-0.5">Gemini 2.5 extracts facts, assesses immediate urgency, and highlights missing information.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#10263B] border border-white/5">
            <span className="w-6 h-6 rounded-full bg-[#FBBF24]/20 text-[#FBBF24] font-bold flex items-center justify-center shrink-0">3</span>
            <div>
              <h4 className="font-bold text-white">Trust & Verification Transparency</h4>
              <p className="text-[#94A3B8] mt-0.5">Explicitly informs you what is verified vs what needs human clinician or dispatcher confirmation.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#10263B] border border-white/5">
            <span className="w-6 h-6 rounded-full bg-[#22D3C5]/20 text-[#22D3C5] font-bold flex items-center justify-center shrink-0">4</span>
            <div>
              <h4 className="font-bold text-white">Clear Numbered Action Plan</h4>
              <p className="text-[#94A3B8] mt-0.5">Immediate stabilization instructions, local hospital contacts, and safe one-click sharing.</p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end">
          <button
            onClick={onClose}
            className="cursor-pointer px-6 py-2.5 rounded-xl text-xs font-bold text-[#07111F] bg-[#22D3C5] hover:bg-[#1bb8ab] transition-all"
          >
            Got it, Let&apos;s Explore
          </button>
        </div>
      </div>
    </div>
  );
};
