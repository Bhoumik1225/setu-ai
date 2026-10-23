'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { RaycastTopBar } from '@/components/RaycastTopBar';
import { DispatchLogEntry } from '@/types/bridge';
import {
  Activity,
  Terminal,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Filter,
  Search,
  ArrowUpRight,
  RefreshCw,
  Download,
  Server,
  Radio,
  SlidersHorizontal,
  Table,
  ListFilter,
  Layers,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  Zap,
} from 'lucide-react';

export default function LogsPage() {
  const { logs, addToast } = useAuth();
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterUrgency, setFilterUrgency] = useState<string>('ALL');
  const [filterVerified, setFilterVerified] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('table');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(logs[0]?.id || null);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Just now');
  const [mounted, setMounted] = useState<boolean>(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const formatTime = (isoString?: string) => {
    if (!isoString) return '--:--';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return '--:--';
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '--:--';
    }
  };

  const query = searchQuery.trim().toLowerCase();
  const filteredLogs = logs.filter((log) => {
    if (!log) return false;
    const matchesCat = filterCategory === 'ALL' || log.category === filterCategory;
    const matchesUrg = filterUrgency === 'ALL' || log.urgencyLevel === filterUrgency;
    const matchesVer = filterVerified === 'ALL' || log.verifiedStatus === filterVerified;
    if (!query) return matchesCat && matchesUrg && matchesVer;

    const targetSys = (log.targetSystem || '').toLowerCase();
    const protoCode = (log.protocolCode || '').toLowerCase();
    const loc = (log.location || '').toLowerCase();
    const payload = (log.payloadSummary || '').toLowerCase();
    const eventId = (log.id || '').toLowerCase();

    const matchesSearch =
      targetSys.includes(query) ||
      protoCode.includes(query) ||
      loc.includes(query) ||
      payload.includes(query) ||
      eventId.includes(query);

    return matchesCat && matchesUrg && matchesVer && matchesSearch;
  });

  const getUrgencyBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-[#FB7185]/15 text-[#FB7185] border-[#FB7185]/30';
      case 'URGENT':
      case 'HIGH':
        return 'bg-[#FBBF24]/15 text-[#FBBF24] border-[#FBBF24]/30';
      case 'NEEDS_ATTENTION':
      case 'ATTENTION_NEEDED':
      case 'MEDIUM':
        return 'bg-[#A78BFA]/15 text-[#A78BFA] border-[#A78BFA]/30';
      default:
        return 'bg-[#34D399]/15 text-[#34D399] border-[#34D399]/30';
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
    addToast('System telemetry logs exported safely', 'success');
  };

  const handleRefreshSync = () => {
    setLastSyncedTime(new Date().toLocaleTimeString());
    addToast('Telemetry streams re-synchronized with CAD gateway', 'info');
  };

  const systemStatusIndicators = [
    { name: 'Gemini 2.5 Analysis', status: 'Operational', latency: '420ms', ok: true },
    { name: 'Multimodal OCR Pipeline', status: 'Operational', latency: '610ms', ok: true },
    { name: 'CAD 911 / FEMA Dispatcher', status: 'Active (RFC-8259)', latency: '85ms', ok: true },
    { name: 'Location & Resource Radar', status: 'Ready', latency: '120ms', ok: true },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen text-[#F8FAFC] lg:pl-64">
      <RaycastTopBar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-white/8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#4F8CFF]/15 border border-[#4F8CFF]/30 text-[#4F8CFF] text-[10px] font-mono font-bold tracking-wide">
              <Activity className="w-3 h-3" /> SYSTEM PULSE AUDIT TELEMETRY
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              System Pulse Logs & Dispatch Telemetry
            </h1>
            <p className="text-xs text-[#94A3B8]">
              Real-time audit log of structured RFC-8259 payloads transmitted to CAD 911, Incident Command, and Trauma ERs. (Anonymized Demo Data)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleRefreshSync}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono text-[#4F8CFF] bg-[#172033] border border-white/10 hover:border-[#4F8CFF]/40 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Synced: {lastSyncedTime}</span>
            </button>

            <button
              onClick={handleExportLogs}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#4F8CFF] hover:bg-[#3B72E0] transition-colors cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit JSON</span>
            </button>
          </div>
        </div>

        {/* System Status Indicators Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {systemStatusIndicators.map((sys) => (
            <div key={sys.name} className="p-3 rounded-xl bg-[#111827] border border-white/6 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-[11px] text-[#94A3B8] block">{sys.name}</span>
                <span className="font-bold text-white">{sys.status}</span>
              </div>
              <div className="text-right">
                <span className="w-2 h-2 rounded-full bg-[#34D399] inline-block mb-1" />
                <span className="text-[10px] font-mono text-[#94A3B8] block">{sys.latency}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Controls & Search */}
        <div className="p-3.5 rounded-xl bg-[#111827] border border-white/8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#172033] border border-white/8">
            <Search className="w-3.5 h-3.5 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search protocol code, target system, location, payload..."
              className="w-full bg-transparent text-xs text-white placeholder-[#94A3B8]/60 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-[#172033] border border-white/10 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="MEDICAL">Medical</option>
              <option value="WEATHER">Weather</option>
              <option value="ROAD_SAFETY">Road Safety</option>
              <option value="CIVIC">Civic</option>
            </select>

            <select
              value={filterUrgency}
              onChange={(e) => setFilterUrgency(e.target.value)}
              className="bg-[#172033] border border-white/10 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Urgencies</option>
              <option value="CRITICAL">Critical</option>
              <option value="URGENT">Urgent</option>
              <option value="NEEDS_ATTENTION">Attention</option>
              <option value="ROUTINE">Routine</option>
            </select>

            {/* View Mode Toggle: Table vs Timeline */}
            <div className="flex items-center rounded-lg bg-[#172033] border border-white/8 p-0.5">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-[#4F8CFF] text-white' : 'text-[#94A3B8] hover:text-white'
                }`}
                title="Table Mode"
              >
                <Table className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                  viewMode === 'timeline' ? 'bg-[#4F8CFF] text-white' : 'text-[#94A3B8] hover:text-white'
                }`}
                title="Timeline Mode"
              >
                <Clock className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Logs Table Mode */}
        {viewMode === 'table' ? (
          <div className="rounded-2xl bg-[#111827] border border-white/8 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/8 bg-[#172033]/60 text-[#94A3B8] font-mono text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-4">Event ID</th>
                    <th className="py-3 px-4">Target System</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Urgency</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Latency</th>
                    <th className="py-3 px-4">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-[#94A3B8]">
                        No dispatch logs matched your search filters.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => {
                      const isExpanded = expandedLogId === log.id;
                      return (
                        <React.Fragment key={log.id}>
                          <tr
                            onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                            className="hover:bg-[#172033]/40 transition-colors cursor-pointer group"
                          >
                            <td className="py-3 px-4 font-mono font-bold text-[#4F8CFF]">
                              <span className="flex items-center gap-1.5">
                                {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3 text-[#94A3B8]" />}
                                {log.id}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-medium text-white">{log.targetSystem}</td>
                            <td className="py-3 px-4 text-[#94A3B8] font-mono">{log.category}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getUrgencyBadge(log.urgencyLevel)}`}>
                                {log.urgencyLevel}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-[#34D399] font-mono font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> {log.statusCode} OK
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-[#94A3B8]">{log.latencyMs}ms</td>
                            <td className="py-3 px-4 font-mono text-[#94A3B8]" suppressHydrationWarning>
                              {mounted ? formatTime(log.timestamp) : '--:--'}
                            </td>
                          </tr>

                          {/* Expandable Event Row */}
                          {isExpanded && (
                            <tr className="bg-[#172033]/70">
                              <td colSpan={7} className="p-4 space-y-2 border-t border-white/5">
                                <div className="text-xs space-y-1">
                                  <span className="text-[11px] font-mono uppercase text-[#4F8CFF] font-bold block">
                                    Dispatched Structured Payload:
                                  </span>
                                  <p className="text-slate-200 bg-[#080B12] p-3 rounded-lg border border-white/5 font-mono text-xs leading-relaxed">
                                    {log.payloadSummary || 'No payload recorded'}
                                  </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#94A3B8] pt-1">
                                  <span>Protocol: <strong className="text-white">{log.protocolCode || 'RFC-8259'}</strong></span>
                                  <span>Location: <strong className="text-white">{log.location || 'Sector 4'}</strong></span>
                                  <span>Verification: <strong className="text-[#34D399]">{log.verifiedStatus || 'VERIFIED'}</strong></span>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Timeline Mode */
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-4 rounded-xl bg-[#111827] border border-white/8 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#4F8CFF]">{log.id}</span>
                    <span className="font-bold text-xs text-white">{log.targetSystem}</span>
                    <span className={`px-2 py-0.2 rounded text-[10px] font-bold border ${getUrgencyBadge(log.urgencyLevel)}`}>
                      {log.urgencyLevel}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#94A3B8]" suppressHydrationWarning>
                    {mounted ? formatTime(log.timestamp) : '--:--'}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{log.payloadSummary || 'No payload recorded'}</p>
                <div className="flex items-center gap-4 text-[11px] text-[#94A3B8] pt-1">
                  <span>Location: {log.location || 'Sector 4'}</span>
                  <span>Latency: {log.latencyMs}ms</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
