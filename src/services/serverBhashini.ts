// Bhashini ULCA API Integration Service (Server-side)
// Official MeitY Bhashini endpoints for Indian Languages ASR (Speech-to-Text) & TTS (Text-to-Speech)
// Supports Hindi ('hi') and English ('en') with automatic language detection

export interface BhashiniSTTRequest {
  audioBase64: string; // Base64-encoded audio data
  audioFormat?: string; // e.g. 'wav', 'mp3', 'webm'
  samplingRate?: number; // e.g. 16000, 44100
  language?: 'hi' | 'en' | 'auto';
}

export interface BhashiniSTTResponse {
  success: boolean;
  transcript: string;
  language: 'hi' | 'en';
  source: 'bhashini' | 'fallback';
  error?: string;
}

export interface BhashiniTTSRequest {
  text: string;
  language: 'hi' | 'en' | 'hinglish';
  gender?: 'female' | 'male';
}

export interface BhashiniTTSResponse {
  success: boolean;
  audioBase64?: string;
  audioFormat?: string;
  language: 'hi' | 'en';
  source: 'bhashini' | 'fallback';
  error?: string;
}

// In-memory cache for Bhashini pipeline config
let pipelineConfigCache: {
  timestamp: number;
  data: any;
} | null = null;

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export function getBhashiniCredentials() {
  const userId = process.env.BHASHINI_USER_ID || process.env.ULCA_USER_ID || '';
  const apiKey = process.env.BHASHINI_API_KEY || process.env.ULCA_API_KEY || '';
  const pipelineId = process.env.BHASHINI_PIPELINE_ID || process.env.ULCA_PIPELINE_ID || '';
  const inferenceApiKey = process.env.BHASHINI_INFERENCE_API_KEY || '';

  return {
    userId: userId.trim(),
    apiKey: apiKey.trim(),
    pipelineId: pipelineId.trim(),
    inferenceApiKey: inferenceApiKey.trim(),
    isConfigured: Boolean(userId.trim() && apiKey.trim()),
  };
}

/**
 * Fetch or get cached model pipeline configuration from Bhashini ULCA
 */
