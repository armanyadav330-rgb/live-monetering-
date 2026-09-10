import React, { useState, useMemo } from 'react';
import {
  CalendarDays,
  Clock,
  MapPin,
  PlayCircle,
  Eye,
  AlertCircle,
  CalendarCheck,
  Building2,
  Navigation,
} from 'lucide-react';
import { Inspection, User } from '../../types';

interface InspectionScheduleViewProps {
  inspections: Inspection[];
  currentUser: User;
  onConductInspection: (id: string) => void;
  onSelectInspection: (id: string) => void;
  isTodayOnly?: boolean;
}

export const InspectionScheduleView: React.FC<InspectionScheduleViewProps> = ({
  inspections,
  currentUser,
  onConductInspection,
  onSelectInspection,
  isTodayOnly = false,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'TODAY' | 'UPCOMING'>('ALL');

  // Filter inspections for the current user (or all if not strictly assigned)
  const scheduledInspections = useMemo(() => {
    return inspections.filter((i) => {
      const isAssigned =
        i.inspectorId === currentUser.id ||
        i.inspectorName === currentUser.name ||
        currentUser.role === 'SUPER_ADMIN';

      if (isTodayOnly) {
        return isAssigned && (i.status === 'PENDING' || i.status === 'IN_PROGRESS');
      }

      return isAssigned;
    });
  }, [inspections, currentUser, isTodayOnly]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-indigo-600" />
            <h1 className="text-base font-bold text-slate-900">
              {isTodayOnly ? "Today's Field Duty Schedule" : 'Inspection Calendar & Itinerary'}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {isTodayOnly
              ? 'Active day audits, geo-tagged route checkpoints, and immediate inspection duties.'
              : 'Chronological timeline of scheduled on-site audits, surprise visits, and statutory re-inspections.'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800">
          <CalendarCheck className="w-4 h-4 text-indigo-600" />
          <span>{scheduledInspections.length} Duty Slots Assigned</span>
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-3">
        {scheduledInspections.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-2">
            <CalendarDays className="w-10 h-10 text-slate-300 mx-auto" />
            <div className="text-sm font-bold text-slate-700">No Scheduled Field Visits</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You currently have no pending inspections scheduled for this timeline. New assignments dispatched from the command center will appear here.
            </p>
          </div>
        ) : (
          scheduledInspections.map((item, idx) => {
            const isCompleted = item.status === 'COMPLETED';
            const isInProgress = item.status === 'IN_PROGRESS';

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] uppercase font-bold text-slate-500">SLOT</span>
                    <span className="text-sm font-black text-[#0B2545]">#{idx + 1}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {item.inspectionCode}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : isInProgress
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {item.inspectionType.replace('_', ' ')}
                      </span>
                    </div>

                    <h2 className="text-sm font-bold text-slate-900">{item.projectName}</h2>

                    <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.district}, {item.state}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Scheduled: {item.scheduledDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => onSelectInspection(item.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Dossier</span>
                  </button>

                  {!isCompleted && (
                    <button
                      onClick={() => onConductInspection(item.id)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0B2545] hover:bg-[#13315C] text-white text-xs font-bold transition shadow-2xs cursor-pointer"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>{isInProgress ? 'Resume Audit' : 'Start Inspection'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
