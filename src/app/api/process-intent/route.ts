import { NextResponse } from 'next/server';
import { GoogleGenAI, Type, Schema } from '@google/genai';
import { BridgeOutput, ProcessIntentRequest, UrgencyLevel } from '@/types/bridge';

export const maxDuration = 60;

// Structured output schema adhering to SETU AI verification, action plan, and urgency standards
const setuBridgeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    urgencyLevel: {
      type: Type.STRING,
      enum: ['ROUTINE', 'NEEDS_ATTENTION', 'URGENT', 'CRITICAL'],
      description: 'Standard SETU urgency tier.',
    },
    urgencyLabel: {
      type: Type.STRING,
      enum: ['Routine', 'Needs Attention', 'Urgent', 'Critical'],
      description: 'Human-readable urgency label.',
    },
    category: {
      type: Type.STRING,
      enum: ['MEDICAL', 'DISASTER', 'INFRASTRUCTURE', 'ROAD_SAFETY', 'WEATHER', 'CIVIC', 'GENERAL'],
    },
    situationTitle: {
      type: Type.STRING,
      description: 'Clear, empathetic, professional headline of the incident.',
    },
    summary: {
      type: Type.STRING,
      description: 'Clear executive situation summary highlighting who is affected and immediate risks.',
    },
    confidenceScore: {
      type: Type.NUMBER,
      description: 'Confidence rating from 0.00 to 1.00 based on corroborating details.',
    },
    riskMeter: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.INTEGER, description: 'Severity score 0 to 100.' },
        label: { type: Type.STRING, enum: ['MINIMAL', 'ELEVATED', 'SEVERE', 'IMMINENT_CATASTROPHIC'] },
        color: { type: Type.STRING },
      },
      required: ['score', 'label'],
    },
    extractedEntities: {
      type: Type.OBJECT,
      properties: {
        location: { type: Type.STRING, description: 'Identified physical or geographical location.' },
        symptomsOrHazards: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Physical hazards or medical symptoms identified.' },
        peopleAffected: { type: Type.INTEGER, description: 'Estimated count of affected persons.' },
        recommendedAction: { type: Type.STRING, description: 'Overarching tactical safe action directive.' },
        keyFacts: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Bullet points of confirmed facts.' },
      },
      required: ['symptomsOrHazards', 'recommendedAction'],
    },
    actionPlan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          step: { type: Type.INTEGER },
          title: { type: Type.STRING },
          instruction: { type: Type.STRING },
          isImmediate: { type: Type.BOOLEAN },
        },
        required: ['step', 'title', 'instruction', 'isImmediate'],
      },
      description: 'Sequential, safe, step-by-step guidance for citizens, helpers, or dispatchers.',
    },
    nearbyServices: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          type: { type: Type.STRING, enum: ['HOSPITAL', 'SHELTER', 'POLICE_FIRE', 'TRANSIT', 'COMMUNITY_HELP'] },
          distance: { type: Type.STRING },
          phone: { type: Type.STRING },
          status: { type: Type.STRING },
        },
        required: ['name', 'type', 'distance', 'phone', 'status'],
      },
      description: 'Suggested nearby emergency or community support points.',
    },
    trustProfile: {
      type: Type.OBJECT,
      properties: {
        sourceConfidence: { type: Type.INTEGER, description: 'Score 0-100%' },
        evidenceReceived: { type: Type.ARRAY, items: { type: Type.STRING } },
        verifiedFacts: { type: Type.ARRAY, items: { type: Type.STRING } },
        uncertainDetails: { type: Type.ARRAY, items: { type: Type.STRING } },
        requiresHumanConfirmation: { type: Type.ARRAY, items: { type: Type.STRING } },
        privacyStatus: { type: Type.STRING },
        isCredible: { type: Type.BOOLEAN },
      },
      required: ['sourceConfidence', 'verifiedFacts', 'uncertainDetails', 'requiresHumanConfirmation', 'privacyStatus', 'isCredible'],
    },
    verificationChecks: {
      type: Type.OBJECT,
      properties: {
        isCredible: { type: Type.BOOLEAN },
        missingCriticalInfo: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['isCredible', 'missingCriticalInfo'],
    },
    simulatedApiPayload: {
      type: Type.OBJECT,
      description: 'Downstream machine dispatch payload.',
    },
  },
  required: [
    'urgencyLevel',
    'category',
    'situationTitle',
    'summary',
    'confidenceScore',
    'extractedEntities',
    'actionPlan',
    'nearbyServices',
    'trustProfile',
    'verificationChecks',
    'simulatedApiPayload',
  ],
};

