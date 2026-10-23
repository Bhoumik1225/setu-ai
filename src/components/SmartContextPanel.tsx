'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  X,
  ShieldCheck,
  PhoneCall,
  MapPin,
  Clock,
  CloudRain,
  AlertCircle,
  ExternalLink,
  Share2,
  CheckCircle2,
  Lock,
  Hospital,
  Building,
  Radio,
  Flame,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const SmartContextPanel: React.FC = () => {
  const {
    isContextPanelOpen,
    setIsContextPanelOpen,
    selectedContextCase,
    setSelectedContextCase,
    addToast,
    updateCaseStatus,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'resources' | 'weather' | 'case'>('resources');
  const [handoffRedacted, setHandoffRedacted] = useState(true);

  if (!isContextPanelOpen) return null;

  const demoEmergencyResources = [
    {
      name: 'Metro City Trauma ER & Cardiac ICU',
      type: 'Trauma Hospital',
      distance: '1.4 km',
      eta: '4 mins',
      phone: '102 / (555) 911-2000',
      status: 'Open 24/7 • High Capacity',
      icon: Hospital,
      verified: true,
    },
    {
      name: 'Central Sector 4 Civic Disaster Shelter',
      type: 'Community Shelter',
      distance: '2.8 km',
      eta: '8 mins',
      phone: '(555) 344-8890',
      status: 'Generator Operational • Food Supply Ready',
      icon: Building,
      verified: true,
    },
    {
      name: 'Station 12 Hazardous Incident Fire & Rescue',
      type: 'Emergency Services',
      distance: '3.1 km',
      eta: '6 mins',
      phone: '101 / (555) 911-1200',
      status: 'High Water Rescue Gear Ready',
      icon: Flame,
      verified: true,
    },
  ];

  const handleCopyHandoff = () => {
    const text = `SETU AI EMERGENCY INCIDENT HANDOFF NOTE\nCase ID: ${selectedContextCase?.id || 'CASE-CURRENT'}\nCategory: ${selectedContextCase?.category || 'MEDICAL'}\nUrgency: ${selectedContextCase?.urgency || 'HIGH'}\nLocation: ${handoffRedacted ? '[REDACTED FOR PRIVACY - GENERAL SECTOR 4]' : selectedContextCase?.location || 'Sector 4, Green Valley'}\nSummary: ${selectedContextCase?.summary || 'Triage summary generated with Gemini reasoning.'}\nAction Taken: ${selectedContextCase?.actionSummary || 'CAD dispatch notified.'}\nVerified via: RFC-8259 Schema • SETU Safety Gateway`;
    navigator.clipboard.writeText(text);
    addToast('Redacted emergency handoff copied to clipboard', 'success');
  };

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={() => setIsContextPanelOpen(false)}
    >
      <div
        className="w-full max-w-md bg-[#111827] border-l border-white/10 h-full flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/8 flex items-center justify-between bg-[#172033]/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#4F8CFF]/15 text-[#4F8CFF]">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Smart Context Panel</h3>
              <p className="text-[11px] text-[#94A3B8]">Nearby resources, helplines & telemetry</p>
            </div>
          </div>
          <button
            onClick={() => setIsContextPanelOpen(false)}
            className="text-[#94A3B8] hover:text-white p-1 rounded-lg text-sm cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/8 bg-[#0B101D] px-3 pt-2 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('resources')}
            className={`pb-2 px-2.5 font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'resources' ? 'border-[#4F8CFF] text-[#4F8CFF]' : 'border-transparent text-[#94A3B8] hover:text-white'
            }`}
          >
            Nearby Resources
          </button>
          <button
            onClick={() => setActiveTab('weather')}
            className={`pb-2 px-2.5 font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'weather' ? 'border-[#4F8CFF] text-[#4F8CFF]' : 'border-transparent text-[#94A3B8] hover:text-white'
            }`}
          >
            Live Risk Radar
          </button>
          {selectedContextCase && (
            <button
              onClick={() => setActiveTab('case')}
              className={`pb-2 px-2.5 font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === 'case' ? 'border-[#4F8CFF] text-[#4F8CFF]' : 'border-transparent text-[#94A3B8] hover:text-white'
              }`}
            >
              Case Handoff
            </button>
          )}
        </div>

        {/* Panel Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'resources' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#172033]/60 border border-white/5 flex items-center justify-between text-xs">
                <span className="text-[#94A3B8]">Sector Location:</span>
                <span className="font-semibold text-white flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#4F8CFF]" /> Sector 4 & Metro Corridor
                </span>
              </div>

              <div className="space-y-2.5">
                {demoEmergencyResources.map((res) => {
                  const ResIcon = res.icon;
                  return (
                    <div
                      key={res.name}
                      className="p-3.5 rounded-xl bg-[#172033]/40 border border-white/6 hover:border-[#4F8CFF]/30 transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <div className="p-2 rounded-lg bg-[#4F8CFF]/15 text-[#4F8CFF] mt-0.5">
                            <ResIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white">{res.name}</h4>
                            <span className="text-[11px] text-[#94A3B8]">{res.type} • {res.distance} away</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/30">
                          {res.eta}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 font-medium pl-9">{res.status}</p>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between pl-9 text-xs">
                        <a
                          href={`tel:${res.phone}`}
                          className="text-[#4F8CFF] font-semibold hover:underline flex items-center gap-1 text-[11px]"
                        >
                          <PhoneCall className="w-3 h-3" /> Call: {res.phone}
                        </a>
                        <span className="text-[10px] font-mono text-[#94A3B8] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-[#34D399]" /> Verified Live
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'weather' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#172033] to-[#0B101D] border border-white/8 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CloudRain className="w-4 h-4 text-[#4F8CFF]" />
                    <span className="text-xs font-bold text-white">Local Weather Risk Assessment</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FBBF24]/15 text-[#FBBF24] border border-[#FBBF24]/30">
                    ELEVATED
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Heavy thunderstorm active across Metro Basin. 42mm precipitation recorded in last 90 minutes. 3 underpasses at risk of water accumulation.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-lg bg-[#080B12] border border-white/5">
                    <span className="text-[10px] text-[#94A3B8] block">Flood Index</span>
                    <span className="font-bold text-white">68% Moderate</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#080B12] border border-white/5">
                    <span className="text-[10px] text-[#94A3B8] block">Wind Gusts</span>
                    <span className="font-bold text-white">44 km/h North</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#172033]/40 border border-white/6 text-xs text-[#94A3B8] space-y-1.5">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" /> Gemini Safety Protocol Recommendation
                </span>
                <p className="text-[11px] leading-relaxed">
                  Advise field responders and ambulance routes to bypass Underpass Mile 14. Recommend Route B via High Ridge Parkway.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'case' && selectedContextCase && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[#172033]/60 border border-white/8 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#4F8CFF]">{selectedContextCase.id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#4F8CFF]/15 text-[#4F8CFF]">
                    {selectedContextCase.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white">{selectedContextCase.title}</h4>
                <p className="text-xs text-[#94A3B8]">{selectedContextCase.summary}</p>
                {selectedContextCase.actionSummary && (
                  <p className="text-xs text-[#34D399] font-medium pt-1">
                    Action: {selectedContextCase.actionSummary}
                  </p>
                )}
              </div>

              {/* Status Update Buttons */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8] font-bold block">
                  Update Case Lifecycle:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => updateCaseStatus(selectedContextCase.id, 'Escalated')}
                    className="p-2 rounded-lg bg-[#FB7185]/15 border border-[#FB7185]/30 text-[#FB7185] font-semibold hover:bg-[#FB7185]/25 cursor-pointer text-left"
                  >
                    Escalate to Emergency
                  </button>
                  <button
                    onClick={() => updateCaseStatus(selectedContextCase.id, 'Resolved')}
                    className="p-2 rounded-lg bg-[#34D399]/15 border border-[#34D399]/30 text-[#34D399] font-semibold hover:bg-[#34D399]/25 cursor-pointer text-left"
                  >
                    Mark as Resolved
                  </button>
                </div>
              </div>

              {/* Shareable Handoff Note */}
              <div className="p-3.5 rounded-xl bg-[#080B12] border border-white/8 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-[#4F8CFF]" /> Emergency Handoff Note
                  </span>
                  <label className="flex items-center gap-1.5 text-[11px] text-[#94A3B8] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={handoffRedacted}
                      onChange={(e) => setHandoffRedacted(e.target.checked)}
                      className="rounded accent-[#4F8CFF]"
                    />
                    <span>Redact PII</span>
                  </label>
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                  Generate a clean, sanitized handoff note suitable for ER doctors, NGO responders, or family members.
                </p>
                <button
                  onClick={handleCopyHandoff}
                  className="w-full py-2 rounded-lg bg-[#4F8CFF] hover:bg-[#3B72E0] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" /> Copy Shareable Handoff
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/8 bg-[#0B101D] flex items-center justify-between text-xs text-[#94A3B8]">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-[#34D399]" /> End-to-end sanitized
          </span>
          <button
            onClick={() => setIsContextPanelOpen(false)}
            className="text-xs text-white hover:text-[#4F8CFF] font-medium cursor-pointer"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
