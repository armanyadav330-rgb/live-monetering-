import React, { useState, useEffect, useRef } from 'react';
import {
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  User,
  Clock,
  Camera,
  RefreshCw,
  ExternalLink,
  MessageCircle,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Maximize2,
  Download,
  Share2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Project, RandomVCRecord } from '../../types';
import { soundEffects } from '../../utils/soundEffects';
import { api } from '../../services/api';

interface WhatsAppVideoCallProps {
  selectedProject: Project | null;
  participantType: 'PROJECT_INCHARGE' | 'STAFF' | 'BENEFICIARY';
  participantName: string;
  participantRole: string;
  participantPhone: string;
  tollFreeNumber?: string;
  tollFreePin?: string;
  autoStart?: boolean;
  onRecordSaved: (record: RandomVCRecord) => void;
  onSwitchToVoiceCall: () => void;
}

interface CapturedSnapshot {
  id: string;
  timestamp: string;
  dataUrl: string;
  label: string;
}

export const WhatsAppVideoCall: React.FC<WhatsAppVideoCallProps> = ({
  selectedProject,
  participantType,
  participantName,
  participantRole,
  participantPhone,
  tollFreeNumber = '1800-180-4921',
  tollFreePin = '481902',
  autoStart = false,
  onRecordSaved,
  onSwitchToVoiceCall,
}) => {
  // Call State
  const [callState, setCallState] = useState<'IDLE' | 'RINGING' | 'CONNECTED' | 'ENDED'>('IDLE');
  const [callDuration, setCallDuration] = useState(0);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isPiPFlipped, setIsPiPFlipped] = useState(false);
  const [isShutterFlashing, setIsShutterFlashing] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  // Field Simulation Scenes
  const [remoteScene, setRemoteScene] = useState<'CLASSROOM' | 'ID_CARD' | 'OFFICE' | 'PREMISES'>('CLASSROOM');

  // Local Camera State
  const [useLocalCam, setUseLocalCam] = useState(false);
  const [camError, setCamError] = useState<string | null>(null);

  // Verification Checklist & Audit
  const [idCardVerified, setIdCardVerified] = useState(true);
  const [locationConfirmed, setLocationConfirmed] = useState(true);
  const [physicalAttendanceMatched, setPhysicalAttendanceMatched] = useState(true);
  const [verificationResult, setVerificationResult] = useState<'VERIFIED' | 'DISCREPANCY_DETECTED' | 'UNAVAILABLE'>('VERIFIED');
  const [verificationNotes, setVerificationNotes] = useState('');
  const [capturedSnapshots, setCapturedSnapshots] = useState<CapturedSnapshot[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Refs
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteVideoCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const timerRef = useRef<any>(null);

  const sceneFeeds = {
    CLASSROOM: {
      title: 'Classroom & Beneficiary Verification',
      img: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80',
      description: 'Live field view: Skill training hall with student roll call in progress',
    },
    ID_CARD: {
      title: 'Beneficiary ID & Biometrics Verification',
      img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80',
      description: 'Physical document check: Trainee displaying enrollment ID and Aadhaar card',
    },
    OFFICE: {
      title: 'Center In-Charge & Administrative Desk',
      img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80',
      description: 'Official office verification: Center head presenting physical attendance log',
    },
    PREMISES: {
      title: 'Campus Entrance & Infrastructure Inspection',
      img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
      description: 'Facility perimeter: Biometric device and main entrance CCTV verified',
    },
  };

  // Auto-start video call if requested
  useEffect(() => {
    if (autoStart && callState === 'IDLE') {
      handleStartCall();
    }
  }, [autoStart]);

  // Ensure webcam stream is attached to video element when connected or flipped
  useEffect(() => {
    if (callState === 'CONNECTED' && localStreamRef.current && localVideoRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
      localVideoRef.current.play().catch(() => {});
    }
  }, [callState, isPiPFlipped, useLocalCam]);

  // Duration Timer
  useEffect(() => {
    if (callState === 'CONNECTED') {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      soundEffects.stopWhatsAppRingtone();
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Web Camera Setup
  const initLocalCamera = async (facing: 'user' | 'environment') => {
    try {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facing, width: { ideal: 640 }, height: { ideal: 480 } },
          audio: true,
        });

        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play().catch(() => {});
        }
        setUseLocalCam(true);
        setCamError(null);
      } else {
        setUseLocalCam(false);
        setCamError('Camera device not available. Running high-fidelity field stream simulation.');
      }
    } catch (err: any) {
      console.warn('getUserMedia notice:', err?.message || err);
      setUseLocalCam(false);
      setCamError('Webcam access was denied or not supported in this iframe. Live simulated feed enabled.');
    }
  };

  const handleStartCall = () => {
    setCallDuration(0);
    setCapturedSnapshots([]);
    setCallState('RINGING');
    soundEffects.startWhatsAppRingtone();

    initLocalCamera(facingMode);

    setTimeout(() => {
      handleAnswerCall();
    }, 3800);
  };

  const handleAnswerCall = () => {
    soundEffects.stopWhatsAppRingtone();
    soundEffects.playCallConnectedSound();
    setCallState('CONNECTED');
  };

  const handleEndCall = async () => {
    soundEffects.stopWhatsAppRingtone();
    soundEffects.playCallEndedSound();

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (selectedProject) {
      setIsSaving(true);
      try {
        const record = await api.saveVCRecord({
          projectId: selectedProject.id,
          projectName: selectedProject.projectName,
          ngoName: selectedProject.ngoName,
          participantType,
          participantName,
          participantContact: participantPhone,
          callDurationSeconds: callDuration,
          verificationResult,
          verificationNotes:
            verificationNotes ||
            `WhatsApp Video Call verification conducted with ${participantName}. Live ID card, geo-presence, and roll call verified.`,
        });

        onRecordSaved(record);
      } catch (err) {
        console.error('Failed to save record:', err);
      } finally {
        setIsSaving(false);
      }
    }

    setCallState('ENDED');
  };

  const handleFlipCamera = () => {
    const nextFacing = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextFacing);
    if (callState === 'CONNECTED' || callState === 'RINGING') {
      initLocalCamera(nextFacing);
    }
  };

  const captureSnapshot = () => {
    soundEffects.playCameraShutterSound();
    setIsShutterFlashing(true);
    setTimeout(() => setIsShutterFlashing(false), 200);

    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const drawFallbackGraphic = () => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 640, 480);

      // Grid Pattern
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < 640; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 480);
        ctx.stroke();
      }
      for (let y = 0; y < 480; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(640, y);
        ctx.stroke();
      }

      // Verification Card
      ctx.fillStyle = 'rgba(30, 41, 59, 0.95)';
      ctx.fillRect(35, 60, 570, 260);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.strokeRect(35, 60, 570, 260);

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(sceneFeeds[remoteScene].title, 55, 105);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px sans-serif';
      ctx.fillText(sceneFeeds[remoteScene].description, 55, 135);

      ctx.fillStyle = '#ffffff';
      ctx.font = '13px monospace';
      ctx.fillText(`TARGET: ${participantName} (${participantRole})`, 55, 180);
      ctx.fillText(`PROJECT: ${selectedProject?.projectName || 'Central Welfare Scheme'}`, 55, 210);
      ctx.fillText(`LOCATION: ${selectedProject?.district || 'New Delhi'}, ${selectedProject?.state || 'India'}`, 55, 240);
      ctx.fillText(`ENCRYPTION: Real-Time Verified Live Stream Feed`, 55, 270);
    };

    const drawWatermark = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(0, 400, 640, 80);

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('DoSJE OFFICIAL WHATSAPP VERIFICATION AUDIT DOSSIER', 16, 424);

      ctx.fillStyle = '#ffffff';
      ctx.font = '11px monospace';
      ctx.fillText(`TIMESTAMP: ${now} IST | GPS: 28.6139° N, 77.2090° E (±4m)`, 16, 444);
      ctx.fillText(`TARGET: ${participantName} | TFN: ${tollFreeNumber}`, 16, 464);

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 4;
      ctx.strokeRect(0, 0, 640, 480);

      try {
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        const newSnap: CapturedSnapshot = {
          id: `snap_${Date.now()}`,
          timestamp: now,
          dataUrl,
          label: `${sceneFeeds[remoteScene].title} (${participantName})`,
        };
        setCapturedSnapshots((prev) => [newSnap, ...prev]);
      } catch (err) {
        console.warn('Canvas export tainted fallback:', err);
        drawFallbackGraphic();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 400, 640, 80);
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText('DoSJE OFFICIAL WHATSAPP VERIFICATION AUDIT DOSSIER', 16, 424);
        ctx.fillStyle = '#ffffff';
        ctx.font = '11px monospace';
        ctx.fillText(`TIMESTAMP: ${now} IST | GPS: 28.6139° N, 77.2090° E (±4m)`, 16, 444);
        ctx.fillText(`TARGET: ${participantName} | TFN: ${tollFreeNumber}`, 16, 464);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, 640, 480);

        const safeDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        const fallbackSnap: CapturedSnapshot = {
          id: `snap_${Date.now()}`,
          timestamp: now,
          dataUrl: safeDataUrl,
          label: `${sceneFeeds[remoteScene].title} (${participantName})`,
        };
        setCapturedSnapshots((prev) => [fallbackSnap, ...prev]);
      }
    };

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        ctx.drawImage(img, 0, 0, 640, 480);
        drawWatermark();
      } catch (e) {
        drawFallbackGraphic();
        drawWatermark();
      }
    };
    img.onerror = () => {
      drawFallbackGraphic();
      drawWatermark();
    };
    img.src = sceneFeeds[remoteScene].img;
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const cleanPhone = participantPhone.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone}?text=${encodeURIComponent(
    `Namaste ${participantName}, this is official video verification for DoSJE project: "${selectedProject?.projectName}". Please join this WhatsApp video call.`
  )}`;

  return (
    <div className="space-y-4">
      {/* WhatsApp Action Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <MessageCircle className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">
                  WhatsApp Video Call &amp; Geotagged Audit System
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  LIVE
                </span>
              </div>
              <p className="text-xs text-slate-500">
                End-to-end video verification with camera flip, snapshot watermarking, and WhatsApp Direct link.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={onSwitchToVoiceCall}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
              <span>Switch to Voice Call</span>
            </button>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>WhatsApp Web/App</span>
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Calling Stage */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 aspect-4/3 sm:aspect-16/10 flex flex-col justify-between select-none">
            {/* Shutter Flash Animation */}
            {isShutterFlashing && (
              <div className="absolute inset-0 bg-white z-50 animate-out fade-out duration-200 pointer-events-none" />
            )}

            {/* TOP OVERLAY: Caller Details & Status */}
            <div className="relative z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/85 via-black/40 to-transparent">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-emerald-700/80 border-2 border-emerald-400/50 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {participantName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white font-bold text-sm leading-tight drop-shadow-xs">
                      {participantName}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/30 text-emerald-300 font-mono font-semibold border border-emerald-400/30">
                      {participantType}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono drop-shadow-xs">
                    {participantPhone} · {selectedProject?.state || 'India'}
                  </div>
                </div>
              </div>

              {/* Call Timer or Call State Badge */}
              <div className="flex items-center gap-2">
                {callState === 'CONNECTED' ? (
                  <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-emerald-400 text-xs font-mono font-bold shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{formatSeconds(callDuration)}</span>
                  </div>
                ) : (
                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-full border shadow-xs ${
                      callState === 'RINGING'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 animate-pulse'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700'
                    }`}
                  >
                    {callState === 'RINGING' ? 'Ringing WhatsApp Call...' : 'Call Offline'}
                  </span>
                )}
              </div>
            </div>

            {/* MIDDLE STAGE: Video Feed or Outgoing Call UI */}
            <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden">
              {callState === 'IDLE' && (
                <div className="text-center p-6 space-y-4 max-w-md z-10">
                  <div className="w-24 h-24 mx-auto rounded-full bg-slate-900/90 border-2 border-slate-700 flex items-center justify-center shadow-xl">
                    <User className="w-12 h-12 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{participantName}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{participantRole}</p>
                    <p className="text-xs font-mono text-emerald-400 mt-1">{participantPhone}</p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleStartCall}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 mx-auto shadow-lg transition transform active:scale-95 cursor-pointer"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Start WhatsApp Video Call</span>
                    </button>
                  </div>
                </div>
              )}

              {callState === 'RINGING' && (
                <div className="text-center p-6 space-y-5 z-10">
                  <div className="relative mx-auto w-28 h-28 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                    <div className="absolute -inset-3 rounded-full border border-emerald-500/30 animate-pulse" />
                    <div className="w-24 h-24 rounded-full bg-slate-900 border-2 border-emerald-500/80 flex items-center justify-center shadow-2xl overflow-hidden z-10">
                      <User className="w-12 h-12 text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-emerald-400 font-bold font-mono">
                      Outgoing Video Call
                    </div>
                    <h3 className="text-xl font-bold text-white mt-1">{participantName}</h3>
                    <p className="text-xs text-slate-300 font-mono mt-0.5">{participantPhone}</p>
                    <p className="text-xs text-emerald-300/80 mt-2 animate-pulse">
                      WhatsApp audio ringing tone active · Auto-connecting in seconds...
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={handleAnswerCall}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Connect Now</span>
                    </button>
                    <button
                      onClick={handleEndCall}
                      className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg cursor-pointer"
                    >
                      <PhoneOff className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              )}

              {callState === 'CONNECTED' && (
                <div className="relative w-full h-full">
                  {/* MAIN VIDEO SURFACE */}
                  {!isPiPFlipped ? (
                    /* Main View: Remote Field Scene */
                    <div className="w-full h-full relative">
                      <img
                        src={sceneFeeds[remoteScene].img}
                        alt="Field video stream"
                        className="w-full h-full object-cover select-none pointer-events-none"
                      />

                      {/* Geotag Watermark Overlay on Live Video */}
                      <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-white text-[11px] font-mono pointer-events-none z-10 flex flex-col gap-0.5 shadow-lg">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span>LIVE ENCRYPTED VC</span>
                        </div>
                        <div className="text-[10px] text-slate-300">
                          GPS: 28.6139° N, 77.2090° E | ±4m Acc
                        </div>
                        <div className="text-[9px] text-emerald-300/80 font-mono">
                          TARGET: {participantName} ({participantRole})
                        </div>
                      </div>

                      {/* Scene Switcher Pills */}
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 backdrop-blur-md p-1 rounded-lg border border-white/15 z-10 shadow-lg">
                        {(['CLASSROOM', 'ID_CARD', 'OFFICE', 'PREMISES'] as const).map((sc) => (
                          <button
                            key={sc}
                            onClick={() => setRemoteScene(sc)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                              remoteScene === sc
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-300 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            {sc === 'ID_CARD' ? '🪪 ID CARD' : sc}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Main View: Inspector Camera / Studio */
                    <div className="w-full h-full relative bg-slate-950">
                      {useLocalCam ? (
                        <video
                          ref={localVideoRef}
                          autoPlay
                          playsInline
                          muted
                          className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-slate-900 via-slate-800 to-emerald-950 flex flex-col items-center justify-center p-6 text-center select-none">
                          <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-emerald-700/80 border-4 border-emerald-400 flex items-center justify-center text-white font-bold text-2xl shadow-2xl">
                              RS
                            </div>
                            <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 animate-pulse" />
                          </div>
                          <div className="text-base font-bold text-white mt-3">Dr. Rajeshwar Sharma, IAS</div>
                          <div className="text-xs text-emerald-300 font-mono">Ministry of Social Justice &amp; Empowerment - HQ</div>
                          <div className="text-[11px] text-slate-400 mt-1">Direct Tele-Audit Verification Session</div>

                          {/* Live Equalizer */}
                          <div className="flex items-center justify-center gap-1.5 h-6 mt-4">
                            {[40, 85, 55, 95, 70, 90, 50, 80, 45].map((h, i) => (
                              <span
                                key={i}
                                style={{ height: isMicMuted ? '4px' : `${h}%` }}
                                className="w-1 rounded-full bg-emerald-400 transition-all duration-150"
                              />
                            ))}
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              initLocalCamera(facingMode);
                            }}
                            className="mt-4 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-lg"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>Connect Laptop / Mobile Webcam</span>
                          </button>
                        </div>
                      )}

                      {/* Watermark */}
                      <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-white text-[11px] font-mono pointer-events-none z-10">
                        <div className="text-emerald-400 font-bold">DoSJE HQ AUDIT FEED</div>
                        <div className="text-[10px] text-slate-300">Inspector Cam (Real-time Stream)</div>
                      </div>
                    </div>
                  )}

                  {/* PiP WINDOW (Click to Flip) */}
                  <div
                    onClick={() => setIsPiPFlipped(!isPiPFlipped)}
                    className="absolute bottom-4 right-4 w-36 sm:w-48 aspect-4/3 rounded-xl overflow-hidden border-2 border-white/50 shadow-2xl bg-slate-900 cursor-pointer transition transform hover:scale-105 z-20 group"
                    title="Click to Flip Main / PiP View"
                  >
                    {!isPiPFlipped ? (
                      /* PiP shows Inspector */
                      <div className="w-full h-full relative">
                        {useLocalCam ? (
                          <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                          />
                        ) : (
                          <div className="w-full h-full bg-linear-to-br from-slate-900 to-emerald-950 flex flex-col items-center justify-center p-2 text-center select-none">
                            <div className="w-8 h-8 rounded-full bg-emerald-700 border border-emerald-400 flex items-center justify-center text-white text-xs font-bold">
                              RS
                            </div>
                            <span className="text-[10px] font-bold text-white mt-1">Dr. Sharma (HQ)</span>
                            <span className="text-[8px] text-emerald-300 font-mono">Live Audio Active</span>
                          </div>
                        )}
                        <div className="absolute bottom-1 left-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-white flex items-center gap-1">
                          <User className="w-2.5 h-2.5 text-emerald-400" />
                          <span>Inspector · Flip 🔄</span>
                        </div>
                      </div>
                    ) : (
                      /* PiP shows Field Remote */
                      <div className="w-full h-full relative">
                        <img
                          src={sceneFeeds[remoteScene].img}
                          alt="Field stream"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-1 left-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-white flex items-center gap-1">
                          <VideoIcon className="w-2.5 h-2.5 text-emerald-400" />
                          <span>Field: {remoteScene} · Flip 🔄</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {callState === 'ENDED' && (
                <div className="text-center p-6 space-y-4 max-w-md z-10">
                  <div className="w-20 h-20 mx-auto rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-slate-400">
                    <PhoneOff className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Video Call Ended</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Total Duration: <span className="font-mono text-white font-bold">{formatSeconds(callDuration)}</span>
                    </p>
                    <p className="text-xs text-slate-400">
                      Snapshots Captured: <span className="font-bold text-emerald-400">{capturedSnapshots.length}</span>
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleStartCall}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 mx-auto transition cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Start New Video Call</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* BOTTOM CONTROLS DOCK (When in Call) */}
            {callState === 'CONNECTED' && (
              <div className="relative z-20 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
                  {/* Mute Mic */}
                  <button
                    onClick={() => setIsMicMuted(!isMicMuted)}
                    className={`p-3 rounded-full transition shadow-lg ${
                      isMicMuted ? 'bg-rose-600 text-white' : 'bg-white/20 hover:bg-white/30 text-white'
                    }`}
                    title={isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
                  >
                    {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>

                  {/* Turn Camera On/Off */}
                  <button
                    onClick={() => setIsVideoMuted(!isVideoMuted)}
                    className={`p-3 rounded-full transition shadow-lg ${
                      isVideoMuted ? 'bg-rose-600 text-white' : 'bg-white/20 hover:bg-white/30 text-white'
                    }`}
                    title={isVideoMuted ? 'Turn Camera On' : 'Turn Camera Off'}
                  >
                    {isVideoMuted ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
                  </button>

                  {/* Flip Front / Back Camera */}
                  <button
                    onClick={handleFlipCamera}
                    className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition shadow-lg"
                    title="Flip Camera (Front / Rear)"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>

                  {/* CAPTURE AUDIT SNAPSHOT */}
                  <button
                    onClick={captureSnapshot}
                    className="p-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl transition transform active:scale-90 flex items-center justify-center ring-4 ring-emerald-500/30"
                    title="Capture Watermarked Audit Snapshot"
                  >
                    <Camera className="w-6 h-6" />
                  </button>

                  {/* Speaker Toggle */}
                  <button
                    onClick={() => setIsSpeakerMuted(!isSpeakerMuted)}
                    className={`p-3 rounded-full transition shadow-lg ${
                      isSpeakerMuted ? 'bg-rose-600 text-white' : 'bg-white/20 hover:bg-white/30 text-white'
                    }`}
                    title={isSpeakerMuted ? 'Unmute Speaker' : 'Mute Speaker'}
                  >
                    {isSpeakerMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>

                  {/* End Call */}
                  <button
                    onClick={handleEndCall}
                    className="p-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-xl transition transform active:scale-95"
                    title="End Call"
                  >
                    <PhoneOff className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Captured Snapshots Gallery */}
          {capturedSnapshots.length > 0 && (
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-800">
                    Watermarked Video Snapshots ({capturedSnapshots.length})
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">Geotagged &amp; Timestamped</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {capturedSnapshots.map((snap) => (
                  <div
                    key={snap.id}
                    className="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-900"
                  >
                    <img src={snap.dataUrl} alt="Snapshot" className="w-full aspect-4/3 object-cover" />
                    <div className="p-1.5 bg-slate-900 text-[10px] text-slate-300 font-mono truncate">
                      {snap.label}
                    </div>
                    <a
                      href={snap.dataUrl}
                      download={`DoSJE_VC_Snapshot_${snap.id}.jpg`}
                      className="absolute top-1.5 right-1.5 p-1 rounded bg-black/70 hover:bg-black text-white transition opacity-0 group-hover:opacity-100"
                      title="Download Snapshot"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Verification Audit & Details */}
        <div className="space-y-4">
          {/* Target Info Card */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-500">Video Call Target</span>
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
                <span className="text-slate-500">WhatsApp Phone:</span>
                <span className="font-mono text-slate-800">{participantPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-semibold text-slate-800">{selectedProject?.district}, {selectedProject?.state}</span>
              </div>
            </div>
          </div>

          {/* Regulatory Verification Checklist */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs text-xs space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 border-b border-slate-100 pb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Regulatory Video Checklist</span>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={idCardVerified}
                  onChange={(e) => setIdCardVerified(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-slate-700">Aadhaar / ID Card Checked on Camera</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={locationConfirmed}
                  onChange={(e) => setLocationConfirmed(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-slate-700">Center Premises &amp; Signboard Inspected</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={physicalAttendanceMatched}
                  onChange={(e) => setPhysicalAttendanceMatched(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-slate-700">Roll Call Matched with Biometric Log</span>
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
                <option value="DISCREPANCY_DETECTED">DISCREPANCY - Roll Call / Facility Mismatch</option>
                <option value="UNAVAILABLE">UNAVAILABLE - Not Responding</option>
              </select>

              <label className="block text-[11px] font-semibold text-slate-700">
                Audit Notes:
              </label>
              <textarea
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                placeholder="Enter regulatory video audit observations..."
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
