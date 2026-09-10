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
  lang?: 'EN' | 'HI';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  availableUsers,
  onSelectUserAndEnter,
  isDarkMode,
  initialMode = 'login',
  lang = 'EN',
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>('SUPER_ADMIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const roleProfiles: { role: UserRole; title: string; desc: string; badge: string }[] = [
    {
      role: 'SUPER_ADMIN',
      title: lang === 'HI' ? 'डॉ. राजेश शर्मा' : 'Dr. Rajesh Sharma',
      desc: lang === 'HI' ? 'केंद्रीय मंत्रालय निदेशक · पूर्ण राष्ट्रीय निगरानी' : 'Central Ministry Director · Full Global Oversight',
      badge: lang === 'HI' ? 'सुपर एडमिन' : 'Super Admin',
    },
    {
      role: 'DEPARTMENT_OFFICIAL',
      title: lang === 'HI' ? 'अनन्या वर्मा' : 'Ananya Verma',
      desc: lang === 'HI' ? 'संयुक्त सचिव · राष्ट्रीय सीसीटीवी एवं एआई अलर्ट' : 'Joint Secretary · National CCTV & AI Alerts',
      badge: lang === 'HI' ? 'विभागीय अधिकारी' : 'Dept Official',
    },
    {
      role: 'INSPECTION_OFFICER',
      title: lang === 'HI' ? 'विक्रम सिंह' : 'Vikram Singh',
      desc: lang === 'HI' ? 'वरिष्ठ फील्ड ऑडिटर · ऑफलाइन रिपोर्ट एवं जीपीएस डॉजियर' : 'Senior Field Auditor · Offline Reports & GPS Dossiers',
      badge: lang === 'HI' ? 'निरीक्षक' : 'Inspector',
    },
    {
      role: 'STATE_DISTRICT_AUTHORITY',
      title: lang === 'HI' ? 'पूजा अय्यर' : 'Pooja Iyer',
      desc: lang === 'HI' ? 'जिला मजिस्ट्रेट कार्यालय · क्षेत्रीय अनुपालन' : 'District Magistrate Office · Regional Compliance',
      badge: lang === 'HI' ? 'जिला अधिकारी' : 'District Officer',
    },
    {
      role: 'NGO_INSTITUTE',
      title: lang === 'HI' ? 'प्रेरणा सोशल ट्रस्ट प्रबंधक' : 'Prerana Social Trust Admin',
      desc: lang === 'HI' ? 'संस्था वार्डन · लाइव फीड व उपस्थिति डेस्क' : 'Facility Warden · Live Feed & Attendance Desk',
      badge: lang === 'HI' ? 'संस्था व्यवस्थापक' : 'Facility Admin',
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
        className="w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl overflow-hidden transition-all relative bg-white text-black"
      >
        {/* Header Bar */}
        <div className="px-6 py-5 border-b border-slate-200 bg-white text-black flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-black">
                {mode === 'login'
                  ? lang === 'HI'
                    ? 'लाइव निगरानी पोर्टल में प्रवेश'
                    : 'Access Live Monitoring Portal'
                  : lang === 'HI'
                  ? 'मूल्यांकन खाता बनाएं'
                  : 'Create Free Evaluation Account'}
              </h3>
              <p className="text-xs text-black font-medium">
                {lang === 'HI'
                  ? 'सरकारी अधिकारियों एवं निगरानी कर्मियों के लिए सिंगल साइन-ऑन'
                  : 'Single sign-on for government officials & monitoring personnel'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-black hover:text-black hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto bg-white text-black">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setMode('login')}
              className={`py-2 rounded-lg transition ${
                mode === 'login'
                  ? 'bg-white text-black font-bold shadow-xs'
                  : 'text-slate-600'
              }`}
            >
              {lang === 'HI' ? 'साइन इन (डेमो प्रोफ़ाइल)' : 'Sign In (Demo Profiles)'}
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`py-2 rounded-lg transition ${
                mode === 'signup'
                  ? 'bg-white text-black font-bold shadow-xs'
                  : 'text-slate-600'
              }`}
            >
              {lang === 'HI' ? 'कस्टम प्रवेश' : 'Custom Access'}
            </button>
          </div>

          {mode === 'login' ? (
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-black">
                {lang === 'HI' ? 'लाइव डैशबोर्ड खोलने हेतु प्रोफ़ाइल चुनें:' : 'Select Persona to Launch Live Dashboard:'}
              </div>

              <div className="space-y-2">
                {roleProfiles.map((p) => {
                  const isSelected = selectedRole === p.role;
                  return (
                    <div
                      key={p.role}
                      onClick={() => setSelectedRole(p.role)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between bg-white text-black ${
                        isSelected
                          ? 'border-2 border-black ring-1 ring-black/10'
                          : 'border border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isSelected
                              ? 'bg-black text-white'
                              : 'bg-slate-100 text-black border border-slate-200'
                          }`}
                        >
                          <UserCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-black">
                            {p.title}
                          </div>
                          <div className="text-[11px] text-black font-medium">
                            {p.desc}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-black text-white'
                            : 'bg-slate-100 text-black border border-slate-300'
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
                <span>
                  {lang === 'HI'
                    ? `${roleProfiles.find((r) => r.role === selectedRole)?.badge} के रूप में डैशबोर्ड खोलें`
                    : `Launch Live Dashboard as ${roleProfiles.find((r) => r.role === selectedRole)?.badge}`}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'HI' ? 'आधिकारिक ईमेल पता' : 'Official Email Address'}
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
                  {lang === 'HI' ? 'पासवर्ड / पिन' : 'Password / PIN'}
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
                  {lang === 'HI' ? 'परिचालन भूमिका निर्धारण' : 'Operational Role Assignment'}
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
                  <option value="SUPER_ADMIN">
                    {lang === 'HI' ? 'केंद्रीय सुपर एडमिन (मंत्रालय स्तर)' : 'Central Super Admin (Ministry Level)'}
                  </option>
                  <option value="DEPARTMENT_OFFICIAL">
                    {lang === 'HI' ? 'विभागीय निगरानी अधिकारी' : 'Department Monitoring Official'}
                  </option>
                  <option value="INSPECTION_OFFICER">
                    {lang === 'HI' ? 'फील्ड निरीक्षण अधिकारी' : 'Field Inspection Officer'}
                  </option>
                  <option value="STATE_DISTRICT_AUTHORITY">
                    {lang === 'HI' ? 'राज्य एवं जिला मजिस्ट्रेट' : 'State & District Magistrate'}
                  </option>
                  <option value="NGO_INSTITUTE">
                    {lang === 'HI' ? 'एनजीओ / संस्था वार्डन' : 'NGO / Institution Warden'}
                  </option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>{lang === 'HI' ? 'खाता बनाएं एवं ग्रिड में प्रवेश करें' : 'Create Account & Access Grid'}</span>
              </button>
            </form>
          )}

          {/* Privacy Note */}
          <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>
              {lang === 'HI'
                ? 'राष्ट्रीय संप्रभु सुरक्षा मानक द्वारा एन्क्रिप्टेड'
                : 'Encrypted with National Sovereign Security Standard'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
