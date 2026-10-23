'use client';

import React, { useState } from 'react';
import { DEMO_SAFETY_PINS } from '@/data/setuDemoData';
import { SafetyMapPin } from '@/types/bridge';
import {
  Navigation,
  Compass,
  AlertTriangle,
  Hospital,
  Shield,
  Activity,
  Layers,
  Radio,
  Maximize2,
  PhoneCall,
  CheckCircle,
} from 'lucide-react';

export const LiveSafetyMap: React.FC = () => {
  const [selectedPin, setSelectedPin] = useState<SafetyMapPin>(DEMO_SAFETY_PINS[0]);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [activeLayer, setActiveLayer] = useState<'RADAR' | 'SATELLITE' | 'CIVIC'>('RADAR');

  const filteredPins = DEMO_SAFETY_PINS.filter((pin) => {
    return filterType === 'ALL' || pin.type === filterType;
  });

  const getPinTheme = (type: string) => {
    switch (type) {
      case 'HOSPITAL':
        return {
          icon: Hospital,
          color: 'text-sky-400',
          bg: 'bg-sky-500/20',
          border: 'border-sky-400/40',
          dot: 'bg-sky-400',
          badge: 'bg-sky-950/80 text-sky-300 border-sky-500/30',
        };
      case 'SHELTER':
        return {
          icon: Shield,
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/20',
          border: 'border-emerald-400/40',
          dot: 'bg-emerald-400',
          badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30',
        };
      case 'TRAFFIC':
        return {
          icon: AlertTriangle,
          color: 'text-amber-400',
          bg: 'bg-amber-500/20',
          border: 'border-amber-400/40',
          dot: 'bg-amber-400',
          badge: 'bg-amber-950/80 text-amber-300 border-amber-500/30',
        };
      case 'WEATHER':
        return {
          icon: Compass,
          color: 'text-rose-400',
          bg: 'bg-rose-500/20',
          border: 'border-rose-400/40',
          dot: 'bg-rose-400',
          badge: 'bg-rose-950/80 text-rose-300 border-rose-500/30',
        };
      default:
        return {
          icon: Activity,
          color: 'text-cyan-400',
          bg: 'bg-cyan-500/20',
          border: 'border-cyan-400/40',
          dot: 'bg-cyan-400',
          badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/30',
        };
    }
  };

  return (
    <div className="rounded-2xl bg-[#0D1527]/85 backdrop-blur-2xl border border-white/10 shadow-2xl p-4 sm:p-5 space-y-4 glow-card overflow-hidden">
      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-400 shadow-sm">
            <Navigation className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white">
                Live Regional Safety & GIS Resource Radar
              </h3>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                ACTIVE
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Live hospital telemetry, shelters, traffic bottlenecks, and flood sensors
            </span>
          </div>
        </div>

        {/* Layer Toggle & Category Pills */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-white/10">
            {(['RADAR', 'CIVIC', 'SATELLITE'] as const).map((layer) => (
              <button
                key={layer}
                onClick={() => setActiveLayer(layer)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition-all ${
                  activeLayer === layer
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {layer}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
            {['ALL', 'HOSPITAL', 'SHELTER', 'TRAFFIC', 'WEATHER'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded-lg font-mono text-[10px] cursor-pointer transition-all ${
                  filterType === type
                    ? 'bg-sky-500/25 text-sky-300 border border-sky-400/40 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white bg-slate-900/60 border border-white/5'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Map Canvas Visual with Radar Sweep & Cyber Grid */}
      <div className="relative w-full h-72 sm:h-84 rounded-2xl bg-[#061224] border border-sky-500/20 overflow-hidden flex items-center justify-center shadow-inner group">
        {/* Subtle Map Vector Background Texture */}
        <div className="absolute inset-0 opacity-25 setu-grid-overlay pointer-events-none" />

        {/* Concentric Radar Rings & Crosshairs */}
        <div className="absolute w-[92%] h-[92%] rounded-full border border-sky-500/10 pointer-events-none" />
        <div className="absolute w-[68%] h-[68%] rounded-full border border-sky-500/15 pointer-events-none" />
        <div className="absolute w-[44%] h-[44%] rounded-full border border-sky-400/20 pointer-events-none" />
        <div className="absolute w-[20%] h-[20%] rounded-full border border-sky-400/30 bg-sky-500/5 pointer-events-none" />

        {/* Crosshair Axes */}
        <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-sky-400/20 to-transparent pointer-events-none" />
        <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-sky-400/20 to-transparent pointer-events-none" />

        {/* Rotating Radar Sweep Beam (Radar Mode) */}
        {activeLayer === 'RADAR' && (
          <div
            className="absolute w-full h-full rounded-full pointer-events-none opacity-40 animate-spin"
            style={{
              animationDuration: '9s',
              background: 'conic-gradient(from 0deg, rgba(56, 189, 248, 0.4) 0deg, transparent 65deg, transparent 360deg)',
            }}
          />
        )}

        {/* Sector Labels */}
        <div className="absolute top-3 left-4 text-[10px] font-mono text-sky-400/60 pointer-events-none">
          REGION: METRO SECTOR-4 [28.6139° N, 77.2090° E]
        </div>
        <div className="absolute top-3 right-4 text-[10px] font-mono text-emerald-400/80 pointer-events-none flex items-center gap-1.5">
          <Radio className="w-3 h-3 animate-pulse" />
          <span>LIVE TELEMETRY SYNC</span>
        </div>

        {/* Interactive Pin Markers */}
        {filteredPins.map((pin, idx) => {
          const offsets = [
            { top: '26%', left: '28%' },
            { top: '34%', left: '72%' },
            { top: '64%', left: '24%' },
            { top: '72%', left: '76%' },
            { top: '48%', left: '50%' },
          ][idx % 5];

          const isSelected = selectedPin.id === pin.id;
          const theme = getPinTheme(pin.type);
          const PinIcon = theme.icon;

          return (
            <div
              key={pin.id}
              style={{ top: offsets.top, left: offsets.left }}
              onClick={() => setSelectedPin(pin)}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
            >
              <div className="relative flex items-center justify-center">
                {/* Radar pulse ping when selected */}
                {isSelected && (
                  <span className={`absolute w-12 h-12 rounded-full ${theme.bg} animate-ping opacity-75`} />
                )}
                <div
                  className={`p-2.5 rounded-2xl border transition-all duration-300 group-hover:scale-125 shadow-xl ${
                    isSelected
                      ? `bg-sky-400 border-white text-slate-950 scale-110 shadow-sky-400/50`
                      : `bg-[#0B172E]/90 border-white/20 text-white hover:border-sky-400`
                  }`}
                >
                  <PinIcon className="w-4 h-4" />
                </div>
              </div>

              {/* Pin Hover/Selected Title Tooltip */}
              <div
                className={`absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg backdrop-blur-md transition-all shadow-md ${
                  isSelected
                    ? 'bg-sky-950/95 text-sky-200 border border-sky-400/50 opacity-100'
                    : 'bg-slate-950/90 text-slate-300 border border-white/10 opacity-0 group-hover:opacity-100'
                }`}
              >
                {pin.title}
              </div>
            </div>
          );
        })}

        {/* Map Legend Overlay in Bottom Corner */}
        <div className="absolute bottom-3 left-3 bg-[#0B172E]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] font-mono text-slate-300 flex items-center gap-3 shadow-lg">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-400 shadow-sm" /> Hospital</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm" /> Shelter</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm" /> Traffic</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-400 shadow-sm" /> Hazard</span>
        </div>
      </div>

      {/* Selected Pin Details Ribbon */}
      {selectedPin && (
        <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-white">{selectedPin.title}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-sky-500/15 border border-sky-500/30 text-sky-300 font-semibold">
                {selectedPin.distance}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-400" /> Verified Hub
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {selectedPin.details}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <span className="text-[11px] font-mono text-emerald-400 block font-semibold">
                {selectedPin.status}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Response: ~4 mins</span>
            </div>
            <a
              href={`tel:112`}
              className="p-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold transition-all shadow-md shadow-sky-500/20 cursor-pointer"
              title="Call Emergency Line"
            >
              <PhoneCall className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
