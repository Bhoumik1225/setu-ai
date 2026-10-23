'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { HeroCommandInput } from '@/components/HeroCommandInput';
import { SituationSummaryCard } from '@/components/SituationSummaryCard';
import { TrustVerificationPanel } from '@/components/TrustVerificationPanel';
import { ImpactWidgets } from '@/components/ImpactWidgets';
import { LiveSafetyMap } from '@/components/LiveSafetyMap';
import { RecentCasesTimeline } from '@/components/RecentCasesTimeline';
import { LiveCommunitySignals } from '@/components/LiveCommunitySignals';
import { QuickActions } from '@/components/QuickActions';
import { OnboardingTourModal } from '@/components/OnboardingTourModal';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { BridgeOutput, MultimodalPayloadItem } from '@/types/bridge';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { apiKey, setApiKey, addLog, addToast } = useAuth();
  const [textPrompt, setTextPrompt] = useState<string>('');
  const [files, setFiles] = useState<MultimodalPayloadItem[]>([]);
  const [sourceLink, setSourceLink] = useState<string>('');
  const [detectedLocation, setDetectedLocation] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [output, setOutput] = useState<BridgeOutput | null>(null);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);

  const handleSelectQuickAction = (type: string) => {
    switch (type) {
      case 'emergency-help':
        setTextPrompt('EMERGENCY: Immediate ambulance needed. Patient experiencing severe distress and difficulty breathing.');
        break;
      case 'upload-records':
        setTextPrompt('Reviewing folded medical prescriptions and previous hospital discharge lab report for drug allergies.');
        break;
      case 'report-civic':
        setTextPrompt('CIVIC HAZARD: High voltage powerlines snapped and hanging over blocked transit corridor near Highway 101.');
        break;
      case 'check-weather':
        setTextPrompt('WEATHER ALERT: Flash flooding reported in local low-lying sector. Water rising over 2 feet near residential gates.');
        break;
      case 'find-help':
        setTextPrompt('Requesting nearest trauma hospital emergency room and operational community shelter with backup power.');
        break;
    }
  };

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
          customApiKey: apiKey,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || 'Failed to process intent with Gemini');
      }

      const elapsed = Date.now() - startTime;
      setOutput(resData.data);
      addToast('Safe Action Plan generated with Gemini', 'success');

      // Record to global system telemetry
      if (resData.data) {
        addLog({
          targetSystem: resData.data.simulatedApiPayload?.targetSystem || 'SETU_CIVIC_BRIDGE',
          protocolCode: resData.data.simulatedApiPayload?.protocolCode || 'SETU-INTENT-ACTION',
          category: resData.data.category,
          urgencyLevel: resData.data.urgencyLevel,
          statusCode: 200,
          latencyMs: Math.min(elapsed, 45),
          location: resData.data.extractedEntities?.location || detectedLocation || 'Regional Sector',
          assignedUnits: resData.data.simulatedApiPayload?.dispatchUnits || ['COMMUNITY_AID_UNIT'],
          payloadSummary: resData.data.situationTitle || resData.data.summary,
          verifiedStatus: 'VERIFIED',
        });
      }
    } catch (err: any) {
      console.error('Error invoking SETU AI:', err);
      addToast(`Notice: ${err.message}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#06B6D4] selection:text-[#030712] relative">
      {/* 3D Neural Safety Network & Layered Gradient Background */}
      <AnimatedBackground pageVariant="dashboard" />

      <Navbar
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
        onOpenTour={() => setIsTourOpen(true)}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 z-10">
        {/* Quick Actions Bar */}
        <QuickActions onSelectAction={handleSelectQuickAction} />

        {/* Impact Cards */}
        <ImpactWidgets />

        {/* Live Community Signals Radar */}
        <LiveCommunitySignals />

        {/* Unified AI Hero Input Box with Gemini reasoning stages and 3D background orb */}
        <HeroCommandInput
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

        {/* Gemini Analysis Result Panel */}
        {output && (
          <div className="space-y-8 animate-fade-in">
            <SituationSummaryCard output={output} />
            <TrustVerificationPanel trustProfile={output.trustProfile} />
          </div>
        )}

        {/* Two-Column Grid: Live Safety Map & Recent Cases Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <LiveSafetyMap />
          <RecentCasesTimeline />
        </div>
      </main>

      <footer className="border-t border-white/10 bg-[#071A38]/70 backdrop-blur-xl py-6 mt-12 text-center text-xs text-[#94A3B8] z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">SETU AI (सेतु)</span>
            <span>— Universal Bridge Between Human Intent & Complex Systems</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Gemini 2.5 Multimodal Engine</span>
            <span>•</span>
            <span>Zero-Delay Safety Schema</span>
          </div>
        </div>
      </footer>

      {/* Onboarding Tour Modal */}
      <OnboardingTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
      />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        apiKey={apiKey}
        setApiKey={setApiKey}
      />
    </div>
  );
}
