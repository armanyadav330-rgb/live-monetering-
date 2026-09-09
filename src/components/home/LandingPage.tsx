import React, { useState } from 'react';
import { LandingNav } from './LandingNav';
import { HeroSection } from './HeroSection';
import { KeyFeatures } from './KeyFeatures';
import { HowItWorks } from './HowItWorks';
import { LiveStatusOverview } from './LiveStatusOverview';
import { CtaBanner } from './CtaBanner';
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
  currentUser,
}) => {
  // Default to official Government light theme for authentic GOI portal appearance
  const [isDarkMode, setIsDarkMode] = useState(false);
  // Default language is English (EN) with Hindi (HI) toggle
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

  const handleOpenSignup = () => {
    setAuthMode('signup');
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

  // Map features directly to portal modules for seamless navigation
  const handleFeatureNavigate = (featureTitle?: string) => {
    if (!featureTitle) {
      onEnterPortal(undefined, 'dashboard');
      return;
    }
    const lower = featureTitle.toLowerCase();
    if (lower.includes('cctv') || lower.includes('camera') || lower.includes('vc')) {
      onEnterPortal(undefined, 'cctv');
    } else if (lower.includes('tracking') || lower.includes('ai') || lower.includes('anomaly')) {
      onEnterPortal(undefined, 'analytics');
    } else if (lower.includes('alert') || lower.includes('notification')) {
      onEnterPortal(undefined, 'notifications');
    } else if (lower.includes('analytic') || lower.includes('log') || lower.includes('audit')) {
      onEnterPortal(undefined, 'reports');
    } else if (lower.includes('widget') || lower.includes('custom')) {
      onEnterPortal(undefined, 'settings');
    } else {
      onEnterPortal(undefined, 'dashboard');
    }
  };

  return (
    <div
      className="min-h-screen bg-white text-black font-sans selection:bg-[#FF671F] selection:text-white"
    >
      {/* 1. Header / Navigation Bar (Sticky & Fully Responsive) */}
      <LandingNav
        isDarkMode={isDarkMode}
        lang={lang}
        onToggleLang={handleToggleLang}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onLoginClick={handleOpenLogin}
        onLaunchDashboard={() => onEnterPortal(undefined, 'dashboard')}
      />

      {/* 2. Hero Section with Interactive Live Visual Mockup */}
      <HeroSection
        isDarkMode={isDarkMode}
        lang={lang}
        onStartMonitoring={() => onEnterPortal(undefined, 'dashboard')}
        onExploreDemo={() => onEnterPortal(undefined, 'cctv')}
      />

      {/* 3. Key Features Section (Grid / Card Layout) */}
      <KeyFeatures
        isDarkMode={isDarkMode}
        lang={lang}
        onExploreFeature={handleFeatureNavigate}
      />

      {/* 4. Social Proof / Statistics Banner & How It Works (Step 1, 2, 3) */}
      <HowItWorks
        isDarkMode={isDarkMode}
        lang={lang}
        onLaunchDashboard={() => onEnterPortal(undefined, 'dashboard')}
      />

      {/* 5. Live Status Overview (Regional Grid) & Pricing / Docs */}
      <LiveStatusOverview
        isDarkMode={isDarkMode}
        lang={lang}
        onLaunchDashboard={() => onEnterPortal(undefined, 'dashboard')}
        onOpenDocs={() => scrollToSection('features')}
      />

      {/* 6. Call to Action (CTA Banner) */}
      <CtaBanner
        isDarkMode={isDarkMode}
        lang={lang}
        onCreateAccount={handleOpenSignup}
        onExploreDemo={() => onEnterPortal(undefined, 'cctv')}
      />

      {/* 7. Multi-Column Footer with System Status Indicator */}
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

