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
    <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-xs font-sans">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
        <h3 className="text-xs font-bold text-[#0B2545] uppercase tracking-wider flex items-center gap-1.5">
          <span>⚡</span>
          <span>Direct Statutory &amp; Operational Controls (त्वरित प्रशासनिक नियंत्रण)</span>
        </h3>
        <span className="text-[11px] text-slate-500 font-medium">NIC Encrypted · Direct Action Desk</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* AI Assistant Button */}
        <button
          onClick={() => (onOpenAIAssistant ? onOpenAIAssistant('audio_call') : onNavigate('ai-assistant'))}
          className="flex items-center justify-center gap-2 p-3 rounded-lg bg-[#0B2545]/5 hover:bg-[#0B2545]/10 text-[#0B2545] border border-[#0B2545]/20 text-xs font-bold transition shadow-xs group cursor-pointer"
        >
          <div className="relative">
            <Bot className="w-4 h-4 text-[#0B2545] group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <span>AI Officer (Oral/Voice)</span>
        </button>

        <button
          onClick={triggerAssign}
          className="flex items-center justify-center gap-2 p-3 rounded-lg bg-[#1E3A8A]/5 hover:bg-[#1E3A8A]/10 text-[#1E3A8A] border border-[#1E3A8A]/20 text-xs font-bold transition cursor-pointer"
        >
          <Shuffle className="w-4 h-4 text-[#1E3A8A]" />
          <span>Assign Random Audit</span>
        </button>

        <button
          onClick={triggerVC}
          className="flex items-center justify-center gap-2 p-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold transition cursor-pointer"
        >
          <PhoneCall className="w-4 h-4 text-emerald-700" />
          <span>Random Call &amp; Video</span>
        </button>

        <button
          onClick={triggerCCTV}
          className="flex items-center justify-center gap-2 p-3 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-300 text-xs font-bold transition cursor-pointer"
        >
          <Video className="w-4 h-4 text-sky-700" />
          <span>CCTV Matrix</span>
        </button>

        <button
          onClick={triggerMap}
          className="flex items-center justify-center gap-2 p-3 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition cursor-pointer"
        >
          <MapPin className="w-4 h-4 text-amber-700" />
          <span>GIS Project Map</span>
        </button>

        <button
          onClick={() => onNavigate('reports')}
          className="flex items-center justify-center gap-2 p-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold transition cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-slate-700" />
          <span>MIS Reports Dossier</span>
        </button>
      </div>
    </div>
  );
};
