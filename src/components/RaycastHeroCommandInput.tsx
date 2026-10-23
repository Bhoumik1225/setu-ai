'use client';

import React, { useState, useEffect, useRef } from 'react';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import {
  Mic,
  FileText,
  MapPin,
  Link as LinkIcon,
  Sparkles,
  Upload,
  X,
  Image as ImageIcon,
  ArrowRight,
  ShieldAlert,
  CornerDownLeft,
  Command,
  CheckCircle2,
  Paperclip,
  Activity,
  Layers,
} from 'lucide-react';
import { MultimodalPayloadItem } from '@/types/bridge';
import { useAuth } from '@/context/AuthContext';

interface RaycastHeroCommandInputProps {
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

export const RaycastHeroCommandInput: React.FC<RaycastHeroCommandInputProps> = ({
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
  const { addToast } = useAuth();
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [processingStageIndex, setProcessingStageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 5-Stage Working Analysis Flow
  const analysisStages = [
    { label: 'Input received & sanitized', sub: 'Multimodal payload parsed' },
    { label: 'Gemini extracts key facts', sub: 'Reasoning across text, audio, images' },
    { label: 'Urgency & risks assessed', sub: 'Comparing with emergency protocols' },
    { label: 'Evidence & uncertainty checked', sub: 'Cross-verifying source fidelity' },
    { label: 'Safe action plan created', sub: 'Ready for coordinated dispatch' },
  ];

  useEffect(() => {
    if (!isProcessing) {
      setProcessingStageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setProcessingStageIndex((prev) => (prev < analysisStages.length - 1 ? prev + 1 : prev));
    }, 450);

    return () => clearInterval(interval);
  }, [isProcessing]);

  // Listen for custom trigger upload from Command Palette
  useEffect(() => {
    const handleTriggerUpload = () => {
      fileInputRef.current?.click();
    };
    window.addEventListener('setu-trigger-upload', handleTriggerUpload);
    return () => window.removeEventListener('setu-trigger-upload', handleTriggerUpload);
  }, []);

  const sampleInputs = [
    {
      label: 'Grandfather Confusion & Rx',
      text: 'My grandfather is confused and I have his prescriptions. He missed his morning dose.',
    },
    {
      label: 'Waterlogging After Rain',
      text: 'There is waterlogging near my street after heavy rain. Water is entering low-lying homes.',
    },
    {
      label: 'Metro Accident',
      text: 'I saw an accident near the metro station. Two commuters need immediate first aid.',
    },
    {
      label: 'Explain Medical Report',
      text: 'Can you explain this medical report? It mentions severe hypoglycemia and high ketones.',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;

    Array.from(uploadedFiles).forEach((file) => {
      const reader = new FileReader();
      const isImage = file.type.startsWith('image/');
      const isAudio = file.type.startsWith('audio/');
      const isPdf = file.type === 'application/pdf';

      reader.onloadend = () => {
        const base64Data = reader.result as string;
        setFiles((prev) => [
          ...prev,
          {
            data: base64Data,
            mimeType: file.type || 'application/octet-stream',
            fileName: file.name,
            type: isImage ? 'image' : isAudio ? 'audio' : isPdf ? 'pdf' : 'text',
          },
        ]);
        addToast(`Attached ${file.name}`, 'info');
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = e.dataTransfer.files;
    if (!droppedFiles || droppedFiles.length === 0) return;

    Array.from(droppedFiles).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFiles((prev) => [
          ...prev,
          {
            data: reader.result as string,
            mimeType: file.type || 'application/octet-stream',
            fileName: file.name,
            type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('audio/') ? 'audio' : 'pdf',
          },
        ]);
        addToast(`Dropped file: ${file.name}`, 'info');
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setDetectedLocation('Sector 4, Green Valley Metro (Simulated)');
      addToast('Location set: Sector 4, Green Valley', 'info');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = `Lat: ${pos.coords.latitude.toFixed(3)}, Lng: ${pos.coords.longitude.toFixed(3)} (Sector 4)`;
        setDetectedLocation(loc);
        addToast('Current emergency coordinates locked', 'success');
      },
      () => {
        setDetectedLocation('Metro Basin Sector 4 (Civic Hub)');
        addToast('Simulated Location: Metro Basin Sector 4', 'info');
      }
    );
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      onProcess();
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Hero Description */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#4F8CFF]/15 border border-[#4F8CFF]/30 text-[#4F8CFF] text-[10px] font-mono font-bold tracking-wide">
          <Activity className="w-3 h-3" /> SETU COMMAND CENTER
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Turn a real-world signal into safe action.
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-3xl">
          Describe what happened in any format. Gemini helps structure the situation, verify evidence, assess urgency, and suggest coordinated next steps.
        </p>
      </div>

      {/* Main Command Input Box (Raycast style) */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`rounded-2xl border transition-all bg-[#111827] shadow-2xl relative overflow-hidden ${
          isDragging ? 'border-[#4F8CFF] ring-2 ring-[#4F8CFF]/20 bg-[#172033]' : 'border-white/10 hover:border-white/20'
        }`}
      >
        <textarea
          value={textPrompt}
          onChange={(e) => setTextPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the situation, upload records, or drop messy audio notes... (e.g. 'My grandfather is confused and I have his prescriptions')"
          rows={3}
          className="w-full p-4 sm:p-5 bg-transparent text-sm text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none resize-none leading-relaxed"
        />

        {/* Attached Multimodal Files Chips */}
        {files.length > 0 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {files.map((file, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#172033] border border-white/10 text-xs text-white"
              >
                {file.type === 'image' && <ImageIcon className="w-3.5 h-3.5 text-[#06B6D4]" />}
                {file.type === 'audio' && <Mic className="w-3.5 h-3.5 text-[#FB7185]" />}
                {file.type === 'pdf' && <FileText className="w-3.5 h-3.5 text-[#A78BFA]" />}
                <span className="max-w-[160px] truncate">{file.fileName || 'Attachment'}</span>
                <button
                  onClick={() => removeFile(idx)}
                  className="text-[#94A3B8] hover:text-white p-0.5 ml-1 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Location / Source Link Badges */}
        {(detectedLocation || sourceLink) && (
          <div className="px-4 pb-2 flex flex-wrap items-center gap-2 text-xs">
            {detectedLocation && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#172033] border border-white/10 text-[#34D399]">
                <MapPin className="w-3 h-3" />
                <span>{detectedLocation}</span>
                <button onClick={() => setDetectedLocation('')} className="ml-1 opacity-70 hover:opacity-100">✕</button>
              </span>
            )}
            {sourceLink && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#172033] border border-white/10 text-[#4F8CFF]">
                <LinkIcon className="w-3 h-3" />
                <span className="max-w-[200px] truncate">{sourceLink}</span>
                <button onClick={() => setSourceLink('')} className="ml-1 opacity-70 hover:opacity-100">✕</button>
              </span>
            )}
          </div>
        )}

        {/* Input Bar Controls */}
        <div className="px-4 py-3 border-t border-white/8 bg-[#0B101D] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept="image/*,audio/*,.pdf,.txt"
              className="hidden"
            />

            {/* Attach File Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 rounded-lg bg-[#172033] hover:bg-[#1E293B] border border-white/8 text-[#94A3B8] hover:text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Paperclip className="w-3.5 h-3.5 text-[#4F8CFF]" />
              <span>Attach File / Photo</span>
            </button>

            {/* Voice Recording Button */}
            <button
              onClick={() => setShowVoiceRecorder(!showVoiceRecorder)}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
                showVoiceRecorder
                  ? 'bg-[#FB7185]/20 border-[#FB7185]/40 text-[#FB7185]'
                  : 'bg-[#172033] hover:bg-[#1E293B] border-white/8 text-[#94A3B8] hover:text-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-[#FB7185]" />
              <span>{showVoiceRecorder ? 'Close Voice' : 'Voice Note'}</span>
            </button>

            {/* Pin Location Button */}
            <button
              onClick={handleDetectLocation}
              className="px-2.5 py-1.5 rounded-lg bg-[#172033] hover:bg-[#1E293B] border border-white/8 text-[#94A3B8] hover:text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-[#34D399]" />
              <span>Set Location</span>
            </button>

            {/* Add Source URL Button */}
            <button
              onClick={() => setShowLinkInput(!showLinkInput)}
              className="px-2.5 py-1.5 rounded-lg bg-[#172033] hover:bg-[#1E293B] border border-white/8 text-[#94A3B8] hover:text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <LinkIcon className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span>News / Alert URL</span>
            </button>
          </div>

          {/* Submit Action Button */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[11px] text-[#94A3B8] font-mono">⌘↵</span>
            <button
              onClick={onProcess}
              disabled={isProcessing || (!textPrompt.trim() && files.length === 0 && !sourceLink)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                isProcessing
                  ? 'bg-[#4F8CFF]/50 text-white cursor-wait'
                  : 'bg-[#4F8CFF] hover:bg-[#3B72E0] text-white shadow-lg shadow-[#4F8CFF]/25 active:scale-95'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Reasoning...' : 'Structure Safe Action'}</span>
              {!isProcessing && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Link Input Drawer */}
        {showLinkInput && (
          <div className="p-3 bg-[#172033] border-t border-white/8 flex items-center gap-2 text-xs">
            <LinkIcon className="w-3.5 h-3.5 text-[#A78BFA] shrink-0" />
            <input
              type="url"
              value={sourceLink}
              onChange={(e) => setSourceLink(e.target.value)}
              placeholder="Paste public weather alert, news link, or civil bulletin URL..."
              className="w-full bg-transparent text-xs text-white placeholder-[#94A3B8]/60 focus:outline-none"
            />
            <button
              onClick={() => setShowLinkInput(false)}
              className="text-[#94A3B8] hover:text-white text-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        )}

        {/* Voice Recorder Drawer */}
        {showVoiceRecorder && (
          <div className="p-4 bg-[#080B12] border-t border-white/8 animate-fade-in">
            <VoiceRecorder
              onAudioRecorded={(audioItem: MultimodalPayloadItem) => {
                setFiles((prev) => [...prev, audioItem]);
                setShowVoiceRecorder(false);
                addToast('Voice distress note captured', 'success');
              }}
            />
          </div>
        )}
      </div>

      {/* Working 5-Stage Analysis Flow indicator */}
      {isProcessing && (
        <div className="p-4 rounded-xl bg-[#111827] border border-[#4F8CFF]/30 space-y-3 shadow-xl animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#4F8CFF] animate-spin-slow" />
              Gemini 2.5 Multi-Stage Reasoning in Progress...
            </span>
            <span className="text-xs font-mono text-[#4F8CFF]">
              Stage {processingStageIndex + 1} of 5
            </span>
          </div>

          {/* Stepper bar */}
          <div className="grid grid-cols-5 gap-1.5">
            {analysisStages.map((stage, idx) => {
              const isActive = idx === processingStageIndex;
              const isPast = idx < processingStageIndex;
              return (
                <div key={stage.label} className="space-y-1">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      isPast
                        ? 'bg-[#34D399]'
                        : isActive
                        ? 'bg-[#4F8CFF] animate-pulse'
                        : 'bg-white/10'
                    }`}
                  />
                  <span className={`text-[10px] block truncate ${isActive ? 'text-white font-bold' : 'text-[#94A3B8]'}`}>
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sample Commands (One-Click Pre-populate) */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8] font-bold block">
          Sample Real-World Signals:
        </span>
        <div className="flex flex-wrap gap-2">
          {sampleInputs.map((sample) => (
            <button
              key={sample.label}
              onClick={() => setTextPrompt(sample.text)}
              className="px-3 py-1.5 rounded-xl bg-[#111827] hover:bg-[#172033] border border-white/6 hover:border-[#4F8CFF]/30 text-xs text-[#94A3B8] hover:text-white transition-all cursor-pointer text-left"
            >
              &quot;{sample.label}&quot;
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
