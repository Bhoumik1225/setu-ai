'use client';

import React, { useState } from 'react';
import { BridgeOutput } from '@/types/bridge';
import {
  ShieldAlert,
  MapPin,
  Users,
  CheckCircle2,
  AlertTriangle,
  Send,
  Copy,
  Check,
  Code2,
  Terminal,
  Activity,
  HeartPulse,
  Truck,
  Flame,
  Radio,
  Clock,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StructuredActionDashboardProps {
  output: BridgeOutput | null;
  isLoading: boolean;
  isSimulated?: boolean;
}

export const StructuredActionDashboard: React.FC<StructuredActionDashboardProps> = ({
  output,
  isLoading,
  isSimulated = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [dispatched, setDispatched] = useState(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'json' | 'cad'>('visual');

  if (isLoading) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[460px] text-center shadow-2xl">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Radio className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-slate-100 tracking-tight">
          Gemini Multimodal Reasoning Active
        </h3>
        <p className="text-sm text-slate-400 max-w-md mt-2">
          De-noising acoustic spectrogram, extracting clinical and spatial entities, cross-verifying hazards, and synthesizing downstream dispatch payloads...
        </p>
        <div className="mt-6 flex items-center gap-3 text-xs font-mono text-cyan-400/80 bg-cyan-950/40 border border-cyan-500/20 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          Enforcing JSON Schema & Structured Schema Bounds
        </div>
      </div>
    );
  }

  if (!output) {
    return (
      <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[460px] text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-400 mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-200">
          Awaiting Multimodal Human Intent
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          Record voice, paste transcripts, upload disaster footage, or select a hackathon preset above to generate structured life-saving actions.
        </p>
      </div>
    );
  }

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(output.simulatedApiPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateDispatch = () => {
    setDispatched(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#10b981', '#f59e0b', '#ec4899'],
    });
    setTimeout(() => setDispatched(false), 5000);
  };

  const getUrgencyBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return {
          bg: 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-rose-950/50 shadow-lg',
          icon: <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />,
          bar: 'bg-rose-500',
        };
      case 'HIGH':
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
          bar: 'bg-amber-500',
        };
      case 'MEDIUM':
        return {
          bg: 'bg-sky-500/20 text-sky-300 border-sky-500/50',
          icon: <Activity className="w-4 h-4 text-sky-400" />,
          bar: 'bg-sky-500',
        };
      default:
        return {
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
          bar: 'bg-emerald-500',
        };
    }
  };

  const urgencyStyles = getUrgencyBadge(output.urgencyLevel);

  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
      {/* Header Bar */}
      <div className="border-b border-slate-800 bg-slate-950/60 p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider border ${urgencyStyles.bg}`}
            >
              {urgencyStyles.icon}
              {output.urgencyLevel} URGENCY
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
              {output.category}
            </span>
            {isSimulated && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
                BENCHMARK SIMULATION
              </span>
            )}
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('visual')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'visual'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Visual Telemetry
          </button>
          <button
            onClick={() => setActiveTab('cad')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'cad'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dispatch CAD
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
              activeTab === 'json'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            JSON Payload
          </button>
        </div>
      </div>

      {/* Main Body Content */}
      <div className="p-6 space-y-6">
        {/* Executive Summary Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-xl p-4 shadow-inner">
          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-cyan-400 to-blue-600" />
          <div className="pl-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block mb-1">
              Mission Summary & Action Directive
            </span>
            <p className="text-sm font-medium text-slate-100 leading-relaxed">
              {output.summary}
            </p>
          </div>
        </div>

        {/* TAB 1: VISUAL TELEMETRY */}
        {activeTab === 'visual' && (
          <div className="space-y-6">
            {/* Extracted Entities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Location Card */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 mb-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  Identified Location
                </div>
                <div className="text-sm font-semibold text-slate-200">
                  {output.extractedEntities.location || 'Location Not Explicitly Stated'}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Extracted via spatial context recognition
                </span>
              </div>

              {/* People Affected Card */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 mb-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  Estimated Impact
                </div>
                <div className="text-sm font-semibold text-slate-200">
                  {output.extractedEntities.peopleAffected !== undefined
                    ? `${output.extractedEntities.peopleAffected} Individual(s) directly affected`
                    : 'Casualty count unconfirmed'}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Derived from sensor / transcript crowd estimate
                </span>
              </div>

              {/* Verification & Credibility Card */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Credibility Assessment
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${
                      output.verificationChecks.isCredible ? 'bg-emerald-400' : 'bg-rose-400'
                    }`}
                  />
                  <span className="text-sm font-semibold text-slate-200">
                    {output.verificationChecks.isCredible ? 'Verified Authentic Intent' : 'Unverified / Disputed'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Cross-referenced sensory indicators
                </span>
              </div>
            </div>

            {/* Symptoms or Hazards List */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-rose-400" />
                  Detected Symptoms, Hazards & Clinical Flags
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {output.extractedEntities.symptomsOrHazards.length} item(s) detected
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {output.extractedEntities.symptomsOrHazards.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-200 shadow-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tactical Recommended Action */}
            <div className="bg-gradient-to-r from-cyan-950/30 to-blue-950/20 border border-cyan-500/30 rounded-xl p-5 shadow-lg">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300 mb-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Operational Tactical Protocol
              </div>
              <p className="text-sm font-semibold text-slate-100 leading-relaxed">
                {output.extractedEntities.recommendedAction}
              </p>
            </div>

            {/* Verification Checks & Missing Info */}
            {output.verificationChecks.missingCriticalInfo?.length > 0 && (
              <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-300 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Missing Critical Information (Operator Check)
                </div>
                <ul className="space-y-1.5">
                  {output.verificationChecks.missingCriticalInfo.map((gap, idx) => (
                    <li key={idx} className="text-xs text-amber-200/90 flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DISPATCH CAD (Computer Aided Dispatch Simulation) */}
        {activeTab === 'cad' && (
          <div className="space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 font-mono text-xs text-slate-300 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <Terminal className="w-4 h-4" />
                  <span>CAD 911 / FEMA INTEGRATED TERMINAL FEED</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  LINK: ACTIVE (LATENCY 12ms)
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">SYSTEM ROUTING</span>
                  <span className="text-cyan-300 font-bold">
                    {output.simulatedApiPayload.targetSystem || 'CITY_WIDE_CAD'}
                  </span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">PROTOCOL CODE</span>
                  <span className="text-amber-300 font-bold">
                    {output.simulatedApiPayload.protocolCode || 'INCIDENT-001'}
                  </span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">DISPATCH QUEUE</span>
                  <span className="text-rose-300 font-bold">
                    {output.simulatedApiPayload.priorityQueue || 'EMERGENCY_Q0'}
                  </span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">TIMESTAMP</span>
                  <span className="text-slate-300">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Units En Route */}
              <div className="pt-2">
                <span className="text-[11px] text-slate-400 block mb-2 font-bold uppercase tracking-wider">
                  Assigned Response Flotilla / Assets:
                </span>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(output.simulatedApiPayload.dispatchUnits) ? (
                    output.simulatedApiPayload.dispatchUnits.map((unit: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 text-xs flex items-center gap-2"
                      >
                        <Truck className="w-3.5 h-3.5 text-cyan-400" />
                        {unit}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500">Autonomous patrol assigned</span>
                  )}
                </div>
              </div>

              {/* Automated Voice / Siren Warning */}
              {output.simulatedApiPayload.automatedVoiceNotification ||
                output.simulatedApiPayload.automatedTrafficAdvisory ||
                output.simulatedApiPayload.automatedCivilianAlert ? (
                <div className="bg-slate-900/90 border border-cyan-500/20 rounded-lg p-3 text-cyan-300">
                  <span className="text-[10px] text-slate-400 block mb-1 font-bold">
                    AUTOMATED BROADCAST SYNTHESIS:
                  </span>
                  <p className="text-xs italic">
                    "{output.simulatedApiPayload.automatedVoiceNotification ||
                      output.simulatedApiPayload.automatedTrafficAdvisory ||
                      JSON.stringify(output.simulatedApiPayload.automatedCivilianAlert)}"
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* TAB 3: RAW JSON API PAYLOAD */}
        {activeTab === 'json' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">
                Downstream Webhook Target Payload (RFC-8259 Standard)
              </span>
              <button
                type="button"
                onClick={handleCopyJson}
                className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copied JSON
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Payload
                  </>
                )}
              </button>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto max-h-[380px] text-xs font-mono text-emerald-400">
              <pre>{JSON.stringify(output.simulatedApiPayload, null, 2)}</pre>
            </div>
          </div>
        )}

        {/* Downstream Dispatch Action Bar */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Ready for autonomous zero-touch API dispatch</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopyJson}
              className="cursor-pointer px-4 py-2.5 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-800/80 text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              Copy API Payload
            </button>

            <button
              type="button"
              onClick={handleSimulateDispatch}
              disabled={dispatched}
              className={`cursor-pointer px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all shadow-lg flex items-center gap-2 ${
                dispatched
                  ? 'bg-emerald-600 shadow-emerald-950/50'
                  : 'bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 active:scale-[0.98] shadow-emerald-950/40'
              }`}
            >
              {dispatched ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Dispatched to CAD 911 & Field Units
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Trigger Emergency Dispatch Webhook
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
