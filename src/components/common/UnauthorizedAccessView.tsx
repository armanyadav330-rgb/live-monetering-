import React from 'react';
import { ShieldAlert, ArrowLeft, Lock, AlertTriangle } from 'lucide-react';
import { User } from '../../types';
import { getRoleCategory, getRoleDisplayName } from '../../utils/rbac';

interface UnauthorizedAccessViewProps {
  currentUser: User;
  attemptedView: string;
  onNavigateToDashboard: () => void;
}

export const UnauthorizedAccessView: React.FC<UnauthorizedAccessViewProps> = ({
  currentUser,
  attemptedView,
  onNavigateToDashboard,
}) => {
  const roleName = getRoleDisplayName(currentUser.role);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl border border-rose-200 shadow-xl p-6 sm:p-8 text-center space-y-5">
        {/* Gov Shield Alert Icon */}
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-700 bg-rose-100 px-3 py-1 rounded-full border border-rose-300">
            Access Restricted · Section 43 IT Act
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2.5">
            Unauthorized Module Access
          </h1>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Your current account role <strong className="text-slate-900">({roleName})</strong> does not possess the requisite security clearance to view or execute actions in the module <code className="bg-slate-100 text-rose-700 px-1.5 py-0.5 rounded font-mono font-bold text-[11px]">{attemptedView}</code>.
          </p>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-left text-xs space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-slate-700">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Role-Based Access Enforcement (RBAC)</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Administrative controls, user credential management, and portal configuration are restricted strictly to authorized Administrator personnel.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onNavigateToDashboard}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B2545] hover:bg-[#13315C] text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Authorized Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
