import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Video,
  Grid,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  User,
  Clock,
  Building2,
  ShieldCheck,
  RefreshCw,
  MessageCircle,
  Hash,
  Play,
  Pause,
  Copy,
  Check,
} from 'lucide-react';
import { Project, RandomVCRecord } from '../../types';
import { soundEffects } from '../../utils/soundEffects';
import { api } from '../../services/api';

interface RandomVoiceCallProps {
  selectedProject: Project | null;
  participantType: 'PROJECT_INCHARGE' | 'STAFF' | 'BENEFICIARY';
  participantName: string;
  participantRole: string;
  participantPhone: string;
  initialTollFreeNumber?: string;
  initialPin?: string;
  autoStart?: boolean;
  onUpgradeToVideoCall: () => void;
  onRecordSaved: (record: RandomVCRecord) => void;
}

export const RandomVoiceCall: React.FC<RandomVoiceCallProps> = ({
  selectedProject,
  participantType,
  participantName,
  participantRole,
  participantPhone,
  initialTollFreeNumber = '1800-180-4921',
  initialPin = '481902',
  autoStart = false,
  onUpgradeToVideoCall,
  onRecordSaved,
}) => {
  // Call State
  const [callState, setCallState] = useState<'IDLE' | 'DIALING' | 'RINGING' | 'CONNECTED' | 'ENDED'>('IDLE');
  const [dialMode, setDialMode] = useState<'TOLL_FREE' | 'DIRECT'>('TOLL_FREE');
  const [tollFreeNumber, setTollFreeNumber] = useState(initialTollFreeNumber);
  const [tollFreePin, setTollFreePin] = useState(initialPin);
  const [callDuration, setCallDuration] = useState(0);

  // Audio Controls
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isOnHold, setIsOnHold] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [enteredDigits, setEnteredDigits] = useState('');

  // Audio Transcript & IVR Dialog
  const [ivrMessage, setIvrMessage] = useState('');
  const [transcriptLines, setTranscriptLines] = useState<Array<{ sender: 'IVR' | 'BENEFICIARY' | 'OFFICER'; text: string; time: string }>>([]);

  // Verification Checklist
  const [idVerified, setIdVerified] = useState(true);
  const [voiceBiometricMatch, setVoiceBiometricMatch] = useState(true);
  const [presenceConfirmed, setPresenceConfirmed] = useState(true);
  const [verificationResult, setVerificationResult] = useState<'VERIFIED' | 'DISCREPANCY_DETECTED' | 'UNAVAILABLE'>('VERIFIED');
  const [verificationNotes, setVerificationNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Timer Ref
  const timerRef = useRef<any>(null);

  // Sync initial Toll-Free props
  useEffect(() => {
    if (initialTollFreeNumber) setTollFreeNumber(initialTollFreeNumber);
    if (initialPin) setTollFreePin(initialPin);
  }, [initialTollFreeNumber, initialPin]);

  // Duration Tracker
  useEffect(() => {
    if (callState === 'CONNECTED' && !isOnHold) {
      timerRef.current = setInterval(() => {
        setCallDuration((d) => d + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState, isOnHold]);

  // Auto-start if requested
  useEffect(() => {
    if (autoStart && callState === 'IDLE') {
      handleStartCall();
    }
  }, [autoStart]);

  // Handle Call Setup & Transition
  useEffect(() => {
    let timer: any;
    if (callState === 'DIALING') {
      // Dialing tone / beep
      soundEffects.playDtmf('1');
      timer = setTimeout(() => {
        setCallState('RINGING');
      }, 1200);
    } else if (callState === 'RINGING') {
      soundEffects.startWhatsAppRingtone();
      timer = setTimeout(() => {
        handleCallConnected();
      }, 3500);
    } else {
      soundEffects.stopWhatsAppRingtone();
    }
    return () => {
      clearTimeout(timer);
      soundEffects.stopWhatsAppRingtone();
    };
  }, [callState]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      soundEffects.stopWhatsAppRingtone();
      soundEffects.stopSpeech();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleCallConnected = () => {
    soundEffects.stopWhatsAppRingtone();
    soundEffects.playCallConnectedSound();
    setCallState('CONNECTED');

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (dialMode === 'TOLL_FREE') {
      const prompt = `Namaste! Ministry of Social Justice Toll-Free Verification Portal me swagat hai. Press 1 to connect directly to Video Call, ya call par bane rahein.`;
      setIvrMessage(prompt);
      soundEffects.speakIvrMessage(prompt);

      setTranscriptLines([
        {
          sender: 'IVR',
          text: `[Toll-Free Gateway ${tollFreeNumber}]: Welcome to DoSJE National Verification System. Project Access PIN: ${tollFreePin}. Press '1' to switch to Video Call.`,
          time: now,
        },
        {
          sender: 'BENEFICIARY',
          text: `Namaste Sir, ${participantName} speaking from ${selectedProject?.projectName || 'the field center'}. I am present at the training center.`,
          time: now,
        },
      ]);
    } else {
      setTranscriptLines([
        {
          sender: 'BENEFICIARY',
          text: `Hello, ${participantName} here. I have received the official verification voice call.`,
          time: now,
        },
      ]);
    }
  };

  const handleStartCall = () => {
    setEnteredDigits('');
    setCallDuration(0);
    setCallState('DIALING');
  };

  const handleEndCall = async () => {
    soundEffects.stopWhatsAppRingtone();
    soundEffects.stopSpeech();
    soundEffects.playCallEndedSound();

    if (timerRef.current) clearInterval(timerRef.current);

    if (selectedProject) {
      setIsSaving(true);
      try {
        const record = await api.saveVCRecord({
          projectId: selectedProject.id,
          projectName: selectedProject.projectName,
          ngoName: selectedProject.ngoName,
          participantType,
          participantName,
          participantContact: dialMode === 'TOLL_FREE' ? `${tollFreeNumber} (PIN: ${tollFreePin})` : participantPhone,
          callDurationSeconds: callDuration,
          verificationResult,
          verificationNotes:
            verificationNotes ||
            `Random Voice Call verification conducted via ${dialMode === 'TOLL_FREE' ? 'Toll-Free Gateway ' + tollFreeNumber : 'Direct Mobile'} with ${participantName}. Attendance and physical presence confirmed.`,
        });

        onRecordSaved(record);
      } catch (err) {
        console.error('Failed to save voice record:', err);
      } finally {
        setIsSaving(false);
      }
    }

    setCallState('ENDED');
  };

  const handleResetCall = () => {
    soundEffects.stopSpeech();
    setCallState('IDLE');
    setCallDuration(0);
    setTranscriptLines([]);
    setVerificationNotes('');
    setEnteredDigits('');
  };

  const handleKeyPress = (key: string) => {
    soundEffects.playDtmf(key);
    const newDigits = enteredDigits + key;
    setEnteredDigits(newDigits);

    // If user presses '1', trigger video call upgrade immediately!
    if (key === '1') {
      soundEffects.speakIvrMessage('Connecting to Video Call bridge now.');
      setTimeout(() => {
        onUpgradeToVideoCall();
      }, 800);
    }
  };

  const handleInquiry = (topic: 'ATTENDANCE' | 'ID_PROOF' | 'CCTV' | 'UPGRADE_VIDEO') => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let officerQuery = '';
    let beneficiaryReply = '';

    if (topic === 'ATTENDANCE') {
      officerQuery = `Officer: "Please confirm today's physical attendance and trainee strength."`;
      beneficiaryReply = `Beneficiary (${participantName}): "Sir, today 42 students are present in the classroom. Biometric attendance punch was completed at 9:30 AM."`;
    } else if (topic === 'ID_PROOF') {
      officerQuery = `Officer: "Do you have your vocational enrollment ID or Aadhaar card available?"`;
      beneficiaryReply = `Beneficiary (${participantName}): "Yes Sir, I am holding my student ID card and registration certificate right now."`;
    } else if (topic === 'CCTV') {
      officerQuery = `Officer: "Is the center CCTV camera online and recording properly?"`;
      beneficiaryReply = `Beneficiary (${participantName}): "Yes Sir, the green LED is on and all entrance CCTV units are active."`;
    } else if (topic === 'UPGRADE_VIDEO') {
      officerQuery = `Officer: "We are initiating live video verification. Please accept the video bridge."`;
      beneficiaryReply = `Beneficiary (${participantName}): "Sure Sir, switching to live video camera right now."`;
    }

    setTranscriptLines((prev) => [
      ...prev,
      { sender: 'OFFICER', text: officerQuery, time: now },
      { sender: 'BENEFICIARY', text: beneficiaryReply, time: now },
    ]);

    soundEffects.speakIvrMessage(beneficiaryReply);

    if (topic === 'UPGRADE_VIDEO') {
      setTimeout(() => {
        onUpgradeToVideoCall();
      }, 1200);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Dialer Configuration Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">
                  Random Voice Call Verification System
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Call field project heads, staff, or beneficiaries with automated IVR &amp; 1-click video call upgrade.
              </p>
            </div>
          </div>

          {/* Mode Switcher: Toll-Free vs Direct Dial */}
          <div className="inline-flex p-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-600 self-start sm:self-auto">
            <button
              onClick={() => {
                if (callState === 'IDLE') setDialMode('TOLL_FREE');
              }}
              disabled={callState !== 'IDLE'}
              className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 ${
                dialMode === 'TOLL_FREE'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'hover:text-slate-900 disabled:opacity-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Toll-Free Gateway (1800)</span>
            </button>
            <button
              onClick={() => {
                if (callState === 'IDLE') setDialMode('DIRECT');
              }}
              disabled={callState !== 'IDLE'}
              className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 ${
                dialMode === 'DIRECT'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'hover:text-slate-900 disabled:opacity-50'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Direct Mobile Number</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Calling Stage Screen */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 rounded-2xl p-6 text-white min-h-[460px] flex flex-col justify-between relative overflow-hidden shadow-xl border border-slate-800 select-none">
            {/* Ambient Background Aura */}
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Bar: Caller ID & Mode */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
                  {dialMode === 'TOLL_FREE' ? 'TOLL-FREE IVR TRUNK' : 'DIRECT TELEPHONY TRUNK'}
                </span>
              </div>

              {callState === 'CONNECTED' && (
                <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-white/10 text-xs font-mono font-bold text-emerald-300">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatSeconds(callDuration)}</span>
                </div>
              )}
            </div>

            {/* Middle Section: Caller Avatar & State */}
            <div className="my-auto text-center py-6 z-10 space-y-4">
              {/* Profile Avatar with Waves */}
              <div className="relative mx-auto w-28 h-28 flex items-center justify-center">
                {callState === 'RINGING' && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                    <div className="absolute -inset-3 rounded-full border border-emerald-500/30 animate-pulse" />
                  </>
                )}

                {callState === 'CONNECTED' && !isMicMuted && (
                  <div className="absolute -inset-2 rounded-full border-2 border-emerald-400/40 animate-pulse" />
                )}

                <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center shadow-xl overflow-hidden z-10">
                  <User className="w-12 h-12 text-slate-300" />
                </div>
              </div>

              {/* Name & Call State Text */}
              <div>
                <h3 className="text-xl font-bold text-white tracking-wide">
                  {participantName}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">
                  {participantRole} · {selectedProject?.projectName || 'DoSJE Verified Project'}
                </p>

                {/* Dialed Number Display */}
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-emerald-300">
                  <Phone className="w-3.5 h-3.5" />
                  <span>
                    {dialMode === 'TOLL_FREE' ? `${tollFreeNumber} (PIN: ${tollFreePin})` : participantPhone}
                  </span>
                </div>

                {/* Status Indicator */}
                <div className="mt-3 text-xs font-semibold">
                  {callState === 'IDLE' && (
                    <span className="text-slate-400">Ready to initiate random voice verification</span>
                  )}
                  {callState === 'DIALING' && (
                    <span className="text-amber-400 animate-pulse">Dialing routing gateway...</span>
                  )}
                  {callState === 'RINGING' && (
                    <span className="text-emerald-400 animate-pulse">Ringing field target...</span>
                  )}
                  {callState === 'CONNECTED' && (
                    <div className="space-y-1">
                      <span className="text-emerald-400 font-bold">Call in progress · Voice Line Active</span>
                      {/* Audio Visualizer Wave */}
                      <div className="flex items-center justify-center gap-1 h-5 pt-1">
                        {[40, 70, 30, 85, 60, 95, 45, 80, 50, 65, 35].map((h, idx) => (
                          <span
                            key={idx}
                            style={{ height: isMicMuted ? '4px' : `${h}%` }}
                            className={`w-1 rounded-full transition-all duration-150 ${
                              isMicMuted ? 'bg-slate-600' : 'bg-emerald-400'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {callState === 'ENDED' && (
                    <span className="text-slate-400">Call finished ({formatSeconds(callDuration)})</span>
                  )}
                </div>
              </div>

              {/* VIDEO CALL UPGRADE BANNER (During Active Voice Call) */}
              {callState === 'CONNECTED' && (
                <div className="pt-2">
                  <div className="max-w-md mx-auto p-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border border-emerald-400/40">
                    <div className="flex items-center gap-2 text-left">
                      <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                        <Video className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-xs font-bold">Toll-Free Video Call Bridge Ready</div>
                        <div className="text-[10px] text-emerald-100">
                          Press &apos;1&apos; on dialer or click to switch to live video instantly
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={onUpgradeToVideoCall}
                      className="px-3.5 py-1.5 rounded-lg bg-white text-emerald-950 font-bold text-xs hover:bg-emerald-50 transition shadow-xs shrink-0 cursor-pointer text-center"
                    >
                      Connect Video Now
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Section: Controls Dock */}
            <div className="pt-4 border-t border-slate-800 z-10 space-y-3">
              {callState === 'IDLE' && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleStartCall}
                    className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>
                      {dialMode === 'TOLL_FREE'
                        ? `Dial Toll-Free (${tollFreeNumber})`
                        : `Dial Mobile (${participantPhone})`}
                    </span>
                  </button>

                  <button
                    onClick={onUpgradeToVideoCall}
                    className="w-full sm:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer border border-slate-700"
                  >
                    <Video className="w-4 h-4 text-indigo-400" />
                    <span>Direct WhatsApp Video Call</span>
                  </button>
                </div>
              )}

              {/* DIALING & RINGING ACTIVE CONTROLS */}
              {(callState === 'DIALING' || callState === 'RINGING') && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleCallConnected}
                    className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4 animate-bounce" />
                    <span>Pick Up / Connect Now</span>
                  </button>

                  <button
                    onClick={handleEndCall}
                    className="w-full sm:w-auto px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>Cancel Call</span>
                  </button>
                </div>
              )}

              {callState === 'CONNECTED' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
                    {/* Mute Button */}
                    <button
                      onClick={() => setIsMicMuted(!isMicMuted)}
                      className={`p-3.5 rounded-full transition shadow-lg ${
                        isMicMuted
                          ? 'bg-rose-600 text-white hover:bg-rose-700'
                          : 'bg-white/15 hover:bg-white/25 text-white'
                      }`}
                      title={isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
                    >
                      {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>

                    {/* Speaker Button */}
                    <button
                      onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                      className={`p-3.5 rounded-full transition shadow-lg ${
                        !isSpeakerOn
                          ? 'bg-rose-600 text-white hover:bg-rose-700'
                          : 'bg-white/15 hover:bg-white/25 text-white'
                      }`}
                      title={isSpeakerOn ? 'Speaker On' : 'Speaker Off'}
                    >
                      {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </button>

                    {/* Keypad Dialpad Toggle */}
                    <button
                      onClick={() => setShowKeypad(!showKeypad)}
                      className={`p-3.5 rounded-full transition shadow-lg ${
                        showKeypad
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-white/15 hover:bg-white/25 text-white'
                      }`}
                      title="Toggle Dialpad Keypad"
                    >
                      <Grid className="w-5 h-5" />
                    </button>

                    {/* End Call Button */}
                    <button
                      onClick={handleEndCall}
                      className="p-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-xl transition"
                      title="End Call"
                    >
                      <PhoneOff className="w-5 h-5" />
                    </button>
                  </div>

                  {/* DTMF Keypad Drawer */}
                  {showKeypad && (
                    <div className="bg-slate-950/90 rounded-xl p-4 border border-slate-800 max-w-xs mx-auto animate-in fade-in duration-200">
                      <div className="text-center font-mono text-sm tracking-widest text-emerald-400 mb-2 h-6">
                        {enteredDigits || 'Dial Keypad (DTMF)'}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((key) => (
                          <button
                            key={key}
                            onClick={() => handleKeyPress(key)}
                            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold font-mono text-sm transition active:scale-95"
                          >
                            {key}
                          </button>
                        ))}
                      </div>
                      <div className="text-[10px] text-slate-400 text-center mt-2">
                        Tip: Press &apos;1&apos; to immediately trigger Video Call bridge
                      </div>
                    </div>
                  )}
                </div>
              )}

              {callState === 'ENDED' && (
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleResetCall}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Start Another Voice Call</span>
                  </button>

                  <button
                    onClick={onUpgradeToVideoCall}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Switch to WhatsApp Video Call</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Live Transcript & IVR Dialog Card */}
          {transcriptLines.length > 0 && (
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">
                <span>Live Audio Transcript &amp; IVR Log</span>
                <span className="text-[10px] font-mono text-slate-400">SPEECH SYNTHESIS REAL-TIME</span>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {transcriptLines.map((line, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-400">
                      <span>{line.sender}</span>
                      <span>·</span>
                      <span>{line.time}</span>
                    </div>
                    <div className="text-slate-800 mt-0.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      {line.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Inquiry Buttons during Connected Call */}
              {callState === 'CONNECTED' && (
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    Quick Verbal Inquiries (Click to Ask Beneficiary):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => handleInquiry('ATTENDANCE')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                    >
                      <span>👥 Verify Attendance</span>
                    </button>
                    <button
                      onClick={() => handleInquiry('ID_PROOF')}
                      className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                    >
                      <span>🪪 Check ID Proof</span>
                    </button>
                    <button
                      onClick={() => handleInquiry('CCTV')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                    >
                      <span>🏢 Check CCTV</span>
                    </button>
                    <button
                      onClick={() => handleInquiry('UPGRADE_VIDEO')}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                    >
                      <span>📹 Bridge to Video Call</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Verification Audit & Details */}
        <div className="space-y-4">
          {/* Target Info Card */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-500">Call Recipient</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                {participantType}
              </span>
            </div>

            <div>
              <div className="font-bold text-slate-900 text-sm">{participantName}</div>
              <div className="text-slate-500 text-[11px]">{participantRole}</div>
            </div>

            <div className="pt-2 border-t border-slate-200 space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Target Project:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[140px]">
                  {selectedProject?.projectName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned Toll-Free:</span>
                <span className="font-mono font-bold text-emerald-700">{tollFreeNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mobile Phone:</span>
                <span className="font-mono text-slate-800">{participantPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">CCTV Telemetry:</span>
                <span className="font-semibold text-slate-800">{selectedProject?.cctvStatus}</span>
              </div>
            </div>
          </div>

          {/* Regulatory Voice Verification Checklist */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs text-xs space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 border-b border-slate-100 pb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Voice Verification Audit Checklist</span>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={idVerified}
                  onChange={(e) => setIdVerified(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-slate-700">Name &amp; Beneficiary ID Confirmed</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={voiceBiometricMatch}
                  onChange={(e) => setVoiceBiometricMatch(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-slate-700">Voice Response &amp; Identity Consistent</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={presenceConfirmed}
                  onChange={(e) => setPresenceConfirmed(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-slate-700">Physical Presence at Center Confirmed</span>
              </label>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="block text-[11px] font-semibold text-slate-700">
                Verification Result:
              </label>
              <select
                value={verificationResult}
                onChange={(e: any) => setVerificationResult(e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-emerald-500"
              >
                <option value="VERIFIED">VERIFIED - Presence Confirmed</option>
                <option value="DISCREPANCY_DETECTED">DISCREPANCY - Suspected Proxy / Inaccurate Info</option>
                <option value="UNAVAILABLE">UNAVAILABLE - Not Responding</option>
              </select>

              <label className="block text-[11px] font-semibold text-slate-700">
                Officer Remarks:
              </label>
              <textarea
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                placeholder="Enter regulatory voice audit observations..."
                rows={3}
                className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
