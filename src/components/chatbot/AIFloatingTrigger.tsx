import React, { useState } from 'react';
import { Bot, Phone, Video, MessageSquare, Sparkles, X, ChevronUp } from 'lucide-react';
import { AIOfficerAvatar } from './AIOfficerAvatar';
import { Robot3DAvatar } from './Robot3DAvatar';

interface AIFloatingTriggerProps {
  onOpen: (mode?: 'chat' | 'audio_call' | 'video_call' | 'tickets') => void;
}

export const AIFloatingTrigger: React.FC<AIFloatingTriggerProps> = ({ onOpen }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end space-y-2 select-none">
      {/* Expanded Quick Action Menu */}
      {expanded && (
        <div className="bg-slate-900/95 border border-slate-700/80 backdrop-blur-md rounded-2xl p-3 shadow-2xl space-y-2 mb-1 w-64 text-white animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-white tracking-wide">DoSJE AI Officer</span>
            </div>
            <button
              onClick={() => setExpanded(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-slate-300">
            Communicate orally like a human to resolve scholarships, CCTV offline, biometrics & inspections:
          </p>

          <div className="space-y-1.5 pt-1">
            <button
              onClick={() => {
                setExpanded(false);
                onOpen('audio_call');
              }}
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all group"
            >
              <div className="p-1 rounded-lg bg-emerald-500/30 text-emerald-300 group-hover:scale-110 transition-transform">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div>Start Audio Call</div>
                <div className="text-[9px] text-emerald-400/80 font-normal">Oral phone conversation</div>
              </div>
            </button>

            <button
              onClick={() => {
                setExpanded(false);
                onOpen('video_call');
              }}
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-all group"
            >
              <div className="p-1 rounded-lg bg-purple-500/30 text-purple-300 group-hover:scale-110 transition-transform">
                <Video className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div>Start Video Call</div>
                <div className="text-[9px] text-purple-400/80 font-normal">Face-to-face AI inspection</div>
              </div>
            </button>

            <button
              onClick={() => {
                setExpanded(false);
                onOpen('chat');
              }}
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold transition-all group"
            >
              <div className="p-1 rounded-lg bg-blue-500/30 text-blue-300 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div>AI Problem Resolver</div>
                <div className="text-[9px] text-blue-400/80 font-normal">Chat & generate tickets</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="group relative flex items-center space-x-3 pl-2 pr-4 py-2 rounded-full bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 hover:from-slate-800 hover:to-indigo-900 text-white shadow-2xl shadow-indigo-950/60 border border-indigo-400/40 transition-all transform hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
      >
        {/* 3D Robot Avatar Character Image */}
        <div className="relative flex items-center justify-center">
          <Robot3DAvatar size={42} />
          <span className="absolute bottom-0 right-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-900"></span>
          </span>
        </div>

        <div className="text-left">
          <div className="text-xs font-bold tracking-wide flex items-center space-x-1.5 text-white">
            <span>AI Officer</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </div>
          <div className="text-[10px] text-blue-200 font-medium">
            Voice & Video Resolution
          </div>
        </div>

        <ChevronUp
          className={`w-4 h-4 text-blue-300 transition-transform duration-200 ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </button>
    </div>
  );
};
