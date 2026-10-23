'use client';

import React, { useState, useEffect } from 'react';
import {
  Siren,
  Hospital,
  PhoneCall,
  CheckCircle,
  Clock,
  ShieldAlert,
  X,
  Radio,
  MapPin,
  CheckCircle2,
  Navigation,
  Compass,
  ArrowRight,
  Activity,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface DispatchHospitalModalProps {
  isOpen: boolean;
  onClose: () => void;
  situationContext?: string;
  location?: string;
}

export const DispatchHospitalModal: React.FC<DispatchHospitalModalProps> = ({
  isOpen,
  onClose,
  situationContext = 'Acute Medical Distress',
  location = 'Sector 4 Metro Corridor',
}) => {
  const { addToast, addLog, addCase } = useAuth();
  const [dispatchStage, setDispatchStage] = useState<'IDLE' | 'LOCATING' | 'DISPATCHED' | 'EN_ROUTE'>('IDLE');
  
  // Real-time dynamic distance and progress tracking
  const [progressPercent, setProgressPercent] = useState(15);
  const [remainingDistanceKm, setRemainingDistanceKm] = useState(1.4);
  const [etaMinutes, setEtaMinutes] = useState(6);

  const assignedAmbulance = {
    unitId: 'ALS-MEDIC-09',
    hospital: 'Metro Emergency Trauma Center',
    driver: 'Paramedic Officer Vikram & Team',
    phone: '108 / +91-11-2396-8800',
    totalDistance: '1.4 km',
  };

  useEffect(() => {
    if (!isOpen) {
      setDispatchStage('IDLE');
      setProgressPercent(15);
      setRemainingDistanceKm(1.4);
      setEtaMinutes(6);
      return;
    }

    // Sequence stages
    setDispatchStage('LOCATING');
    const timer1 = setTimeout(() => {
      setDispatchStage('DISPATCHED');
      addToast('Nearby Trauma Hospital Contacted: Ambulance Assigned!', 'success');

      // Record in system logs & cases
      addLog({
        targetSystem: 'CAD-108 Emergency Medical Dispatch',
        protocolCode: 'AMBULANCE-FAST-DISPATCH-99',
        category: 'MEDICAL',
        urgencyLevel: 'CRITICAL',
        statusCode: 201,
        latencyMs: 380,
        location: location || 'Sector 4 Metro',
        assignedUnits: ['ALS-MEDIC-09', 'Metro Trauma ICU'],
        payloadSummary: `Emergency Ambulance Dispatched for: ${situationContext.slice(0, 80)}`,
        verifiedStatus: 'VERIFIED',
      });

      addCase({
        title: `Ambulance Dispatched: ${situationContext.slice(0, 45)}...`,
        category: 'MEDICAL',
        urgency: 'CRITICAL',
        status: 'Action Ready',
        location: location || 'Sector 4 Metro',
        summary: `ALS Ambulance 09 actively rolling towards patient from Metro Trauma Center.`,
        actionSummary: 'Siren active. ETA 6 mins. Live distance tracked on map.',
      });
    }, 1500);

    const timer2 = setTimeout(() => {
      setDispatchStage('EN_ROUTE');
    }, 2800);

    // Live continuous distance progress animation
    const interval = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 85) return 85;
        return prev + 3;
      });
      setRemainingDistanceKm((prev) => {
        if (prev <= 0.3) return 0.3;
        return +(prev - 0.05).toFixed(2);
      });
      setEtaMinutes((prev) => {
        if (prev <= 2) return 2;
        return prev - 0.2 < 2 ? 2 : Math.round(prev);
      });
    }, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearInterval(interval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate live marker position on map vector curve
  // Start: Hospital (x: 18%, y: 26%) -> End: User Location (x: 82%, y: 74%)
  const ambX = 18 + (progressPercent / 100) * (82 - 18);
  const ambY = 26 + (progressPercent / 100) * (74 - 26);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#091122] border border-rose-500/40 shadow-2xl shadow-rose-950/60 p-5 sm:p-7 space-y-4 sm:space-y-5 text-white overflow-hidden glow-card my-auto">
        {/* Animated Top Emergency Glow Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-amber-400 to-rose-500 animate-pulse" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 sm:w-12 h-11 sm:h-12 rounded-2xl bg-rose-500/20 border border-rose-400/50 flex items-center justify-center text-rose-400 animate-bounce shrink-0">
              <Siren className="w-5 sm:w-6 h-5 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-rose-400">
                  Live Emergency Ambulance Tracker
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                  DISPATCH ACTIVE
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                Hospital to Your Location Distance Radar
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Interactive Distance Map Visual */}
        <div className="relative w-full h-56 sm:h-64 rounded-2xl bg-[#050D1C] border border-sky-500/30 overflow-hidden shadow-inner flex items-center justify-center">
          {/* Cyber Vector Grid Overlay */}
          <div className="absolute inset-0 setu-grid-overlay opacity-30 pointer-events-none" />

          {/* Compass radar rings */}
          <div className="absolute w-[85%] h-[85%] rounded-full border border-sky-500/10 pointer-events-none" />
          <div className="absolute w-[50%] h-[50%] rounded-full border border-sky-400/15 pointer-events-none" />

          {/* Road / Transit Vector Path SVG between Hospital and User */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#FB7185" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#34D399" stopOpacity="1" />
              </linearGradient>
            </defs>
            {/* Base route road */}
            <path
              d="M 18% 26% Q 40% 65%, 82% 74%"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Glowing route vector */}
            <path
              d="M 18% 26% Q 40% 65%, 82% 74%"
              fill="none"
              stroke="url(#routeGrad)"
              strokeWidth="3.5"
              strokeDasharray="6 4"
              className="animate-pulse"
            />
          </svg>

          {/* 1. Point A: Metro Emergency Trauma Hospital (Fixed Origin) */}
          <div className="absolute top-[26%] left-[18%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
            <div className="p-2 rounded-xl bg-sky-500/20 border border-sky-400 text-sky-300 shadow-lg shadow-sky-500/40">
              <Hospital className="w-4 h-4" />
            </div>
            <span className="mt-1 text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950/90 text-sky-200 border border-sky-500/30 whitespace-nowrap">
              Metro Trauma Center (Origin)
            </span>
          </div>

          {/* 2. Point B: Your Coordinates (Target Destination) */}
          <div className="absolute top-[74%] left-[82%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
            <span className="absolute -top-1 w-8 h-8 rounded-full bg-emerald-400/30 animate-ping pointer-events-none" />
            <div className="p-2 rounded-xl bg-emerald-500 border border-white text-slate-950 font-bold shadow-lg shadow-emerald-500/50">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="mt-1 text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950/90 text-emerald-300 border border-emerald-500/40 whitespace-nowrap">
              Your Location ({location.slice(0, 18)})
            </span>
          </div>

          {/* 3. Dynamic Moving Ambulance Marker */}
          <div
            className="absolute z-30 flex flex-col items-center transition-all duration-700 ease-out -translate-x-1/2 -translate-y-1/2"
            style={{
              top: `${ambY}%`,
              left: `${ambX}%`,
            }}
          >
            <span className="absolute w-10 h-10 rounded-full bg-rose-500/40 animate-ping pointer-events-none" />
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 border-2 border-white text-white shadow-xl shadow-rose-600/70 scale-110">
              <Siren className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            {/* Live Floating Distance Tag above Ambulance */}
            <div className="mt-1 text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-rose-950/95 text-rose-200 border border-rose-400/60 shadow-lg whitespace-nowrap flex items-center gap-1">
              <span>{remainingDistanceKm} km away</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
            </div>
          </div>

          {/* Map Top Status Badges */}
          <div className="absolute top-2.5 left-3 text-[10px] font-mono text-slate-400 flex items-center gap-1.5 bg-slate-950/80 px-2 py-1 rounded-lg border border-white/10">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>GPS SAT-SYNC: ACTIVE</span>
          </div>
          <div className="absolute top-2.5 right-3 text-[10px] font-mono text-amber-300 font-bold bg-slate-950/80 px-2.5 py-1 rounded-lg border border-amber-500/30">
            ETA: ~{etaMinutes} MINS
          </div>
        </div>

        {/* Telemetry Metrics Bar */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-0.5 text-center">
            <span className="text-[10px] text-slate-400 font-mono block">Initial Distance</span>
            <span className="font-bold text-slate-200 text-xs block">{assignedAmbulance.totalDistance}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-0.5 text-center">
            <span className="text-[10px] text-slate-400 font-mono block">Current Distance</span>
            <span className="font-black text-rose-400 text-xs sm:text-sm block animate-pulse">
              {remainingDistanceKm} km
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-0.5 text-center">
            <span className="text-[10px] text-slate-400 font-mono block">Transit Speed</span>
            <span className="font-bold text-emerald-400 text-xs block">54 km/h (Clear Corridor)</span>
          </div>
        </div>

        {/* Driver Details & Direct Emergency Connect */}
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-xs sm:text-sm">{assignedAmbulance.driver}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Unit {assignedAmbulance.unitId}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Pickup target: <strong className="text-slate-200">{location}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href="tel:108"
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-600/30 cursor-pointer active:scale-95"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Paramedic (108)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
