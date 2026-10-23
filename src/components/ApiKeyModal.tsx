'use client';

import React, { useState } from 'react';
import { Key, ShieldCheck, ExternalLink, X } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  setApiKey,
}) => {
  const [tempKey, setTempKey] = useState(apiKey);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiKey(tempKey);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Google Gemini API Key</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Provide your Google Gemini API key to invoke live multimodal models (<code className="text-cyan-300 font-mono">gemini-2.5-flash</code>) with structured JSON outputs.
          If left blank, OmniBridge runs on the high-fidelity emergency simulation engine.
        </p>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400">Gemini API Key</label>
          <input
            type="password"
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
          />
        </div>

        <div className="flex items-center justify-between pt-3">
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 underline underline-offset-4"
          >
            Get Gemini Key <ExternalLink className="w-3 h-3" />
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-950/40"
            >
              <ShieldCheck className="w-4 h-4" />
              Save Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
