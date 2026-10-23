'use client';

import React, { useState } from 'react';
import {
  Radio,
  CloudRain,
  Car,
  Heart,
  Building,
  Filter,
  MapPin,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import { CommunitySignal } from '@/types/bridge';

const INITIAL_SIGNALS: CommunitySignal[] = [
  {
    id: 'SIG-104',
    category: 'WEATHER',
    title: 'Flash Waterlogging: Underpass Mile 14',
    severity: 'URGENT',
    location: 'Sector 4 North Corridor',
    timeAgo: '4m ago',
    impactScore: 'High Risk (4 vehicles affected)',
  },
  {
    id: 'SIG-103',
    category: 'TRAFFIC',
    title: 'Signal Failure & Congestion at Flyover',
    severity: 'ATTENTION',
    location: 'Metro Central Intersection',
    timeAgo: '12m ago',
    impactScore: 'Transit Delay 25m',
  },
  {
    id: 'SIG-102',
    category: 'HEALTH',
    title: 'ER Trauma Beds Available: 6 Critical Beds',
    severity: 'ROUTINE',
    location: 'Metro Trauma Hospital',
    timeAgo: '18m ago',
    impactScore: 'Normal Capacity',
  },
  {
    id: 'SIG-101',
    category: 'CIVIC',
    title: 'Downed High-Voltage Line Neutralized',
    severity: 'ROUTINE',
    location: 'Central Walkway',
    timeAgo: '42m ago',
    impactScore: 'Grid Restored',
  },
];

export const RaycastCommunitySignals: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedLocation, setSelectedLocation] = useState<string>('ALL');

  const filteredSignals = INITIAL_SIGNALS.filter((sig) => {
    const matchesCat = selectedCategory === 'ALL' || sig.category === selectedCategory;
    const matchesLoc = selectedLocation === 'ALL' || sig.location.includes(selectedLocation);
    return matchesCat && matchesLoc;
  });

  const getSeverityBadge = (sev: CommunitySignal['severity']) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-[#FB7185]/15 text-[#FB7185] border-[#FB7185]/30';
      case 'URGENT':
        return 'bg-[#FBBF24]/15 text-[#FBBF24] border-[#FBBF24]/30';
      case 'ATTENTION':
        return 'bg-[#A78BFA]/15 text-[#A78BFA] border-[#A78BFA]/30';
      default:
        return 'bg-[#34D399]/15 text-[#34D399] border-[#34D399]/30';
    }
  };

  return (
    <div className="p-4 rounded-xl bg-[#111827] border border-white/8 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/6 pb-2.5">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-[#34D399] animate-pulse" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Verified Community Signals (Demo Feed)
          </h3>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 text-xs">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#172033] border border-white/10 text-xs text-white rounded-lg px-2 py-1 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="WEATHER">Weather</option>
            <option value="TRAFFIC">Traffic</option>
            <option value="HEALTH">Health</option>
            <option value="CIVIC">Civic</option>
          </select>

          <span className="text-[10px] text-[#94A3B8] font-mono">Demo Telemetry</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {filteredSignals.map((sig) => (
          <div
            key={sig.id}
            className="p-3 rounded-lg bg-[#172033]/50 border border-white/5 space-y-1.5 hover:border-[#4F8CFF]/30 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#4F8CFF] font-bold">{sig.category}</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${getSeverityBadge(sig.severity)}`}>
                {sig.severity}
              </span>
            </div>
            <h4 className="text-xs font-bold text-white line-clamp-1">{sig.title}</h4>
            <div className="flex items-center justify-between text-[11px] text-[#94A3B8] pt-1">
              <span className="flex items-center gap-1 truncate max-w-[140px]">
                <MapPin className="w-3 h-3 text-[#34D399]" /> {sig.location}
              </span>
              <span className="font-mono">{sig.timeAgo}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
