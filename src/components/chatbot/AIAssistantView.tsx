import React, { useState, useEffect } from 'react';
import {
  Phone,
  Video,
  MessageSquare,
  Shield,
  Sparkles,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Headphones,
  Camera,
  RefreshCw,
} from 'lucide-react';
import { GrievanceTicket } from '../../types';
import { api } from '../../services/api';
import { AITicketCard } from './AITicketCard';
import { AIOfficerAvatar } from './AIOfficerAvatar';

interface AIAssistantViewProps {
  onStartCall: (mode: 'chat' | 'audio_call' | 'video_call') => void;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({ onStartCall }) => {
  const [tickets, setTickets] = useState<GrievanceTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await api.getGrievances();
      setTickets(data);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  const resolvedCount = tickets.filter((t) => t.status === 'RESOLVED').length;
  const inProgressCount = tickets.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'OPEN').length;

  return (
    <div className="space-y-6 animate-fade-in text-slate-900 dark:text-slate-100">
      {/* Hero Banner with Animated Officer Avatar */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <AIOfficerAvatar size="lg" />
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active 24x7 • Human Oral Speech Cadence</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                DoSJE AI Grievance Resolution &amp; Tele-Inspection Desk
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Communicate directly via <strong>oral audio call</strong> or <strong>two-way live video call</strong> with Dr. Aditi Verma and Officer Rajeshwar. Get instant resolutions for delayed scholarships, PFMS DBT clearances, offline CCTV feeds, biometric device sync failures, and surprise field inspections.
              </p>
            </div>
          </div>

          {/* Quick Stats Block */}
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0 text-center">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3">
              <div className="text-2xl font-black text-emerald-400">{resolvedCount}</div>
              <div className="text-[11px] text-slate-400 font-medium">Issues Resolved</div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3">
              <div className="text-2xl font-black text-amber-400">{inProgressCount}</div>
              <div className="text-[11px] text-slate-400 font-medium">Active Dockets</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Cards: 3 Modalities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Oral Audio Call */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Oral Audio Tele-Call
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Speak orally into your microphone as if on a telephone call. The AI Officer listens, speaks back with natural human inflection, and logs actionable resolution tickets.
            </p>
            <ul className="text-xs text-slate-500 dark:text-slate-400 mt-3 space-y-1.5 list-disc list-inside">
              <li>Voice-driven problem resolution</li>
              <li>Real-time speech-to-text transcript</li>
              <li>DTMF automated routing keypad</li>
            </ul>
          </div>

          <button
            onClick={() => onStartCall('audio_call')}
            className="mt-6 w-full inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-sm"
          >
            <Headphones className="w-4 h-4" />
            <span>Connect on Audio Call</span>
          </button>
        </div>

        {/* Card 2: Two-Way Live Video Call */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 border border-purple-500/20">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Live Video Call &amp; ID Inspection
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Face-to-face video consultation. Hold student ID cards, NGO certificates, or attendance registers in front of your camera for automated live AI authentication.
            </p>
            <ul className="text-xs text-slate-500 dark:text-slate-400 mt-3 space-y-1.5 list-disc list-inside">
              <li>Two-way video conference stream</li>
              <li>Document scan &amp; credential check</li>
              <li>Geo-tagged audit snapshot capture</li>
            </ul>
          </div>

          <button
            onClick={() => onStartCall('video_call')}
            className="mt-6 w-full inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors shadow-sm"
          >
            <Camera className="w-4 h-4" />
            <span>Start Live Video Call</span>
          </button>
        </div>

        {/* Card 3: Interactive Problem Resolver Chat */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 border border-blue-500/20">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              AI Problem Resolver &amp; Tickets
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Prefer typing? Chat with the AI Officer, examine step-by-step diagnostic workflows, and generate official printable resolution slips.
            </p>
            <ul className="text-xs text-slate-500 dark:text-slate-400 mt-3 space-y-1.5 list-disc list-inside">
              <li>Instant PFMS DBT hold checks</li>
              <li>72-hour CCTV downtime waivers</li>
              <li>Downloadable docket receipts</li>
            </ul>
          </div>

          <button
            onClick={() => onStartCall('chat')}
            className="mt-6 w-full inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open Problem Desk</span>
          </button>
        </div>
      </div>

      {/* Dockets & Grievance Tickets List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Official Grievance Resolution Dockets
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Logged and tracked by the AI Tele-Inspection Officer
            </p>
          </div>
          <button
            onClick={fetchTickets}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 py-1 px-2.5 rounded-lg border border-blue-200 dark:border-blue-900/40 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Dockets</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tickets.map((t) => (
            <AITicketCard key={t.id} ticket={t} onResolved={fetchTickets} />
          ))}
        </div>
      </div>
    </div>
  );
};
