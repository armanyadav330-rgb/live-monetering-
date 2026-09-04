import React from 'react';
import {
  Shuffle,
  PhoneCall,
  Video,
  MapPin,
  FileSpreadsheet,
} from 'lucide-react';

interface QuickActionsProps {
  onOpenAssignModal: () => void;
  onNavigate: (view: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onOpenAssignModal,
  onNavigate,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Direct Operational Controls
        </h3>
        <span className="text-[11px] text-slate-400">Randomized &amp; Real-time Verification</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        <button
          onClick={onOpenAssignModal}
          className="flex items-center justify-center gap-2 p-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-semibold transition"
        >
          <Shuffle className="w-4 h-4 text-indigo-700" />
          <span>Assign Random Inspection</span>
        </button>

        <button
          onClick={() => onNavigate('vc')}
          className="flex items-center justify-center gap-2 p-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-semibold transition"
        >
          <PhoneCall className="w-4 h-4 text-emerald-700" />
          <span>Start Random VC</span>
        </button>

        <button
          onClick={() => onNavigate('cctv')}
          className="flex items-center justify-center gap-2 p-3 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 text-xs font-semibold transition"
        >
          <Video className="w-4 h-4 text-sky-700" />
          <span>View CCTV Matrix</span>
        </button>

        <button
          onClick={() => onNavigate('map')}
          className="flex items-center justify-center gap-2 p-3 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold transition"
        >
          <MapPin className="w-4 h-4 text-amber-700" />
          <span>View GIS Map</span>
        </button>

        <button
          onClick={() => onNavigate('reports')}
          className="flex items-center justify-center gap-2 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold transition"
        >
          <FileSpreadsheet className="w-4 h-4 text-slate-700" />
          <span>Generate MIS Report</span>
        </button>
      </div>
    </div>
  );
};
