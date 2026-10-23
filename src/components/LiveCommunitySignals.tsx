'use client';

import React from 'react';
import { DEMO_COMMUNITY_SIGNALS } from '@/data/setuDemoData';
import { Radio, CloudRain, Car, Activity, Zap, Clock, MapPin } from 'lucide-react';

export const LiveCommunitySignals: React.FC = () => {
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'WEATHER':
        return <CloudRain className="w-3.5 h-3.5 text-[#06B6D4]" />;
      case 'TRAFFIC':
        return <Car className="w-3.5 h-3.5 text-[#FB7185]" />;
      case 'HEALTH':
        return <Activity className="w-3.5 h-3.5 text-[#2563EB]" />;
      default:
        return <Zap className="w-3.5 h-3.5 text-[#FBBF24]" />;
    }
  };

  const getSeverityBadge = (s: string) => {
    switch (s) {
      case 'CRITICAL':
        return 'bg-[#FB7185]/20 text-[#FB7185] border-[#FB7185]/40';
      case 'URGENT':
        return 'bg-[#FBBF24]/20 text-[#FBBF24] border-[#FBBF24]/40';
      case 'ATTENTION':
        return 'bg-[#6D28D9]/20 text-purple-300 border-[#6D28D9]/40';
      default:
        return 'bg-[#06B6D4]/20 text-[#06B6D4] border-[#06B6D4]/40';
    }
  };

  return (
    <div className="glass-panel p-5 space-y-3.5">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-[#06B6D4] animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Live Community Signals & Sensor Telemetry
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#06B6D4]">Real-Time Multimodal Radar</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {DEMO_COMMUNITY_SIGNALS.map((sig) => (
          <div
            key={sig.id}
            className="p-3.5 rounded-2xl bg-[#061826]/70 border border-white/10 flex flex-col justify-between space-y-2 hover:border-[#06B6D4]/40 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <div className="p-1.5 rounded-lg bg-[#0D2235] border border-white/5">
                  {getCategoryIcon(sig.category)}
                </div>
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${getSeverityBadge(sig.severity)}`}>
                  {sig.severity}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                {sig.title}
              </h4>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-[#94A3B8] font-mono">
              <span className="flex items-center gap-1 truncate max-w-[110px]">
                <MapPin className="w-3 h-3 text-[#06B6D4]" />
                {sig.location}
              </span>
              <span>{sig.timeAgo}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
