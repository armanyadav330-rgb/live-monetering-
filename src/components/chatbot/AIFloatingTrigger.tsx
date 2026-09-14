import React, { useState } from 'react';
import { Bot, Phone, Video, MessageSquare, Sparkles, X, ChevronUp } from 'lucide-react';
import { AIOfficerAvatar } from './AIOfficerAvatar';
import { Robot3DAvatar } from './Robot3DAvatar';

interface AIFloatingTriggerProps {
  onOpen: (mode?: 'chat' | 'audio_call' | 'video_call' | 'tickets') => void;
  isOpen?: boolean;
}

export const AIFloatingTrigger: React.FC<AIFloatingTriggerProps> = ({ onOpen, isOpen = false }) => {
  const [expanded, setExpanded] = useState(false);

  // If chatbot is currently open, hide floating launcher to prevent visual overlap
  if (isOpen) return null;

  return (
    <div
      className="fixed bottom-[max(0.75rem,calc(env(safe-area-inset-bottom,0px)+0.5rem))] right-[max(0.75rem,calc(env(safe-area-inset-right,0px)+0.5rem))] sm:bottom-6 sm:right-6 z-40 flex flex-col items-end space-y-2 select-none max-w-[calc(100vw-1.5rem)]"
      id="satya-nirakshak-ai-floating-trigger"
    >
      {/* Expanded Quick Action Menu */}
      {expanded && (
        <div className="bg-slate-900/95 border border-slate-700/80 backdrop-blur-md rounded-2xl p-3 shadow-2xl space-y-2 mb-1 w-[min(16rem,calc(100vw-1.5rem))] max-w-[calc(100vw-1.5rem)] text-white animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="flex h-2.5 w-2.5 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-white tracking-wide truncate">DoSJE AI Officer</span>
            </div>
            <button
              onClick={() => setExpanded(false)}
              className="text-slate-400 hover:text-white p-1 shrink-0"
              aria-label="Close action menu"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-slate-300 leading-snug">
            Communicate orally like a human to resolve scholarships, CCTV offline, biometrics & inspections:
          </p>

          <div className="space-y-1.5 pt-1">
            <button
              onClick={() => {
                setExpanded(false);
                onOpen('audio_call');
              }}
              className="w-full flex items-center space-x-2.5 px-2.5 sm:px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all group"
            >
              <div className="p-1 rounded-lg bg-emerald-500/30 text-emerald-300 group-hover:scale-110 transition-transform shrink-0">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div className="text-left min-w-0">
                <div className="truncate">Start Audio Call</div>
                <div className="text-[9px] text-emerald-400/80 font-normal truncate">Oral phone conversation</div>
              </div>
            </button>

            <button
              onClick={() => {
                setExpanded(false);
                onOpen('video_call');
              }}
              className="w-full flex items-center space-x-2.5 px-2.5 sm:px-3 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-all group"
            >
              <div className="p-1 rounded-lg bg-purple-500/30 text-purple-300 group-hover:scale-110 transition-transform shrink-0">
                <Video className="w-3.5 h-3.5" />
              </div>
              <div className="text-left min-w-0">
                <div className="truncate">Start Video Call</div>
                <div className="text-[9px] text-purple-400/80 font-normal truncate">Face-to-face AI inspection</div>
              </div>
            </button>

            <button
              onClick={() => {
                setExpanded(false);
                onOpen('chat');
              }}
              className="w-full flex items-center space-x-2.5 px-2.5 sm:px-3 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold transition-all group"
            >
              <div className="p-1 rounded-lg bg-blue-500/30 text-blue-300 group-hover:scale-110 transition-transform shrink-0">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <div className="text-left min-w-0">
                <div className="truncate">AI Problem Resolver</div>
                <div className="text-[9px] text-blue-400/80 font-normal truncate">Chat & generate tickets</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="group relative flex items-center space-x-2 sm:space-x-3 pl-1.5 sm:pl-2 pr-3 sm:pr-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 hover:from-slate-800 hover:to-indigo-900 text-white shadow-2xl shadow-indigo-950/60 border border-indigo-400/40 transition-all transform hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md max-w-full"
        aria-label="Open AI Officer Voice & Video Resolution"
      >
        {/* 3D Robot Avatar Character Image */}
        <div className="relative flex items-center justify-center shrink-0">
          <Robot3DAvatar size={38} />
          <span className="absolute bottom-0 right-0 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-emerald-500 border-2 border-slate-900"></span>
          </span>
        </div>

        <div className="text-left min-w-0">
          <div className="text-[11px] sm:text-xs font-bold tracking-wide flex items-center space-x-1 sm:space-x-1.5 text-white">
            <span className="truncate">AI Officer</span>
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300 shrink-0" />
          </div>
          <div className="text-[9px] sm:text-[10px] text-blue-200 font-medium truncate">
            Voice & Video Resolution
          </div>
        </div>

        <ChevronUp
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-300 transition-transform duration-200 shrink-0 ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </button>
    </div>
  );
};
