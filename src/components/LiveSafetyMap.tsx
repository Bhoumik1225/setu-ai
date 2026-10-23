'use client';

import React, { useState } from 'react';
import { DEMO_SAFETY_PINS } from '@/data/setuDemoData';
import { SafetyMapPin } from '@/types/bridge';
import { MapPin, Navigation, Compass, AlertTriangle, Hospital, Shield, Flame, Activity } from 'lucide-react';

export const LiveSafetyMap: React.FC = () => {
  const [selectedPin, setSelectedPin] = useState<SafetyMapPin>(DEMO_SAFETY_PINS[0]);
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredPins = DEMO_SAFETY_PINS.filter((pin) => {
    return filterType === 'ALL' || pin.type === filterType;
  });

  const getPinIcon = (type: string) => {
    switch (type) {
      case 'HOSPITAL':
        return <Hospital className="w-3.5 h-3.5 text-[#06B6D4]" />;
      case 'SHELTER':
        return <Shield className="w-3.5 h-3.5 text-[#6D28D9]" />;
      case 'TRAFFIC':
        return <AlertTriangle className="w-3.5 h-3.5 text-[#FBBF24]" />;
      case 'WEATHER':
        return <Compass className="w-3.5 h-3.5 text-[#FB7185]" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  return (
    <div className="glass-panel p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-[#06B6D4]" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Live Regional Safety & Resource Map
            </h3>
            <span className="text-[10px] text-[#94A3B8] font-mono">
              Hospital, shelter, traffic, flood & community-help pins
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
          {['ALL', 'HOSPITAL', 'SHELTER', 'TRAFFIC', 'WEATHER'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 rounded-lg font-mono cursor-pointer transition-colors ${
                filterType === type
                  ? 'bg-[#06B6D4]/20 text-[#06B6D4] border border-[#06B6D4]/40 font-bold'
                  : 'text-slate-400 hover:text-white bg-[#061826]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Cyber Grid Visual Map Canvas */}
      <div className="relative w-full h-64 sm:h-72 rounded-2xl bg-[#061826] border border-white/10 overflow-hidden flex items-center justify-center setu-cyber-grid">
        <div className="absolute w-72 h-72 rounded-full border border-white/5 pointer-events-none" />
        <div className="absolute w-44 h-44 rounded-full border border-[#06B6D4]/15 pointer-events-none" />
        <div className="absolute w-24 h-24 rounded-full bg-[#06B6D4]/10 blur-xl pointer-events-none" />

        {/* Interactive Pin Markers */}
        {filteredPins.map((pin, idx) => {
          const offsets = [
            { top: '28%', left: '30%' },
            { top: '38%', left: '68%' },
            { top: '65%', left: '26%' },
            { top: '70%', left: '74%' },
            { top: '48%', left: '48%' },
          ][idx % 5];

          const isSelected = selectedPin.id === pin.id;

          return (
            <div
              key={pin.id}
              style={{ top: offsets.top, left: offsets.left }}
              onClick={() => setSelectedPin(pin)}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
            >
              <div className="relative flex items-center justify-center">
                {isSelected && (
                  <span className="absolute w-8 h-8 rounded-full bg-[#06B6D4]/30 animate-ping" />
                )}
                <div
                  className={`p-2 rounded-xl border transition-transform duration-200 group-hover:scale-110 shadow-lg ${
                    isSelected
                      ? 'bg-[#06B6D4] border-white text-[#061826]'
                      : 'bg-[#0D2235] border-white/20 text-white'
                  }`}
                >
                  {getPinIcon(pin.type)}
                </div>
              </div>
              <span className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#061826]/90 text-slate-200 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                {pin.title}
              </span>
            </div>
          );
        })}

        {/* Map Legend Overlay */}
        <div className="absolute bottom-3 left-3 bg-[#0D2235]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] font-mono text-slate-400 flex items-center gap-3">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#06B6D4]" /> Hospital</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#6D28D9]" /> Shelter</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#FBBF24]" /> Traffic</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#FB7185]" /> Flood</span>
        </div>
      </div>

      {/* Selected Pin Details Ribbon */}
      {selectedPin && (
        <div className="p-3.5 rounded-2xl bg-[#061826] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">{selectedPin.title}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#06B6D4]">
                {selectedPin.distance}
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">
              {selectedPin.details}
            </p>
          </div>
          <span className="text-xs font-mono text-[#06B6D4] shrink-0 font-medium">
            {selectedPin.status}
          </span>
        </div>
      )}
    </div>
  );
};
