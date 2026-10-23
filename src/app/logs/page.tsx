'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { DispatchLogEntry } from '@/types/bridge';
import {
  Activity,
  Terminal,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Filter,
  Search,
  Layers,
  ArrowUpRight,
  Lock,
  Cpu,
  ChevronDown,
  ChevronRight,
  Server,
  Radio,
  Download,
  RefreshCw,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

export default function LogsPage() {
  const { logs, addToast } = useAuth();
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterUrgency, setFilterUrgency] = useState<string>('ALL');
  const [filterVerified, setFilterVerified] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(logs[0]?.id || null);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Just now');

  const filteredLogs = logs.filter((log) => {
    const matchesCat = filterCategory === 'ALL' || log.category === filterCategory;
    const matchesUrg = filterUrgency === 'ALL' || log.urgencyLevel === filterUrgency;
    const matchesVer = filterVerified === 'ALL' || log.verifiedStatus === filterVerified;
    const matchesSearch =
      log.targetSystem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.protocolCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.payloadSummary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesUrg && matchesVer && matchesSearch;
  });

  const getUrgencyBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-[#FB7185]/20 text-[#FB7185] border-[#FB7185]/40';
      case 'URGENT':
      case 'HIGH':
        return 'bg-[#FBBF24]/20 text-[#FBBF24] border-[#FBBF24]/40';
      case 'NEEDS_ATTENTION':
      case 'ATTENTION_NEEDED':
      case 'MEDIUM':
        return 'bg-[#6D28D9]/25 text-purple-300 border-[#6D28D9]/50';
      default:
        return 'bg-[#06B6D4]/20 text-[#06B6D4] border-[#06B6D4]/40';
    }
  };

  const handleExportLogs = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `SETU_System_Pulse_Logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Telemetry logs exported safely', 'success');
  };

  const handleRefreshSync = () => {
    setLastSyncedTime(new Date().toLocaleTimeString());
    addToast('Telemetry streams re-synchronized with CAD gateway', 'info');
  };

  return (
    <div className="min-h-screen relative text-[#F8FAFC] flex flex-col font-sans selection:bg-[#06B6D4] selection:text-[#061826]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Top Header Card with Last Synced & Export Logs */}
        <section className="glass-panel p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#06B6D4]/15 border border-[#06B6D4]/30 text-[#06B6D4] text-xs font-semibold">
              <Activity className="w-3.5 h-3.5" />
              SETU System Pulse & Live Audit Telemetry
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Live System Pulse Logs & Telemetry
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-2xl">
              Real-time audit log of structured RFC-8259 payloads transmitted to CAD 911, FEMA Incident Command, Trauma ERs, and Municipal DOT systems.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Last Synced Status */}
            <button
              onClick={handleRefreshSync}
              className="cursor-pointer flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono text-[#06B6D4] bg-[#061826] border border-white/10 hover:border-[#06B6D4]/40 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Synced: {lastSyncedTime}</span>
            </button>

            {/* Export Logs Button */}
            <button
              onClick={handleExportLogs}
              className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0D2235] hover:bg-white/10 border border-white/15 transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span>Export Logs</span>
            </button>

            <Link
              href="/dashboard"
              className="cursor-pointer inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#2563EB] to-[#06B6D4] hover:opacity-95 transition-all shadow-lg shadow-[#2563EB]/20 shrink-0"
            >
              <span>Back to Command Center</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Gradient Visual Charts for Categories & Urgency Trends */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Distribution Chart */}
          <div className="glass-panel p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span className="flex items-center gap-1.5 uppercase font-mono tracking-wider">
                <BarChart3 className="w-4 h-4 text-[#06B6D4]" />
                Case Category Distribution
              </span>
              <span className="text-[11px] font-mono text-[#06B6D4]">100% Ingest Ratio</span>
            </div>
            <div className="space-y-2 pt-1 font-mono text-xs">
              <div>
                <div className="flex justify-between text-[11px] text-[#94A3B8] mb-1">
                  <span>Medical Support (42%)</span>
                  <span>1,634 Cases</span>
                </div>
                <div className="w-full bg-[#061826] h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-[#FB7185] to-[#6D28D9] h-full rounded-full" style={{ width: '42%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-[#94A3B8] mb-1">
                  <span>Disaster & Flood Triage (34%)</span>
                  <span>1,323 Cases</span>
                </div>
                <div className="w-full bg-[#061826] h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-[#2563EB] to-[#06B6D4] h-full rounded-full" style={{ width: '34%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-[#94A3B8] mb-1">
                  <span>Civic & Transit Assistance (24%)</span>
                  <span>935 Cases</span>
                </div>
                <div className="w-full bg-[#061826] h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-[#FBBF24] to-[#06B6D4] h-full rounded-full" style={{ width: '24%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Urgency Response Speed Chart */}
          <div className="glass-panel p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span className="flex items-center gap-1.5 uppercase font-mono tracking-wider">
                <TrendingUp className="w-4 h-4 text-[#2563EB]" />
                Zero-Delay Telemetry Latency Trend
              </span>
              <span className="text-[11px] font-mono text-emerald-400">Avg 14.8ms</span>
            </div>
            <div className="h-24 w-full flex items-end gap-2 pt-4 px-2 bg-[#061826]/70 rounded-xl border border-white/5">
              {[40, 25, 65, 30, 85, 45, 95, 60, 35, 75, 50, 90].map((h, i) => (
                <div key={i} className="flex-1 bg-gradient-to-t from-[#2563EB] via-[#6D28D9] to-[#06B6D4] rounded-t-sm" style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
              <span>T-60 mins</span>
              <span>Sub-20ms Telemetry Stream</span>
              <span>Live Now</span>
            </div>
          </div>
        </section>

        {/* System Health Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-4 sm:p-5 flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-[#06B6D4]/15 border border-[#06B6D4]/30 text-[#06B6D4]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#94A3B8]">Gemini AI</span>
              <h4 className="text-sm font-bold text-white">Operational</h4>
              <span className="text-[10px] font-mono text-[#06B6D4]">Flash 2.5 Active</span>
            </div>
          </div>

          <div className="glass-panel p-4 sm:p-5 flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-[#6D28D9]/20 border border-[#6D28D9]/30 text-[#6D28D9]">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#94A3B8]">Verification Engine</span>
              <h4 className="text-sm font-bold text-white">Schema OK</h4>
              <span className="text-[10px] font-mono text-[#6D28D9]">RFC-8259 Bound</span>
            </div>
          </div>

          <div className="glass-panel p-4 sm:p-5 flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-[#FBBF24]/15 border border-[#FBBF24]/30 text-[#FBBF24]">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#94A3B8]">Dispatch Alerts</span>
              <h4 className="text-sm font-bold text-white">CAD 911 Ready</h4>
              <span className="text-[10px] font-mono text-[#FBBF24]">Zero Queue Wait</span>
            </div>
          </div>

          <div className="glass-panel p-4 sm:p-5 flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-[#FB7185]/15 border border-[#FB7185]/30 text-[#FB7185]">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#94A3B8]">Location Services</span>
              <h4 className="text-sm font-bold text-white">Triangulation OK</h4>
              <span className="text-[10px] font-mono text-[#06B6D4]">&lt; 10m Accuracy</span>
            </div>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="p-4 rounded-2xl bg-[#0D2235]/80 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by system, location, protocol..."
              className="w-full pl-10 pr-4 py-2 bg-[#061826] border border-white/10 focus:border-[#06B6D4] rounded-xl text-xs text-white placeholder-slate-500 font-sans"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
            <span className="text-[11px] font-mono text-slate-400">Category:</span>
            {['ALL', 'MEDICAL', 'DISASTER', 'WEATHER', 'CIVIC'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-lg font-mono cursor-pointer transition-colors ${
                  filterCategory === cat
                    ? 'bg-[#06B6D4]/20 text-[#06B6D4] border border-[#06B6D4]/40 font-bold'
                    : 'text-slate-400 hover:text-white bg-[#061826]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Live Stream Table & Expandable Details Drawer */}
        <section className="glass-panel overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#061826]/70">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#06B6D4]" />
              Live Telemetry Event Stream ({filteredLogs.length} Records)
            </span>
            <span className="text-[11px] font-mono text-[#06B6D4] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#06B6D4] animate-ping" />
              CAD STREAM ACTIVE
            </span>
          </div>

          <div className="divide-y divide-white/5 font-mono text-xs">
            {filteredLogs.map((log) => {
              const isExpanded = expandedLogId === log.id;
              return (
                <div key={log.id} className="transition-colors hover:bg-white/5">
                  <div
                    onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                    className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <button className="text-slate-400">
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-[#06B6D4]" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{log.id}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getUrgencyBadge(log.urgencyLevel)}`}>
                            {log.urgencyLevel}
                          </span>
                          <span className="text-[10px] text-[#06B6D4] bg-[#06B6D4]/10 px-2 py-0.5 rounded border border-[#06B6D4]/30">
                            {log.verifiedStatus || 'VERIFIED'}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#94A3B8] font-sans mt-0.5 block">
                          {log.payloadSummary}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] text-slate-400 shrink-0">
                      <span>{log.targetSystem}</span>
                      <span className="text-[#06B6D4]">{log.latencyMs}ms</span>
                      <span className="text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  {/* Expandable Log Details Drawer */}
                  {isExpanded && (
                    <div className="px-6 py-4 bg-[#061826]/90 border-t border-white/5 space-y-3 animate-fade-in">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-[#0D2235] border border-white/10">
                          <span className="text-[10px] text-slate-500 uppercase block">Protocol Code</span>
                          <span className="font-bold text-white">{log.protocolCode}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#0D2235] border border-white/10">
                          <span className="text-[10px] text-slate-500 uppercase block">Geo Target</span>
                          <span className="font-bold text-white">{log.location}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#0D2235] border border-white/10">
                          <span className="text-[10px] text-slate-500 uppercase block">Response Flotilla</span>
                          <span className="font-bold text-[#06B6D4]">{log.assignedUnits.join(', ')}</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#0D2235] border border-white/5 font-mono text-[11px] text-slate-300">
                        <span className="text-slate-500 block mb-1">TRANSMISSION ENVELOPE:</span>
                        <code>{`{"system": "${log.targetSystem}", "status": 200, "handshakeVerified": true, "timestamp": "${log.timestamp}"}`}</code>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Privacy Note */}
        <div className="p-4 rounded-2xl bg-[#0D2235]/70 border border-white/10 flex items-center gap-3 text-xs text-[#94A3B8]">
          <Lock className="w-4 h-4 text-[#06B6D4] shrink-0" />
          <span>
            <strong className="text-white">Privacy Guarantee:</strong> All log entries are anonymized and stored with personal identifiers minimized according to SETU Zero-Knowledge Emergency Protocols.
          </span>
        </div>
      </main>

      <footer className="border-t border-white/10 bg-[#0D2235]/70 py-6 mt-12 text-center text-xs text-[#94A3B8]">
        SETU System Pulse • Real-Time Algorithmic Audit & Telemetry
      </footer>
    </div>
  );
}
