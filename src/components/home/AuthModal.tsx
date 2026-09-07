import React, { useState } from 'react';
import {
  X,
  Shield,
  UserCheck,
  Building2,
  LogIn,
  CheckCircle2,
  ArrowRight,
  Lock,
  Mail,
  Zap,
} from 'lucide-react';
import { User, UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableUsers: User[];
  onSelectUserAndEnter: (user: User) => void;
  isDarkMode: boolean;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  availableUsers,
  onSelectUserAndEnter,
  isDarkMode,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>('SUPER_ADMIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const roleProfiles: { role: UserRole; title: string; desc: string; badge: string }[] = [
    {
      role: 'SUPER_ADMIN',
      title: 'Dr. Rajesh Sharma',
      desc: 'Central Ministry Director · Full Global Oversight',
      badge: 'Super Admin',
    },
    {
      role: 'DEPARTMENT_OFFICIAL',
      title: 'Ananya Verma',
      desc: 'Joint Secretary · National CCTV & AI Alerts',
      badge: 'Dept Official',
    },
    {
      role: 'INSPECTION_OFFICER',
      title: 'Vikram Singh',
      desc: 'Senior Field Auditor · Offline Reports & GPS Dossiers',
      badge: 'Inspector',
    },
    {
      role: 'STATE_DISTRICT_AUTHORITY',
      title: 'Pooja Iyer',
      desc: 'District Magistrate Office · Regional Compliance',
      badge: 'District Officer',
    },
    {
      role: 'NGO_INSTITUTE',
      title: 'Prerana Social Trust Admin',
      desc: 'Facility Warden · Live Feed & Attendance Desk',
      badge: 'Facility Admin',
    },
  ];

  const handleQuickLogin = (role: UserRole) => {
    const matchedUser = availableUsers.find((u) => u.role === role);
    if (matchedUser) {
      onSelectUserAndEnter(matchedUser);
    } else if (availableUsers.length > 0) {
      onSelectUserAndEnter(availableUsers[0]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleQuickLogin(selectedRole);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden transition-all relative ${
          isDarkMode
            ? 'bg-slate-900 border-slate-700 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header Bar */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {mode === 'login' ? 'Access Live Monitoring Portal' : 'Create Free Evaluation Account'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Single sign-on for government officials &amp; monitoring personnel
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setMode('login')}
              className={`py-2 rounded-lg transition ${
                mode === 'login'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Sign In (Demo Profiles)
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`py-2 rounded-lg transition ${
                mode === 'signup'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Custom Access
            </button>
          </div>

          {mode === 'login' ? (
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Select Persona to Launch Live Dashboard:
              </div>

              <div className="space-y-2">
                {roleProfiles.map((p) => {
                  const isSelected = selectedRole === p.role;
                  return (
                    <div
                      key={p.role}
                      onClick={() => setSelectedRole(p.role)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 ring-1 ring-blue-500'
                          : isDarkMode
                          ? 'border-slate-800 bg-slate-800/40 hover:bg-slate-800/80'
                          : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <UserCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            {p.title}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {p.desc}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {p.badge}
                      </span>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => handleQuickLogin(selectedRole)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>Launch Live Dashboard as {roleProfiles.find(r => r.role === selectedRole)?.badge}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="officer@dosje.gov.in"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-xs border outline-none transition ${
                      isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500'
                        : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Password / PIN
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-xs border outline-none transition ${
                      isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500'
                        : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Operational Role Assignment
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs border outline-none ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-white'
                      : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  <option value="SUPER_ADMIN">Central Super Admin (Ministry Level)</option>
                  <option value="DEPARTMENT_OFFICIAL">Department Monitoring Official</option>
                  <option value="INSPECTION_OFFICER">Field Inspection Officer</option>
                  <option value="STATE_DISTRICT_AUTHORITY">State &amp; District Magistrate</option>
                  <option value="NGO_INSTITUTE">NGO / Institution Warden</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>Create Account &amp; Access Grid</span>
              </button>
            </form>
          )}

          {/* Privacy Note */}
          <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>Encrypted with National Sovereign Security Standard</span>
          </div>
        </div>
      </div>
    </div>
  );
};
