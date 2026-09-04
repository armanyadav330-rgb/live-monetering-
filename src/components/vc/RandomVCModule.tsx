import React, { useState, useEffect, useRef } from 'react';
import {
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Shuffle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  User,
  Clock,
  Building2,
} from 'lucide-react';
import { Project, RandomVCRecord, UserRole } from '../../types';
import { SimulationBanner } from '../common/SimulationBanner';
import { api } from '../../services/api';

interface RandomVCModuleProps {
  initialProjectId?: string;
}

export const RandomVCModule: React.FC<RandomVCModuleProps> = ({ initialProjectId }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [participantType, setParticipantType] = useState<
    'PROJECT_INCHARGE' | 'STAFF' | 'BENEFICIARY'
  >('PROJECT_INCHARGE');
  const [participantName, setParticipantName] = useState('');
  const [participantRole, setParticipantRole] = useState('');

  const [isInCall, setIsInCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [useLocalCam, setUseLocalCam] = useState(false);

  // Verification Checklist
  const [idCardVerified, setIdCardVerified] = useState(true);
  const [locationConfirmed, setLocationConfirmed] = useState(true);
  const [physicalAttendanceMatched, setPhysicalAttendanceMatched] = useState(true);
  const [verificationResult, setVerificationResult] = useState<
    'VERIFIED' | 'DISCREPANCY_DETECTED' | 'UNAVAILABLE'
  >('VERIFIED');
  const [verificationNotes, setVerificationNotes] = useState('');

  // Past VC Logs
  const [vcHistory, setVcHistory] = useState<RandomVCRecord[]>([]);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    api.getProjects().then((p) => {
      setProjects(p);
      if (initialProjectId) {
        const found = p.find((x) => x.id === initialProjectId);
        if (found) selectTarget(found);
      } else if (p.length > 0) {
        selectRandomTarget(p);
      }
    });

    api.getVCRecords().then((recs) => setVcHistory(recs));
  }, [initialProjectId]);

  // Call duration counter
  useEffect(() => {
    let interval: any;
    if (isInCall) {
      interval = setInterval(() => {
        setCallDuration((d) => d + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [isInCall]);

  const selectRandomTarget = (pool = projects) => {
    if (pool.length === 0) return;
    const randomProject = pool[Math.floor(Math.random() * pool.length)];
    selectTarget(randomProject);
  };

  const selectTarget = (p: Project) => {
    setSelectedProject(p);
    const types: Array<'PROJECT_INCHARGE' | 'STAFF' | 'BENEFICIARY'> = [
      'PROJECT_INCHARGE',
      'STAFF',
      'BENEFICIARY',
    ];
    const pickedType = types[Math.floor(Math.random() * types.length)];
    setParticipantType(pickedType);

    if (pickedType === 'PROJECT_INCHARGE') {
      setParticipantName(p.projectIncharge);
      setParticipantRole('Project Director / Center Head');
    } else if (pickedType === 'STAFF') {
      setParticipantName('Suresh Kumar, Vocational Instructor');
      setParticipantRole('Sanctioned Staff Member');
    } else {
      setParticipantName('Mohd. Irfan (Beneficiary #B-104)');
      setParticipantRole('Resident Beneficiary');
    }
  };

  // Start Call
  const handleStartCall = async () => {
    setIsInCall(true);

    // Attempt to acquire real webcam if available
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setUseLocalCam(true);
      }
    } catch {
      // Graceful fallback to realistic simulated video stream
      setUseLocalCam(false);
    }
  };

  // End and Save Call
  const handleEndCall = async () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (selectedProject) {
      const record = await api.saveVCRecord({
        projectId: selectedProject.id,
        projectName: selectedProject.projectName,
        participantType,
        participantName,
        callDurationSeconds: callDuration,
        verificationResult,
        notes: verificationNotes || 'Verification conducted via random live audio/visual session.',
      });

      setVcHistory((prev) => [record, ...prev]);
    }

    setIsInCall(false);
    alert('Video verification session concluded and audit record logged.');
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Simulation Banner */}
      <SimulationBanner context="RANDOM VC DEMO MODE: Real-time video verification connects with project beneficiaries/staff. Supports real browser camera/microphone when allowed, or automated high-fidelity simulated feeds." />

      {/* Main VC Interface */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-emerald-600" />
              <h1 className="text-base font-bold text-slate-900">
                Randomized Video Call Verification Engine
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Conduct unannounced audio-video check-ins directly with field beneficiaries, teachers,
              or center in-charges.
            </p>
          </div>

          {!isInCall && (
            <button
              onClick={() => selectRandomTarget()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition border border-indigo-200 self-start sm:self-auto"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Draw Random Target</span>
            </button>
          )}
        </div>

        {selectedProject && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Target Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Target Entity
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  {selectedProject.riskLevel} RISK
                </span>
              </div>
              <div className="font-bold text-slate-900 text-sm">{selectedProject.projectName}</div>
              <div className="text-slate-500">
                {selectedProject.district}, {selectedProject.state} · {selectedProject.scheme.split('(')[0]}
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-1">
                <div className="text-[11px] text-slate-600">
                  Selected Participant: <strong className="text-slate-900">{participantName}</strong>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Role: {participantRole} ({participantType})
                </div>
              </div>

              {!isInCall && (
                <button
                  onClick={handleStartCall}
                  className="w-full mt-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs flex items-center justify-center gap-2 transition"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Initiate Verification Video Call</span>
                </button>
              )}
            </div>

            {/* Video Call Stage */}
            <div className="lg:col-span-2 bg-slate-950 rounded-xl overflow-hidden min-h-[300px] sm:min-h-[360px] flex flex-col justify-between p-4 relative text-white">
              {isInCall ? (
                <>
                  {/* Top Status Bar */}
                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      <span className="font-mono text-xs font-bold text-emerald-400">
                        ENCRYPTED SESSION · {formatSeconds(callDuration)}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded">
                      NIC SECURE WEBRTC
                    </span>
                  </div>

                  {/* Video Stage Canvas */}
                  <div className="my-auto flex flex-col items-center justify-center text-center p-4">
                    {useLocalCam ? (
                      <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full max-w-md h-56 rounded-lg object-cover border border-slate-700"
                      />
                    ) : (
                      <div className="relative w-full max-w-md h-56 bg-slate-900 rounded-lg flex flex-col items-center justify-center border border-slate-800 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
                          alt="Remote Participant"
                          className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 rounded text-[10px] font-mono text-white">
                          {participantName} (Field Live)
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Controls Bar */}
                  <div className="flex items-center justify-center gap-3 z-10 pt-2">
                    <button
                      onClick={() => setIsMicMuted(!isMicMuted)}
                      className={`p-3 rounded-full transition ${
                        isMicMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200'
                      }`}
                      title="Mute/Unmute Mic"
                    >
                      {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => setIsVideoMuted(!isVideoMuted)}
                      className={`p-3 rounded-full transition ${
                        isVideoMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200'
                      }`}
                      title="Turn Camera On/Off"
                    >
                      {isVideoMuted ? (
                        <VideoOff className="w-4 h-4" />
                      ) : (
                        <VideoIcon className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={handleEndCall}
                      className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-full flex items-center gap-2 shadow-lg transition"
                    >
                      <PhoneOff className="w-4 h-4" />
                      <span>End &amp; Record Verification</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="m-auto text-center space-y-2 p-6">
                  <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-emerald-400">
                    <PhoneCall className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-slate-200">
                    Ready to Connect with Field Participant
                  </div>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Click "Initiate Verification Video Call" to establish a secure line. You can
                    verify beneficiary roll calls, examine premises, and record regulatory compliance.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Verification Checklist & Result Form */}
        {isInCall && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Live Audit Checklist &amp; Finding Recording
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={idCardVerified}
                  onChange={(e) => setIdCardVerified(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span className="font-medium text-slate-800">Aadhaar / ID Card Checked</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={locationConfirmed}
                  onChange={(e) => setLocationConfirmed(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span className="font-medium text-slate-800">Physical Location Confirmed</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={physicalAttendanceMatched}
                  onChange={(e) => setPhysicalAttendanceMatched(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span className="font-medium text-slate-800">Attendance Log Matched</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Verification Conclusion
                </label>
                <select
                  value={verificationResult}
                  onChange={(e) => setVerificationResult(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-semibold"
                >
                  <option value="VERIFIED">✅ VERIFIED (Identity &amp; Presence Confirmed)</option>
                  <option value="DISCREPANCY_DETECTED">
                    ⚠️ DISCREPANCY DETECTED (Requires Audit)
                  </option>
                  <option value="UNAVAILABLE">❌ UNAVAILABLE (Call Not Answered)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Session Notes</label>
                <input
                  type="text"
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  placeholder="Record observations, responses to queries, or irregularities noted..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Historical VC Audit Records */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Recent Random Video Verification Logs
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[10px] uppercase">
                <th className="py-2.5 px-3">Date &amp; Time</th>
                <th className="py-2.5 px-3">Project</th>
                <th className="py-2.5 px-3">Participant</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Conducted By</th>
                <th className="py-2.5 px-3">Verification Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vcHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-slate-400">
                    No video verification sessions recorded yet.
                  </td>
                </tr>
              ) : (
                vcHistory.map((vc) => (
                  <tr key={vc.id} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                      {new Date(vc.calledAt).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">{vc.projectName}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-800">{vc.participantName}</div>
                      <div className="text-[10px] text-slate-500">{vc.participantType}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono">{formatSeconds(vc.callDurationSeconds)}</td>
                    <td className="py-2.5 px-3 text-slate-700">{vc.conductedByUserName}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                          vc.verificationResult === 'VERIFIED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : vc.verificationResult === 'DISCREPANCY_DETECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {vc.verificationResult}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
