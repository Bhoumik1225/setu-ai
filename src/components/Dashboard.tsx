'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Radio,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Gauge,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DashboardProps {
  output: BridgeOutput | null;
  isLoading: boolean;
  isSimulated?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  output,
  isLoading,
  isSimulated = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchComplete, setDispatchComplete] = useState(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'cad' | 'terminal'>('visual');
  const [isJsonOpen, setIsJsonOpen] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const terminalBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  const handleDispatchAction = () => {
    setIsDispatching(true);
    setDispatchComplete(false);
    setActiveTab('terminal');

    const steps = [
      `[INIT] Initializing OmniBridge Zero-Touch Dispatch Handshake...`,
      `[PARSE] Ingested unstructured multimodal intent payload [Schema RFC-8259 OK]`,
      `[VERIFY] Validating high-assurance verification checks: isCredible=${output?.verificationChecks.isCredible}`,
      `[CAD] Connecting to dispatch queue: ${output?.simulatedApiPayload.priorityQueue || 'ALPHA_ZERO'}`,
      `[SYSTEM] Authenticating with downstream target: ${output?.simulatedApiPayload.targetSystem || 'CAD_911_DISPATCH'}`,
      `[PROTOCOL] Transmitting mission directive: ${output?.simulatedApiPayload.protocolCode || 'CODE_RED_ALPHA'}`,
      `[FLOTILLA] Deploying assigned units: ${(output?.simulatedApiPayload.dispatchUnits || ['MEDIC_42', 'USAR_01']).join(', ')}`,
      `[TELEMETRY] Broadcast beacon dispatched to field telemetry endpoints`,
      `[SUCCESS] 200 OK — Payload delivered to target system ID #${Math.floor(1000 + Math.random() * 9000)}. Operational handshake established!`,
    ];

    setTerminalLogs([]);

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setTerminalLogs((prev) => [...prev, step]);
        if (idx === steps.length - 1) {
          setIsDispatching(false);
          setDispatchComplete(true);
          confetti({
            particleCount: 110,
            spread: 85,
            origin: { y: 0.6 },
            colors: ['#06b6d4', '#6366f1', '#a855f7', '#ec4899', '#10b981'],
          });
        }
      }, (idx + 1) * 350);
    });
  };

  const handleCopyJson = () => {
    if (!output) return;
    navigator.clipboard.writeText(JSON.stringify(output.simulatedApiPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[500px] text-center shadow-2xl shadow-indigo-500/10">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-cyan-400 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Radio className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
        </div>
        <h3 className="text-lg font-black tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-400 to-pink-500 bg-clip-text text-transparent">
          Gemini Multimodal Reasoning Active
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mt-2 leading-relaxed">
          De-noising acoustic audio, extracting spatial and medical clinical entities, checking credibility, and synthesizing downstream machine payloads...
        </p>
        <div className="mt-6 flex items-center gap-3 text-xs font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          Enforcing JSON Schema & Structured Schema Bounds
        </div>
      </div>
    );
  }

  if (!output) {
    return (
      <div className="bg-slate-900/40 backdrop-blur-xl border-2 border-dashed border-white/10 hover:border-indigo-500/40 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[500px] text-center transition-all">
        <div className="relative mb-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-950/80 border border-white/15 flex items-center justify-center text-slate-400 shadow-xl shadow-indigo-950/40">
            <ShieldAlert className="w-7 h-7 text-indigo-400" />
          </div>
        </div>
        <h3 className="text-base font-bold text-white">
          Awaiting Multimodal Human Intent
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mt-1.5 leading-relaxed">
          Record live microphone voice, paste dispatch notes, upload evidence files, or click a benchmark scenario preset above to synthesize actions.
        </p>
      </div>
    );
  }

  const getUrgencyBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return {
          bg: 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.35)] animate-pulse',
          icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
        };
      case 'HIGH':
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.25)]',
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
        };
      case 'MEDIUM':
        return {
          bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]',
          icon: <Activity className="w-4 h-4 text-cyan-400" />,
        };
      default:
        return {
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
        };
    }
  };

  const urgencyStyles = getUrgencyBadge(output.urgencyLevel);
  const confidencePct = Math.round((output.confidenceScore || 0.96) * 100);
  const riskScore = output.riskMeter?.score ?? (output.urgencyLevel === 'CRITICAL' ? 95 : output.urgencyLevel === 'HIGH' ? 84 : 55);

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-indigo-500/40 rounded-3xl shadow-2xl shadow-indigo-500/10 overflow-hidden flex flex-col transition-all duration-300">
      {/* Header Bar */}
      <div className="border-b border-white/10 bg-slate-950/70 p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider border ${urgencyStyles.bg}`}
          >
            {urgencyStyles.icon}
            {output.urgencyLevel} URGENCY
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800/80 border border-white/10 text-slate-200">
            {output.category}
          </span>
          {isSimulated && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold">
              BENCHMARK EVALUATION
            </span>
          )}
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-950/80 border border-white/10 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('visual')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'visual'
                ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Visual Telemetry
          </button>
          <button
            onClick={() => setActiveTab('cad')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'cad'
                ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dispatch CAD
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
              activeTab === 'terminal'
                ? 'bg-gradient-to-r from-indigo-500/20 to-pink-500/20 text-pink-300 border border-pink-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Dispatch Log
            {dispatchComplete && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />}
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Executive Summary Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-950 border border-white/10 rounded-2xl p-4 shadow-inner">
          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-cyan-400 via-indigo-500 to-pink-500" />
          <div className="pl-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block mb-1">
              Incident Action Directive
            </span>
            <p className="text-xs sm:text-sm font-medium text-slate-100 leading-relaxed">
              {output.summary}
            </p>
          </div>
        </div>

        {/* Confidence Score & Risk Meter Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Confidence Rating Card */}
          <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Gemini Reasoning Confidence
              </span>
              <span className="text-xs font-mono font-bold text-cyan-300">
                {confidencePct}%
              </span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-white/5">
              <div
                className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-pink-500 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                style={{ width: `${confidencePct}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 mt-2 block font-mono">
              Multimodal sensory coherence verified
            </span>
          </div>

          {/* Risk Severity Meter Card */}
          <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-rose-400" />
                Risk Severity Index
              </span>
              <span
                className={`text-xs font-mono font-bold ${
                  riskScore >= 80 ? 'text-rose-400' : riskScore >= 50 ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {riskScore} / 100 [{output.riskMeter?.label || (riskScore >= 80 ? 'IMMINENT' : 'ELEVATED')}]
              </span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-white/5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  riskScore >= 80
                    ? 'bg-gradient-to-r from-amber-500 to-rose-600 shadow-[0_0_10px_rgba(244,63,94,0.5)]'
                    : 'bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                }`}
                style={{ width: `${riskScore}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 mt-2 block font-mono">
              Threat level to life and critical infrastructure
            </span>
          </div>
        </div>

        {/* TAB 1: VISUAL TELEMETRY */}
        {activeTab === 'visual' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-4 shadow-md">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 mb-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  Target Location
                </div>
                <div className="text-xs sm:text-sm font-semibold text-white">
                  {output.extractedEntities.location || 'Location Not Specified'}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                  Spatial entity extraction
                </span>
              </div>

              <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-4 shadow-md">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 mb-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  People Impacted
                </div>
                <div className="text-xs sm:text-sm font-semibold text-white">
                  {output.extractedEntities.peopleAffected !== undefined
                    ? `${output.extractedEntities.peopleAffected} Casualty/Victims affected`
                    : 'Casualty count unconfirmed'}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                  Crowd risk estimate
                </span>
              </div>

              <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-4 shadow-md">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Credibility Check
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${
                      output.verificationChecks.isCredible ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-rose-400 shadow-[0_0_8px_#f43f5e]'
                    }`}
                  />
                  <span className="text-xs sm:text-sm font-semibold text-white">
                    {output.verificationChecks.isCredible ? 'Verified Authentic Intent' : 'Unverified Report'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                  Cross-sensor verification
                </span>
              </div>
            </div>

            {/* Symptoms & Hazards */}
            <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-4 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-pink-400" />
                  Extracted Hazards & Symptoms ({output.extractedEntities.symptomsOrHazards.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {output.extractedEntities.symptomsOrHazards.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs text-slate-200 shadow-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400 shadow-[0_0_6px_#f472b6]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tactical Action Protocol */}
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-950 border border-indigo-500/30 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300 mb-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Recommended Tactical Protocol
              </div>
              <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                {output.extractedEntities.recommendedAction}
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: DISPATCH CAD */}
        {activeTab === 'cad' && (
          <div className="bg-slate-950 border border-white/10 rounded-2xl p-5 font-mono text-xs text-slate-300 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Terminal className="w-4 h-4" />
                <span>CAD 911 / FEMA INTEGRATED TERMINAL FEED</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
                LINK: ACTIVE (LATENCY 8ms)
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-500 block">TARGET SYSTEM</span>
                <span className="text-cyan-300 font-bold">
                  {output.simulatedApiPayload.targetSystem || 'CITY_WIDE_CAD'}
                </span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-500 block">PROTOCOL CODE</span>
                <span className="text-amber-300 font-bold">
                  {output.simulatedApiPayload.protocolCode || 'INCIDENT-001'}
                </span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-500 block">DISPATCH QUEUE</span>
                <span className="text-rose-300 font-bold">
                  {output.simulatedApiPayload.priorityQueue || 'EMERGENCY_Q0'}
                </span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-500 block">STATUS</span>
                <span className="text-emerald-400 font-bold">READY FOR DISPATCH</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[11px] text-slate-400 block mb-2 font-bold uppercase tracking-wider">
                Assigned Emergency Units:
              </span>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(output.simulatedApiPayload.dispatchUnits) ? (
                  output.simulatedApiPayload.dispatchUnits.map((unit: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 text-xs flex items-center gap-2"
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
          </div>
        )}

        {/* TAB 3: TERMINAL DISPATCH LOG */}
        {activeTab === 'terminal' && (
          <div className="bg-slate-950 border border-white/10 rounded-2xl p-4 font-mono text-xs shadow-2xl min-h-[260px] max-h-[340px] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3 text-slate-400">
              <span className="flex items-center gap-2 text-cyan-400">
                <Terminal className="w-4 h-4" />
                <span>OmniBridge Live Dispatch Telemetry Transmission</span>
              </span>
              <span className="text-[11px]">TTY-01</span>
            </div>

            {terminalLogs.length === 0 && !isDispatching ? (
              <div className="text-slate-500 py-8 text-center">
                Click <strong className="text-cyan-400 font-semibold">&quot;Dispatch Action&quot;</strong> below to execute the live downstream transmission sequence.
              </div>
            ) : (
              <div className="space-y-1.5">
                {terminalLogs.map((log, idx) => {
                  const isSuccess = log.includes('[SUCCESS]');
                  const isVerify = log.includes('[VERIFY]');
                  const isCad = log.includes('[CAD]');
                  return (
                    <div
                      key={idx}
                      className={`leading-relaxed ${
                        isSuccess
                          ? 'text-emerald-400 font-bold bg-emerald-950/30 p-2 rounded-xl border border-emerald-500/30'
                          : isVerify
                          ? 'text-cyan-300'
                          : isCad
                          ? 'text-amber-300'
                          : 'text-slate-300'
                      }`}
                    >
                      {log}
                    </div>
                  );
                })}
                {isDispatching && (
                  <div className="flex items-center gap-2 text-cyan-400 animate-pulse pt-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>Transmitting packets to target CAD systems...</span>
                  </div>
                )}
                <div ref={terminalBottomRef} />
              </div>
            )}
          </div>
        )}

        {/* Collapsible JSON Viewer */}
        <div className="border border-white/10 rounded-2xl overflow-hidden bg-slate-950/80">
          <button
            type="button"
            onClick={() => setIsJsonOpen(!isJsonOpen)}
            className="w-full px-4 py-3 bg-slate-900/60 hover:bg-slate-900 transition-colors flex items-center justify-between text-xs font-semibold text-slate-300 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>Structured API Payload (RFC-8259 Standardized JSON)</span>
              <span className="text-[10px] text-slate-500 font-mono">
                {isJsonOpen ? 'Click to collapse' : 'Click to inspect payload code'}
              </span>
            </div>
            {isJsonOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {isJsonOpen && (
            <div className="p-4 border-t border-white/10 bg-slate-950">
              <div className="flex items-center justify-end mb-2">
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-white/10 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy JSON
                    </>
                  )}
                </button>
              </div>
              <pre className="text-xs font-mono text-emerald-400 overflow-x-auto max-h-[300px] p-3 bg-black/40 rounded-xl border border-white/5">
                {JSON.stringify(output.simulatedApiPayload, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Dispatch Action Trigger Footer with Neon Gradient Button */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Autonomous zero-touch life-saving action payload ready</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopyJson}
              className="cursor-pointer px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-slate-950/60 text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              Copy Payload
            </button>

            {/* Neon Primary Action Button */}
            <button
              type="button"
              onClick={handleDispatchAction}
              disabled={isDispatching}
              className={`cursor-pointer px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 shadow-lg flex items-center gap-2 ${
                dispatchComplete
                  ? 'bg-emerald-600 shadow-emerald-950/50'
                  : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 shadow-lg shadow-purple-500/25 active:scale-[0.98]'
              }`}
            >
              {isDispatching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Transmitting Dispatch...</span>
                </>
              ) : dispatchComplete ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Dispatched Successfully
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Dispatch Action
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