async function getPipelineConfig(taskType: 'asr' | 'tts', sourceLang: 'hi' | 'en') {
  const creds = getBhashiniCredentials();
  if (!creds.isConfigured) return null;

  const now = Date.now();
  if (pipelineConfigCache && now - pipelineConfigCache.timestamp < CACHE_TTL_MS) {
    return pipelineConfigCache.data;
  }

  try {
    const configUrl = 'https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline';
    const payload: any = {
      pipelineTasks: [
        {
          taskType,
          config: {
            language: {
              sourceLanguage: sourceLang,
            },
          },
        },
      ],
      pipelineRequestConfig: {
        pipelineId: creds.pipelineId || undefined,
      },
    };

    const res = await fetch(configUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        userID: creds.userId,
        ulcaApiKey: creds.apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.warn(`Bhashini getModelsPipeline error HTTP ${res.status}: ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    pipelineConfigCache = { timestamp: now, data };
    return data;
  } catch (err: any) {
    console.warn('Bhashini getPipelineConfig exception:', err?.message || err);
    return null;
  }
}

/**
 * Perform Speech-to-Text via Bhashini API
 */
export async function transcribeAudioWithBhashini(
  req: BhashiniSTTRequest
): Promise<BhashiniSTTResponse> {
  const creds = getBhashiniCredentials();
  const targetLang = req.language === 'hi' ? 'hi' : 'en';

  if (!creds.isConfigured || !req.audioBase64) {
    return {
      success: false,
      transcript: '',
      language: targetLang,
      source: 'fallback',
      error: !creds.isConfigured ? 'Bhashini API credentials not configured' : 'No audio provided',
    };
  }

  try {
    const pipelineConfig = await getPipelineConfig('asr', targetLang);
    const callbackUrl =
      pipelineConfig?.pipelineInferenceAPIEndPoint?.callbackUrl ||
      'https://dhruva-api.bhashini.gov.in/services/inference/pipeline';

    const inferenceToken =
      pipelineConfig?.pipelineInferenceAPIEndPoint?.inferenceApiKey?.value ||
      creds.inferenceApiKey ||
      creds.apiKey;

    const asrConfig = pipelineConfig?.pipelineResponseConfig?.find(
      (c: any) => c.taskType === 'asr'
    )?.config?.[0];

    const serviceId = asrConfig?.serviceId || '';

    const computePayload = {
      pipelineTasks: [
        {
          taskType: 'asr',
          config: {
            language: {
              sourceLanguage: targetLang,
            },
            serviceId: serviceId || undefined,
            audioFormat: req.audioFormat || 'wav',
            samplingRate: req.samplingRate || 16000,
          },
        },
      ],
      inputData: {
        audio: [
          {
            audioContent: req.audioBase64,
          },
        ],
      },
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      userID: creds.userId,
      ulcaApiKey: creds.apiKey,
    };
    if (inferenceToken) {
      headers['Authorization'] = inferenceToken;
    }

    const computeRes = await fetch(callbackUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(computePayload),
    });

    if (!computeRes.ok) {
      const errText = await computeRes.text();
      throw new Error(`Bhashini STT HTTP ${computeRes.status}: ${errText}`);
    }

    const result = await computeRes.json();
    const transcript =
      result?.pipelineResponse?.[0]?.output?.[0]?.source ||
      result?.pipelineResponse?.[0]?.output?.[0]?.target ||
      '';

    // Detect if transcript is Hindi
    const isDevanagari = /[\u0900-\u097F]/.test(transcript);
    const detectedLang: 'hi' | 'en' = isDevanagari ? 'hi' : targetLang;

    return {
      success: Boolean(transcript),
      transcript: transcript.trim(),
      language: detectedLang,
      source: 'bhashini',
    };
  } catch (err: any) {
    console.error('Bhashini STT inference error:', err?.message || err);
    return {
      success: false,
      transcript: '',
      language: targetLang,
      source: 'fallback',
      error: err?.message || 'Bhashini STT processing failed',
    };
  }
}

/**
 * Perform Text-to-Speech via Bhashini API
 */
export async function synthesizeSpeechWithBhashini(
  req: BhashiniTTSRequest
): Promise<BhashiniTTSResponse> {
  const creds = getBhashiniCredentials();
  const rawLang = req.language;
  const targetLang: 'hi' | 'en' = rawLang === 'hi' ? 'hi' : 'en';

  if (!creds.isConfigured || !req.text) {
    return {
      success: false,
      language: targetLang,
      source: 'fallback',
      error: !creds.isConfigured ? 'Bhashini API credentials not configured' : 'No text provided',
    };
  }

  try {
    const pipelineConfig = await getPipelineConfig('tts', targetLang);
    const callbackUrl =
      pipelineConfig?.pipelineInferenceAPIEndPoint?.callbackUrl ||
      'https://dhruva-api.bhashini.gov.in/services/inference/pipeline';

    const inferenceToken =
      pipelineConfig?.pipelineInferenceAPIEndPoint?.inferenceApiKey?.value ||
      creds.inferenceApiKey ||
      creds.apiKey;

    const ttsConfig = pipelineConfig?.pipelineResponseConfig?.find(
      (c: any) => c.taskType === 'tts'
    )?.config?.[0];

    const serviceId = ttsConfig?.serviceId || '';

    // Strip out markdown symbols for clean oral synthesis
    const cleanText = req.text
      .replace(/[#*_`~>[\]()]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\n+/g, '. ')
      .trim();

    const computePayload = {
      pipelineTasks: [
        {
          taskType: 'tts',
          config: {
            language: {
              sourceLanguage: targetLang,
            },
            serviceId: serviceId || undefined,
            gender: req.gender || 'female',
          },
        },
      ],
      inputData: {
        input: [
          {
            source: cleanText,
          },
        ],
      },
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      userID: creds.userId,
      ulcaApiKey: creds.apiKey,
    };
    if (inferenceToken) {
      headers['Authorization'] = inferenceToken;
    }

    const computeRes = await fetch(callbackUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(computePayload),
    });

    if (!computeRes.ok) {
      const errText = await computeRes.text();
      throw new Error(`Bhashini TTS HTTP ${computeRes.status}: ${errText}`);
    }

    const result = await computeRes.json();
    const audioContent =
      result?.pipelineResponse?.[0]?.audio?.[0]?.audioContent ||
      result?.pipelineResponse?.[0]?.audioContent ||
      '';

    return {
      success: Boolean(audioContent),
      audioBase64: audioContent,
      audioFormat: 'wav',
      language: targetLang,
      source: 'bhashini',
    };
  } catch (err: any) {
    console.error('Bhashini TTS inference error:', err?.message || err);
    return {
      success: false,
      language: targetLang,
      source: 'fallback',
      error: err?.message || 'Bhashini TTS synthesis failed',
    };
  }
}
