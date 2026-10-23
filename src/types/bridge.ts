export type UrgencyLevel = 'ROUTINE' | 'NEEDS_ATTENTION' | 'URGENT' | 'CRITICAL' | 'LOW' | 'MEDIUM' | 'HIGH';
export type Category = 'MEDICAL' | 'DISASTER' | 'INFRASTRUCTURE' | 'ROAD_SAFETY' | 'WEATHER' | 'CIVIC' | 'GENERAL';

export type CaseStatus = 'Draft' | 'Analysing' | 'Awaiting Verification' | 'Action Ready' | 'Escalated' | 'Resolved';

export interface ActionPlanStep {
  step: number;
  title: string;
  instruction: string;
  isImmediate: boolean;
  completed?: boolean;
}

export interface NearbyEmergencyService {
  name: string;
  type: 'HOSPITAL' | 'SHELTER' | 'POLICE_FIRE' | 'TRANSIT' | 'COMMUNITY_HELP';
  distance: string;
  phone: string;
  status: 'OPEN_24_7' | 'ON_ALERT' | 'DISPATCH_AVAILABLE';
}

export interface VerificationProfile {
  sourceConfidence: number; // 0-100%
  evidenceReceived: string[];
  verifiedFacts: string[];
  uncertainDetails: string[];
  requiresHumanConfirmation: string[];
  privacyStatus: string;
  isCredible: boolean;
  limitations?: string[];
  whyRecommendation?: string;
}

export interface CommunitySignal {
  id: string;
  category: 'WEATHER' | 'TRAFFIC' | 'HEALTH' | 'CIVIC';
  title: string;
  severity: 'ROUTINE' | 'ATTENTION' | 'URGENT' | 'CRITICAL';
  location: string;
  timeAgo: string;
  impactScore: string;
}

export interface CaseTimelineItem {
  id: string;
  title: string;
  category: Category;
  urgency: UrgencyLevel;
  status: CaseStatus;
  timestamp: string;
  location?: string;
  summary: string;
  actionSummary?: string;
}

export interface SimulatedApiPayload {
  targetSystem?: string;
  protocolCode?: string;
  priorityQueue?: string;
  dispatchUnits?: string[];
  timestamp?: string;
  automatedVoiceNotification?: string;
  automatedTrafficAdvisory?: string;
  automatedCivilianAlert?: string | Record<string, unknown>;
  [key: string]: unknown; // Allow Gemini-generated extra fields
}

export interface BridgeOutput {
  urgencyLevel: UrgencyLevel;
  urgencyLabel?: 'Routine' | 'Attention Needed' | 'Urgent' | 'Critical';
  urgencyReason?: string;
  category: Category;
  summary: string;
  situationTitle?: string;
  confidenceScore?: number; // 0.0 - 1.0 confidence rating from Gemini
  riskMeter?: {
    score: number; // 0 - 100 risk score
    label: 'MINIMAL' | 'ELEVATED' | 'SEVERE' | 'IMMINENT_CATASTROPHIC' | 'ROUTINE' | 'URGENT';
    color: string;
  };
  extractedEntities: {
    location?: string;
    symptomsOrHazards: string[];
    peopleAffected?: number;
    recommendedAction: string;
    keyFacts?: string[];
  };
  actionPlan?: ActionPlanStep[];
  nearbyServices?: NearbyEmergencyService[];
  trustProfile?: VerificationProfile;
  verificationChecks: {
    isCredible: boolean;
    missingCriticalInfo: string[];
  };
  simulatedApiPayload: SimulatedApiPayload;
  medicalDisclaimerNeeded?: boolean;
}

export interface MultimodalPayloadItem {
  data: string; // base64 data URL or raw base64
  mimeType: string;
  fileName?: string;
  type: 'image' | 'audio' | 'pdf' | 'text' | 'link';
}

export interface ProcessIntentRequest {
  textPrompt?: string;
  files?: MultimodalPayloadItem[];
  customApiKey?: string;
  sourceLink?: string;
}

export interface DispatchLogEntry {
  id: string;
  timestamp: string;
  targetSystem: string;
  protocolCode: string;
  category: Category;
  urgencyLevel: UrgencyLevel;
  statusCode: 200 | 201 | 400 | 500;
  latencyMs: number;
  location: string;
  assignedUnits: string[];
  payloadSummary: string;
  verifiedStatus?: 'VERIFIED' | 'NEEDS_CONFIRMATION' | 'PARTIAL';
}

export interface SafetyMapPin {
  id: string;
  title: string;
  type: 'HOSPITAL' | 'SHELTER' | 'TRAFFIC' | 'WEATHER' | 'COMMUNITY_HELP';
  lat: number;
  lng: number;
  distance: string;
  status: string;
  details: string;
}

export interface RecentCaseItem {
  id: string;
  category: Category;
  categoryLabel: string;
  title: string;
  timestamp: string;
  urgency: UrgencyLevel;
  outcome: string;
  peopleAssisted: number;
}
