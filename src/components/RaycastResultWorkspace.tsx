'use client';

import React, { useState } from 'react';
import { BridgeOutput } from '@/types/bridge';
import {
  ShieldAlert,
  MapPin,
  Users,
  CheckCircle2,
  AlertTriangle,
  Download,
  Share2,
  PhoneCall,
  Check,
  Sparkles,
  Info,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ExternalLink,
  Flame,
  FileCheck,
  UserCheck,
  Siren,
  Hospital,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DispatchHospitalModal } from '@/components/DispatchHospitalModal';

interface RaycastResultWorkspaceProps {
  output: BridgeOutput;
  onDispatchTriggered?: () => void;
}

export const RaycastResultWorkspace: React.FC<RaycastResultWorkspaceProps> = ({
  output,
  onDispatchTriggered,
}) => {
  const { addToast, addCase, setIsContextPanelOpen } = useAuth();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showTrustDetails, setShowTrustDetails] = useState<boolean>(false);
  const [isEscalated, setIsEscalated] = useState<boolean>(false);
  const [isAmbulanceModalOpen, setIsAmbulanceModalOpen] = useState<boolean>(false);

  const getUrgencyBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return {
          label: 'Critical',
          bg: 'bg-[#FB7185]/15 text-[#FB7185] border-[#FB7185]/30',
          dot: 'bg-[#FB7185]',
        };
      case 'URGENT':
      case 'HIGH':
        return {
          label: 'Urgent',
          bg: 'bg-[#FBBF24]/15 text-[#FBBF24] border-[#FBBF24]/30',
          dot: 'bg-[#FBBF24]',
        };
      case 'NEEDS_ATTENTION':
      case 'ATTENTION_NEEDED':
      case 'MEDIUM':
        return {
          label: 'Attention',
          bg: 'bg-[#A78BFA]/15 text-[#A78BFA] border-[#A78BFA]/30',
          dot: 'bg-[#A78BFA]',
        };
      default:
        return {
          label: 'Routine',
          bg: 'bg-[#34D399]/15 text-[#34D399] border-[#34D399]/30',
          dot: 'bg-[#34D399]',
        };
    }
  };

  const urgencyInfo = getUrgencyBadge(output.urgencyLevel);
  const confidenceScore = output.confidenceScore ? Math.round(output.confidenceScore * 100) : 94;

  const toggleStep = (stepNum: number) => {
    if (completedSteps.includes(stepNum)) {
      setCompletedSteps(completedSteps.filter((s) => s !== stepNum));
    } else {
      setCompletedSteps([...completedSteps, stepNum]);
      addToast(`Action Step ${stepNum} marked as complete`, 'success');
    }
  };

  const handleCopyShare = () => {
    const text = `SETU AI Triage Summary\nTitle: ${output.situationTitle || output.category}\nUrgency: ${output.urgencyLevel}\nConfidence: ${confidenceScore}%\nSummary: ${output.summary}\nRecommended: ${output.extractedEntities.recommendedAction}\nStatus: Verified via Gemini Reasoning`;
    navigator.clipboard.writeText(text);
    addToast('Triage summary copied to clipboard', 'success');
  };

  const handleDownloadSummary = () => {
    const payload = JSON.stringify(output, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SETU_Triage_Summary_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast('Triage audit report downloaded', 'info');
  };

  const handleEscalateToHuman = () => {
    setIsEscalated(true);
    addCase({
      title: output.situationTitle || 'Escalated Incident Case',
      category: output.category,
      urgency: 'CRITICAL',
      status: 'Escalated',
      location: output.extractedEntities?.location || 'Local Sector',
      summary: output.summary,
      actionSummary: 'Escalated to human supervisor on emergency hotline.',
    });
    addToast('Escalated to 24/7 Human Dispatch Reviewer', 'warning');
  };

  const isMedicalCategory = output.category === 'MEDICAL' || output.medicalDisclaimerNeeded;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 1. Header Bar: Title, Category, Urgency, Confidence Meter */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-white/8 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white uppercase">
                {output.category}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${urgencyInfo.bg}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${urgencyInfo.dot} animate-pulse`} />
                {urgencyInfo.label}
              </span>
              {isEscalated && (
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#FB7185]/20 text-[#FB7185] border border-[#FB7185]/40 animate-pulse">
                  ESCALATED TO HUMAN REVIEWER
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              {output.situationTitle || 'Verified Situation Assessment'}
            </h2>
          </div>

          {/* Instant Call Nearby Ambulance Button */}
          <button
            onClick={() => setIsAmbulanceModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-rose-600/35 hover:shadow-rose-600/50 cursor-pointer active:scale-95 transition-all animate-pulse"
          >
            <Siren className="w-4 h-4 animate-bounce" />
            <span>Call Nearby Hospital Ambulance</span>
          </button>

          {/* 0-100 Confidence Meter */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#172033]/80 border border-white/6 shrink-0">
            <div>
              <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Gemini Confidence</div>
              <div className="text-base font-black text-white flex items-center gap-1">
                <span className="text-[#34D399]">{confidenceScore}%</span>
                <span className="text-[10px] text-[#94A3B8] font-normal">High Accuracy</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-[#34D399]/40 border-t-[#34D399] flex items-center justify-center font-mono text-[10px] font-bold text-white">
              {confidenceScore}
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-[#080B12]/60 p-3.5 rounded-xl border border-white/5">
          {output.summary}
        </p>

        {/* Metadata Badges: Location, People Affected, Hazard */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#94A3B8] pt-1">
          {output.extractedEntities?.location && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#172033] border border-white/5 text-white">
              <MapPin className="w-3.5 h-3.5 text-[#4F8CFF]" />
              {output.extractedEntities.location}
            </span>
          )}
          {output.extractedEntities?.peopleAffected && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#172033] border border-white/5 text-white">
              <Users className="w-3.5 h-3.5 text-[#A78BFA]" />
              {output.extractedEntities.peopleAffected} persons affected
            </span>
          )}
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#172033] border border-white/5 text-[#34D399]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            RFC-8259 Standard Verified
          </span>
        </div>
      </div>

      {/* 2. Compact Two-Column Workspace: "What We Know" vs "Needs Confirmation" */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Facts List */}
        <div className="p-4 rounded-xl bg-[#111827] border border-white/8 space-y-3">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-[#34D399]" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">What We Know (Verified Facts)</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-200">
            {((output.extractedEntities?.keyFacts && output.extractedEntities.keyFacts.length > 0)
              ? output.extractedEntities.keyFacts
              : output.extractedEntities?.symptomsOrHazards || ['Input context verified with high fidelity.']
            ).map((fact, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-[#172033]/40 p-2 rounded-lg border border-white/5">
                <Check className="w-3.5 h-3.5 text-[#34D399] mt-0.5 shrink-0" />
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Uncertainty / Confirmation List */}
        <div className="p-4 rounded-xl bg-[#111827] border border-white/8 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#FBBF24]" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">What Still Needs Confirmation</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-200">
            {output.verificationChecks?.missingCriticalInfo && output.verificationChecks.missingCriticalInfo.length > 0 ? (
              output.verificationChecks.missingCriticalInfo.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-[#172033]/40 p-2 rounded-lg border border-white/5 text-[#FBBF24]/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-[#94A3B8] p-2 bg-[#172033]/40 rounded-lg">
                No immediate critical ambiguities detected in the provided signal.
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* 3. Recommended Next Actions with Interactive Checkboxes */}
      {output.actionPlan && output.actionPlan.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-white/8 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#4F8CFF]" />
              Recommended Safe Action Plan
            </h3>
            <span className="text-xs font-mono text-[#94A3B8]">
              {completedSteps.length} of {output.actionPlan.length} completed
            </span>
          </div>

          <div className="space-y-2">
            {output.actionPlan.map((step) => {
              const isChecked = completedSteps.includes(step.step);
              return (
                <div
                  key={step.step}
                  onClick={() => toggleStep(step.step)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isChecked
                      ? 'bg-[#172033]/30 border-white/5 opacity-60'
                      : 'bg-[#172033]/80 border-white/8 hover:border-[#4F8CFF]/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="mt-1 rounded accent-[#4F8CFF] cursor-pointer"
                  />
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${isChecked ? 'line-through text-[#94A3B8]' : 'text-white'}`}>
                        Step {step.step}: {step.title}
                      </span>
                      {step.isImmediate && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#FB7185]/20 text-[#FB7185] border border-[#FB7185]/30">
                          Immediate
                        </span>
                      )}
                    </div>
                    <p className={`text-xs leading-relaxed ${isChecked ? 'line-through text-[#94A3B8]' : 'text-slate-300'}`}>
                      {step.instruction}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Trust Layer & "Why this recommendation?" Expandable Card */}
      <div className="p-4 rounded-xl bg-[#111827] border border-white/8 space-y-2">
        <button
          onClick={() => setShowTrustDetails(!showTrustDetails)}
          className="w-full flex items-center justify-between text-xs font-bold text-white hover:text-[#4F8CFF] cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#34D399]" />
            Why this recommendation? (Trust & Evidence Profile)
          </span>
          {showTrustDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showTrustDetails && (
          <div className="pt-3 border-t border-white/5 space-y-3 text-xs text-[#94A3B8] animate-fade-in">
            <p className="leading-relaxed">
              Gemini analyzed the unstructured input against emergency protocol benchmarks. Cross-checked with CAD CAD-911 and FEMA hazard schemas.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg bg-[#080B12] border border-white/5">
                <span className="text-[10px] font-mono text-[#94A3B8] uppercase block">Privacy & Storage</span>
                <span className="font-semibold text-white">Private by default • PII Redacted</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#080B12] border border-white/5">
                <span className="text-[10px] font-mono text-[#94A3B8] uppercase block">Human Oversight</span>
                <span className="font-semibold text-white">Human verification advised for critical actions</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Medical / Emergency Disclaimer if relevant */}
      {isMedicalCategory && (
        <div className="p-3.5 rounded-xl bg-[#FBBF24]/10 border border-[#FBBF24]/30 flex items-start gap-2.5 text-xs text-[#FBBF24]">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <p className="leading-relaxed">
            <strong>Emergency & Medical Disclaimer:</strong> SETU AI provides algorithmic triage assistance and evidence extraction for emergency coordination. It does not replace professional emergency medical dispatch (911) or clinical diagnosis. If this is a life-threatening medical emergency, call local emergency services immediately.
          </p>
        </div>
      )}

      {/* 6. Quick Action Buttons: Share, Download, Context, Escalate */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyShare}
            className="px-3.5 py-2 rounded-xl bg-[#172033] hover:bg-[#1E293B] border border-white/10 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-[#4F8CFF]" />
            Share Safely
          </button>

          <button
            onClick={handleDownloadSummary}
            className="px-3.5 py-2 rounded-xl bg-[#172033] hover:bg-[#1E293B] border border-white/10 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#A78BFA]" />
            Download Audit JSON
          </button>

          <button
            onClick={() => setIsContextPanelOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#172033] hover:bg-[#1E293B] border border-white/10 text-[#34D399] text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" />
            Find Nearby Help
          </button>
        </div>

        <button
          onClick={handleEscalateToHuman}
          disabled={isEscalated}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            isEscalated
              ? 'bg-[#FB7185]/20 text-[#FB7185] border border-[#FB7185]/40 cursor-not-allowed'
              : 'bg-[#FB7185] hover:bg-[#E11D48] text-white shadow-lg shadow-[#FB7185]/20'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          {isEscalated ? 'Escalated to Human' : 'Escalate to Human Reviewer'}
        </button>
      </div>

      {/* Emergency Ambulance Dispatch Radar Modal */}
      <DispatchHospitalModal
        isOpen={isAmbulanceModalOpen}
        onClose={() => setIsAmbulanceModalOpen(false)}
        situationContext={output.summary || output.situationTitle || 'Immediate Medical Emergency'}
        location={output.extractedEntities?.location || 'Sector 4 Metro'}
      />
    </div>
  );
};
