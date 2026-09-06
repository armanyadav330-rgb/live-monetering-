// Speech Synthesis, Speech Recognition, and Audio Tone Generator
// Designed for natural oral conversation like a human officer

class VoiceAssistantService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private recognition: any = null;
  private isListeningActive = false;
  private audioCtx: AudioContext | null = null;
  private cachedVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
        this.loadVoices();
        if (this.synth.onvoiceschanged !== undefined) {
          this.synth.onvoiceschanged = () => this.loadVoices();
        }
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.cachedVoices = this.synth.getVoices();
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Play natural telephone & call sound effects using pure Web Audio API synthesis
  public playTone(type: 'ring' | 'connected' | 'hangup' | 'ticket' | 'chirp') {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'ring') {
        // Dual-tone telephone ring (440Hz + 480Hz)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
        osc.start(now);
        osc.stop(now + 0.9);
      } else if (type === 'connected') {
        // High upbeat chime
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.3); // G5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'hangup') {
        // Descending disconnect tone
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.3);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'ticket') {
        // Resolution ticket generated fanfare
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880.0, now + 0.12); // A5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'chirp') {
        // Subtle mic toggle sound
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.start(now);
        osc.stop(now + 0.09);
      }
    } catch {
      // Audio context might be restricted before first gesture
    }
  }

  // Speak text orally with human cadence
  public speak(
    text: string,
    callbacks?: {
      onStart?: () => void;
      onEnd?: () => void;
      onWord?: (word: string) => void;
      onError?: (err: any) => void;
    }
  ): boolean {
    if (!this.synth) return false;

    this.stopSpeaking();

    // Clean text of markdown formatting for natural oral speaking
    const clean = text
      .replace(/[#*_`~>[\]()]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\n+/g, '. ')
      .trim();

    if (!clean) return false;

    const utterance = new SpeechSynthesisUtterance(clean);
    this.currentUtterance = utterance;

    // Pick best natural voice (prefers Indian English, Hindi, or clear female/male natural voices)
    const voices = this.cachedVoices.length > 0 ? this.cachedVoices : this.synth.getVoices();
    let selectedVoice = voices.find(
      (v) =>
        v.lang.startsWith('en-IN') ||
        v.name.includes('India') ||
        v.name.includes('Veena') ||
        v.name.includes('Rishi')
    );

    if (!selectedVoice) {
      selectedVoice = voices.find(
        (v) =>
          v.name.includes('Natural') ||
          v.name.includes('Google') ||
          v.name.includes('Samantha') ||
          v.lang.startsWith('en-GB') ||
          v.lang.startsWith('en-US')
      );
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Natural human voice modulation
    utterance.rate = 0.98; // slightly relaxed cadence
    utterance.pitch = 1.04; // pleasant, warm pitch

    utterance.onstart = () => {
      callbacks?.onStart?.();
    };

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const word = clean.substring(event.charIndex, event.charIndex + (event.charLength || 6));
        callbacks?.onWord?.(word);
      }
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      callbacks?.onEnd?.();
    };

    utterance.onerror = (err) => {
      this.currentUtterance = null;
      callbacks?.onError?.(err);
    };

    this.synth.speak(utterance);
    return true;
  }

  public stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
  }

  public isSpeaking(): boolean {
    return Boolean(this.synth && this.synth.speaking);
  }

  // Voice Recognition (Speech-to-Text)
  public isSpeechRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean((window as any).webkitSpeechRecognition || (window as any).SpeechRecognition);
  }

  public startListening(callbacks: {
    onResult: (transcript: string, isFinal: boolean) => void;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }): boolean {
    if (!this.isSpeechRecognitionSupported()) return false;

    try {
      this.stopListening();
      const SpeechRecognitionClass =
        (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      this.recognition = new SpeechRecognitionClass();

      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-IN'; // Indian English dialect default

      this.recognition.onstart = () => {
        this.isListeningActive = true;
        this.playTone('chirp');
        callbacks.onStart?.();
      };

      this.recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (final) {
          callbacks.onResult(final.trim(), true);
        } else if (interim) {
          callbacks.onResult(interim.trim(), false);
        }
      };

      this.recognition.onerror = (err: any) => {
        // ignore benign aborted events
        if (err.error !== 'no-speech' && err.error !== 'aborted') {
          callbacks.onError?.(err);
        }
      };

      this.recognition.onend = () => {
        this.isListeningActive = false;
        callbacks.onEnd?.();
      };

      this.recognition.start();
      return true;
    } catch (err) {
      callbacks.onError?.(err);
      return false;
    }
  }

  public stopListening() {
    if (this.recognition && this.isListeningActive) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
      this.isListeningActive = false;
    }
  }

  public isListening(): boolean {
    return this.isListeningActive;
  }
}

export const voiceAssistant = new VoiceAssistantService();
