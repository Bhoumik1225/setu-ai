# 🌐 OmniBridge: Universal Intent-to-Action Gateway

> **Societal Benefit Hackathon Challenge Submission**  
> An AI-powered universal bridge transforming chaotic, unstructured multimodal human intent into structured, verified, life-saving actions for downstream emergency and civic response systems.

---

## 🚀 Key Highlights & Architecture

In emergency crisis scenarios, humans communicate under extreme duress: panicked 911 audio recordings, fragmented bystander texts, blurry photos of collapsed bridges, and crumpled medical history sheets.

**OmniBridge** bridges human intent and complex mission-critical systems through:

1. **Universal Multimodal Ingestion Hub (`src/components/MultimodalInputHub.tsx`)**:
   - In-browser live microphone voice recording (MediaRecorder API with WebM audio blobs).
   - Drag-and-drop zone accepting mixed media: incident photos, medical PDFs, acoustic clips, and text transcripts.
   - Quick-select testing presets benchmarked for hackathon challenges.

2. **Gemini Multimodal Reasoning Engine (`src/app/api/process-intent/route.ts`)**:
   - Built on `@google/genai` with `gemini-2.5-flash` multimodal inference.
   - Strictly enforced **Structured Outputs / JSON Schema** mapping to the standardized `BridgeOutput` TypeScript interface:
     - `urgencyLevel`: `'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'`
     - `category`: `'MEDICAL' | 'DISASTER' | 'INFRASTRUCTURE' | 'GENERAL'`
     - `summary`: High-density executive action summary.
     - `extractedEntities`: Location, symptoms/hazards list, people affected count, and tactical recommended action.
     - `verificationChecks`: Credibility flag and missing critical information checklist.
     - `simulatedApiPayload`: Machine-to-machine downstream webhook payload for CAD 911 / FEMA EOC.

3. **Autonomous Dispatch Action Dashboard (`src/components/StructuredActionDashboard.tsx`)**:
   - Visual operational telemetry with color-coded urgency banners.
   - Computer Aided Dispatch (CAD 911) terminal view.
   - RFC-8259 compliant JSON payload inspector with one-click copy and simulated webhook trigger.

---

## 🛠️ Quickstart

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm 10+

### Installation & Launch

```bash
# Navigate to the project directory
cd omnibridge

# Install dependencies (already pre-installed)
npm install

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Gemini API Key Configuration
OmniBridge can be configured in two ways:
1. **Via Environment Variable**:
   ```bash
   export GEMINI_API_KEY="your_api_key_here"
   npm run dev
   ```
2. **Via In-App Key Modal**:
   Click **"Configure Gemini Key"** in the top navigation bar to test live with any Google AI Studio key.
3. **Simulation Mode**:
   If no key is provided, OmniBridge runs on its built-in realistic high-fidelity emergency simulation engine.

---

## 📋 Included Benchmark Presets
1. **Emergency Medical Triage**:
   - *Input*: Frantic bystander voice note + crumpled medical triage history chart with Ventricular Tachycardia and Penicillin/Sulfa allergies.
   - *Output*: CRITICAL ALS ambulance dispatch with allergy contraindication flags.
2. **Disaster & Infrastructure Report**:
   - *Input*: Shaky incident camera snapshot of collapsed Highway 101 overpass with sparking live powerlines.
   - *Output*: HIGH urgency SIGALERT highway shutdown, grid de-energization, and heavy USAR crane taskforce deployment.
3. **Wildfire Flash Evacuation**:
   - *Input*: Thermal imagery + alarm transcript for nursing home evacuation in canyon.
   - *Output*: CRITICAL Level 3 "GO NOW" paratransit fleet mobilization.
