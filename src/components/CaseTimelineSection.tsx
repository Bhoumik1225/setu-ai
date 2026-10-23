'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ArrowRight,
  MapPin,
  ExternalLink,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { CaseTimelineItem } from '@/types/bridge';

export const CaseTimelineSection: React.FC = () => {
  const { cases, setSelectedContextCase, setIsContextPanelOpen } = useAuth();

  const getStatusBadge = (status: CaseTimelineItem['status']) => {
    switch (status) {
      case 'Action Ready':
        return 'bg-[#34D399]/15 text-[#34D399] border-[#34D399]/30';
      case 'Escalated':
        return 'bg-[#FB7185]/15 text-[#FB7185] border-[#FB7185]/30 animate-pulse';
      case 'Analysing':
        return 'bg-[#4F8CFF]/15 text-[#4F8CFF] border-[#4F8CFF]/30';
      case 'Awaiting Verification':
        return 'bg-[#FBBF24]/15 text-[#FBBF24] border-[#FBBF24]/30';
      default:
        return 'bg-white/10 text-slate-300 border-white/10';
    }
  };

  const handleSelectCase = (item: CaseTimelineItem) => {
    setSelectedContextCase(item);
    setIsContextPanelOpen(true);
  };

  return (
    <section id="case-timeline-section" className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#4F8CFF]" />
          <h2 className="text-sm font-bold text-white tracking-tight">Active Incident Case Timeline</h2>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-[#94A3B8]">
            {cases.length} cases
          </span>
        </div>
        <span className="text-xs text-[#94A3B8]">Click any case to inspect & hand off</span>
      </div>

      <div className="space-y-2">
        {cases.map((c) => (
          <div
            key={c.id}
            onClick={() => handleSelectCase(c)}
            className="p-3.5 rounded-xl bg-[#111827] border border-white/8 hover:border-[#4F8CFF]/35 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md group"
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full bg-[#4F8CFF] mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#4F8CFF]">{c.id}</span>
                  <span className="text-xs font-bold text-white truncate">{c.title}</span>
                  <span className={`px-2 py-0.2 rounded text-[10px] font-bold border ${getStatusBadge(c.status)}`}>
                    {c.status}
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] line-clamp-1">{c.summary}</p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 text-xs text-[#94A3B8] border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
              {c.location && (
                <span className="flex items-center gap-1 text-[11px] text-slate-300">
                  <MapPin className="w-3 h-3 text-[#4F8CFF]" /> {c.location}
                </span>
              )}
              <span className="text-[11px] font-mono">{c.timestamp}</span>
              <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-white transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
