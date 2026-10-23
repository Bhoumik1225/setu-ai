import { BridgeOutput } from '@/types/bridge';

export interface PresetScenario {
  id: string;
  title: string;
  subtitle: string;
  category: 'MEDICAL' | 'DISASTER' | 'INFRASTRUCTURE';
  icon: string;
  badge: string;
  badgeColor: string;
  description: string;
  textPrompt: string;
  simulatedAudioName?: string;
  simulatedFileName?: string;
  simulatedFileType?: 'pdf' | 'image' | 'audio';
  sampleImageDataUrl?: string;
  expectedOutput: BridgeOutput;
}

const blockedBridgeSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%231a1a24"/><rect x="50" y="220" width="500" height="40" fill="%23374151"/><rect x="180" y="160" width="120" height="100" fill="%23ef4444" transform="rotate(-15 240 210)"/><text x="300" y="120" font-family="sans-serif" font-size="20" fill="%23f87171" text-anchor="middle" font-weight="bold">HIGHWAY 101 OVERPASS COLLAPSE</text><text x="300" y="320" font-family="monospace" font-size="14" fill="%239ca3af" text-anchor="middle">LIVE TRAFFIC CAM 44-B [SENSOR DETECTED DEBRIS]</text></svg>`;

const medicalChartSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230f172a"/><rect x="40" y="40" width="520" height="320" rx="8" fill="%231e293b" stroke="%2338bdf8" stroke-width="2"/><text x="70" y="80" font-family="sans-serif" font-size="18" fill="%2338bdf8" font-weight="bold">ST. JUDE EMERGENCY TRIAGE RECORD</text><text x="70" y="120" font-family="monospace" font-size="13" fill="%23e2e8f0">PATIENT ID: #7829-MRX | DOB: 12-04-1981</text><text x="70" y="150" font-family="monospace" font-size="13" fill="%23ef4444">CRITICAL ALLERGIES: PENICILLIN, SULFA, LATEX</text><text x="70" y="180" font-family="monospace" font-size="13" fill="%23f59e0b">CURRENT RX: METOPROLOL 50MG, ALBUTEROL INHALER</text><text x="70" y="210" font-family="monospace" font-size="13" fill="%2394a3b8">HISTORY: Ventricular Tachycardia, Severe Asthma</text><text x="70" y="270" font-family="monospace" font-size="12" fill="%2364748b">STATUS: UNCONSCIOUS COLLAPSE REPORTED AT DOWNTOWN STATION</text></svg>`;

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'emergency-medical-triage',
    title: 'Medical Emergency',
    subtitle: 'Voice Note + Messy PDF Chart',
    category: 'MEDICAL',
    icon: 'Activity',
    badge: 'CRITICAL',
    badgeColor: 'border-rose-500/50 bg-rose-500/20 text-rose-300 shadow-rose-950/40',
    description: 'Frantic 911 audio transcript from bystander reporting an unconscious commuter with cardiac arrest, cross-referenced with crumpled patient allergy card.',
    textPrompt: `[TRANSCRIBED 911 AUDIO DISPATCH - TAPE 09:42:15]
"Help! Somebody collapsed on the platform at 4th and Market Metro Station! He's clutching his chest, barely breathing, and his lips are turning blue! We found a folded medical chart in his jacket - says he has a history of Ventricular Tachycardia and severe Penicillin and Sulfa allergies! Please send an ambulance right now!"`,
    simulatedAudioName: '911_panic_call_platform4.wav',
    simulatedFileName: 'patient_7829_emergency_card.pdf',
    simulatedFileType: 'pdf',
    sampleImageDataUrl: medicalChartSvg,
    expectedOutput: {
      urgencyLevel: 'CRITICAL',
      category: 'MEDICAL',
      summary: 'Emergency Medical Triage: Bystander panic audio & clinical history card confirm acute ventricular tachycardia collapse with severe penicillin/sulfa contraindications.',
      confidenceScore: 0.97,
      riskMeter: {
        score: 94,
        label: 'IMMINENT_CATASTROPHIC',
        color: '#ef4444',
      },
      extractedEntities: {
        location: '4th and Market Metro Station, Platform Level',
        symptomsOrHazards: [
          'Cyanosis (lips turning bluish)',
          'Severe dyspnea / agonal breathing',
          'Acute cardiac arrest / collapse',
          'Documented Penicillin & Sulfa allergy'
        ],
        peopleAffected: 1,
        recommendedAction: 'Dispatch Advanced Life Support (ALS) Unit 12 with AED, suction, and airway kit. Alert Trauma ER with strict NO PENICILLIN/SULFA flag.',
      },
      verificationChecks: {
        isCredible: true,
        missingCriticalInfo: ['Current AED rhythm analysis status', 'Bystander CPR initiation confirmation'],
      },
      simulatedApiPayload: {
        targetSystem: 'CAD_911_EMERGENCY_DISPATCH',
        protocolCode: 'MED-ALS-CODE3-RED',
        priorityQueue: 'ALPHA_ZERO_IMMEDIATE',
        dispatchUnits: ['MEDIC_UNIT_12', 'PARAMEDIC_RESCUE_09'],
        traumaNotificationSent: true,
        automatedVoiceNotification: 'Paramedic dispatch confirmed. En route ETA 3.4 mins.',
        timestamp: new Date().toISOString(),
      },
    },
  },
  {
    id: 'disaster-infrastructure-hazard',
    title: 'Disaster / Infrastructure',
    subtitle: 'Hazard Image + Text Report',
    category: 'DISASTER',
    icon: 'AlertTriangle',
    badge: 'HIGH',
    badgeColor: 'border-amber-500/50 bg-amber-500/20 text-amber-300 shadow-amber-950/40',
    description: 'Post-tremor structural bridge collapse on Highway 101 Overpass with live sparking power lines, fuel smoke, and trapped civilian sedans.',
    textPrompt: `[CITIZEN SENSOR STREAM - HIGHWAY 101 OVERPASS]
"Highway 101 northbound overpass right at Mile Marker 44. A huge concrete support beam snapped during the tremor and crushed two lanes! Sparks are flying everywhere from dangling high-tension power cables. At least 3 sedans are pinned underneath. Traffic is backing up for miles and smoke is beginning to billow from the fuel tank."`,
    simulatedAudioName: 'citizen_witness_call_hwy101.wav',
    simulatedFileName: 'overpass_collapse_cam44b.jpg',
    simulatedFileType: 'image',
    sampleImageDataUrl: blockedBridgeSvg,
    expectedOutput: {
      urgencyLevel: 'HIGH',
      category: 'DISASTER',
      summary: 'Catastrophic overpass beam failure at HWY 101 MM 44. Live high-voltage electrical hazard and vehicle entrapment with active fire risk.',
      confidenceScore: 0.94,
      riskMeter: {
        score: 86,
        label: 'SEVERE',
        color: '#f59e0b',
      },
      extractedEntities: {
        location: 'Highway 101 Northbound Overpass at Mile Marker 44',
        symptomsOrHazards: [
          'Collapsed concrete structural beam',
          'Live ruptured high-tension power cables',
          'Trapped motorists in multiple vehicles',
          'Fuel leak ignition risk',
          'Complete arterial transit blockage'
        ],
        peopleAffected: 6,
        recommendedAction: 'Issue immediate SIGALERT closure. Isolate 500m perimeter. Cut grid power remotely via Pacific Grid EOC. Dispatch heavy extraction rescue & fire foam unit.',
      },
      verificationChecks: {
        isCredible: true,
        missingCriticalInfo: ['Substation grid feeder switch ID for power cutoff', 'Exact number of pinned occupants inside crushed sedans'],
      },
      simulatedApiPayload: {
        targetSystem: 'FEMA_REGIONAL_INCIDENT_COMMAND_DOT',
        protocolCode: 'CIV-STRUCTURAL-COLLAPSE-TIER1',
        priorityQueue: 'DISASTER_RESCUE_TASKFORCE',
        dispatchUnits: [
          'DOT_HEAVY_CRANE_08',
          'COUNTY_FIRE_USAR_TASKFORCE',
          'POWER_UTILITY_RAPID_DE-ENERGIZE'
        ],
        automatedCivilianAlert: {
          system: 'WEA_WIRELESS_EMERGENCY_ALERTS',
          headline: 'EMERGENCY: HWY 101 CLOSED AT MM 44. ALL TRAFFIC DIVERTED.',
          radiusMeters: 5000,
        },
        telemetry: {
          structuralIntegrityIndex: 0.14,
          powerlineHazardActive: true,
          geoPin: { lat: 37.5218, lng: -122.2612 },
        },
        timestamp: new Date().toISOString(),
      },
    },
  },
  {
    id: 'grid-failure-panic',
    title: 'Grid Failure',
    subtitle: 'Substation Blast + Panic Text',
    category: 'INFRASTRUCTURE',
    icon: 'Zap',
    badge: 'CRITICAL',
    badgeColor: 'border-yellow-500/50 bg-yellow-500/20 text-yellow-300 shadow-yellow-950/40',
    description: 'Sudden 230kV transformer explosion at Substation Delta-9 causing city blackout and hospital auxiliary backup generator failure.',
    textPrompt: `[CRITICAL ALERT - MUNICIPAL SCADA DESK]
"MAYDAY! Massive explosion at Metro Substation Delta-9. 230kV main transformer ruptured in flames. Regional grid collapsed across Sector 4 and 5. St. Jude Hospital ER reports their backup generator tripped and ICU ventilators are on secondary UPS batteries with under 25 minutes left! Traffic lights are dead across 40 intersections. We need emergency power units immediately!"`,
    simulatedFileName: 'substation_delta9_scada.png',
    simulatedFileType: 'image',
    sampleImageDataUrl: blockedBridgeSvg,
    expectedOutput: {
      urgencyLevel: 'CRITICAL',
      category: 'INFRASTRUCTURE',
      summary: 'Catastrophic Grid Failure: High-voltage regional substation explosion causing cascading power failure and ICU hospital backup generator risk.',
      confidenceScore: 0.98,
      riskMeter: {
        score: 96,
        label: 'IMMINENT_CATASTROPHIC',
        color: '#ef4444',
      },
      extractedEntities: {
        location: 'Metro Substation Delta-9 & St. Jude Medical Corridor',
        symptomsOrHazards: [
          'High-voltage 230kV transformer explosion & fire',
          'Cascading regional blackout across 4 civic sectors',
          'Hospital auxiliary backup generators overloaded (fuel < 3 hrs)',
          'Non-functional traffic grid & locked transit signals'
        ],
        peopleAffected: 45000,
        recommendedAction: 'Engage National Guard emergency power convoy. Reroute priority grid feeder line to St. Jude ICU. Deploy mobile diesel turbine generators.',
      },
      verificationChecks: {
        isCredible: true,
        missingCriticalInfo: ['Fuel reserve telemetry at Mercy General and St. Jude', 'SCADA remote bypass breaker confirmation'],
      },
      simulatedApiPayload: {
        targetSystem: 'NERC_CRISIS_GRID_COMMAND_EOC',
        protocolCode: 'INFRA-GRID-BLACKSTART-ALPHA',
        priorityQueue: 'NATIONAL_INFRASTRUCTURE_DEFENSE',
        dispatchUnits: ['USACE_POWER_FLOTILLA_4', 'REGIONAL_GRID_FIRE_TASKFORCE', 'DOT_SIGNALS_EMERGENCY'],
        automatedGridOverride: {
          substationId: 'SUB-DELTA-9',
          islanderStatus: 'ISOLATION_TRIGGERED',
          priorityFeeders: ['HOSPITAL_DISTRICT_FEEDER_01'],
        },
        timestamp: new Date().toISOString(),
      },
    },
  },
];
