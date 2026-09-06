import React from 'react';
import {
  Shuffle,
  PhoneCall,
  Video,
  MapPin,
  FileSpreadsheet,
  MessageCircle,
  Bot,
  Sparkles,
} from 'lucide-react';

interface QuickActionsProps {
  onOpenAssignModal?: () => void;
  onNavigate: (view: string) => void;
  onOpenAIAssistant?: (mode?: string) => void;
  userRole?: string;
  onOpenAddProject?: () => void;
  onOpenAssignInspection?: () => void;
  onOpenCCTV?: () => void;
  onOpenVC?: () => void;
  onOpenAIAnalytics?: () => void;
  onOpenGISMap?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onOpenAssignModal,
  onNavigate,
  onOpenAIAssistant,
  onOpenAssignInspection,
  onOpenCCTV,
  onOpenVC,
  onOpenGISMap,
}) => {
  const triggerAssign = onOpenAssignModal || onOpenAssignInspection;
  const triggerCCTV = onOpenCCTV || (() => onNavigate('cctv'));
  const triggerVC = onOpenVC || (() => onNavigate('vc'));
  const triggerMap = onOpenGISMap || (() => onNavigate('map'));

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Direct Operational Controls
        </h3>
        <span className="text-[11px] text-slate-400">Randomized &amp; Real-time Verification</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* AI Assistant Button */}
        <button
          onClick={() => (onOpenAIAssistant ? onOpenAIAssistant('audio_call') : onNavigate('ai-assistant'))}
          className="flex items-center justify-center gap-2 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 text-purple-900 border border-purple-200 text-xs font-semibold transition shadow-xs group"
        >
          <div className="relative">
            <Bot className="w-4 h-4 text-purple-700 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <span>AI Officer (Call)</span>
        </button>

        <button
          onClick={triggerAssign}
          className="flex items-center justify-center gap-2 p-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-semibold transition"
        >
          <Shuffle className="w-4 h-4 text-indigo-700" />
          <span>Assign Random Audit</span>
        </button>

        <button
          onClick={triggerVC}
          className="flex items-center justify-center gap-2 p-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-semibold transition"
        >
          <PhoneCall className="w-4 h-4 text-emerald-700" />
          <span>Random Call &amp; Video</span>
        </button>

        <button
          onClick={triggerCCTV}
          className="flex items-center justify-center gap-2 p-3 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 text-xs font-semibold transition"
        >
          <Video className="w-4 h-4 text-sky-700" />
          <span>CCTV Matrix</span>
        </button>

        <button
          onClick={triggerMap}
          className="flex items-center justify-center gap-2 p-3 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold transition"
        >
          <MapPin className="w-4 h-4 text-amber-700" />
          <span>GIS Project Map</span>
        </button>

        <button
          onClick={() => onNavigate('reports')}
          className="flex items-center justify-center gap-2 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold transition"
        >
          <FileSpreadsheet className="w-4 h-4 text-slate-700" />
          <span>MIS Report</span>
        </button>
      </div>
    </div>
  );
};
