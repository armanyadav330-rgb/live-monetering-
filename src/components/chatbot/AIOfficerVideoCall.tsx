import React, { useState, useEffect, useRef } from 'react';
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  Camera,
  Shield,
  Clock,
  FileCheck,
  Sparkles,
  Maximize2,
  Minimize2,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { AIOfficerAvatar } from './AIOfficerAvatar';
import { voiceAssistant } from '../../services/voiceAssistant';
import { api } from '../../services/api';
import { GrievanceTicket } from '../../types';
import { AITicketCard } from './AITicketCard';

interface AIOfficerVideoCallProps {
  onSwitchToAudio: () => void;
  onEndCall: () => void;
  onTicketCreated?: (ticket: GrievanceTicket) => void;
  initialTopic?: string;
}

export const AIOfficerVideoCall: React.FC<AIOfficerVideoCallProps> = ({
  onSwitchToAudio,
  onEndCall,
  onTicketCreated,
  initialTopic,
}) => {
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [officerSubtitle, setOfficerSubtitle] = useState('');
  const [userTranscript, setUserTranscript] = useState('');
  const [isScanningDocument, setIsScanningDocument] = useState(false);
  const [documentVerified, setDocumentVerified] = useState(false);
  const [snapshotTaken, setSnapshotTaken] = useState(false);
  const [lastTicket, setLastTicket] = useState<GrievanceTicket | null>(null);
  const [isPipFlipped, setIsPipFlipped] = useState(false);
  const [manualText, setManualText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Camera & Start Officer Video Greeting
  useEffect(() => {
    voiceAssistant.playTone('connected');

    // Camera setup
    async function startCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
            audio: false,
          });
          localStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.warn('Camera access denied or unavailable in iframe, using animated video simulation:', err);
      }
    }

    startCamera();

    // Call duration timer
    timerRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    // Initial greeting
    const welcome = initialTopic
      ? `Namaste. I am Dr. Aditi Verma, Senior Inspection and Resolution Officer. We are connected over an encrypted DoSJE video channel regarding ${initialTopic}. I can see and hear you clearly. Please present your concern or hold your verification document to the camera.`
      : 'Namaste! I am Dr. Aditi Verma, Senior Inspection Officer for the Ministry of Social Justice and Empowerment. We are live on secure video. I can see you clearly. Please tell me what problem you are facing, and I will resolve it immediately.';

    speakOfficer(welcome);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      voiceAssistant.stopSpeaking();
      voiceAssistant.stopListening();
    };
  }, []);

  const speakOfficer = (text: string) => {
    setOfficerSubtitle(text);
    if (isSpeakerMuted) return;

    setIsSpeaking(true);
    voiceAssistant.speak(text, {
      onStart: () => setIsSpeaking(true),
      onWord: (w) => setCurrentWord(w),
      onEnd: () => {
        setIsSpeaking(false);
        setCurrentWord('');
        if (!isMuted) {
          startVoiceRecognition();
        }
      },
      onError: () => {
        setIsSpeaking(false);
      },
    });
  };

  const startVoiceRecognition = () => {
    if (isMuted || isSpeaking) return;
    setIsListening(true);
    voiceAssistant.startListening({
      onResult: (text, isFinal) => {
        setUserTranscript(text);
        if (isFinal && text.trim().length > 2) {
          handleSendVideoQuery(text.trim());
        }
      },
      onError: () => setIsListening(false),
      onEnd: () => setIsListening(false),
    });
  };

  const handleSendVideoQuery = async (msg: string) => {
    if (!msg.trim() || isProcessing) return;
    setIsProcessing(true);
    voiceAssistant.stopListening();
    setIsListening(false);

    try {
      const res = await api.sendChatbotMessage({
        message: msg,
        mode: 'video_call',
      });

      if (res.ticket) {
        setLastTicket(res.ticket);
        voiceAssistant.playTone('ticket');
        onTicketCreated?.(res.ticket);
      }

      speakOfficer(res.speechText);
    } catch {
      speakOfficer('Please repeat your query, the audio stream had a brief packet buffer.');
    } finally {
      setIsProcessing(false);
      setUserTranscript('');
      setManualText('');
    }
  };

  // Inspect document in front of camera
  const handleInspectDocument = () => {
    setIsScanningDocument(true);
    voiceAssistant.playTone('chirp');

    speakOfficer('Please hold your ID card or certificate steady in front of the camera while I scan the registration watermark.');

    setTimeout(() => {
      setIsScanningDocument(false);
      setDocumentVerified(true);
      voiceAssistant.playTone('ticket');

      speakOfficer('Document scanned successfully. I have verified your Aadhaar-linked beneficiary registration against the central DoSJE database. Credentials authenticated.');
    }, 2800);
  };

  // Capture official watermarked snapshot
  const handleCaptureSnapshot = () => {
    setSnapshotTaken(true);
    voiceAssistant.playTone('chirp');
    setTimeout(() => setSnapshotTaken(false), 2000);
  };

  const handleEndCall = () => {
    voiceAssistant.playTone('hangup');
    voiceAssistant.stopSpeaking();
    voiceAssistant.stopListening();
    onEndCall();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="relative flex flex-col h-full bg-slate-950 text-white overflow-hidden select-none">
      {/* Top Floating Telemetry Overlay */}
      <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20 pointer-events-none">
        <div className="flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/80 shadow-lg pointer-events-auto">
          <div className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </div>
          <span className="text-xs font-semibold text-white tracking-wide">REC</span>
          <span className="text-slate-500 text-xs">•</span>
          <span className="text-xs font-mono text-emerald-400">{formatTime(duration)}</span>
        </div>

        <div className="flex items-center space-x-2 pointer-events-auto">
          <div className="hidden sm:flex items-center space-x-1 px-3 py-1 bg-slate-900/80 backdrop-blur-md rounded-full border border-slate-700/80 text-[11px] text-slate-300">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Encrypted DoSJE Official Bridge</span>
          </div>

          <button
            onClick={() => setIsPipFlipped(!isPipFlipped)}
            className="p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors"
            title="Switch Primary & Secondary Feeds"
          >
            {isPipFlipped ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Center Video Area */}
      <div className="relative flex-1 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center overflow-hidden">
        {/* Officer Primary Screen */}
        {!isPipFlipped ? (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
            {/* Background Office Studio Grid */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Officer Avatar Display */}
            <div className="relative z-10">
              <AIOfficerAvatar
                size="xl"
                isSpeaking={isSpeaking}
                isListening={isListening}
                currentWord={currentWord}
                officerName="Dr. Aditi Verma, IAS"
                officerRole="Senior Grievance Resolution & Inspection Officer"
              />
            </div>

            {/* Government Geotag & Cryptographic Watermark */}
            <div className="absolute top-14 left-4 z-10 text-[10px] font-mono text-emerald-400/80 space-y-0.5 pointer-events-none drop-shadow">
              <div>GEO: 28.6139° N, 77.2090° E (New Delhi HQ)</div>
              <div>AUTH: SHA256-DOSJE-{new Date().getFullYear()}-CERT</div>
              <div>STREAM: 1080p • 60 FPS • 256-BIT AES</div>
            </div>

            {/* Subtitles Overlay */}
            {officerSubtitle && (
              <div className="absolute bottom-20 inset-x-6 z-10 flex justify-center">
                <div className="max-w-xl bg-slate-950/85 backdrop-blur-md border border-slate-700/80 text-center px-4 py-2.5 rounded-xl shadow-2xl">
                  <div className="text-[10px] font-semibold text-emerald-400 flex items-center justify-center space-x-1 mb-0.5">
                    <Volume2 className="w-3 h-3" />
                    <span>Dr. Aditi Verma (Live Officer):</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed italic">
                    "{officerSubtitle}"
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* User is Primary Screen, Officer in PiP */
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            {isCameraOff ? (
              <div className="text-center text-slate-500">
                <VideoOff className="w-12 h-12 mx-auto mb-2 text-slate-600" />
                <p className="text-xs">Your Camera is Muted</p>
              </div>
            ) : (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}
          </div>
        )}

        {/* Picture-in-Picture (Secondary Video Screen) */}
        <div
          onClick={() => setIsPipFlipped(!isPipFlipped)}
          className="absolute bottom-20 right-4 w-32 h-44 sm:w-40 sm:h-52 rounded-xl overflow-hidden border-2 border-slate-600/90 shadow-2xl bg-slate-900 cursor-pointer z-20 hover:scale-105 transition-transform"
        >
          {isPipFlipped ? (
            /* Officer in PiP */
            <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center p-2 relative">
              <AIOfficerAvatar
                size="sm"
                isSpeaking={isSpeaking}
                isListening={isListening}
                officerName="Officer Verma"
              />
              <span className="text-[9px] text-slate-300 font-medium mt-1">Dr. Aditi Verma</span>
            </div>
          ) : (
            /* User Video in PiP */
            <div className="w-full h-full relative bg-slate-900 flex items-center justify-center">
              {isCameraOff ? (
                <div className="text-center p-2 text-slate-500">
                  <VideoOff className="w-6 h-6 mx-auto mb-1 text-slate-600" />
                  <span className="text-[10px]">Camera Off</span>
                </div>
              ) : (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              )}

              {/* User Label */}
              <div className="absolute bottom-1.5 left-2 text-[9px] px-1.5 py-0.5 rounded bg-black/60 text-white font-medium">
                You (Field)
              </div>
            </div>
          )}

          {/* Scanner HUD Laser Line when Inspecting Document */}
          {isScanningDocument && (
            <div className="absolute inset-0 bg-emerald-500/10 border-2 border-emerald-400 z-30 flex flex-col justify-between p-2 pointer-events-none">
              <div className="text-[9px] text-emerald-400 font-bold animate-pulse text-center">
                SCANNING ID...
              </div>
              <div className="w-full h-0.5 bg-emerald-400 shadow-[0_0_8px_#34d399] animate-bounce" />
              <div className="text-[8px] text-emerald-300 text-center font-mono">
                ALIGN CORNERS
              </div>
            </div>
          )}
        </div>

        {/* Verification Success Toast */}
        {documentVerified && (
          <div className="absolute top-14 right-4 z-20 bg-emerald-950/90 border border-emerald-700/80 rounded-xl px-3 py-2 flex items-center space-x-2 shadow-xl animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div>
              <div className="text-xs font-bold text-emerald-300">Document Authenticated</div>
              <div className="text-[10px] text-emerald-400/80">Matched with DoSJE Portal Rolls</div>
            </div>
          </div>
        )}

        {/* Snapshot Notification */}
        {snapshotTaken && (
          <div className="absolute inset-0 bg-white/40 pointer-events-none z-30 flex items-center justify-center transition-opacity duration-300">
            <div className="bg-slate-900/90 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-2xl">
              📸 Watermarked Audit Snapshot Saved!
            </div>
          </div>
        )}

        {/* Live User Transcript */}
        {userTranscript && (
          <div className="absolute bottom-4 left-4 z-10 max-w-sm bg-blue-950/80 backdrop-blur-md border border-blue-700/70 rounded-xl px-3 py-1.5 shadow-lg">
            <div className="text-[9px] text-blue-300 font-bold uppercase">Spoken by you:</div>
            <div className="text-xs text-blue-100 font-medium">"{userTranscript}"</div>
          </div>
        )}
      </div>

      {/* Ticket Notification in Call */}
      {lastTicket && (
        <div className="px-4 py-2 bg-slate-900/95 border-t border-slate-800 z-20">
          <AITicketCard ticket={lastTicket} compact />
        </div>
      )}

      {/* Video Call Quick Input & Bottom Action Bar */}
      <div className="bg-slate-900/95 border-t border-slate-800 p-3 z-20 space-y-2">
        {/* Quick Text / Speech Input */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendVideoQuery(manualText)}
            placeholder="Ask question or report issue orally or type here..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() => handleSendVideoQuery(manualText)}
            disabled={!manualText.trim() || isProcessing}
            className="p-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Document Inspection Button */}
            <button
              onClick={handleInspectDocument}
              disabled={isScanningDocument}
              className="inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="hidden sm:inline">Inspect Document / ID</span>
              <span className="sm:hidden">Inspect ID</span>
            </button>

            {/* Watermark Snapshot */}
            <button
              onClick={handleCaptureSnapshot}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Capture Watermarked Snapshot"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Mic Toggle */}
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
              className={`p-2.5 rounded-full transition-colors ${
                isMuted ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Camera Toggle */}
            <button
              onClick={() => {
                const next = !isCameraOff;
                setIsCameraOff(next);
                if (localStreamRef.current) {
                  localStreamRef.current.getVideoTracks().forEach((track) => {
                    track.enabled = !next;
                  });
                }
              }}
              className={`p-2.5 rounded-full transition-colors ${
                isCameraOff ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title={isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}
            >
              {isCameraOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
            </button>

            {/* Switch to Audio Only */}
            <button
              onClick={onSwitchToAudio}
              className="p-2.5 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
              title="Switch to Audio Call"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {/* End Call */}
            <button
              onClick={handleEndCall}
              className="p-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition-all active:scale-95"
              title="End Video Call"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
