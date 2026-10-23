'use client';

import React, { useState } from 'react';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import {
  Mic,
  Camera,
  FileText,
  MapPin,
  Link as LinkIcon,
  Sparkles,
  Upload,
  X,
  Volume2,
  Image as ImageIcon,
  Compass,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { MultimodalPayloadItem } from '@/types/bridge';

interface HeroCommandInputProps {
  textPrompt: string;
  setTextPrompt: (val: string) => void;
  files: MultimodalPayloadItem[];
  setFiles: React.Dispatch<React.SetStateAction<MultimodalPayloadItem[]>>;
  isProcessing: boolean;
  onProcess: () => void;
  sourceLink: string;
  setSourceLink: (val: string) => void;
  detectedLocation: string;
  setDetectedLocation: (val: string) => void;
}

export const HeroCommandInput: React.FC<HeroCommandInputProps> = ({
  textPrompt,
  setTextPrompt,
  files,
  setFiles,
  isProcessing,
  onProcess,
  sourceLink,
  setSourceLink,
  detectedLocation,
  setDetectedLocation,
}) => {
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('Understanding input');

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Exact 4-step animated processing sequence requested
  React.useEffect(() => {
    if (!isProcessing) return;
    const stages = [
      'Understanding input',
      'Extracting facts',
      'Checking urgency',
      'Creating action plan',
    ];
    let i = 0;
    setProcessingStage(stages[0]);
    const interval = setInterval(() => {
      i = (i + 1) % stages.length;
      setProcessingStage(stages[i]);
    }, 1100);
    return () => clearInterval(interval);
  }, [isProcessing]);

  // Exact sample chips requested by user
  const samplePromptChips = [
    {
      label: '“My father is feeling dizzy and I have his old prescriptions”',
      text: 'My father is feeling dizzy and unsteady since this morning. He is resting in bed. We have his old medical prescriptions from last year with cardiac medications, but we are not sure what to give him right now.',
    },
    {
      label: '“A road accident happened near me”',
      text: 'A high-speed road collision happened near me on Highway 101 Overpass at Mile Marker 44. Two sedans are badly smashed, blocking two lanes, and fuel is leaking with injured passengers inside.',
    },
    {
      label: '“Heavy rain is causing flooding in my area”',
      text: 'Heavy continuous rain is causing rapid street flooding in our neighborhood. The water is already 2.5 feet deep and entering ground-floor gates. An electrical utility pole is sparking nearby.',
    },
    {
      label: '“I need help understanding this medical report”',
      text: 'I received an urgent discharge summary and lab report indicating elevated cardiac enzymes and ventricular tachycardia history, with strict penicillin and sulfa contraindications.',
    },
  ];

  const handleAudioRecorded = (audioItem: MultimodalPayloadItem) => {
    setFiles((prev) => [...prev.filter((f) => f.type !== 'audio'), audioItem]);
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    Array.from(e.target.files).forEach((file) => {
      const isImg = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
      const isAud = file.type.startsWith('audio/');

      let type: 'image' | 'pdf' | 'audio' | 'text' = 'text';
      if (isImg) type = 'image';
      else if (isPdf) type = 'pdf';
      else if (isAud) type = 'audio';

      const reader = new FileReader();
      reader.onload = () => {
        setFiles((prev) => [
          ...prev,
          {
            data: reader.result as string,
            mimeType: file.type || 'application/octet-stream',
            fileName: file.name,
            type,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const detectBrowserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setDetectedLocation(`Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)} (GPS Active)`);
        },
        () => {
          setDetectedLocation('Civic District Hub (Manual Pin)');
        }
      );
    } else {
      setDetectedLocation('Civic Emergency Hotspot');
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-8 space-y-6">
      {/* 1. Large Hero Area */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#06B6D4] mb-1.5">
          <Sparkles className="w-4 h-4" />
          <span className="uppercase tracking-wider font-mono">Intent-to-Action Command Center</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
          Tell SETU what happened. We’ll turn it into safe action.
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1.5 leading-relaxed max-w-3xl">
          Speak out loud, paste panic notes, snap an accident photo, or attach messy medical prescriptions. Gemini AI interprets the chaos into verified next steps.
        </p>
      </div>

      {/* 2. Unified AI Input Box with Glassmorphism */}
      <div className="rounded-2xl bg-[#061826]/80 border border-white/12 focus-within:border-[#06B6D4] transition-all p-4 sm:p-5 space-y-3.5 shadow-inner">
        <textarea
          value={textPrompt}
          onChange={(e) => setTextPrompt(e.target.value)}
          placeholder="Describe what is happening in your own words (e.g. medical symptoms, road blockage, flood depth, or upload a prescription/photo)..."
          rows={4}
          className="w-full bg-transparent text-sm sm:text-base text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none resize-none leading-relaxed"
        />

        {/* Location Tag Badge */}
        {detectedLocation && (
          <div className="flex items-center gap-2 text-xs text-[#06B6D4] bg-[#0D2235] px-3 py-1.5 rounded-xl border border-[#06B6D4]/30 w-fit">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="font-mono text-[11px] truncate max-w-[280px]">{detectedLocation}</span>
            <button onClick={() => setDetectedLocation('')} className="text-slate-400 hover:text-white ml-1">✕</button>
          </div>
        )}

        {/* Attached Files Chips */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1 border-t border-white/5">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0D2235] border border-white/10 text-xs text-slate-200"
              >
                {file.type === 'image' && <ImageIcon className="w-3.5 h-3.5 text-[#06B6D4]" />}
                {file.type === 'pdf' && <FileText className="w-3.5 h-3.5 text-[#6D28D9]" />}
                {file.type === 'audio' && <Volume2 className="w-3.5 h-3.5 text-[#FBBF24]" />}
                <span className="truncate max-w-[160px] font-mono text-[11px]">
                  {file.fileName || `Evidence #${idx + 1}`}
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="text-slate-400 hover:text-[#FB7185] ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 3. Icon Buttons & Upload Trigger Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFiles}
              multiple
              accept="image/*,application/pdf,audio/*"
              className="hidden"
            />

            {/* Voice Recording Button */}
            <button
              type="button"
              onClick={() => setShowVoiceRecorder(!showVoiceRecorder)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                showVoiceRecorder
                  ? 'bg-[#06B6D4]/20 text-[#06B6D4] border-[#06B6D4]/40'
                  : 'bg-[#0D2235] text-slate-300 hover:text-white border-white/10 hover:border-[#06B6D4]/40'
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span>Voice</span>
            </button>

            {/* Photo Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#0D2235] text-slate-300 hover:text-white border border-white/10 hover:border-[#2563EB]/40 transition-colors cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Photo</span>
            </button>

            {/* Document / Prescription Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#0D2235] text-slate-300 hover:text-white border border-white/10 hover:border-[#6D28D9]/40 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#6D28D9]" />
              <span className="hidden sm:inline">Prescription / PDF</span>
            </button>

            {/* Location Button */}
            <button
              type="button"
              onClick={detectBrowserLocation}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#0D2235] text-slate-300 hover:text-white border border-white/10 hover:border-[#FB7185]/40 transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#FB7185]" />
              <span className="hidden sm:inline">Location</span>
            </button>

            {/* Link Button */}
            <button
              type="button"
              onClick={() => setShowLinkInput(!showLinkInput)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#0D2235] text-slate-300 hover:text-white border border-white/10 hover:border-[#06B6D4]/40 transition-colors cursor-pointer"
            >
              <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Link / Weather</span>
            </button>
          </div>

          {/* 5. Primary CTA Button: "Analyse with Gemini" */}
          <button
            type="button"
            onClick={onProcess}
            disabled={isProcessing || (!textPrompt.trim() && files.length === 0 && !sourceLink)}
            className="cursor-pointer px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#2563EB] via-[#6D28D9] to-[#06B6D4] hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#2563EB]/25 flex items-center gap-2 active:scale-[0.98]"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analysing with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>Analyse with Gemini</span>
              </>
            )}
          </button>
        </div>

        {/* Optional Link Input */}
        {showLinkInput && (
          <div className="pt-2 border-t border-white/5 flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-slate-400" />
            <input
              type="url"
              value={sourceLink}
              onChange={(e) => setSourceLink(e.target.value)}
              placeholder="Paste weather forecast URL, civic advisory link, or news stream..."
              className="flex-1 bg-[#0D2235] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500"
            />
            <button
              type="button"
              onClick={() => setShowLinkInput(false)}
              className="text-xs text-[#06B6D4] font-semibold px-2 py-1"
            >
              Done
            </button>
          </div>
        )}
      </div>

      {/* Embedded Live Audio Recorder Deck if active */}
      {showVoiceRecorder && (
        <div className="border border-white/10 rounded-2xl p-4 bg-[#0D2235]/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#06B6D4] flex items-center gap-1.5">
              <Mic className="w-4 h-4" />
              Live Microphone Voice Recording
            </span>
            <button
              onClick={() => setShowVoiceRecorder(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>
          <VoiceRecorder
            onAudioRecorded={handleAudioRecorded}
            onAudioCleared={() => setFiles((p) => p.filter((f) => f.type !== 'audio'))}
            disabled={isProcessing}
          />
        </div>
      )}

      {/* 6. Animated Processing Steps: Understanding input → Extracting facts → Checking urgency → Creating action plan */}
      {isProcessing && (
        <div className="p-4 rounded-2xl bg-[#0D2235] border border-[#06B6D4]/40 flex items-center gap-4 animate-fade-in shadow-xl">
          <div className="relative">
            <div className="w-9 h-9 rounded-full border-2 border-[#06B6D4]/20 border-t-[#06B6D4] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#06B6D4]" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Gemini Multimodal Reasoning Pipeline</span>
              <span className="text-[10px] font-mono text-[#06B6D4] animate-pulse">Running</span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs font-semibold text-[#06B6D4]">
              <span>{processingStage}</span>
              <span className="text-[#94A3B8] font-normal">→ Next Step Safe Action</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Sample Prompt Chips */}
      <div className="space-y-2 pt-1">
        <span className="text-xs font-semibold text-[#94A3B8] block">
          Or test an emergency scenario preset:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {samplePromptChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isProcessing}
              onClick={() => setTextPrompt(chip.text)}
              className="cursor-pointer text-left px-3.5 py-2.5 rounded-xl text-xs bg-[#0D2235]/70 hover:bg-[#0D2235] border border-white/5 hover:border-[#06B6D4]/40 text-slate-300 hover:text-white transition-all shadow-sm"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
