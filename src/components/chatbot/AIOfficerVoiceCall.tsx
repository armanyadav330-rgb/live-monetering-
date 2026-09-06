import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  Volume2,
  VolumeX,
  Sparkles,
  Grid,
  Clock,
  Shield,
  Send,
  HelpCircle,
} from 'lucide-react';
import { AIOfficerAvatar } from './AIOfficerAvatar';
import { voiceAssistant } from '../../services/voiceAssistant';
import { api } from '../../services/api';
import { GrievanceTicket } from '../../types';
import { AITicketCard } from './AITicketCard';

interface AIOfficerVoiceCallProps {
  onSwitchToVideo: () => void;
  onEndCall: () => void;
  onTicketCreated?: (ticket: GrievanceTicket) => void;
  initialTopic?: string;
}

export const AIOfficerVoiceCall: React.FC<AIOfficerVoiceCallProps> = ({
  onSwitchToVideo,
  onEndCall,
  onTicketCreated,
  initialTopic,
}) => {
  const [callState, setCallState] = useState<'RINGING' | 'CONNECTED' | 'ENDED'>('RINGING');
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [transcript, setTranscript] = useState('');
  const [lastSpeech, setLastSpeech] = useState('');
  const [lastTicket, setLastTicket] = useState<GrievanceTicket | null>(null);
  const [manualInput, setManualInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Call connection lifecycle
  useEffect(() => {
    // Play ringing tone
    voiceAssistant.playTone('ring');
    const ringTimeout = setTimeout(() => {
      setCallState('CONNECTED');
      voiceAssistant.playTone('connected');

      // AI Officer opening verbal greeting
      const greeting = initialTopic
        ? `Namaste! I am Officer Rajeshwar from the Ministry of Social Justice and Empowerment. I see you are inquiring regarding ${initialTopic}. I am actively listening, please tell me the exact issue.`
        : 'Namaste! I am Officer Rajeshwar from the Department of Social Justice and Empowerment Central Directorate. I am listening on this secure line. Please tell me your problem and I will resolve it immediately.';

      speakResponse(greeting);
    }, 1800);

    return () => {
      clearTimeout(ringTimeout);
      if (timerRef.current) clearInterval(timerRef.current);
      voiceAssistant.stopSpeaking();
      voiceAssistant.stopListening();
    };
  }, []);

  // Duration timer
  useEffect(() => {
    if (callState === 'CONNECTED') {
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  // Oral speech synthesis
  const speakResponse = (text: string) => {
    setLastSpeech(text);
    if (isSpeakerMuted) return;

    setIsSpeaking(true);
    voiceAssistant.speak(text, {
      onStart: () => setIsSpeaking(true),
      onWord: (w) => setCurrentWord(w),
      onEnd: () => {
        setIsSpeaking(false);
        setCurrentWord('');
        // Automatically start listening after officer finishes speaking if not muted
        if (!isMuted) {
          startVoiceRecognition();
        }
      },
      onError: () => {
        setIsSpeaking(false);
      },
    });
  };

  // Voice recognition (listening to user's oral question)
  const startVoiceRecognition = () => {
    if (isMuted || isSpeaking) return;

    setIsListening(true);
    voiceAssistant.startListening({
      onResult: (text, isFinal) => {
        setTranscript(text);
        if (isFinal && text.trim().length > 2) {
          handleSendQuery(text.trim());
        }
      },
      onError: () => {
        setIsListening(false);
      },
      onEnd: () => {
        setIsListening(false);
      },
    });
  };

  const handleSendQuery = async (queryText: string) => {
    if (!queryText.trim() || isProcessing) return;
    setIsProcessing(true);
    voiceAssistant.stopListening();
    setIsListening(false);

    try {
      const res = await api.sendChatbotMessage({
        message: queryText,
        mode: 'audio_call',
      });

      if (res.ticket) {
        setLastTicket(res.ticket);
        voiceAssistant.playTone('ticket');
        onTicketCreated?.(res.ticket);
      }

      speakResponse(res.speechText);
    } catch {
      speakResponse('I apologize, there was a momentary network disturbance. Please repeat your concern or choose a quick option below.');
    } finally {
      setIsProcessing(false);
      setTranscript('');
      setManualInput('');
    }
  };

  const handleEndCall = () => {
    voiceAssistant.playTone('hangup');
    voiceAssistant.stopSpeaking();
    voiceAssistant.stopListening();
    setCallState('ENDED');
    setTimeout(() => {
      onEndCall();
    }, 600);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const quickPrompts = [
    'Why is my PM-DAKSH stipend delayed?',
    'My institute CCTV camera is showing offline',
    'Biometric attendance machine failed to sync',
    'Schedule surprise inspection verification',
  ];

  const handleKeypadPress = (digit: string) => {
    voiceAssistant.playTone('chirp');
    if (digit === '1') {
      handleSendQuery('Report delayed scholarship and stipend payment');
    } else if (digit === '2') {
      handleSendQuery('Report CCTV camera offline and request grace period');
    } else if (digit === '3') {
      handleSendQuery('Resolve biometric attendance device sync anomaly');
    } else if (digit === '4') {
      handleSendQuery('Request physical inspection audit appeal');
    }
    setShowKeypad(false);
  };

  return (
    <div className="relative flex flex-col h-full bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white p-4 sm:p-6 overflow-hidden select-none">
      {/* Background Ambience Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Status Bar */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-200">DoSJE Audio Tele-Helpline</div>
            <div className="text-[10px] text-slate-400">Encrypted Government Bridge • 256-bit</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {callState === 'CONNECTED' && (
            <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono text-emerald-400">
              <Clock className="w-3 h-3 text-emerald-400" />
              <span>{formatTime(duration)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Center Officer Avatar & Calling State */}
      <div className="flex-1 flex flex-col items-center justify-center py-4 z-10">
        {callState === 'RINGING' ? (
          <div className="text-center space-y-4">
            <div className="relative mx-auto w-28 h-28 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
              <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-blue-400 flex items-center justify-center shadow-lg">
                <Phone className="w-10 h-10 text-blue-400 animate-bounce" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Connecting with Officer...</h3>
              <p className="text-xs text-slate-400 mt-1">Direct tele-channel to Senior Grievance Officer</p>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md flex flex-col items-center space-y-4">
            {/* Animated Officer Avatar */}
            <AIOfficerAvatar
              size="lg"
              isSpeaking={isSpeaking}
              isListening={isListening}
              currentWord={currentWord}
              officerName="Dr. Rajeshwar Sharma, IAS"
              officerRole="Senior Monitoring & Grievance Resolution Officer"
            />

            {/* Reactive Audio Equalizer Waveform */}
            <div className="flex items-center justify-center space-x-1.5 h-8">
              {[40, 70, 90, 60, 100, 50, 80, 45, 95, 30].map((h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isSpeaking
                      ? 'bg-emerald-400 animate-pulse'
                      : isListening
                      ? 'bg-blue-400 animate-pulse'
                      : 'bg-slate-700'
                  }`}
                  style={{
                    height: isSpeaking || isListening ? `${(h * 0.28) + 6}px` : '4px',
                    animationDelay: `${i * 80}ms`,
                  }}
                />
              ))}
            </div>

            {/* Officer Live Speech Transcript Bubble */}
            {lastSpeech && (
              <div className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl p-3.5 shadow-lg text-center backdrop-blur-sm">
                <div className="flex items-center justify-center space-x-1.5 text-[11px] font-semibold text-emerald-400 mb-1">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Officer Rajeshwar (Speaking):</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed italic">
                  "{lastSpeech}"
                </p>
              </div>
            )}

            {/* User Real-time Spoken Transcript or Processing */}
            {transcript && (
              <div className="w-full bg-blue-950/40 border border-blue-800/60 rounded-xl p-2.5 text-center">
                <div className="text-[10px] text-blue-300 font-semibold mb-0.5">Your Voice Input:</div>
                <div className="text-xs text-blue-100 font-medium">"{transcript}"</div>
              </div>
            )}

            {/* Generated Ticket Card Popup */}
            {lastTicket && (
              <div className="w-full">
                <AITicketCard ticket={lastTicket} compact />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Spoken Query Shortcuts */}
      {callState === 'CONNECTED' && (
        <div className="py-2 z-10">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 px-1">
            <span className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Or speak any of these quick queries:</span>
            </span>
            <button
              onClick={() => setShowKeypad(!showKeypad)}
              className="text-blue-400 hover:text-blue-300 flex items-center space-x-1"
            >
              <Grid className="w-3 h-3" />
              <span>{showKeypad ? 'Close Keypad' : 'DTMF Keypad'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendQuery(q)}
                disabled={isProcessing}
                className="text-left text-[11px] p-2 rounded-lg bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 transition-colors line-clamp-1 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Fallback Text Input in Audio Call */}
          <div className="mt-2 flex items-center space-x-2">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendQuery(manualInput)}
              placeholder="Or type here to speak aloud to officer..."
              className="flex-1 bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => handleSendQuery(manualInput)}
              disabled={!manualInput.trim() || isProcessing}
              className="p-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white rounded-lg transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* DTMF Keypad Overlay */}
      {showKeypad && (
        <div className="absolute inset-x-4 bottom-24 bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-2xl z-30">
          <div className="text-center font-semibold text-xs text-slate-300 mb-3">
            Press a key for automated interactive routing:
          </div>
          <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
            {[
              { key: '1', sub: 'Scholarship' },
              { key: '2', sub: 'CCTV Outage' },
              { key: '3', sub: 'Biometrics' },
              { key: '4', sub: 'Inspection' },
              { key: '5', sub: 'DBT Hold' },
              { key: '6', sub: 'NGO Help' },
              { key: '7', sub: 'Status' },
              { key: '8', sub: 'Waiver' },
              { key: '9', sub: 'Escalate' },
            ].map((k) => (
              <button
                key={k.key}
                onClick={() => handleKeypadPress(k.key)}
                className="py-2 bg-slate-800 hover:bg-slate-700 active:bg-blue-600 rounded-xl border border-slate-700 flex flex-col items-center justify-center transition-all"
              >
                <span className="text-base font-bold text-white">{k.key}</span>
                <span className="text-[9px] text-slate-400">{k.sub}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Phone Action Bar */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-around z-10">
        {/* Mute Mic */}
        <button
          onClick={() => {
            const next = !isMuted;
            setIsMuted(next);
            if (next) {
              voiceAssistant.stopListening();
              setIsListening(false);
            } else {
              startVoiceRecognition();
            }
          }}
          className={`flex flex-col items-center space-y-1 p-2.5 rounded-full transition-all ${
            isMuted
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          <span className="text-[9px]">{isMuted ? 'Unmute' : 'Mute'}</span>
        </button>

        {/* Upgrade to Video Call */}
        <button
          onClick={onSwitchToVideo}
          className="flex flex-col items-center space-y-1 p-2.5 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/40 hover:bg-blue-600/30 transition-all"
          title="Switch to Face-to-Face Video Call"
        >
          <Video className="w-5 h-5" />
          <span className="text-[9px]">Video Call</span>
        </button>

        {/* Speaker Volume Toggle */}
        <button
          onClick={() => {
            const next = !isSpeakerMuted;
            setIsSpeakerMuted(next);
            if (next) voiceAssistant.stopSpeaking();
          }}
          className={`flex flex-col items-center space-y-1 p-2.5 rounded-full transition-all ${
            isSpeakerMuted
              ? 'bg-slate-800 text-slate-500'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          title={isSpeakerMuted ? 'Turn Sound On' : 'Mute Speaker'}
        >
          {isSpeakerMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          <span className="text-[9px]">Speaker</span>
        </button>

        {/* End Call Button */}
        <button
          onClick={handleEndCall}
          className="flex flex-col items-center space-y-1 p-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 active:scale-95 transition-all"
          title="Hang Up Call"
        >
          <PhoneOff className="w-6 h-6" />
          <span className="text-[9px] font-bold">End Call</span>
        </button>
      </div>
    </div>
  );
};
