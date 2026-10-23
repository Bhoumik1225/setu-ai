export type UrgencyLevel = 'ROUTINE' | 'NEEDS_ATTENTION' | 'URGENT' | 'CRITICAL' | 'LOW' | 'MEDIUM' | 'HIGH';
export type Category = 'MEDICAL' | 'DISASTER' | 'INFRASTRUCTURE' | 'ROAD_SAFETY' | 'WEATHER' | 'CIVIC' | 'GENERAL';

export interface ActionPlanStep {
  step: number;
  title: string;
  instruction: string;
  isImmediate: boolean;
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

export interface BridgeOutput {
  urgencyLevel: UrgencyLevel;
  urgencyLabel?: 'Routine' | 'Attention Needed' | 'Urgent' | 'Critical';
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
  simulatedApiPayload: Record<string, any>;
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
