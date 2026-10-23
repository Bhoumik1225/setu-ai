'use client';

import React from 'react';
import { DEMO_RECENT_CASES } from '@/data/setuDemoData';
import { History, Heart, Car, CloudRain, Clock, UserCheck } from 'lucide-react';

export const RecentCasesTimeline: React.FC = () => {
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'MEDICAL':
        return <Heart className="w-3.5 h-3.5 text-[#FB7185]" />;
      case 'ROAD_SAFETY':
        return <Car className="w-3.5 h-3.5 text-[#FBBF24]" />;
      case 'WEATHER':
        return <CloudRain className="w-3.5 h-3.5 text-[#06B6D4]" />;
      default:
        return <UserCheck className="w-3.5 h-3.5 text-[#6D28D9]" />;
    }
  };

  const getUrgencyBadge = (u: string) => {
    switch (u) {
      case 'CRITICAL':
        return 'bg-[#FB7185]/20 text-[#FB7185] border-[#FB7185]/40';
      case 'URGENT':
        return 'bg-[#FBBF24]/20 text-[#FBBF24] border-[#FBBF24]/40';
      case 'NEEDS_ATTENTION':
        return 'bg-[#6D28D9]/20 text-purple-300 border-[#6D28D9]/40';
      default:
        return 'bg-[#06B6D4]/20 text-[#06B6D4] border-[#06B6D4]/40';
    }
  };

  return (
    <div className="glass-panel p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#6D28D9]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Recent Cases & Safe Resolution Timeline
          </h3>
        </div>
        <span className="text-[11px] font-mono text-[#94A3B8]">
          Anonymized Community Feed
        </span>
      </div>

      <div className="divide-y divide-white/5 space-y-2">
        {DEMO_RECENT_CASES.map((item) => (
          <div key={item.id} className="pt-2.5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#061826] border border-white/10 shrink-0 mt-0.5">
                {getCategoryIcon(item.category)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white">{item.title}</h4>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${getUrgencyBadge(item.urgency)}`}>
                    {item.urgency}
                  </span>
                </div>
                <p className="text-[11px] text-[#94A3B8] mt-0.5">
                  {item.outcome}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] font-mono text-slate-400 block">
                {item.timestamp}
              </span>
              <span className="text-[10px] text-[#06B6D4] font-mono">
                {item.peopleAssisted} safe
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
