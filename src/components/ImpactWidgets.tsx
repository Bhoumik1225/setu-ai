'use client';

import React, { useEffect, useState } from 'react';
import { Users, AlertCircle, Clock, CheckCircle2, TrendingUp } from 'lucide-react';

export const ImpactWidgets: React.FC = () => {
  const [peopleAssisted, setPeopleAssisted] = useState(14820);
  const [activeCases, setActiveCases] = useState(14);
  const [timeSaved, setTimeSaved] = useState(18.4);
  const [plansVerified, setPlansVerified] = useState(3892);

  useEffect(() => {
    const timer = setInterval(() => {
      setPeopleAssisted((p) => p + 1);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* People Helped */}
      <div className="glass-panel p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#94A3B8]">
          <span className="text-xs font-bold uppercase tracking-wider">People Helped</span>
          <Users className="w-4 h-4 text-[#06B6D4]" />
        </div>
        <div className="my-2.5">
          <span className="text-2xl sm:text-3xl font-mono font-black text-white">
            {peopleAssisted.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-[#06B6D4] font-mono">
          <TrendingUp className="w-3 h-3" />
          <span>+14 helped in past hour</span>
        </div>
      </div>

      {/* Active Cases */}
      <div className="glass-panel p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#94A3B8]">
          <span className="text-xs font-bold uppercase tracking-wider">Active Cases</span>
          <AlertCircle className="w-4 h-4 text-[#FB7185]" />
        </div>
        <div className="my-2.5">
          <span className="text-2xl sm:text-3xl font-mono font-black text-[#FB7185]">
            {activeCases}
          </span>
        </div>
        <span className="text-[11px] text-[#94A3B8] font-mono">
          Under active responder monitoring
        </span>
      </div>

      {/* Time Saved */}
      <div className="glass-panel p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#94A3B8]">
          <span className="text-xs font-bold uppercase tracking-wider">Time Saved</span>
          <Clock className="w-4 h-4 text-[#6D28D9]" />
        </div>
        <div className="my-2.5">
          <span className="text-2xl sm:text-3xl font-mono font-black text-white">
            {timeSaved} <span className="text-sm font-normal text-[#94A3B8]">mins</span>
          </span>
        </div>
        <span className="text-[11px] text-[#06B6D4] font-mono">
          Zero-delay structured schema
        </span>
      </div>

      {/* Verified Action Plans */}
      <div className="glass-panel p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#94A3B8]">
          <span className="text-xs font-bold uppercase tracking-wider">Verified Action Plans</span>
          <CheckCircle2 className="w-4 h-4 text-[#06B6D4]" />
        </div>
        <div className="my-2.5">
          <span className="text-2xl sm:text-3xl font-mono font-black text-white">
            {plansVerified.toLocaleString()}
          </span>
        </div>
        <span className="text-[11px] text-[#94A3B8] font-mono">
          100% protocol checked
        </span>
      </div>
    </div>
  );
};
