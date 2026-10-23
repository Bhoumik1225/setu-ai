'use client';

import React from 'react';
import { ShieldAlert, FileText, CloudRain, Car, HeartPulse, ExternalLink } from 'lucide-react';

interface QuickActionsProps {
  onSelectAction: (type: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onSelectAction }) => {
  const actions = [
    {
      id: 'emergency-help',
      title: 'Emergency Help',
      subtitle: 'Immediate ALS Ambulance / Dispatch',
      icon: <ShieldAlert className="w-5 h-5 text-[#FB7185]" />,
      border: 'hover:border-[#FB7185]/50',
      bgGlow: 'hover:shadow-[#FB7185]/10',
    },
    {
      id: 'upload-records',
      title: 'Upload Medical Records',
      subtitle: 'Prescriptions & Clinical Charts',
      icon: <FileText className="w-5 h-5 text-[#6D28D9]" />,
      border: 'hover:border-[#6D28D9]/50',
      bgGlow: 'hover:shadow-[#6D28D9]/10',
    },
    {
      id: 'report-civic',
      title: 'Report Civic Issue',
      subtitle: 'Power grid & Road collapse',
      icon: <Car className="w-5 h-5 text-[#FBBF24]" />,
      border: 'hover:border-[#FBBF24]/50',
      bgGlow: 'hover:shadow-[#FBBF24]/10',
    },
    {
      id: 'check-weather',
      title: 'Check Weather Risk',
      subtitle: 'Waterlogging & Runoff alerts',
      icon: <CloudRain className="w-5 h-5 text-[#06B6D4]" />,
      border: 'hover:border-[#06B6D4]/50',
      bgGlow: 'hover:shadow-[#06B6D4]/10',
    },
    {
      id: 'find-help',
      title: 'Find Nearby Help',
      subtitle: 'Trauma ERs & Community Shelters',
      icon: <HeartPulse className="w-5 h-5 text-[#2563EB]" />,
      border: 'hover:border-[#2563EB]/50',
      bgGlow: 'hover:shadow-[#2563EB]/10',
    },
  ];

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Quick-Action Protocols
        </span>
        <span className="text-[11px] font-mono text-[#06B6D4]">One-Click Direct Response</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {actions.map((act) => (
          <button
            key={act.id}
            type="button"
            onClick={() => onSelectAction(act.id)}
            className={`cursor-pointer text-left p-3.5 rounded-2xl bg-[#0D2235]/70 backdrop-blur-md border border-white/10 ${act.border} ${act.bgGlow} transition-all duration-300 shadow-lg flex flex-col justify-between hover:scale-[1.02]`}
          >
            <div className="p-2 rounded-xl bg-[#061826] border border-white/10 w-fit mb-2">
              {act.icon}
            </div>
            <div>
              <h4 className="text-xs font-bold text-white truncate">{act.title}</h4>
              <p className="text-[10px] text-[#94A3B8] truncate mt-0.5">{act.subtitle}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
