'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Trash2, Volume2, Radio } from 'lucide-react';
import { MultimodalPayloadItem } from '@/types/bridge';

interface VoiceRecorderProps {
  onAudioRecorded: (audioItem: MultimodalPayloadItem) => void;
  onAudioCleared?: () => void;
  disabled?: boolean;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onAudioRecorded,
  onAudioCleared,
  disabled = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [volumeLevels, setVolumeLevels] = useState<number[]>([15, 20, 30, 25, 40, 30, 20, 15]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      // Set up Web Audio API Analyser for real-time visualizer waveform
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateWaveform = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Sample 8 distinct frequency bands for waveform animation
        const levels = [];
        const step = Math.floor(bufferLength / 8);
        for (let i = 0; i < 8; i++) {
          const val = dataArray[i * step] || 0;
          // Scale between min 10% and max 100%
          const pct = Math.max(12, Math.min(100, Math.round((val / 255) * 100)));
          levels.push(pct);
        }
        setVolumeLevels(levels);
        animationFrameRef.current = requestAnimationFrame(updateWaveform);
      };
      updateWaveform();

      // Recorder instance
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close().catch(() => {});
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          onAudioRecorded({
            data: base64Audio,
            mimeType: 'audio/webm',
            fileName: `live_voice_capture_${new Date().toLocaleTimeString().replace(/:/g, '-')}.webm`,
            type: 'audio',
          });
        };

        // Stop all tracks to release mic hardware
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start(250);
      setIsRecording(true);
      setRecordingSeconds(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone access denied:', err);
      alert('Could not access microphone. Please enable audio permissions in your browser settings.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  const clearAudio = () => {
    setAudioUrl(null);
    setVolumeLevels([15, 20, 30, 25, 40, 30, 20, 15]);
    if (onAudioCleared) onAudioCleared();
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group hover:border-slate-700 transition-all">
      {/* Glow Effect when Recording */}
      {isRecording && (
        <div className="absolute -inset-1 bg-gradient-to-r from-rose-500/20 via-red-500/10 to-amber-500/20 rounded-2xl blur-sm animate-pulse pointer-events-none -z-10" />
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-emerald-400" />
            Live Voice Audio Recorder
          </span>

          {isRecording ? (
            <span className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              LIVE REC {formatTime(recordingSeconds)}
            </span>
          ) : audioUrl ? (
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              Ready for Gemini
            </span>
          ) : (
            <span className="text-[11px] font-mono text-slate-500">
              Web Audio API
            </span>
          )}
        </div>

        <p className="text-[11px] text-slate-400 leading-normal mb-3">
          Capture frantic civilian audio, dispatcher 911 calls, or noisy field radio reports directly for multimodal AI reasoning.
        </p>

        {/* Real-time Frequency Waveform Visualizer */}
        <div className="h-12 bg-slate-900/90 border border-slate-800/80 rounded-xl px-4 flex items-center justify-center gap-1.5 mb-3 shadow-inner">
          {volumeLevels.map((lvl, index) => (
            <div
              key={index}
              style={{ height: `${isRecording ? lvl : 16}%` }}
              className={`w-2 rounded-full transition-all duration-75 ${
                isRecording
                  ? 'bg-gradient-to-t from-rose-500 to-amber-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                  : 'bg-slate-700/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Recording Actions */}
      <div className="flex items-center gap-2">
        {!isRecording ? (
          <button
            type="button"
            onClick={startRecording}
            disabled={disabled}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 active:scale-[0.98] transition-all shadow-lg shadow-emerald-950/40 cursor-pointer disabled:opacity-50"
          >
            <Mic className="w-4 h-4 text-emerald-200" />
            <span>Record Voice Note</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 active:scale-[0.98] animate-pulse cursor-pointer shadow-lg shadow-rose-950/50"
          >
            <Square className="w-4 h-4 fill-current" />
            <span>Stop & Attach Audio</span>
          </button>
        )}

        {audioUrl && !isRecording && (
          <button
            type="button"
            onClick={clearAudio}
            title="Discard audio"
            className="p-2.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Audio Playback Deck */}
      {audioUrl && !isRecording && (
        <div className="mt-3 pt-3 border-t border-slate-800/80">
          <audio src={audioUrl} controls className="w-full h-8 opacity-90 rounded" />
        </div>
      )}
    </div>
  );
};
