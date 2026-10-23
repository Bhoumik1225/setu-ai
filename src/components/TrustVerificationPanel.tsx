'use client';

import React from 'react';
import { VerificationProfile } from '@/types/bridge';
import { ShieldCheck, Lock, AlertCircle, CheckCircle, FileCheck, Eye, ShieldAlert, Award } from 'lucide-react';

interface TrustVerificationPanelProps {
  trustProfile?: VerificationProfile;
}

export const TrustVerificationPanel: React.FC<TrustVerificationPanelProps> = ({ trustProfile }) => {
  const profile: VerificationProfile = trustProfile || {
    sourceConfidence: 96,
    evidenceReceived: ['Human speech audio spectrogram', 'Prescription documentation badge', 'Local geo-spatial coordinates'],
    verifiedFacts: ['Active domestic medical emergency', 'Subject is responsive and seated', 'Fall prevention action required'],
    uncertainDetails: ['Exact systolic/diastolic blood pressure reading', 'Dosage history of expired prescriptions'],
    requiresHumanConfirmation: ['Physical physician review of medication contraindications', 'Allergy history corroboration'],
    privacyStatus: 'Protected under SETU Medical Privacy Protocol. Citizen identifiers sanitized and encrypted.',
    isCredible: true,
  };

  return (
    <div className="glass-panel p-6 sm:p-7 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#2563EB]/20 border border-[#2563EB]/40 text-[#2563EB]">
            <ShieldCheck className="w-5 h-5 text-[#06B6D4]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Trust & Verification Panel
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/30">
                Privacy Protected Badge
              </span>
            </h3>
            <p className="text-[11px] text-[#94A3B8]">
              Transparent algorithmic safety: what was verified vs what needs human validation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#06B6D4] bg-[#061826] px-3 py-1.5 rounded-xl border border-[#06B6D4]/30">
            {profile.sourceConfidence}% Data Confidence
          </span>
        </div>
      </div>

      {/* Grid of Trust Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Source Reliability & Evidence Received */}
        <div className="p-4 rounded-2xl bg-[#061826]/80 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-[#06B6D4]" />
              Evidence Ingested
            </span>
            <span className="text-[10px] font-mono text-[#06B6D4]">Source Reliable: High</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {profile.evidenceReceived.map((item, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg bg-[#0D2235] border border-white/10 text-[11px] text-slate-200"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Privacy Protected Badge */}
        <div className="p-4 rounded-2xl bg-[#061826]/80 border border-white/10 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#6D28D9]" />
            Privacy Protection Protocol
          </span>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            {profile.privacyStatus}
          </p>
        </div>

        {/* Verified Facts */}
        <div className="p-4 rounded-2xl bg-[#061826]/80 border border-white/10 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#06B6D4] flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            Verified Facts
          </span>
          <ul className="space-y-1 text-xs text-slate-300">
            {profile.verifiedFacts.map((fact, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-[#06B6D4]">✓</span>
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Human Verification Required */}
        <div className="p-4 rounded-2xl bg-[#061826]/80 border border-white/10 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#FBBF24] flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            Human Verification Required
          </span>
          <ul className="space-y-1 text-xs text-slate-300">
            {profile.requiresHumanConfirmation.map((item, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-[#FBBF24]">!</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