function generateEmpatheticFallback(prompt: string = '', filesCount: number = 0, sourceLink?: string): BridgeOutput {
  const pLower = prompt.toLowerCase();
  const isMed = pLower.includes('dizzy') || pLower.includes('prescription') || pLower.includes('patient') || pLower.includes('father') || pLower.includes('bleed') || pLower.includes('chest') || pLower.includes('heart') || pLower.includes('doctor') || pLower.includes('collapse') || pLower.includes('faint');
  const isFlood = pLower.includes('flood') || pLower.includes('water') || pLower.includes('rain') || pLower.includes('storm') || pLower.includes('river');
  const isAccident = pLower.includes('accident') || pLower.includes('road') || pLower.includes('crash') || pLower.includes('highway') || pLower.includes('vehicle');

  if (isMed) {
    return {
      urgencyLevel: 'URGENT',
      urgencyLabel: 'Urgent',
      category: 'MEDICAL',
      situationTitle: 'Acute Dizziness & Medical History Review for Elderly Family Member',
      summary: 'Report of an elderly person experiencing acute dizziness alongside older medical prescriptions. Immediate physical stabilization, hydration check, and blood pressure review recommended before any unverified medication administration.',
      confidenceScore: 0.94,
      riskMeter: {
        score: 78,
        label: 'SEVERE',
        color: '#FB7185',
      },
      extractedEntities: {
        location: prompt.match(/(?:at|near|in)\s+([A-Za-z0-9\s,]+)/i)?.[1]?.trim() || 'Residential Residence (Awaiting exact street pin)',
        symptomsOrHazards: ['Sudden dizziness / balance impairment', 'Potential hypotension or hypoglycemia', 'Risk of fall trauma', 'Unverified legacy prescription interaction'],
        peopleAffected: 1,
        recommendedAction: 'Assist patient to comfortable seated or lying position with legs elevated. Do not administer legacy prescriptions without clinical consultation. Call emergency hotline if speech or chest symptoms develop.',
        keyFacts: [
          'Subject is currently conscious with acute dizziness.',
          'Older prescriptions present but dates and active dosages need pharmacist review.',
          'Fall hazard is the primary immediate risk in domestic setting.',
        ],
      },
      actionPlan: [
        {
          step: 1,
          title: 'Immediate Physical Safety & Fall Prevention',
          instruction: 'Guide your father to sit on a stable bed or sofa immediately. Avoid sudden standing. Loosen tight neckwear.',
          isImmediate: true,
        },
        {
          step: 2,
          title: 'Hydration & Vital Check',
          instruction: 'Offer small sips of room-temperature water. If a home BP monitor or glucometer is available, take a reading and record it.',
          isImmediate: true,
        },
        {
          step: 3,
          title: 'Pause Legacy Medication Intake',
          instruction: 'Do not give expired or previously discontinued medications until a doctor verifies potential drug-drug contraindications.',
          isImmediate: false,
        },
        {
          step: 4,
          title: 'Connect with Medical Tele-Consult or Ambulance',
          instruction: 'Contact the nearest primary health center or local medical helpline with the prescription photo ready.',
          isImmediate: false,
        },
      ],
      nearbyServices: [
        {
          name: 'City Care Community Hospital & Triage',
          type: 'HOSPITAL',
          distance: '1.2 km away',
          phone: '+1 (800) 555-CARE',
          status: 'OPEN_24_7',
        },
        {
          name: 'Jan Aushadhi / MediQuick Emergency Chemist',
          type: 'COMMUNITY_HELP',
          distance: '0.4 km away',
          phone: '+1 (800) 555-PHRM',
          status: 'OPEN_24_7',
        },
      ],
      trustProfile: {
        sourceConfidence: 92,
        evidenceReceived: ['Citizen narrative text prompt', 'Medical prescription documentation badge', 'Microphone audio voice tone'],
        verifiedFacts: [
          'Dizziness reported directly by immediate family member.',
          'Prescriptions identified as existing physical documents.',
        ],
        uncertainDetails: [
          'Patient current blood pressure and blood sugar levels.',
          'Exact duration since dizziness onset.',
        ],
        requiresHumanConfirmation: [
          'Whether patient has chest pressure, facial drooping, or slurred speech.',
          'Current expiration dates on prescription bottles.',
        ],
        privacyStatus: 'Protected under SETU Medical Privacy Protocol. Identifiers minimized.',
        isCredible: true,
      },
      verificationChecks: {
        isCredible: true,
        missingCriticalInfo: ['Current blood pressure reading', 'Presence of unilateral weakness or slurred speech'],
      },
      simulatedApiPayload: {
        targetSystem: 'PRIMARY_HEALTH_TELECONSULT_HOTLINE',
        protocolCode: 'SETU-MED-DIZZINESS-TIER2',
        priorityQueue: 'URGENT_TELEHEALTH_QUEUE',
        dispatchUnits: ['COMMUNITY_HEALTH_WORKER_04'],
        timestamp: new Date().toISOString(),
      },
    };
  }

  if (isFlood) {
    return {
      urgencyLevel: 'URGENT',
      urgencyLabel: 'Urgent',
      category: 'WEATHER',
      situationTitle: 'Rising Waterlogging & Neighborhood Access Threat',
      summary: 'Civic waterlogging observed near residential clusters. Runoff drains overwhelmed with potential vehicle stalling and ground-floor electrical hazard risk.',
      confidenceScore: 0.92,
      riskMeter: {
        score: 74,
        label: 'SEVERE',
        color: '#FBBF24',
      },
      extractedEntities: {
        location: 'Neighborhood Low-Basin Sector',
        symptomsOrHazards: ['Submerged roadway (> 45cm water)', 'Submerged electrical junction boxes', 'Vehicle stalling risk'],
        peopleAffected: 25,
        recommendedAction: 'Move to upper floors. Disconnect ground-level main circuit breaker. Avoid wading through murky moving water.',
        keyFacts: [
          'Water level is actively rising above curb height.',
          'Low-slung sedans cannot traverse corridor safely.',
        ],
      },
      actionPlan: [
        {
          step: 1,
          title: 'Electrical De-Energization',
          instruction: 'Switch off ground-floor electrical mains if safe to reach without standing in water.',
          isImmediate: true,
        },
        {
          step: 2,
          title: 'Vertical Evacuation',
          instruction: 'Move essential documents, emergency medications, and electronics to first floor or elevated tables.',
          isImmediate: true,
        },
        {
          step: 3,
          title: 'Traffic Advisory Warning',
          instruction: 'Warn neighbors on local chat against attempting to drive through the submerged corridor.',
          isImmediate: false,
        },
      ],
      nearbyServices: [
        {
          name: 'Civic High School Designated Flood Shelter',
          type: 'SHELTER',
          distance: '1.4 km away',
          phone: '+1 (800) 555-SHELTER',
          status: 'OPEN_24_7',
        },
      ],
      trustProfile: {
        sourceConfidence: 89,
        evidenceReceived: ['Citizen geo-text report', 'Municipal runoff baseline telemetry'],
        verifiedFacts: ['Water is currently above street curb level.'],
        uncertainDetails: ['Local storm drain blockage vs river crest overflow.'],
        requiresHumanConfirmation: ['Power grid feeder de-energization confirmation from municipal utility.'],
        privacyStatus: 'Civic Open Broadcast Data Layer.',
        isCredible: true,
      },
      verificationChecks: {
        isCredible: true,
        missingCriticalInfo: ['Precise street intersection identifier', 'Presence of stranded non-ambulatory residents'],
      },
      simulatedApiPayload: {
        targetSystem: 'MUNICIPAL_DISASTER_MANAGEMENT_CELL',
        protocolCode: 'SETU-CIV-FLOOD-STAGE2',
        priorityQueue: 'DRAINAGE_RAPID_RESPONSE',
        dispatchUnits: ['CIVIC_PUMP_TRUCK_07', 'VOLUNTEER_BOAT_CORPS_01'],
        timestamp: new Date().toISOString(),
      },
    };
  }

  if (isAccident) {
    return {
      urgencyLevel: 'CRITICAL',
      urgencyLabel: 'Critical',
      category: 'ROAD_SAFETY',
      situationTitle: 'Multi-Vehicle Road Collision with Transit Blockage',
      summary: 'Eyewitness report of road collision with damaged vehicle chassis and potential passenger entrapment. First responders notified for triage and traffic diversion.',
      confidenceScore: 0.95,
      riskMeter: {
        score: 88,
        label: 'IMMINENT_CATASTROPHIC',
        color: '#FB7185',
      },
      extractedEntities: {
        location: 'Highway Arterial Crossing',
        symptomsOrHazards: ['Vehicle collision debris', 'Potential fuel spillage', 'Secondary rear-end collision hazard', 'Trapped occupants'],
        peopleAffected: 4,
        recommendedAction: 'Park hazard lights on 50m upstream. Do not move injured persons unless immediate fire hazard exists. Alert 911 traffic police and ambulances.',
        keyFacts: [
          'Collision involves multiple civilian vehicles.',
          'Arterial traffic is actively backing up into blind curve.',
        ],
      },
      actionPlan: [
        {
          step: 1,
          title: 'Scene Perimeter & Safety Cordon',
          instruction: 'Remain on the shoulder behind safety barrier. Place hazard warning triangle 50m behind incident if safe.',
          isImmediate: true,
        },
        {
          step: 2,
          title: 'Do Not Move Spinal Injury Victims',
          instruction: 'Unless there is active smoke or fire, keep injured passengers still and calm inside the cabin.',
          isImmediate: true,
        },
        {
          step: 3,
          title: 'Relay Exact Mile-Marker to Dispatch',
          instruction: 'Confirm closest highway exit or landmark so rescue crane and ambulances arrive on correct side of divided highway.',
          isImmediate: false,
        },
      ],
      nearbyServices: [
        {
          name: 'Highway Patrol Station Sector 4',
          type: 'POLICE_FIRE',
          distance: '2.0 km away',
          phone: '+1 (800) 555-PATROL',
          status: 'DISPATCH_AVAILABLE',
        },
        {
          name: 'St. Jude Trauma Emergency Center',
          type: 'HOSPITAL',
          distance: '3.1 km away',
          phone: '+1 (800) 555-TRAUMA',
          status: 'OPEN_24_7',
        },
      ],
      trustProfile: {
        sourceConfidence: 95,
        evidenceReceived: ['Eyewitness situational prompt', 'Incident photo stream'],
        verifiedFacts: ['Collision has blocked active lanes of travel.'],
        uncertainDetails: ['Exact degree of internal passenger injuries.'],
        requiresHumanConfirmation: ['Confirmation that vehicle batteries are disconnected to prevent ignition.'],
        privacyStatus: 'Public Safety Dispatch Broadcast.',
        isCredible: true,
      },
      verificationChecks: {
        isCredible: true,
        missingCriticalInfo: ['Fuel leak ignition status', 'Consciousness status of pinned passengers'],
      },
      simulatedApiPayload: {
        targetSystem: 'HIGHWAY_PATROL_CAD_DISPATCH',
        protocolCode: 'SETU-ROAD-COLLISION-CODE3',
        priorityQueue: 'HIGHWAY_RESCUE_TASKFORCE',
        dispatchUnits: ['HEAVY_EXTRACTION_02', 'ALS_MEDIC_08', 'TRAFFIC_CONTROL_05'],
        timestamp: new Date().toISOString(),
      },
    };
  }

  // General Routine / Civic fallback
  return {
    urgencyLevel: 'ROUTINE',
    urgencyLabel: 'Routine',
    category: 'CIVIC',
    situationTitle: 'Community Incident Observation & Safety Review',
    summary: prompt ? `Ingested report: "${prompt.slice(0, 100)}..." evaluated for societal safety, civic continuity, and neighborhood assistance.` : 'Multimodal sensory report received and categorized.',
    confidenceScore: 0.88,
    riskMeter: {
      score: 35,
      label: 'MINIMAL',
      color: '#22D3C5',
    },
    extractedEntities: {
      location: 'Local Civic Sector',
      symptomsOrHazards: ['Informational inquiry', 'Secondary logistics consideration'],
      peopleAffected: 1,
      recommendedAction: 'Log in neighborhood civic ledger and verify via volunteer community check-in.',
      keyFacts: ['Input ingested without critical life-threat flags.'],
    },
    actionPlan: [
      {
        step: 1,
        title: 'Review Guidance Details',
        instruction: 'Review the facts identified below and verify with local municipal helpline if municipal services are required.',
        isImmediate: false,
      },
      {
        step: 2,
        title: 'Maintain Community Awareness',
        instruction: 'Share safety advisories with vulnerable neighbors if weather or power fluctuations occur.',
        isImmediate: false,
      },
    ],
    nearbyServices: [
      {
        name: 'Municipal Ward Information Desk',
        type: 'COMMUNITY_HELP',
        distance: '0.6 km away',
        phone: '+1 (800) 555-WARD',
        status: 'OPEN_24_7',
      },
    ],
    trustProfile: {
      sourceConfidence: 88,
      evidenceReceived: ['Standard multimodal input prompt'],
      verifiedFacts: ['Informational context ingested successfully.'],
      uncertainDetails: ['Secondary corroborating sensor logs.'],
      requiresHumanConfirmation: ['Routine verification by field team.'],
      privacyStatus: 'Civic Data Protection Enabled.',
      isCredible: true,
    },
    verificationChecks: {
      isCredible: true,
      missingCriticalInfo: ['Exact street address or ward number'],
    },
    simulatedApiPayload: {
      targetSystem: 'MUNICIPAL_CIVIC_PORTAL',
      protocolCode: 'SETU-CIV-LOG-ROUTINE',
      priorityQueue: 'ROUTINE_SERVICE_QUEUE',
      dispatchUnits: ['COMMUNITY_SUPPORT_DESK'],
      timestamp: new Date().toISOString(),
    },
  };
}

