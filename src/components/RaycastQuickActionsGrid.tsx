'use client';

import React from 'react';
import {
  FileText,
  Car,
  CloudRain,
  Building,
  HeartHandshake,
  Hospital,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface RaycastQuickActionsGridProps {
  onSelectAction: (text: string) => void;
}

export const RaycastQuickActionsGrid: React.FC<RaycastQuickActionsGridProps> = ({
  onSelectAction,
}) => {
  const { setIsContextPanelOpen } = useAuth();

  const actions = [
    {
      title: 'Medical Document Assistant',
      desc: 'Scan prescriptions & dosage warnings',
      icon: FileText,
      color: 'text-[#4F8CFF] bg-[#4F8CFF]/15 border-[#4F8CFF]/30',
      prompt: 'Reviewing folded prescriptions and hospital discharge sheet for drug interactions and urgent contraindications.',
    },
    {
      title: 'Road Accident Reporting',
      desc: 'Multi-lane collision & transit reroute',
      icon: Car,
      color: 'text-[#FB7185] bg-[#FB7185]/15 border-[#FB7185]/30',
      prompt: 'ROAD COLLISION: 2-car accident at Metro flyover junction. Lane 1 blocked. Debris on asphalt.',
    },
    {
      title: 'Flood / Weather Risk Check',
      desc: 'Local precipitation & drainage alerts',
      icon: CloudRain,
      color: 'text-[#06B6D4] bg-[#06B6D4]/15 border-[#06B6D4]/30',
      prompt: 'WEATHER RISK: Flash flood water rising over 2 feet near low-lying apartment gate. Storm drain backed up.',
    },
    {
      title: 'Civic Issue Reporter',
      desc: 'Snapped powerlines & structural cracks',
      icon: Building,
      color: 'text-[#FBBF24] bg-[#FBBF24]/15 border-[#FBBF24]/30',
      prompt: 'CIVIC HAZARD: High voltage electric cable hanging loose over pedestrian walkway after storm wind.',
    },
    {
      title: 'Elderly Assistance',
      desc: 'Disorientation & medication support',
      icon: HeartHandshake,
      color: 'text-[#A78BFA] bg-[#A78BFA]/15 border-[#A78BFA]/30',
      prompt: 'My 78-year-old grandfather is confused and missing his daily heart medication schedule. Prescriptions attached.',
    },
    {
      title: 'Nearby Hospital / Shelter Finder',
      desc: 'Open live resource radar & helplines',
      icon: Hospital,
      color: 'text-[#34D399] bg-[#34D399]/15 border-[#34D399]/30',
      action: () => setIsContextPanelOpen(true),
    },
  ];

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8] font-bold block">
          Quick Workflows (One-Click Intake)
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.title}
              onClick={() => {
                if (act.action) {
                  act.action();
                } else if (act.prompt) {
                  onSelectAction(act.prompt);
                }
              }}
              className="p-3.5 rounded-xl bg-[#0F172A]/80 backdrop-blur-md border border-white/8 hover:border-sky-400/40 transition-all duration-200 text-left flex flex-col justify-between gap-2.5 group cursor-pointer shadow-md shadow-black/20 hover:-translate-y-1 hover:shadow-sky-950/40 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center justify-between w-full relative z-10">
                <div className={`p-2 rounded-lg border shadow-sm ${act.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-300 transition-all group-hover:translate-x-0.5" />
              </div>
              <div className="space-y-0.5 min-w-0 relative z-10">
                <span className="text-xs font-bold text-white block truncate group-hover:text-sky-100 transition-colors">{act.title}</span>
                <span className="text-[10px] text-slate-400 block line-clamp-1">{act.desc}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
