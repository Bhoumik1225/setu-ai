'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { RaycastTopBar } from '@/components/RaycastTopBar';
import { RaycastHeroCommandInput } from '@/components/RaycastHeroCommandInput';
import { RaycastQuickActionsGrid } from '@/components/RaycastQuickActionsGrid';
import { RaycastResultWorkspace } from '@/components/RaycastResultWorkspace';
import { CaseTimelineSection } from '@/components/CaseTimelineSection';
import { RaycastCommunitySignals } from '@/components/RaycastCommunitySignals';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { BridgeOutput, MultimodalPayloadItem } from '@/types/bridge';

export default function DashboardPage() {
  const { apiKey, setApiKey, addLog, addToast, addCase } = useAuth();
  const [textPrompt, setTextPrompt] = useState<string>('');
  const [files, setFiles] = useState<MultimodalPayloadItem[]>([]);
  const [sourceLink, setSourceLink] = useState<string>('');
  const [detectedLocation, setDetectedLocation] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [output, setOutput] = useState<BridgeOutput | null>(null);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);

  // Listen for custom preset selection from Command Palette
  React.useEffect(() => {
    const handlePresetSelect = (e: any) => {
      if (e.detail?.text) {
        setTextPrompt(e.detail.text);
      }
    };
    window.addEventListener('setu-preset-select', handlePresetSelect);
    return () => window.removeEventListener('setu-preset-select', handlePresetSelect);
  }, []);

  const handleProcessIntent = async () => {
    if (!textPrompt.trim() && files.length === 0 && !sourceLink) return;

    setIsProcessing(true);
    const startTime = Date.now();
    try {
      const response = await fetch('/api/process-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          textPrompt,
          files,
          sourceLink,
          customApiKey: apiKey || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to process signal');
      }

      setOutput(data);

      // Register new case in Timeline
      addCase({
        title: data.situationTitle || (textPrompt ? textPrompt.slice(0, 48) + '...' : 'Multimodal Signal Triage'),
        category: data.category,
        urgency: data.urgencyLevel,
        status: 'Action Ready',
        location: data.extractedEntities?.location || detectedLocation || 'Sector 4 Metro',
        summary: data.summary,
        actionSummary: data.extractedEntities?.recommendedAction || 'Action plan verified via Gemini reasoning.',
      });

      // Record in Telemetry Logs
      const latency = Date.now() - startTime;
      addLog({
        targetSystem: data.category === 'MEDICAL' ? 'CAD-911 Medical Dispatch' : data.category === 'WEATHER' ? 'FEMA Civic Incident Network' : 'DOT Transit System',
        protocolCode: 'RFC-8259-TRIAGE',
        category: data.category,
        urgencyLevel: data.urgencyLevel,
        statusCode: 200,
        latencyMs: latency,
        location: data.extractedEntities?.location || detectedLocation || 'Local Sector',
        assignedUnits: ['Auto-Triage', 'Gemini-2.5-Flash'],
        payloadSummary: data.summary,
        verifiedStatus: 'VERIFIED',
      });

      addToast('Situation analyzed and structured into safe action plan', 'success');
    } catch (err: any) {
      console.error('Error invoking SETU AI:', err);
      addToast(`Notice: ${err.message}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen text-[#F8FAFC] lg:pl-64">
      {/* Top Search & Command Header */}
      <RaycastTopBar onOpenKeyModal={() => setIsKeyModalOpen(true)} />

      {/* Main Command Workspace */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
        {/* Quick Actions Grid (One-click intake workflows) */}
        <RaycastQuickActionsGrid onSelectAction={(text) => setTextPrompt(text)} />

        {/* Hero Command Input Box */}
        <RaycastHeroCommandInput
          textPrompt={textPrompt}
          setTextPrompt={setTextPrompt}
          files={files}
          setFiles={setFiles}
          isProcessing={isProcessing}
          onProcess={handleProcessIntent}
          sourceLink={sourceLink}
          setSourceLink={setSourceLink}
          detectedLocation={detectedLocation}
          setDetectedLocation={setDetectedLocation}
        />

        {/* Dynamic Analysis Result Workspace */}
        {output && (
          <RaycastResultWorkspace output={output} />
        )}

        {/* Live Community Signals Feed */}
        <RaycastCommunitySignals />

        {/* Active Incident Case Timeline */}
        <CaseTimelineSection />
      </main>

      {/* API Key Modal */}
      {isKeyModalOpen && (
        <ApiKeyModal
          isOpen={isKeyModalOpen}
          onClose={() => setIsKeyModalOpen(false)}
          apiKey={apiKey}
          setApiKey={(key: string) => setApiKey(key)}
        />
      )}
    </div>
  );
}
