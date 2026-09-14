import Groq from 'groq-sdk';

export interface GroqChatbotMessage {
  role: 'user' | 'assistant' | 'system' | 'model';
  content?: string;
  parts?: string;
}

export interface GroqChatbotRequest {
  message: string;
  history?: GroqChatbotMessage[];
  mode?: 'chat' | 'audio_call' | 'video_call';
  language?: 'en' | 'hi' | 'auto';
  context?: {
    userName?: string;
    userRole?: string;
    projectId?: string;
    projectName?: string;
    cameraCount?: number;
    currentGrievanceId?: string;
    [key: string]: any;
  };
}

export interface GroqChatbotResponse {
  isSimulatedFallback: boolean;
  modelUsed: string;
  speechText: string;
  displayText: string;
  actionTaken?: string;
  resolved: boolean;
  ticketData?: {
    category: 'SCHOLARSHIP' | 'CCTV_OFFLINE' | 'ATTENDANCE_ANOMALY' | 'INSPECTION_APPEAL' | 'GRANT_IN_AID' | 'GENERAL_GRIEVANCE';
    subject: string;
    description: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    resolutionNotes: string;
  };
  suggestedQuickReplies: string[];
}

let groqClient: Groq | null = null;

export function getGroqClient(): Groq | null {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === 'your_groq_api_key' || apiKey.trim() === '') {
    return null;
  }
  if (!groqClient) {
    groqClient = new Groq({ apiKey: apiKey.trim() });
  }
  return groqClient;
}

const DEFAULT_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const FALLBACK_MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'];

function buildSystemPrompt(context: Record<string, any> = {}, mode: string = 'chat', language: string = 'en'): string {
  return `
You are "Satya Nirakshak AI Assistant", the official intelligent assistant for the Satya Nirakshak monitoring & inspection platform under the Ministry of Social Justice and Empowerment (DoSJE), Government of India.

PURPOSE & SCOPE:
You assist NGO staff, field officers, inspectors, district/central administrators, and authorized personnel with:
1. NGO project monitoring: Tracking verified facilities, operational statuses, and resource allocations.
2. Field inspections: Assisting with physical verification protocols, geo-tagged photo guidelines, and scheduling.
3. Inspection checklists: Explaining standard audit criteria across infrastructure, beneficiary health, nutrition, and hygiene.
4. Project status: Providing clear status overviews for registered welfare homes and de-addiction centers.
5. Compliance guidance: Explaining statutory norms under GIA (Grant-in-Aid) schemes, Atal Vayo Abhyuday Yojana (AVYAY), and NAPDDR.
6. Field reports: Helping summarize observations, non-compliance markers, and corrective action recommendations.
7. Beneficiary/program monitoring: Aadhaar-based attendance tracking (AEBAS), daily roster records, and nutrition standards.
8. Resource/document guidance: Assisting with utilization certificates, statutory registers, and fire/safety NOC requirements.
9. Issue reporting: Logging grievances for payment/stipend delays, CCTV stream dropouts, or biometric equipment errors.
10. Impact monitoring: Tracking qualitative rehabilitation, elderly care metrics, and skill training outcomes.
11. Dashboard-related assistance: Guiding users to CCTV streams, random inspection tools, analytics graphs, and audit logs.

CORE PRINCIPLES & CONSTRAINTS:
- Give clear, objective, and practical answers.
- Never fabricate official rules, statutory guidelines, statistics, inspection reports, or legal documents.
- Clearly state when specific information is unavailable or requires on-ground verification by an authorized officer.
- Protect sensitive beneficiary information and proprietary NGO records; never disclose private personal identifiers.
- Avoid making administrative decisions that must legally be made by authorized DoSJE or district welfare officers.
- Keep responses concise, respectful, and professional.
- Language: Respond in ${language === 'hi' ? 'Hindi (हिंदी)' : 'English'}, or match the user's input language.
- Mode of interaction: ${mode} (if audio_call or video_call, provide warm, spoken cadence in "speechText" without asterisks or emojis).

RESPONSE FORMAT:
You MUST respond with a strictly valid JSON object matching this schema (do NOT wrap with markdown code fences):
{
  "speechText": "Natural human spoken response with no markdown, asterisks, emojis, or bullets (suitable for text-to-speech oral delivery)",
  "displayText": "Comprehensive, well-structured markdown for display with headings, bullet points, and official advisories",
  "actionTaken": "Brief summary of administrative action taken, docket created, or null",
  "resolved": true or false,
  "ticketData": {
    "category": "SCHOLARSHIP" | "CCTV_OFFLINE" | "ATTENDANCE_ANOMALY" | "INSPECTION_APPEAL" | "GRANT_IN_AID" | "GENERAL_GRIEVANCE",
    "subject": "Clear docket subject line",
    "description": "Issue summary",
    "priority": "LOW" | "MEDIUM" | "HIGH" | "URGENT",
    "resolutionNotes": "Concrete next steps or statutory guidance"
  } or null,
  "suggestedQuickReplies": ["Practical follow-up prompt 1", "Practical follow-up prompt 2", "Practical follow-up prompt 3"]
}

CURRENT USER CONTEXT:
- Name: ${context.userName || 'Authorized Personnel / User'}
- Role: ${context.userRole || 'FIELD_OFFICER'}
- Focus Project: ${context.projectName || 'Central Welfare Monitoring Grid'}
`.trim();
}

