import React, { useState } from 'react';
import { DonationHero } from './DonationHero';
import { ImpactSection } from './ImpactSection';
import { DonationAmountSection } from './DonationAmountSection';
import { ImpactStatistics } from './ImpactStatistics';
import { FinalDonationCTA } from './FinalDonationCTA';
import { DonationModal } from './DonationModal';
import { DonationCause, DonationFrequency } from '../../types/donation';

interface DonationLandingPageProps {
  onBackToPortal?: () => void;
  isStandaloneView?: boolean;
}

export const DonationLandingPage: React.FC<DonationLandingPageProps> = ({
  onBackToPortal: _onBackToPortal,
  isStandaloneView: _isStandaloneView = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAmount, setSelectedAmount] = useState<number | undefined>(undefined);
  const [selectedFrequency, setSelectedFrequency] = useState<DonationFrequency>('ONE_TIME');
  const [selectedCause, setSelectedCause] = useState<DonationCause>('ALL');

  const handleOpenDonateModal = (
    amt?: number,
    freq: DonationFrequency = 'ONE_TIME',
    c: DonationCause = 'ALL'
  ) => {
    setSelectedAmount(amt);
    setSelectedFrequency(freq);
    setSelectedCause(c);
    setIsModalOpen(true);
  };

  const handleNavigateToAmount = (cause: DonationCause = 'ALL') => {
    setSelectedCause(cause);
    const el = document.getElementById('donation-amount-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const input = document.getElementById('donation-amount-input') as HTMLInputElement | null;
        if (input) input.focus();
      }, 350);
    } else {
      handleOpenDonateModal(undefined, 'ONE_TIME', cause);
    }
  };

  const handleScrollToImpact = () => {
    const el = document.getElementById('impact-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="donation-section" className="w-full bg-white text-slate-900 font-sans">
      {/* 1. HERO SECTION */}
      <DonationHero
        onDonateClick={() => handleNavigateToAmount('ALL')}
        onExploreImpactClick={handleScrollToImpact}
      />

      {/* 2. IMPACT SECTION */}
      <ImpactSection onSelectCause={(cause) => handleNavigateToAmount(cause)} />

      {/* 3. DONATION AMOUNT SELECTION SECTION */}
      <DonationAmountSection
        preselectedCause={selectedCause}
        onProceedToDonate={(amt, freq, c) => handleOpenDonateModal(amt, freq, c)}
      />

      {/* 4. IMPACT STATISTICS / NGO GALLERY */}
      <ImpactStatistics />

      {/* 5. FINAL CALL TO ACTION BANNER */}
      <FinalDonationCTA onDonateClick={() => handleNavigateToAmount('ALL')} />

      {/* DONATION FLOW MODAL / CHECKOUT */}
      <DonationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialAmount={selectedAmount}
        initialFrequency={selectedFrequency}
        initialCause={selectedCause}
      />
    </div>
  );
};
