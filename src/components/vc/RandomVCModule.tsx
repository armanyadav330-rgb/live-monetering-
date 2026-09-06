import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  Phone,
  Video,
  Shuffle,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  User,
  Clock,
  Building2,
  RefreshCw,
  ExternalLink,
  MessageCircle,
  Copy,
  Check,
  Download,
  Share2,
  Sparkles,
  FileSpreadsheet,
} from 'lucide-react';
import { Project, RandomVCRecord } from '../../types';
import { SimulationBanner } from '../common/SimulationBanner';
import { api } from '../../services/api';
import { RandomVoiceCall } from './RandomVoiceCall';
import { WhatsAppVideoCall } from './WhatsAppVideoCall';
import { TollFreeGenerator } from './TollFreeGenerator';

interface RandomVCModuleProps {
  initialProjectId?: string;
}

export const RandomVCModule: React.FC<RandomVCModuleProps> = ({ initialProjectId }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'VOICE_CALL' | 'VIDEO_CALL' | 'TOLL_FREE' | 'HISTORY'>('VOICE_CALL');
  const [autoStartVoice, setAutoStartVoice] = useState(false);
  const [autoStartVideo, setAutoStartVideo] = useState(false);

  // Participant State
  const [participantType, setParticipantType] = useState<'PROJECT_INCHARGE' | 'STAFF' | 'BENEFICIARY'>('PROJECT_INCHARGE');
  const [participantName, setParticipantName] = useState('');
  const [participantRole, setParticipantRole] = useState('');
  const [participantPhone, setParticipantPhone] = useState('+91 98101 23456');

  // Toll-Free Configuration State
  const [tollFreeNumber, setTollFreeNumber] = useState('1800-180-4921');
  const [tollFreePin, setTollFreePin] = useState('481902');

  // Past Logs
  const [vcHistory, setVcHistory] = useState<RandomVCRecord[]>([]);

  // Load Projects & VC History
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

  // Target Selection Helpers
  const selectTarget = (proj: Project) => {
    setSelectedProject(proj);
    setParticipantType('PROJECT_INCHARGE');
    setParticipantName(proj.projectIncharge || 'Dr. Rajesh Verma');
    setParticipantRole(`Project Director (${proj.ngoName})`);
    setParticipantPhone(proj.contact || '+91 98101 23456');
  };

  const selectRandomTarget = (list = projects) => {
    if (list.length === 0) return;
    const randProj = list[Math.floor(Math.random() * list.length)];
    const types: Array<'PROJECT_INCHARGE' | 'STAFF' | 'BENEFICIARY'> = ['PROJECT_INCHARGE', 'STAFF', 'BENEFICIARY'];
    const chosenType = types[Math.floor(Math.random() * types.length)];

    setSelectedProject(randProj);
    setParticipantType(chosenType);

    if (chosenType === 'PROJECT_INCHARGE') {
      setParticipantName(randProj.projectIncharge || 'Dr. Rajesh Verma');
      setParticipantRole(`Project In-Charge (${randProj.ngoName})`);
      setParticipantPhone(randProj.contact || '+91 98101 23456');
    } else if (chosenType === 'STAFF') {
      const staffNames = ['Sunita Sharma (Trainer)', 'Ramesh Kumar (Center Coordinator)', 'Pooja Rani (Warden)'];
      const chosenStaff = staffNames[Math.floor(Math.random() * staffNames.length)];
      setParticipantName(chosenStaff);
      setParticipantRole('Field Supervisory Staff');
      setParticipantPhone(`+91 98${Math.floor(10000000 + Math.random() * 90000000)}`);
    } else {
      const benNames = ['Amit Kumar (Enrolled Student)', 'Preeti Kumari (Trainee)', 'Rahul Dev (Hostel Resident)'];
      const chosenBen = benNames[Math.floor(Math.random() * benNames.length)];
      setParticipantName(chosenBen);
      setParticipantRole('Enrolled Beneficiary');
      setParticipantPhone(`+91 94${Math.floor(10000000 + Math.random() * 90000000)}`);
    }
  };

  const handleRecordSaved = (newRecord: RandomVCRecord) => {
    setVcHistory((prev) => [newRecord, ...prev]);
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Simulation Banner */}
      <SimulationBanner
        featureName="Random Voice Call &amp; WhatsApp Video Verification Gateway"
        telephonyActive={true}
        description="Official zero-charge Toll-Free Helpline (1800-XXX-XXXX) &amp; Live Video Call verification portal under DoSJE guidelines."
      />

      {/* Target Selector & Random Pick Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Project Select */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wide">
                Target Project
              </label>
              <select
                value={selectedProject?.id || ''}
                onChange={(e) => {
                  const p = projects.find((x) => x.id === e.target.value);
                  if (p) selectTarget(p);
                }}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-emerald-500 text-slate-800 font-medium"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.projectName} ({p.state})
                  </option>
                ))}
              </select>
            </div>

            {/* Target Role */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wide">
                Participant Role
              </label>
              <select
                value={participantType}
                onChange={(e: any) => {
                  const val = e.target.value;
                  setParticipantType(val);
                  if (val === 'PROJECT_INCHARGE' && selectedProject) {
                    setParticipantName(selectedProject.projectIncharge || 'Dr. Rajesh Verma');
                    setParticipantRole(`Project In-Charge (${selectedProject.ngoName})`);
                    setParticipantPhone(selectedProject.contact || '+91 98101 23456');
                  } else if (val === 'STAFF') {
                    setParticipantName('Anita Deshmukh (Head Warden)');
                    setParticipantRole('Field Supervisory Staff');
                    setParticipantPhone('+91 98230 45678');
                  } else {
                    setParticipantName('Suresh Kumar (Student Reg #4092)');
                    setParticipantRole('Enrolled Beneficiary');
                    setParticipantPhone('+91 97654 32109');
                  }
                }}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-emerald-500 text-slate-800 font-medium"
              >
                <option value="PROJECT_INCHARGE">Project In-Charge / Center Head</option>
                <option value="STAFF">Field Staff / Teacher / Warden</option>
                <option value="BENEFICIARY">Direct Beneficiary / Student</option>
              </select>
            </div>

            {/* Phone Number (Editable) */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wide">
                Target Phone Number
              </label>
              <input
                type="text"
                value={participantPhone}
                onChange={(e) => setParticipantPhone(e.target.value)}
                placeholder="+91 98101 23456"
                className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-emerald-500 font-mono text-slate-800 font-medium"
              />
            </div>
          </div>

          {/* Random Target Shuffler Button */}
          <button
            onClick={() => selectRandomTarget()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition shadow-sm self-start lg:self-end cursor-pointer"
            title="Randomly Pick Another Field Target"
          >
            <Shuffle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Random Pick Target</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-4 rounded-t-xl gap-2 overflow-x-auto">
        <button
          onClick={() => {
            setAutoStartVoice(false);
            setAutoStartVideo(false);
            setActiveTab('VOICE_CALL');
          }}
          className={`py-3 px-3.5 border-b-2 text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'VOICE_CALL'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Phone className="w-4 h-4 text-emerald-600" />
          <span>Random Voice Call (Working)</span>
          <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
            ACTIVE
          </span>
        </button>

        <button
          onClick={() => {
            setAutoStartVoice(false);
            setAutoStartVideo(false);
            setActiveTab('VIDEO_CALL');
          }}
          className={`py-3 px-3.5 border-b-2 text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'VIDEO_CALL'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Video className="w-4 h-4 text-emerald-600" />
          <span>WhatsApp Video Call</span>
          <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
            LIVE VC
          </span>
        </button>

        <button
          onClick={() => {
            setAutoStartVoice(false);
            setAutoStartVideo(false);
            setActiveTab('TOLL_FREE');
          }}
          className={`py-3 px-3.5 border-b-2 text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'TOLL_FREE'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Toll-Free Number Generator</span>
          <span className="px-1.5 py-0.2 rounded bg-teal-100 text-teal-800 text-[10px] font-bold">
            1800 TFN
          </span>
        </button>

        <button
          onClick={() => {
            setAutoStartVoice(false);
            setAutoStartVideo(false);
            setActiveTab('HISTORY');
          }}
          className={`py-3 px-3.5 border-b-2 text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'HISTORY'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4 text-slate-500" />
          <span>Audit Records &amp; Logs ({vcHistory.length})</span>
        </button>
      </div>

      {/* TAB CONTENT */}
      <div>
        {activeTab === 'VOICE_CALL' && (
          <RandomVoiceCall
            selectedProject={selectedProject}
            participantType={participantType}
            participantName={participantName}
            participantRole={participantRole}
            participantPhone={participantPhone}
            initialTollFreeNumber={tollFreeNumber}
            initialPin={tollFreePin}
            autoStart={autoStartVoice}
            onUpgradeToVideoCall={() => {
              setAutoStartVideo(true);
              setAutoStartVoice(false);
              setActiveTab('VIDEO_CALL');
            }}
            onRecordSaved={handleRecordSaved}
          />
        )}

        {activeTab === 'VIDEO_CALL' && (
          <WhatsAppVideoCall
            selectedProject={selectedProject}
            participantType={participantType}
            participantName={participantName}
            participantRole={participantRole}
            participantPhone={participantPhone}
            tollFreeNumber={tollFreeNumber}
            tollFreePin={tollFreePin}
            autoStart={autoStartVideo}
            onRecordSaved={handleRecordSaved}
            onSwitchToVoiceCall={() => {
              setAutoStartVoice(true);
              setAutoStartVideo(false);
              setActiveTab('VOICE_CALL');
            }}
          />
        )}

        {activeTab === 'TOLL_FREE' && (
          <TollFreeGenerator
            selectedProject={selectedProject}
            participantName={participantName}
            participantPhone={participantPhone}
            onConnectVoiceCall={(tfn, pin) => {
              setTollFreeNumber(tfn);
              setTollFreePin(pin);
              setAutoStartVoice(true);
              setAutoStartVideo(false);
              setActiveTab('VOICE_CALL');
            }}
            onConnectVideoCall={(tfn, pin) => {
              setTollFreeNumber(tfn);
              setTollFreePin(pin);
              setAutoStartVideo(true);
              setAutoStartVoice(false);
              setActiveTab('VIDEO_CALL');
            }}
          />
        )}

        {activeTab === 'HISTORY' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Regulatory Voice &amp; Video Audit Ledger
                </h3>
                <p className="text-xs text-slate-500">
                  Cryptographically timestamped records of all voice calls, WhatsApp video calls, and Toll-Free verifications.
                </p>
              </div>

              <span className="text-xs text-slate-500 font-mono">
                {vcHistory.length} Recorded Sessions
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[10px] uppercase">
                    <th className="py-2.5 px-3">Date &amp; Time (IST)</th>
                    <th className="py-2.5 px-3">Project</th>
                    <th className="py-2.5 px-3">Participant &amp; Contact</th>
                    <th className="py-2.5 px-3">Duration</th>
                    <th className="py-2.5 px-3">Officer / Inspector</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {vcHistory.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No voice or video verification sessions recorded yet.
                      </td>
                    </tr>
                  ) : (
                    vcHistory.map((vc) => (
                      <tr key={vc.id} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                          {new Date(vc.createdAt || (vc as any).calledAt || Date.now()).toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-900">{vc.projectName}</td>
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-slate-800">{vc.participantName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {vc.participantContact || vc.participantType}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          {formatSeconds(vc.durationSeconds || (vc as any).callDurationSeconds || 0)}
                        </td>
                        <td className="py-2.5 px-3 text-slate-700">{vc.conductedByUserName || 'Field Officer'}</td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
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
                        <td className="py-2.5 px-3 text-slate-600 text-[11px] max-w-xs truncate">
                          {vc.verificationNotes || 'Presence confirmed.'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
