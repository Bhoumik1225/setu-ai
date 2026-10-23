'use client';

import React, { useState, useRef } from 'react';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { Trash2, Upload, FileText, Image as ImageIcon, Volume2, Sparkles, X, AlertCircle } from 'lucide-react';
import { MultimodalPayloadItem } from '@/types/bridge';

interface MultimodalInputHubProps {
  textPrompt: string;
  setTextPrompt: (val: string) => void;
  files: MultimodalPayloadItem[];
  setFiles: React.Dispatch<React.SetStateAction<MultimodalPayloadItem[]>>;
  isProcessing: boolean;
  onProcess: () => void;
  onClear: () => void;
}

export const MultimodalInputHub: React.FC<MultimodalInputHubProps> = ({
  textPrompt,
  setTextPrompt,
  files,
  setFiles,
  isProcessing,
  onProcess,
  onClear,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAudioRecorded = (audioItem: MultimodalPayloadItem) => {
    setFiles((prev) => [...prev.filter((f) => f.type !== 'audio'), audioItem]);
  };

  const handleAudioCleared = () => {
    setFiles((prev) => prev.filter((f) => f.type !== 'audio'));
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    newFiles.forEach((file) => {
      const isImg = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
      const isAud = file.type.startsWith('audio/');

      let type: 'image' | 'pdf' | 'audio' | 'text' = 'text';
      if (isImg) type = 'image';
      else if (isPdf) type = 'pdf';
      else if (isAud) type = 'audio';

      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result as string;
        setFiles((prev) => [
          ...prev,
          {
            data: base64Data,
            mimeType: file.type || (isPdf ? 'application/pdf' : 'application/octet-stream'),
            fileName: file.name,
            type,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-indigo-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-indigo-500/5 transition-all duration-300 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span className="flex h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-pulse" />
            Universal Multimodal Ingestion Hub
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ingest unstructured real-world chaos: audio voice, crash imagery, messy medical charts, or transcripts
          </p>
        </div>

        {(textPrompt || files.length > 0) && (
          <button
            onClick={onClear}
            className="text-xs text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 hover:border-rose-500/40 bg-slate-950/60 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Main Text / Voice Area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            Text Prompt / Live Dispatch Transcript
          </label>
          <span className="text-[11px] text-slate-500 font-mono">
            {textPrompt.length} chars
          </span>
        </div>
        <textarea
          value={textPrompt}
          onChange={(e) => setTextPrompt(e.target.value)}
          placeholder="Paste or type raw emergency transcription, frantic 911 notes, sensor alarms, or live casualty observations..."
          rows={5}
          className="w-full bg-slate-950/80 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 rounded-2xl p-4 text-xs sm:text-sm text-slate-100 placeholder-slate-500 resize-none font-sans leading-relaxed transition-all shadow-inner hover:border-white/20"
        />
      </div>

      {/* Grid: Live Voice Recorder & Futuristic Upload Zone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Component: VoiceRecorder */}
        <VoiceRecorder
          onAudioRecorded={handleAudioRecorded}
          onAudioCleared={handleAudioCleared}
          disabled={isProcessing}
        />

        {/* Futuristic Upload Zone with glowing dashed border */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
            dragOver
              ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_20px_rgba(6,182,212,0.35)]'
              : 'border-indigo-500/40 hover:border-cyan-400 bg-slate-950/40 hover:bg-slate-950/70 shadow-lg shadow-indigo-950/20'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            multiple
            accept="image/*,application/pdf,audio/*"
            className="hidden"
          />
          <div className="relative mb-2.5">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full blur opacity-60" />
            <div className="relative w-10 h-10 rounded-full bg-slate-950 border border-white/20 flex items-center justify-center text-cyan-400 shadow-md">
              <Upload className="w-5 h-5" />
            </div>
          </div>
          <span className="text-xs font-bold text-white">
            Upload Evidence (PDF / Images)
          </span>
          <span className="text-[11px] text-slate-400 mt-1 max-w-[210px] leading-tight">
            Drop medical history charts, hazard camera snapshots, or incident audio files
          </span>
        </div>
      </div>

      {/* Uploaded Files Chips */}
      {files.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Attached Multimodal Streams ({files.length}):
          </span>
          <div className="flex flex-wrap gap-2">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-white/10 hover:border-indigo-500/40 text-xs text-slate-200 shadow-sm transition-all"
              >
                {file.type === 'image' && <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />}
                {file.type === 'pdf' && <FileText className="w-3.5 h-3.5 text-pink-400" />}
                {file.type === 'audio' && <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                <span className="truncate max-w-[180px] font-mono text-[11px]">
                  {file.fileName || `Attachment #${idx + 1}`}
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="text-slate-400 hover:text-rose-400 transition-colors ml-1 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Process Intent Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <AlertCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Multimodal streams convert instantly into standardized RFC-8259 actions</span>
        </div>

        {/* Primary Action Button with Rich Neon Glow */}
        <button
          type="button"
          onClick={onProcess}
          disabled={isProcessing || (!textPrompt.trim() && files.length === 0)}
          className="cursor-pointer w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 shadow-lg shadow-purple-500/25 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Synthesizing Intent...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Bridge Intent to Action</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
