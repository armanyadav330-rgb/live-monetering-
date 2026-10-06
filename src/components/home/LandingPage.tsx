import React, { useState } from 'react';
import { LandingNav } from './LandingNav';
import { HeroSection } from './HeroSection';
import { LandingFooter } from './LandingFooter';
import { AuthModal } from './AuthModal';
import { PolicyModal, PolicyType } from './PolicyModal';
import { DonationLandingPage } from '../donation/DonationLandingPage';
import { User, UserRole } from '../../types';
import { useTranslation } from '../../i18n/LanguageContext';

interface LandingPageProps {
  onEnterPortal: (user?: User, targetView?: string) => void;
  availableUsers: User[];
  currentUser: User;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterPortal,
  availableUsers,
}) => {
  const { lang, t } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [selectedInitialRole, setSelectedInitialRole] = useState<UserRole>('SUPER_ADMIN');
  const [pendingTargetView, setPendingTargetView] = useState<string>('dashboard');
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyType>('privacy');

  const handleOpenLogin = (role?: UserRole, targetView: string = 'dashboard') => {
    if (role) {
      setSelectedInitialRole(role);
    }
    setPendingTargetView(targetView);
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const handleSelectUserAndEnter = (user: User) => {
    setIsAuthModalOpen(false);
    onEnterPortal(user, pendingTargetView || 'dashboard');
  };

  const handleOpenPolicy = (policy: PolicyType) => {
    setSelectedPolicy(policy);
    setIsPolicyModalOpen(true);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-800 selection:text-white flex flex-col justify-between">
      {/* 1. Header / Navigation Bar */}
      <LandingNav
        isDarkMode={isDarkMode}
        lang={lang}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onLoginClick={() => handleOpenLogin()}
        onLaunchDashboard={() => handleOpenLogin(undefined, 'dashboard')}
        onDonateClick={() => {
          scrollToSection('donation-amount-section');
          setTimeout(() => {
            const input = document.getElementById('donation-amount-input') as HTMLInputElement | null;
            if (input) input.focus();
          }, 350);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 2. Simple, High-Clarity Hero Section */}
        <HeroSection
          isDarkMode={isDarkMode}
          lang={lang}
          onStartMonitoring={() => handleOpenLogin('SUPER_ADMIN', 'dashboard')}
          onExploreDemo={() => handleOpenLogin('DEPARTMENT_OFFICIAL', 'dashboard')}
          onOpenSuperAdminDashboard={() => handleOpenLogin('SUPER_ADMIN', 'dashboard')}
          onOpenInspectionOfficerDashboard={() => handleOpenLogin('INSPECTION_OFFICER', 'dashboard')}
          onOpenDistrictDashboard={() => handleOpenLogin('STATE_DISTRICT_AUTHORITY', 'dashboard')}
          onOpenMinistryDashboard={() => handleOpenLogin('DEPARTMENT_OFFICIAL', 'dashboard')}
        />

        {/* 3. Essential 3-Pillar Overview */}
        <section id="features" className="py-10 sm:py-12 bg-[#F8FAFC] border-y border-slate-200">
          <div id="how-it-works" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {t('pillars.title')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                {t('pillars.subtitle')}
              </p>
            </div>

            <div id="status" className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              {/* Pillar 1 */}
              <div
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-slate-400 transition-all text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center text-xl">
                    📹
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-black border border-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                    {t('pillars.cctv_badge')}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                  {t('pillars.cctv_title')}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t('pillars.cctv_desc')}
                </p>
              </div>

              {/* Pillar 2 */}
              <div
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-slate-400 transition-all text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center text-xl">
                    📋
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-black border border-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                    {t('pillars.inspections_badge')}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                  {t('pillars.inspections_title')}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t('pillars.inspections_desc')}
                </p>
              </div>

              {/* Pillar 3 */}
              <div
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-slate-400 transition-all text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center text-xl">
                    👥
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-black border border-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                    {t('pillars.biometric_badge')}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                  {t('pillars.biometric_title')}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t('pillars.biometric_desc')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Official NGO Donation & Social Impact Landing Section */}
        <DonationLandingPage />
      </main>

      {/* 5. Minimal, Professional Government / NGO Footer */}
      <LandingFooter
        isDarkMode={isDarkMode}
        lang={lang}
        onNavigateSection={scrollToSection}
        onLaunchDashboard={() => handleOpenLogin(undefined, 'dashboard')}
        onOpenPrivacy={() => handleOpenPolicy('privacy')}
        onOpenTerms={() => handleOpenPolicy('terms')}
      />

      {/* Authentication / Role Selection Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        availableUsers={availableUsers}
        onSelectUserAndEnter={handleSelectUserAndEnter}
        isDarkMode={isDarkMode}
        initialMode={authMode}
        initialRole={selectedInitialRole}
        lang={lang}
      />

      {/* Statutory Governance & Policy Charter Modal */}
      <PolicyModal
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
        initialPolicy={selectedPolicy}
        isDarkMode={isDarkMode}
        lang={lang}
      />
    </div>
  );
};