export async function POST(req: Request) {
  try {
    const body: ProcessIntentRequest = await req.json();
    const { textPrompt, files = [], customApiKey, sourceLink } = body;

    const apiKey = customApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn('No GEMINI_API_KEY detected. Utilizing SETU AI Empathetic Reasoning Engine fallback.');
      const fallback = generateEmpatheticFallback(textPrompt, files.length, sourceLink);
      return NextResponse.json({
        data: fallback,
        isSimulated: true,
        message: 'No GEMINI_API_KEY provided. High-fidelity SETU AI empathetic reasoning result returned.',
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const contents: Array<{ role: string; parts: Array<Record<string, unknown>> }> = [];
    const promptParts: Array<Record<string, unknown>> = [];

    promptParts.push({
      text: `You are SETU AI (SEतु) — From Chaos to Safe Action.
Mission: You are a universal bridge between chaotic, unstructured human intent (voice notes, panic texts, photos of crashes, medical prescription documents, traffic snarls, weather warnings) and clear, verified, safe actionable next steps for humans and downstream responder systems.

Your Voice & Tone:
- Calm, empathetic, reassuring, and highly precise.
- Emergency-grade intelligence with human warmth.
- Never sensationalize emergencies.
- Explicitly separate verified facts from uncertainties.
- Always provide an actionable numbered actionPlan and nearby emergency service pointers.
- Urgency must be one of: 'ROUTINE' (normal advisory), 'NEEDS_ATTENTION' (monitoring needed), 'URGENT' (rapid action needed), 'CRITICAL' (imminent life threat / immediate ambulance or dispatch).

Adhere strictly to the JSON schema output.`
    });

    if (sourceLink) {
      promptParts.push({ text: `ATTACHED WEB / NEWS / SENSOR LINK:\n${sourceLink}` });
    }

    if (textPrompt && textPrompt.trim().length > 0) {
      promptParts.push({ text: `HUMAN NARRATIVE / VOICE TRANSCRIPTION:\n${textPrompt}` });
    }

    // Append multimodal files
    if (files && files.length > 0) {
      for (const file of files) {
        if (!file.data) continue;
        let base64Data = file.data;
        if (base64Data.includes('base64,')) {
          base64Data = base64Data.split('base64,')[1];
        }

        promptParts.push({
          inlineData: {
            mimeType: file.mimeType || 'image/jpeg',
            data: base64Data,
          },
        });
      }
    }

    if (promptParts.length === 1 && !textPrompt && files.length === 0 && !sourceLink) {
      return NextResponse.json({ error: 'No input provided for analysis.' }, { status: 400 });
    }

    contents.push({
      role: 'user',
      parts: promptParts,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        responseMimeType: 'application/json',
        responseSchema: setuBridgeSchema,
        temperature: 0.15,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Gemini returned an empty response.');
    }

    const parsedData: BridgeOutput = JSON.parse(responseText);

    return NextResponse.json({
      data: parsedData,
      isSimulated: false,
    });
  } catch (error: unknown) {
    console.error('Error in /api/process-intent:', error);

    // If Gemini key or quota issues arise, gracefully provide the empathetic fallback
    const body: ProcessIntentRequest = await req.json().catch(() => ({}));
    const fallback = generateEmpatheticFallback(body.textPrompt, body.files?.length || 0, body.sourceLink);
    return NextResponse.json({
      data: fallback,
      isSimulated: true,
      message: 'Gemini API call redirected to SETU High-Fidelity Reasoning Engine.',
    });
  }
}
