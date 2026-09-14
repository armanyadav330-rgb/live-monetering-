import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  LogIn,
  Lock,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  UserCog,
  ChevronDown,
} from 'lucide-react';
import { User, UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableUsers: User[];
  onSelectUserAndEnter: (user: User) => void;
  isDarkMode?: boolean;
  initialMode?: 'login' | 'signup';
  initialRole?: UserRole;
  lang?: 'EN' | 'HI';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  availableUsers,
  onSelectUserAndEnter,
  initialRole,
  lang = 'EN',
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole || 'SUPER_ADMIN');
  const [identifier, setIdentifier] = useState('admin.dosje@gov.in');
  const [password, setPassword] = useState('GovSecure@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const targetRole = initialRole || 'SUPER_ADMIN';
      setSelectedRole(targetRole);
      const matchedUser = availableUsers.find((u) => u.role === targetRole);
      if (matchedUser) {
        setIdentifier(matchedUser.email);
      } else {
        const fallback = availableUsers[0];
        if (fallback) setIdentifier(fallback.email);
      }
      setErrorMessage(null);
      setForgotPasswordSent(false);
      setIsLoading(false);
    }
  }, [isOpen, initialRole, availableUsers]);

  if (!isOpen) return null;

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    const matchedUser = availableUsers.find((u) => u.role === role);
    if (matchedUser) {
      setIdentifier(matchedUser.email);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setForgotPasswordSent(false);

    if (!identifier.trim()) {
      setErrorMessage(
        lang === 'HI'
          ? 'कृपया अपना ईमेल या आधिकारिक आईडी दर्ज करें'
          : 'Please enter your Email or Official ID'
      );
      return;
    }

    if (!password) {
      setErrorMessage(
        lang === 'HI' ? 'कृपया अपना पासवर्ड दर्ज करें' : 'Please enter your password'
      );
      return;
    }

    setIsLoading(true);

    // Simulate authentic government portal verification
    setTimeout(() => {
      const input = identifier.trim().toLowerCase();

      // 1. Direct match with selected role and email/ID
      let matchedUser = availableUsers.find(
        (u) =>
          u.role === selectedRole &&
          (u.email.toLowerCase() === input || u.id.toLowerCase() === input)
      );

      // 2. Direct email or ID match across all users
      if (!matchedUser) {
        matchedUser = availableUsers.find(
          (u) => u.email.toLowerCase() === input || u.id.toLowerCase() === input
        );
      }

      // 3. Email prefix or partial match
      if (!matchedUser && input) {
        matchedUser = availableUsers.find((u) => {
          const emailPrefix = u.email.split('@')[0].toLowerCase();
          return (
            emailPrefix === input ||
            u.email.toLowerCase().includes(input) ||
            u.id.toLowerCase().includes(input) ||
            u.name.toLowerCase().includes(input)
          );
        });
      }

      // 4. Role-based fallback for the selected role
      if (!matchedUser) {
        matchedUser = availableUsers.find((u) => u.role === selectedRole);
      }

      // 5. Default fallback to Super Admin if available
      if (!matchedUser) {
        matchedUser =
          availableUsers.find((u) => u.role === 'SUPER_ADMIN') || availableUsers[0];
      }

      setIsLoading(false);

      if (matchedUser) {
        onSelectUserAndEnter(matchedUser);
      } else {
        setErrorMessage(
          lang === 'HI'
            ? 'अमान्य क्रेडेंशियल। कृपया विवरण पुनः जांचें।'
            : 'Invalid credentials. Please verify your official ID.'
        );
      }
    }, 350);
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setForgotPasswordSent(true);
    setErrorMessage(null);
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="auth-modal-container"
        className="w-full max-w-md rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl overflow-hidden relative bg-white text-slate-900 transition-all flex flex-col max-h-[92vh]"
      >
        {/* Government Header Bar */}
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-slate-100 bg-linear-to-b from-slate-50/90 to-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B2545] flex items-center justify-center text-amber-400 font-bold shadow-xs border border-amber-500/30 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3
                id="auth-modal-title"
                className="text-base sm:text-lg font-bold text-[#0B2545] tracking-tight leading-snug"
              >
                {lang === 'HI'
                  ? 'लाइव निगरानी पोर्टल में प्रवेश'
                  : 'Access Live Monitoring Portal'}
              </h3>
              <p
                id="auth-modal-subtitle"
                className="text-xs text-slate-500 font-medium leading-tight mt-0.5"
              >
                {lang === 'HI'
                  ? 'अधिकृत निगरानी कर्मियों हेतु सुरक्षित साइन-इन'
                  : 'Secure sign-in for authorized monitoring personnel'}
              </p>
            </div>
          </div>

          <button
            id="auth-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body & Single Unified Login Form */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* Notification / Alert Feedback */}
          {errorMessage && (
            <div
              id="auth-error-alert"
              className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-in fade-in"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {forgotPasswordSent && (
            <div
              id="auth-forgot-alert"
              className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 animate-in fade-in"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <div className="leading-relaxed">
                {lang === 'HI'
                  ? 'पासवर्ड रीसेट लिंक आपके पंजीकृत सरकारी एनआईसी / आधिकारिक ईमेल पर भेज दिया गया है।'
                  : 'A secure password recovery instructions link has been dispatched to your registered NIC / official email.'}
              </div>
            </div>
          )}

          <form id="unified-login-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label
                htmlFor="auth-role-select"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                {lang === 'HI' ? 'भूमिका चुनें / पद' : 'Select Role / Designation'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserCog className="w-4 h-4" />
                </div>
                <select
                  id="auth-role-select"
                  value={selectedRole}
                  onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50/70 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20 focus:border-[#0B2545] transition cursor-pointer appearance-none"
                >
                  <option value="SUPER_ADMIN">
                    {lang === 'HI' ? 'सुपर एडमिन (केंद्रीय मंत्रालय)' : 'Super Admin (Central Ministry)'}
                  </option>
                  <option value="DEPARTMENT_OFFICIAL">
                    {lang === 'HI' ? 'विभागीय अधिकारी (संयुक्त सचिव / राज्य स्तर)' : 'Department Official (Joint Secretary)'}
                  </option>
                  <option value="INSPECTION_OFFICER">
                    {lang === 'HI' ? 'निरीक्षण अधिकारी (फील्ड ऑडिटर)' : 'Inspection Officer (Field Auditor)'}
                  </option>
                  <option value="STATE_DISTRICT_AUTHORITY">
                    {lang === 'HI' ? 'जिला / राज्य प्राधिकारी (मजिस्ट्रेट)' : 'District / State Authority (Magistrate)'}
                  </option>
                  <option value="NGO_INSTITUTE">
                    {lang === 'HI' ? 'संस्था / एनजीओ व्यवस्थापक (वार्डन)' : 'Facility / NGO Admin (Warden)'}
                  </option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* 1. Email / Official ID */}
            <div>
              <label
                htmlFor="auth-email-input"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                {lang === 'HI' ? 'ईमेल / आधिकारिक आईडी' : 'Email / Official ID'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="auth-email-input"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder={
                    lang === 'HI'
                      ? 'उदा. officer@dosje.gov.in या आधिकारिक आईडी'
                      : 'officer@dosje.gov.in or Official ID'
                  }
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50/70 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20 focus:border-[#0B2545] transition"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* 2. Password & 3. Show/Hide Password */}
            <div>
              <label
                htmlFor="auth-password-input"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                {lang === 'HI' ? 'पासवर्ड' : 'Password'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="auth-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50/70 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20 focus:border-[#0B2545] transition"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  id="toggle-password-visibility-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPassword((prev) => !prev);
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#0B2545] active:scale-95 transition-colors cursor-pointer select-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-[#0B2545]" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-500" />
                  )}
                </button>
              </div>
            </div>

            {/* 4. Remember me & 6. Forgot Password? */}
            <div className="flex items-center justify-between pt-0.5 text-xs">
              <label
                htmlFor="auth-remember-me"
                className="flex items-center gap-2 cursor-pointer select-none text-slate-600 hover:text-slate-900 font-medium"
              >
                <input
                  type="checkbox"
                  id="auth-remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-[#0B2545] border-slate-300 focus:ring-[#0B2545] cursor-pointer"
                />
                <span>{lang === 'HI' ? 'मुझे याद रखें' : 'Remember me'}</span>
              </label>

              <button
                type="button"
                id="auth-forgot-password-link"
                onClick={handleForgotPassword}
                className="text-[#0B2545] hover:text-blue-700 font-semibold hover:underline transition cursor-pointer"
              >
                {lang === 'HI' ? 'पासवर्ड भूल गए?' : 'Forgot Password?'}
              </button>
            </div>

            {/* 5. Sign In Button */}
            <div className="pt-2">
              <button
                type="submit"
                id="auth-signin-submit-btn"
                disabled={isLoading}
                className="w-full py-3 px-5 rounded-xl bg-[#0B2545] hover:bg-[#13315C] active:bg-[#071930] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>
                      {lang === 'HI' ? 'प्रमाणीकरण जारी है...' : 'Authenticating...'}
                    </span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'HI' ? 'साइन इन करें' : 'Sign In'}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security Banner Message */}
          <div
            id="auth-security-notice"
            className="pt-3 pb-1 border-t border-slate-100 text-center space-y-1"
          >
            <div className="inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                {lang === 'HI'
                  ? 'केवल अधिकृत कर्मियों के लिए • सुरक्षित एक्सेस'
                  : 'Authorized personnel only • Secure access'}
              </span>
            </div>
            <p className="text-[10px] text-slate-600 font-medium">
              National Informatics Centre (NIC) • 256-Bit TLS Protected Session
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
