// Bhashini Voice Assistant Client Service
// Integrates with backend Bhashini STT and TTS endpoints for Hindi & English oral interaction
// Supports MediaRecorder audio capture with seamless fallback to browser Web Speech API

import { api } from './api';

export interface BhashiniVoiceConfig {
  preferredGender?: 'female' | 'male';
}

class BhashiniVoiceService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private mediaStream: MediaStream | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;
  private isRecordingActive = false;
  private isSynthesizingActive = false;

  /**
   * Play Bhashini generated audio or fall back gracefully
   */
  public async playBhashiniTTS(
    text: string,
    language: 'hi' | 'en' | 'hinglish',
    callbacks?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    }
  ): Promise<boolean> {
    this.stopSpeaking();

    // Clean text for speech
    const clean = text
      .replace(/[#*_`~>[\]()]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\n+/g, '. ')
      .trim();

    if (!clean) return false;

    this.isSynthesizingActive = true;
    callbacks?.onStart?.();

    try {
      // 1. Call backend Bhashini TTS endpoint
      const result = await api.bhashiniTTS({
        text: clean,
        language,
        gender: 'female',
      });

      if (result.success && result.audioBase64) {
        // Play base64 audio returned by Bhashini
        const mimeType = result.audioFormat === 'mp3' ? 'audio/mp3' : 'audio/wav';
        const audioSrc = `data:${mimeType};base64,${result.audioBase64}`;
        const audio = new Audio(audioSrc);
        this.currentAudioElement = audio;

        audio.onended = () => {
          this.isSynthesizingActive = false;
          this.currentAudioElement = null;
          callbacks?.onEnd?.();
        };

        audio.onerror = (err) => {
          console.warn('Bhashini audio element playback error:', err);
          this.isSynthesizingActive = false;
          this.currentAudioElement = null;
          // Fall back to browser speech synthesis
          this.fallbackBrowserSpeak(clean, language, callbacks);
        };

        await audio.play();
        return true;
      }
    } catch (err) {
      console.warn('Bhashini TTS call encountered an error, using native fallback:', err);
    }

    // 2. Fall back to browser SpeechSynthesis if Bhashini is not configured or fails
    return this.fallbackBrowserSpeak(clean, language, callbacks);
  }

  /**
   * Browser SpeechSynthesis fallback with correct language dialect
   */
  private fallbackBrowserSpeak(
    cleanText: string,
    language: 'hi' | 'en' | 'hinglish',
    callbacks?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    }
  ): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.isSynthesizingActive = false;
      callbacks?.onEnd?.();
      return false;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);

      // Select voice based on language
      const voices = window.speechSynthesis.getVoices();
      if (language === 'hi') {
        utterance.lang = 'hi-IN';
        const hiVoice = voices.find((v) => v.lang.startsWith('hi') || v.name.includes('Hindi'));
        if (hiVoice) utterance.voice = hiVoice;
      } else {
        utterance.lang = 'en-IN';
        const inVoice = voices.find(
          (v) =>
            v.lang.startsWith('en-IN') ||
            v.name.includes('India') ||
            v.name.includes('Veena') ||
            v.name.includes('Rishi')
        );
        if (inVoice) utterance.voice = inVoice;
      }

      utterance.rate = 0.98;
      utterance.pitch = 1.02;

      utterance.onend = () => {
        this.isSynthesizingActive = false;
        callbacks?.onEnd?.();
      };

      utterance.onerror = (err) => {
        this.isSynthesizingActive = false;
        callbacks?.onError?.(err);
      };

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err) {
      this.isSynthesizingActive = false;
      callbacks?.onError?.(err);
      return false;
    }
  }

  /**
   * Stop any playing audio
   */
  public stopSpeaking() {
    this.isSynthesizingActive = false;
    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
      } catch {
        // ignore
      }
      this.currentAudioElement = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public isSpeaking(): boolean {
    return (
      this.isSynthesizingActive ||
      Boolean(this.currentAudioElement && !this.currentAudioElement.paused) ||
      Boolean(typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.speaking)
    );
  }

  /**
   * Record microphone audio from user and send to Bhashini STT (with Web Speech fallback)
   */
  public async startMicrophoneCapture(callbacks: {
    onStart?: () => void;
    onTranscript: (transcript: string, detectedLanguage: 'hi' | 'en') => void;
    onStatusChange?: (status: 'listening' | 'transcribing' | 'idle') => void;
    onError?: (err: any) => void;
  }): Promise<boolean> {
    this.stopMicrophoneCapture();

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      callbacks.onError?.('Microphone access is not supported by your browser.');
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      this.mediaStream = stream;
      this.audioChunks = [];

      // Determine supported mime type
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
        mimeType = 'audio/ogg';
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      this.mediaRecorder = recorder;
      this.isRecordingActive = true;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      recorder.onstart = () => {
        callbacks.onStatusChange?.('listening');
        callbacks.onStart?.();
      };

      recorder.onstop = async () => {
        this.isRecordingActive = false;
        callbacks.onStatusChange?.('transcribing');

        try {
          const audioBlob = new Blob(this.audioChunks, { type: mimeType });
          if (audioBlob.size < 500) {
            callbacks.onStatusChange?.('idle');
            return;
          }

          // Convert Blob to Base64
          const base64Data = await this.blobToBase64(audioBlob);

          // Call Bhashini STT endpoint
          const format = mimeType.includes('webm') ? 'webm' : mimeType.includes('mp4') ? 'mp4' : 'wav';
          const sttRes = await api.bhashiniSTT({
            audioBase64: base64Data,
            audioFormat: format,
            samplingRate: 16000,
            language: 'auto',
          });

          if (sttRes.success && sttRes.transcript) {
            callbacks.onTranscript(sttRes.transcript, sttRes.language);
          } else {
            // If Bhashini returned empty or was not configured, we inform user gracefully
            if (sttRes.transcript) {
              callbacks.onTranscript(sttRes.transcript, sttRes.language);
            } else {
              callbacks.onError?.(sttRes.error || 'No speech recognized. Please speak again.');
            }
          }
        } catch (err) {
          console.warn('STT transcription error:', err);
          callbacks.onError?.(err);
        } finally {
          callbacks.onStatusChange?.('idle');
        }
      };

      recorder.start();
      return true;
    } catch (err: any) {
      this.isRecordingActive = false;
      console.warn('Microphone permission or capture error:', err);
      callbacks.onError?.(err?.message || 'Could not access microphone');
      callbacks.onStatusChange?.('idle');
      return false;
    }
  }

  /**
   * Stop recording microphone and trigger transcription
   */
  public stopMicrophoneCapture() {
    if (this.mediaRecorder && this.isRecordingActive) {
      try {
        this.mediaRecorder.stop();
      } catch {
        // ignore
      }
    }
    this.isRecordingActive = false;

    if (this.mediaStream) {
      try {
        this.mediaStream.getTracks().forEach((track) => track.stop());
      } catch {
        // ignore
      }
      this.mediaStream = null;
    }
  }

  public isListening(): boolean {
    return this.isRecordingActive;
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = reader.result as string;
        // Strip data:audio/...;base64, prefix
        const base64 = res.split(',')[1] || '';
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

export const bhashiniVoice = new BhashiniVoiceService();
