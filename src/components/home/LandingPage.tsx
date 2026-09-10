import React, { useState } from 'react';
import { LandingNav } from './LandingNav';
import { HeroSection } from './HeroSection';
import { LandingFooter } from './LandingFooter';
import { AuthModal } from './AuthModal';
import { PolicyModal, PolicyType } from './PolicyModal';
import { User } from '../../types';

interface LandingPageProps {
  onEnterPortal: (user?: User, targetView?: string) => void;
  availableUsers: User[];
  currentUser: User;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterPortal,
  availableUsers,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [lang, setLang] = useState<'EN' | 'HI'>('EN');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyType>('privacy');

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'EN' ? 'HI' : 'EN'));
  };

  const handleOpenLogin = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const handleSelectUserAndEnter = (user: User) => {
    setIsAuthModalOpen(false);
    onEnterPortal(user, 'dashboard');
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
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#FF671F] selection:text-white flex flex-col justify-between">
      {/* 1. Header / Navigation Bar */}
      <LandingNav
        isDarkMode={isDarkMode}
        lang={lang}
        onToggleLang={handleToggleLang}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onLoginClick={handleOpenLogin}
        onLaunchDashboard={() => onEnterPortal(undefined, 'dashboard')}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 2. Simple, High-Clarity Hero Section */}
        <HeroSection
          isDarkMode={isDarkMode}
          lang={lang}
          onStartMonitoring={() => onEnterPortal(undefined, 'dashboard')}
          onExploreDemo={() => onEnterPortal(undefined, 'dashboard')}
          onOpenInspectionOfficerDashboard={() => {
            const inspector =
              availableUsers.find((u) => u.role === 'INSPECTION_OFFICER') ||
              availableUsers.find((u) => u.id === 'usr_inspector_1') ||
              availableUsers[0];
            onEnterPortal(inspector, 'dashboard');
          }}
        />

        {/* 3. Essential 3-Pillar Overview (Simple, Clean & Purpose-Driven) */}
        <section id="features" className="py-10 sm:py-12 bg-slate-50 border-y border-slate-200">
          <div id="how-it-works" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 className="text-lg sm:text-xl font-black text-[#0B2545]">
                {lang === 'HI' ? 'प्लेटफॉर्म के मुख्य कार्य एवं उद्देश्य' : 'Core Platform Pillars'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                {lang === 'HI'
                  ? 'अनुदान-प्राप्त संस्थानों में पूर्ण पारदर्शिता, सुरक्षा और वैधानिक अनुपालन।'
                  : 'Ensuring total transparency, beneficiary safety, and statutory compliance.'}
              </p>
            </div>

            <div id="status" className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              {/* Pillar 1 */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center text-lg mb-3">
                  📹
                </div>
                <h3 className="text-sm font-bold text-[#0B2545] mb-1.5">
                  {lang === 'HI' ? '24×7 लाइव सीसीटीवी निगरानी' : '24×7 Live CCTV Monitoring'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'HI'
                    ? 'वृद्धाश्रमों और नशा मुक्ति केंद्रों से सुरक्षित लाइव फीड व विसंगति रडार अलर्ट।'
                    : 'Secure real-time camera streams and automated anomaly detection across assisted institutions.'}
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center text-lg mb-3">
                  📋
                </div>
                <h3 className="text-sm font-bold text-[#0B2545] mb-1.5">
                  {lang === 'HI' ? 'डिजिटल ऑन-साइट निरीक्षण' : 'On-Site Field Inspections'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'HI'
                    ? 'जियो-टैग फोटो साक्ष्य, डिजिटल चेकलिस्ट और ऑन-साइट निरीक्षण डॉजियर।'
                    : 'Standardized field audit checklists, GPS-stamped photo evidence, and digital inspection dossiers.'}
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center text-lg mb-3">
                  👥
                </div>
                <h3 className="text-sm font-bold text-[#0B2545] mb-1.5">
                  {lang === 'HI' ? 'बायोमेट्रिक सत्यापन एवं ऑडिट' : 'Biometric Attendance Audit'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'HI'
                    ? 'आधार-सत्यापित उपस्थिति मिलान और कैग अनुपालन हेतु पारदर्शी डिजिटल रिकॉर्ड।'
                    : 'Aadhaar-authenticated beneficiary headcount reconciliation and CAG-compliant audit trails.'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 4. Minimal, Professional Government Footer */}
      <LandingFooter
        isDarkMode={isDarkMode}
        lang={lang}
        onNavigateSection={scrollToSection}
        onLaunchDashboard={() => onEnterPortal(undefined, 'dashboard')}
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
