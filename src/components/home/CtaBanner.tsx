import React from 'react';
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Headphones,
} from 'lucide-react';

interface CtaBannerProps {
  isDarkMode: boolean;
  lang: 'EN' | 'HI';
  onCreateAccount: () => void;
  onExploreDemo: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({
  isDarkMode: _isDarkMode,
  lang,
  onCreateAccount,
  onExploreDemo,
}) => {
  return (
    <section className="py-16 sm:py-20 relative overflow-hidden bg-white border-t border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div
          className="p-8 sm:p-12 rounded-3xl border border-slate-200 text-center relative overflow-hidden bg-white shadow-xl transition-all text-black"
        >
          {/* Top Tiranga Stripe */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF671F] via-slate-300 to-[#046A38]" />

          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            {/* Live Indicator Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 text-black border border-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>
                {lang === 'HI'
                  ? 'राष्ट्रीय निगरानी ग्रिड • National Oversight Command'
                  : 'National Oversight Command Grid • Operational 24/7'}
              </span>
            </div>

            {/* Bold Headline */}
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-black leading-tight">
              {lang === 'HI'
                ? 'केंद्रीय निगरानी प्रणाली से जुड़ें'
                : 'Connect to the National Surveillance Grid'}
            </h2>
            <div className="text-sm sm:text-base font-black text-black">
              {lang === 'HI'
                ? 'सुरक्षित एवं पारदर्शी डिजिटल इंडिया ई-गवर्नेंस'
                : 'Operationalize Statutory 24/7 Live Monitoring Today'}
            </div>

            {/* Sub-copy */}
            <p className="text-xs sm:text-sm text-black leading-relaxed max-w-xl mx-auto font-semibold">
              {lang === 'HI'
                ? 'राज्य नोडल अधिकारियों, जिला समाज कल्याण अधिकारियों (DSWO), मान्यता प्राप्त गैर-सरकारी संगठनों (NGOs) और केंद्रीय मंत्रालय के लिए एकीकृत डिजिटल मंच।'
                : 'Unified digital command platform for State Nodal Officers, District Social Welfare Officers (DSWO), accredited NGOs, and Central Ministry Directors.'}
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={onCreateAccount}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-black hover:bg-slate-800 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 border border-black"
              >
                <Zap className="w-4 h-4 text-white" />
                <span>{lang === 'HI' ? 'विभागीय पोर्टल में प्रवेश करें' : 'Access Officer Portal'}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <button
                onClick={onExploreDemo}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-black font-black text-sm border border-slate-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>{lang === 'HI' ? 'लाइव निरीक्षण ग्रिड देखें' : 'View Live Inspection Feeds'}</span>
              </button>
            </div>

            {/* Feature Checklist */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-black font-bold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {lang === 'HI' ? 'एनआईसी मेघराज क्लाउड' : 'NIC MeghRaj Cloud'}
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-black" />
                {lang === 'HI' ? 'सुरक्षित टीएलएस 1.3 एन्क्रिप्शन (AES-256)' : 'TLS 1.3 / AES-256 Encryption'}
              </span>
              <span className="flex items-center gap-1.5">
                <Headphones className="w-3.5 h-3.5 text-black" />
                {lang === 'HI' ? 'राष्ट्रीय टोल-फ्री हेल्पलाइन: 14567' : 'National Toll-Free Helpline: 14567'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

