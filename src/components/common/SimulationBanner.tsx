import React from 'react';
import { Info, Sparkles } from 'lucide-react';

export const SimulationBanner: React.FC<{ context?: string }> = ({ context }) => {
  return (
    <div className="bg-amber-50 border-y border-amber-200 px-4 py-2 text-xs text-amber-900 flex items-center justify-between gap-2 shadow-2xs">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider bg-amber-200 text-amber-950 px-2 py-0.5 rounded-sm border border-amber-300">
          <Info className="w-3 h-3 text-amber-900" />
          SIMULATION / DEMO ENVIRONMENT
        </span>
        <span className="text-amber-800">
          {context ||
            'Operating in Free-First Demo Mode: CCTV video streams, WebRTC conference channels, and attendance telemetry are simulated for testing without paid infrastructure.'}
        </span>
      </div>
      <div className="hidden md:flex items-center gap-1 text-[11px] text-amber-700 font-medium">
        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
        <span>Gemini 3.8 Flash &amp; Leaflet active</span>
      </div>
    </div>
  );
};