export async function processGroqAIChatbotQuery(req: GroqChatbotRequest): Promise<GroqChatbotResponse> {
  const { message, history = [], mode = 'chat', language = 'en', context = {} } = req;

  // Validate message
  if (!message || typeof message !== 'string' || !message.trim()) {
    throw new Error('Message content is required and cannot be empty.');
  }

  const cleanMessage = message.trim();
  const groq = getGroqClient();

  if (groq) {
    const systemPrompt = buildSystemPrompt(context, mode, language);

    // Build chat message payload
    const chatMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
    ];

    // Append conversation history
    if (Array.isArray(history) && history.length > 0) {
      for (const h of history.slice(-8)) {
        const text = h.content || h.parts || '';
        if (!text) continue;
        const role = h.role === 'assistant' || h.role === 'model' ? 'assistant' : 'user';
        chatMessages.push({ role, content: text });
      }
    }

    // Add current user message
    chatMessages.push({ role: 'user', content: cleanMessage });

    // Models to attempt: configured model first, followed by fallbacks
    const modelsToTry = [DEFAULT_MODEL, ...FALLBACK_MODELS.filter((m) => m !== DEFAULT_MODEL)];

    for (const modelName of modelsToTry) {
      try {
        const completion = await groq.chat.completions.create({
          model: modelName,
          messages: chatMessages,
          temperature: 0.3,
          max_tokens: 1500,
          response_format: { type: 'json_object' },
        });

        const rawContent = completion.choices?.[0]?.message?.content?.trim() || '';
        if (!rawContent) {
          continue;
        }

        let parsed: any;
        try {
          parsed = JSON.parse(rawContent);
        } catch {
          // If JSON parse failed, try extracting JSON substring
          const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            parsed = JSON.parse(jsonMatch[0]);
          } else {
            parsed = {
              displayText: rawContent,
              speechText: rawContent.replace(/[*#_`]/g, '').slice(0, 300),
              resolved: false,
              suggestedQuickReplies: ['Project Monitoring Help', 'Field Inspection Checklist', 'Contact Administrator'],
            };
          }
        }

        const displayText = parsed.displayText || parsed.speechText || rawContent;
        const speechText =
          parsed.speechText ||
          displayText.replace(/[*#_`]/g, '').replace(/\n+/g, ' ').slice(0, 300);

        return {
          isSimulatedFallback: false,
          modelUsed: `Groq (${modelName})`,
          speechText,
          displayText,
          actionTaken: parsed.actionTaken || undefined,
          resolved: Boolean(parsed.resolved),
          ticketData: parsed.ticketData || undefined,
          suggestedQuickReplies:
            Array.isArray(parsed.suggestedQuickReplies) && parsed.suggestedQuickReplies.length > 0
              ? parsed.suggestedQuickReplies
              : ['Field Inspection Checklist', 'CCTV Status Check', 'Compliance Norms'],
        };
      } catch (err: any) {
        // If rate limit (429) or model not found (404), log securely and try next model
        console.warn(`Groq request with model ${modelName} encountered an issue:`, err?.message || err);
        // Continue loop to try fallback model
      }
    }
  }

  // Graceful domain fallback if Groq API key is not configured or all attempts timed out
  return generateDomainFallbackResponse(cleanMessage, mode, language, context);
}

function generateDomainFallbackResponse(
  message: string,
  mode: 'chat' | 'audio_call' | 'video_call',
  language: string,
  context: Record<string, any>
): GroqChatbotResponse {
  const q = message.toLowerCase();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const isHindi = language === 'hi' || /[\u0900-\u097F]/.test(message);

  // 1. INSPECTION / CHECKLIST / AUDIT
  if (q.includes('inspection') || q.includes('checklist') || q.includes('audit') || q.includes('निरीक्षण') || q.includes('चेकलिस्ट')) {
    const docketNo = `INSP-2026-${randomNum}`;
    return {
      isSimulatedFallback: true,
      modelUsed: 'Satya Nirakshak Domain Engine (Groq Key Pending)',
      speechText: isHindi
        ? `नमस्ते। सत्य निरीक्षक निरीक्षण प्रणाली में आपका स्वागत है। फील्ड निरीक्षण हेतु जीपीएस-टैग्ड फोटो एवं मानकीकृत चेकलिस्ट अनिवार्य है। आपकी जांच संदर्भ संख्या ${docketNo} दर्ज कर ली गई है।`
        : `Namaste. Welcome to Satya Nirakshak Inspection Desk. For on-site field visits, geo-tagged photo evidence within ten meters of the facility and digital checklist verification are mandatory. Docket number ${docketNo} has been logged.`,
      displayText: isHindi
        ? `### 📋 सत्य निरीक्षक - फील्ड निरीक्षण एवं चेकलिस्ट मार्गदर्शन\n\n* **संदर्भ डॉकेट:** \`${docketNo}\`\n* **अनिवार्य मानक चेकलिस्ट:**\n  1. **बुनियादी ढांचा:** स्वच्छ पेयजल, हवादार कमरे, प्राथमिक चिकित्सा किट एवं सीसीटीवी कवरेज।\n  2. **उपस्थिति मिलान:** दैनिक बायोमेट्रिक (AEBAS) एवं भौतिक रजिस्टर का 100% सत्यापन।\n  3. **जियो-टैगिंग:** न्यूनतम 4 दिशात्मक तस्वीरों के साथ GPS लोकेशन (त्रुटि सीमा ≤10 मीटर)।\n* **स्थिति:** जिला निरीक्षण दल को समीक्षा हेतु अग्रेषित।`
        : `### 📋 Satya Nirakshak - Field Inspection & Checklist Protocol\n\n* **Docket Reference:** \`${docketNo}\`\n* **Mandatory Verification Standards:**\n  1. **Infrastructure:** Clean potable water, ventilation, first-aid, fire safety NOC, and active CCTV stream.\n  2. **Attendance Reconciliation:** Cross-check AEBAS biometric headcount with physical muster rolls.\n  3. **Geo-tagging Protocol:** 4-point timestamped photos with GPS variance under 10 meters.\n* **Status:** Forwarded to District Monitoring Directorate for schedule dispatch.`,
      actionTaken: `Created Inspection Guidance Docket #${docketNo}`,
      resolved: true,
      ticketData: {
        category: 'INSPECTION_APPEAL',
        subject: 'Standard Field Inspection Protocol & Checklist Review',
        description: message,
        priority: 'MEDIUM',
        resolutionNotes: 'Standard field checklist guidelines provided. Assigned to District Inspection Officer for verification.',
      },
      suggestedQuickReplies: [
        'Download Inspection Checklist',
        'Check GPS Accuracy Rules',
        'Schedule Surprise Inspection',
      ],
    };
  }

  // 2. CCTV / LIVE STREAM / SURVEILLANCE
  if (q.includes('cctv') || q.includes('camera') || q.includes('stream') || q.includes('ऑफलाइन') || q.includes('कैमरा')) {
    const docketNo = `CCTV-2026-${randomNum}`;
    return {
      isSimulatedFallback: true,
      modelUsed: 'Satya Nirakshak Domain Engine (Groq Key Pending)',
      speechText: isHindi
        ? `सीसीटीवी कैमरा नेटवर्क संबंधी जांच दर्ज की गई है। संस्थान के लिए 72 घंटे का तकनीकी रखरखाव ग्रेस टिकट ${docketNo} जारी किया गया है।`
        : `CCTV stream diagnostic initiated. A 72-hour technical maintenance waiver ticket ${docketNo} has been registered to prevent compliance penalty while routers reboot.`,
      displayText: `### 📹 CCTV Live Stream Diagnostic\n\n* **Protocol:** Continuous 24x7 RTSP streaming to Central Monitoring Grid.\n* **Troubleshooting Steps:**\n  1. Power-cycle NVR/DVR router and confirm static IP connectivity.\n  2. Verify minimum 2 Mbps dedicated upload bandwidth per camera stream.\n  3. Ensure camera lens coverage spans dormitories, dining halls, and entrance gates.\n* **Compliance Protection:** **72-hour maintenance waiver** registered under Docket \`${docketNo}\`.`,
      actionTaken: `Logged CCTV Maintenance Waiver #${docketNo}`,
      resolved: true,
      ticketData: {
        category: 'CCTV_OFFLINE',
        subject: 'CCTV Stream Maintenance & Downtime Waiver',
        description: message,
        priority: 'MEDIUM',
        resolutionNotes: '72-hour technical compliance grace granted for router & RTSP stream reboot.',
      },
      suggestedQuickReplies: ['View Live CCTV Feeds', 'Submit Bandwidth Test', 'Request Camera Relocation'],
    };
  }

  // 3. BIOMETRIC ATTENDANCE / AEBAS
  if (q.includes('attendance') || q.includes('biometric') || q.includes('aebas') || q.includes('उपस्थिति') || q.includes('बायोमेट्रिक')) {
    const docketNo = `ATT-2026-${randomNum}`;
    return {
      isSimulatedFallback: true,
      modelUsed: 'Satya Nirakshak Domain Engine (Groq Key Pending)',
      speechText: isHindi
        ? `बायोमेट्रिक उपस्थिति संबंधी विवरण प्राप्त हुआ है। सर्वर सिंक त्रुटि के दौरान भौतिक मस्टर रोल व आइरिस स्कैनर बैकअप अधिकृत किया गया है। टिकट ${docketNo} दर्ज है।`
        : `Biometric attendance concern noted. While AEBAS sync recovers, manual register entries counter-signed by the Project In-Charge are authorized. Ticket ${docketNo} has been recorded.`,
      displayText: `### 🕒 Biometric & Attendance Reconciliation\n\n* **Operational Protocol:** Daily Aadhaar-enabled biometric attendance (AEBAS) for all sanctioned beneficiaries.\n* **Contingency Authorization:**\n  1. Temporary **Iris / Facial fallback mode** authorized for unreadable fingerprints.\n  2. Maintain signed physical muster roll with daily meal count verification.\n  3. Offline biometric punches will auto-synchronize upon NIC network reconnection.\n* **Grievance Docket:** \`${docketNo}\``,
      actionTaken: `Authorized Fallback Register Protocol under Docket #${docketNo}`,
      resolved: true,
      ticketData: {
        category: 'ATTENDANCE_ANOMALY',
        subject: 'AEBAS Biometric Machine Sync Error & Fallback Approval',
        description: message,
        priority: 'HIGH',
        resolutionNotes: 'Manual muster-roll authorization recorded with photo verification protocol.',
      },
      suggestedQuickReplies: ['How to sync AEBAS data?', 'Check Attendance Analytics', 'Schedule Headcount Verification'],
    };
  }

  // 4. GENERAL ASSISTANCE
  const docketNo = `SN-2026-${randomNum}`;
  return {
    isSimulatedFallback: true,
    modelUsed: 'Satya Nirakshak Domain Engine (Groq Key Pending)',
    speechText: isHindi
      ? `नमस्ते। मैं सत्य निरीक्षक एआई सहायक हूँ। मैं एनजीओ प्रोजेक्ट निगरानी, फील्ड निरीक्षण, चेकलिस्ट और अनुपालन में आपकी सहायता के लिए उपस्थित हूँ।`
      : `Namaste. I am the Satya Nirakshak AI Assistant. I can assist you with NGO project monitoring, field inspections, compliance checklists, CCTV streams, and grievance resolution. How may I help you today?`,
    displayText: isHindi
      ? `### 🏛️ सत्य निरीक्षक एआई सहायक (सामाजिक न्याय एवं अधिकारिता मंत्रालय)\n\nमैं निम्नलिखित विषयों में आपकी तत्काल सहायता कर सकता हूँ:\n\n* **फील्ड निरीक्षण:** मानक चेकलिस्ट, जियो-टैगिंग दिशानिर्देश एवं ऑन-साइट डॉजियर।\n* **सीसीटीवी निगरानी:** लाइव स्ट्रीम स्थिति एवं तकनीकी छूट अनुरोध।\n* **बायोमेट्रिक सत्यापन:** AEBAS उपस्थिति मिलान एवं विसंगति समाधान।\n* **अनुपालन व रिपोर्ट:** जीआईए (Grant-in-Aid) दिशा-निर्देश एवं स्थिति ट्रैकिंग।\n\n*कृपया अपना प्रश्न दर्ज करें अथवा नीचे दिए गए त्वरित विकल्पों में से चुनें।*`
      : `### 🏛️ Satya Nirakshak AI Assistant (Ministry of Social Justice & Empowerment)\n\nI am configured to assist NGO staff, field inspectors, and administrators with:\n\n* **Field Inspections:** Verification checklists, GPS-stamped photo rules, and inspection dossiers.\n* **Project Monitoring:** Sanctioned capacity, active beneficiaries, and risk assessments.\n* **CCTV Surveillance:** 24x7 live stream diagnostic and downtime waiver dockets.\n* **Biometric Attendance:** AEBAS synchronization and headcount reconciliation.\n\n*Please type your query or select a quick action below.*`,
    actionTaken: 'Satya Nirakshak AI Session Active',
    resolved: false,
    suggestedQuickReplies: [
      'Field Inspection Checklist',
      'CCTV Troubleshooting Protocol',
      'Biometric Sync Assistance',
      'GIA Compliance Guidelines',
    ],
  };
}
