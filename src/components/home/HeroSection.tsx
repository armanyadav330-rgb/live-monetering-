import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';

interface HeroSectionProps {
  isDarkMode: boolean;
  lang: 'EN' | 'HI';
  onStartMonitoring: () => void;
  onExploreDemo: () => void;
  onOpenInspectionOfficerDashboard?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  isDarkMode: _isDarkMode,
  lang,
  onStartMonitoring,
  onExploreDemo: _onExploreDemo,
  onOpenInspectionOfficerDashboard,
}) => {
  return (
    <section id="preview" className="relative overflow-hidden pt-8 sm:pt-12 pb-12 sm:pb-16 bg-white text-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          {/* Official GOI Emblem & Ministry Banner */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-50 text-black border border-slate-300">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF671F] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF671F]" />
            </span>
            <span>
              {lang === 'HI'
                ? 'भारत सरकार • सामाजिक न्याय और अधिकारिता मंत्रालय'
                : 'Government of India • Ministry of Social Justice and Empowerment'}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-snug text-[#0B2545]">
            {lang === 'HI' ? (
              <>
                सत्य निरीक्षक ·{' '}
                <span className="underline decoration-[#FF671F] decoration-4 underline-offset-8">
                  राष्ट्रीय संस्थागत निगरानी
                </span>{' '}
                एवं ऑडिट कमान ग्रिड
              </>
            ) : (
              <>
                Satya Nirakshak ·{' '}
                <span className="underline decoration-[#FF671F] decoration-4 underline-offset-8">
                  National Surveillance
                </span>{' '}
                &amp; Inspection Command Grid
              </>
            )}
          </h1>

          <div className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">
            {lang === 'HI'
              ? 'सामाजिक न्याय और अधिकारिता विभाग (DoSJE)'
              : 'Department of Social Justice and Empowerment (DoSJE)'}
          </div>

          {/* Simple, Understandable Purpose Statement */}
          <p className="text-sm sm:text-base text-slate-700 max-w-2xl mx-auto leading-relaxed font-medium">
            {lang === 'HI'
              ? 'देश भर के अनुदान-प्राप्त वृद्धाश्रमों, नशा मुक्ति केंद्रों (IRCAs) और दिव्यांगजन पुनर्वास संस्थानों में 24×7 लाइव सीसीटीवी निगरानी, बायोमेट्रिक उपस्थिति सत्यापन और ऑन-साइट फील्ड निरीक्षण का केंद्रीय डिजिटल प्लेटफॉर्म।'
              : 'A unified digital oversight portal enabling 24×7 live CCTV monitoring, biometric attendance verification, and on-site field inspections across grant-in-aid institutions nationwide.'}
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onStartMonitoring}
              className="px-6 py-3 rounded-xl bg-[#0B2545] hover:bg-[#13315C] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>{lang === 'HI' ? 'कमांड पोर्टल में प्रवेश करें' : 'Enter Command Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Role-based Access Guide */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
            <div
              onClick={onStartMonitoring}
              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-[#0B2545] shadow-xs transition cursor-pointer group"
            >
              <div className="text-xl">🏢</div>
              <div className="font-bold text-xs sm:text-sm text-black mt-1 group-hover:text-[#0B2545] transition">
                {lang === 'HI' ? 'संस्थान एवं एनजीओ' : 'Institutions & NGOs'}
              </div>
              <div className="text-[11px] text-slate-600 mt-1 leading-tight">
                {lang === 'HI' ? 'कैमरे व बायोमेट्रिक उपस्थिति जोड़ें' : 'CCTV feeds & attendance logs'}
              </div>
            </div>

            <div
              id="inspection-officer-hero-card"
              onClick={onOpenInspectionOfficerDashboard || onStartMonitoring}
              className="relative p-3.5 rounded-xl border-2 border-indigo-600/90 bg-indigo-50/40 hover:bg-indigo-50 hover:border-indigo-700 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group ring-2 ring-indigo-500/20 transform hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">🕵️‍♂️</span>
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-600 text-white tracking-wider shadow-2xs">
                  INSPECTOR
                </span>
              </div>
              <div className="font-bold text-xs sm:text-sm text-indigo-950 mt-1 flex items-center justify-between group-hover:text-indigo-600 transition">
                <span>{lang === 'HI' ? 'निरीक्षण अधिकारी' : 'Inspection Officers'}</span>
                <span className="text-indigo-600 font-bold transition-transform group-hover:translate-x-1">→</span>
              </div>
              <div className="text-[11px] text-slate-700 mt-1 leading-tight">
                {lang === 'HI' ? 'सरप्राइज वीडियो कॉल, ग्राउंड ऑडिट व फील्ड रिपोर्ट' : 'Surprise video calls, field evidence & audit reports'}
              </div>
              <div className="mt-2.5 pt-1.5 border-t border-indigo-200/70 flex items-center justify-between text-[10px] font-bold text-indigo-700 group-hover:text-indigo-900">
                <span>{lang === 'HI' ? 'डैशबोर्ड खोलें' : 'Open Dashboard'}</span>
                <span className="text-xs font-mono">⚡</span>
              </div>
            </div>

            <div
              onClick={onStartMonitoring}
              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-[#0B2545] shadow-xs transition cursor-pointer group"
            >
              <div className="text-xl">🏛️</div>
              <div className="font-bold text-xs sm:text-sm text-black mt-1 group-hover:text-[#0B2545] transition">
                {lang === 'HI' ? 'जिला कल्याण प्रशासन' : 'District Authorities'}
              </div>
              <div className="text-[11px] text-slate-600 mt-1 leading-tight">
                {lang === 'HI' ? 'क्षेत्रीय विसंगतियां व सत्यापन' : 'Regional anomaly reviews & grant checks'}
              </div>
            </div>

            <div
              onClick={onStartMonitoring}
              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-[#0B2545] shadow-xs transition cursor-pointer group"
            >
              <div className="text-xl">🇮🇳</div>
              <div className="font-bold text-xs sm:text-sm text-black mt-1 group-hover:text-[#0B2545] transition">
                {lang === 'HI' ? 'केंद्रीय मंत्रालय' : 'Central Ministry Apex'}
              </div>
              <div className="text-[11px] text-slate-600 mt-1 leading-tight">
                {lang === 'HI' ? 'राष्ट्रीय ऑडिट, बजट व कैग अनुमोदन' : 'National audit, budget & CAG clearance'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
