import React, { useState } from 'react';
import {
  CheckCircle2,
  ArrowRight,
  Radio,
  Building2,
  Video,
  FileCheck2,
  PhoneCall,
  UserCheck,
  ShieldCheck,
  Clock,
  BadgeCheck,
} from 'lucide-react';

interface HowItWorksProps {
  isDarkMode: boolean;
  lang: 'EN' | 'HI';
  onLaunchDashboard: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({
  isDarkMode: _isDarkMode,
  lang,
  onLaunchDashboard,
}) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  const steps = [
    {
      num: 1,
      title: lang === 'HI' ? 'संस्थान पंजीकरण एवं जियो-टैगिंग' : 'Facility Registration & Geo-Tagging',
      subtitle: lang === 'HI' ? 'संस्थान ऑनबोर्डिंग व जीपीएस सत्यापन' : 'Institution Onboarding & GPS Verification',
      description:
        lang === 'HI'
          ? 'प्रत्येक अनुदान-प्राप्त वृद्धाश्रम, नशा मुक्ति केंद्र व दिव्यांगजन विद्यालय का एनआईसी पोर्टल पर पंजीकरण, नोडल अधिकारी नियुक्ति व अक्षांश-देशांतर (GPS) सत्यापन।'
          : 'Registration of every grant-in-aid senior home, de-addiction center, and special institute on the NIC portal, nodal officer assignment, and verified geo-coordinates.',
      icon: Building2,
    },
    {
      num: 2,
      title: lang === 'HI' ? '24×7 सीसीटीवी एवं बायोमेट्रिक उपस्थिति एकीकरण' : '24/7 CCTV & Biometric Integration',
      subtitle: lang === 'HI' ? 'लाइव सीसीटीवी व आधार उपस्थिति' : 'Live CCTV Feeds & Aadhaar Biometric Muster',
      description:
        lang === 'HI'
          ? 'डाइनिंग हॉल, मुख्य द्वार व कक्षाओं के कैमरों का सीधा क्लाउड लिंक तथा आधार-सत्यापित बायोमेट्रिक मशीन द्वारा सभी लाभार्थियों व स्टाफ की दैनिक लाइव उपस्थिति।'
          : 'Encrypted direct cloud feeds from dining halls, entry points, and activity rooms paired with daily Aadhaar-verified biometric check-ins for residents and staff.',
      icon: Video,
    },
    {
      num: 3,
      title: lang === 'HI' ? 'औचक वीडियो कॉल निरीक्षण एवं पारदर्शी अनुदान संवितरण' : 'Surprise Video Audit & Grant Clearance',
      subtitle: lang === 'HI' ? 'औचक निरीक्षण व डीबीटी फंड संवितरण' : 'Spot Auditing & Direct Benefit Transfer',
      description:
        lang === 'HI'
          ? 'निरीक्षण अधिकारियों द्वारा बिना पूर्व सूचना औचक वीडियो कॉल द्वारा मौके पर सत्यापन। एआई विसंगति जांच के उपरांत कैग (CAG) मानकों पर सीधा फंड ट्रांसफर।'
          : 'Random, unannounced live video inspections by designated officers. Automatic AI census cross-validation leading to CAG-compliant DBT fund releases.',
      icon: FileCheck2,
    },
  ];

  return (
    <section id="how-it-works" className="py-14 sm:py-20 bg-white border-t border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SOCIAL PROOF / TRUST METRICS BANNER */}
        <div
          className="mb-14 p-6 sm:p-8 rounded-2xl border-2 border-slate-300 bg-white shadow-md text-black relative overflow-hidden"
        >
          {/* Top Tricolor stripe on banner */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF671F] via-slate-300 to-[#046A38]" />

          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-xs font-black uppercase tracking-widest text-black">
              {lang === 'HI'
                ? 'राष्ट्रीय निगरानी सांख्यिकी • National Grid Operations'
                : 'National Surveillance Operations • Key Performance Metrics'}
            </span>
            <h3 className="text-xl sm:text-2xl font-black mt-1 text-black">
              {lang === 'HI'
                ? 'केंद्रीय सामाजिक न्याय एवं अधिकारिता कमान ग्रिड'
                : 'Central Social Justice Institutional Command Grid'}
            </h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
            <div className="pt-4 sm:pt-0">
              <div className="text-2xl sm:text-4xl font-black text-black tracking-tight font-mono">
                99.9%
              </div>
              <div className="text-xs sm:text-sm font-black text-black mt-1">
                {lang === 'HI' ? 'लाइव अपटाइम (SLA Met)' : 'Live Uptime (SLA Met)'}
              </div>
              <div className="text-[11px] font-bold text-black mt-0.5">
                {lang === 'HI' ? 'एनआईसी क्लाउड सर्वर' : 'NIC Cloud Data Centers'}
              </div>
            </div>

            <div className="pt-4 sm:pt-0 sm:pl-4">
              <div className="text-2xl sm:text-4xl font-black text-black tracking-tight font-mono">
                &lt; 10ms
              </div>
              <div className="text-xs sm:text-sm font-black text-black mt-1">
                {lang === 'HI' ? 'टेलीमेट्री विलंबता (Latency)' : 'Telemetry Latency'}
              </div>
              <div className="text-[11px] font-bold text-black mt-0.5">
                {lang === 'HI' ? 'वास्तविक समय डेटा स्ट्रीम' : 'Edge-Accelerated Pipeline'}
              </div>
            </div>

            <div className="pt-4 sm:pt-0 sm:pl-4">
              <div className="text-2xl sm:text-4xl font-black text-black tracking-tight font-mono">
                24×7
              </div>
              <div className="text-xs sm:text-sm font-black text-black mt-1">
                {lang === 'HI' ? 'सतत निगरानी कमान' : 'Continuous Surveillance'}
              </div>
              <div className="text-[11px] font-bold text-black mt-0.5">
                {lang === 'HI' ? 'स्वचालित एआई विसंगति रडार' : 'AI Anomaly & Risk Engine'}
              </div>
            </div>

            <div className="pt-4 sm:pt-0 sm:pl-4">
              <div className="text-2xl sm:text-4xl font-black text-black tracking-tight font-mono">
                1,200+
              </div>
              <div className="text-xs sm:text-sm font-black text-black mt-1">
                {lang === 'HI' ? 'पंजीकृत संस्थाएं एवं केंद्र' : 'Monitored Institutions'}
              </div>
              <div className="text-[11px] font-bold text-black mt-0.5">
                {lang === 'HI' ? 'सभी 28 राज्य एवं 8 केंद्रशासित प्रदेश' : 'Across 28 States & 8 UTs'}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION HEADER: HOW IT WORKS */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 text-black border border-slate-300">
            <Radio className="w-3.5 h-3.5 text-black" />
            <span>
              {lang === 'HI'
                ? 'कार्यप्रणाली • Statutory 3-Step Verification Pipeline'
                : 'Standard Operating Procedure • 3-Step Verification'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-black">
            {lang === 'HI' ? 'यह पोर्टल कैसे कार्य करता है?' : 'How the Surveillance Grid Operates'}
          </h2>

          <p className="text-sm sm:text-base text-black leading-relaxed font-semibold">
            {lang === 'HI'
              ? 'संस्थान ऑनबोर्डिंग से लेकर 24×7 सीसीटीवी प्रसारण, औचक वीडियो निरीक्षण और कैग (CAG) अनुपालन आधारित फंड संवितरण की पारदर्शी प्रक्रिया।'
              : 'A transparent end-to-end statutory process from institutional onboarding to 24/7 CCTV surveillance, spot video audits, and CAG-cleared DBT disbursement.'}
          </p>
        </div>

        {/* 3-STEP INTERACTIVE WORKFLOW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Step Selectors (5 cols) */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              {steps.map((s) => {
                const isActive = activeStep === s.num;
                const Icon = s.icon;
                return (
                  <div
                    key={s.num}
                    onClick={() => setActiveStep(s.num as 1 | 2 | 3)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white border-black shadow-md text-black ring-2 ring-black/20'
                        : 'bg-white border-slate-200 text-black hover:bg-slate-50 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                          isActive
                            ? 'bg-black text-white shadow-xs'
                            : 'bg-slate-100 text-black border border-slate-300'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-black uppercase tracking-wider text-black">
                            {lang === 'HI' ? `चरण ${s.num}` : `STEP ${s.num}`}
                          </span>
                          {isActive && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-black border border-slate-300">
                              {lang === 'HI' ? 'सक्रिय दृश्य' : 'Active View'}
                            </span>
                          )}
                        </div>
                        <h4 className="font-black text-sm sm:text-base text-black leading-snug">
                          {s.title}
                        </h4>
                        <div className="text-[11px] font-bold text-black">
                          {s.subtitle}
                        </div>
                        <p className="text-xs text-black leading-relaxed font-semibold pt-1">
                          {s.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                onClick={onLaunchDashboard}
                className="w-full py-3.5 rounded-xl bg-black hover:bg-slate-800 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer border border-black"
              >
                <span>{lang === 'HI' ? 'कमांड पोर्टल खोलें' : 'Open Official Command Portal'}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Right Column: Authentic Government Verification Interactive Simulator (7 cols) */}
          <div className="lg:col-span-7 flex">
            <div
              className="w-full rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col justify-between shadow-lg transition-all bg-white text-black"
            >
              {/* Header of Simulated Verification Card */}
              <div>
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs shrink-0">
                      🇮🇳
                    </div>
                    <div>
                      <div className="font-black text-xs text-black">
                        {lang === 'HI'
                          ? 'राष्ट्रीय निरीक्षण एवं सत्यापन रिकॉर्ड'
                          : 'National Inspection & Verification Dossier'}
                      </div>
                      <div className="text-[10px] text-black font-mono font-bold">
                        DoSJE-REF-2026-DL-8842 • {lang === 'HI' ? 'एनआईसी प्रमाणित' : 'NIC Certified'}
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-100 text-black border border-slate-300">
                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {lang === 'HI' ? 'सत्यापित नोड' : 'Verified Node'}
                  </span>
                </div>

                {/* Step 1 Preview: Facility Details & Geo-Tagging */}
                {activeStep === 1 && (
                  <div className="mt-4 space-y-4">
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                      <div className="text-xs font-black text-black mb-2 flex items-center justify-between">
                        <span>
                          {lang === 'HI' ? '🏢 पंजीकृत संस्थान विवरण' : '🏢 Facility Profile & Verification'}
                        </span>
                        <span className="text-[10px] font-mono text-black font-bold">
                          ● {lang === 'HI' ? 'सक्रिय' : 'Active'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] text-black font-semibold block">
                            {lang === 'HI' ? 'संस्थान का नाम' : 'Institution Name'}
                          </span>
                          <span className="font-bold text-black">
                            {lang === 'HI' ? 'सुरक्षा सीनियर केयर होम' : 'Suraksha Senior Care Home'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-black font-semibold block">
                            {lang === 'HI' ? 'जिला एवं राज्य' : 'District & State'}
                          </span>
                          <span className="font-bold text-black">
                            {lang === 'HI' ? 'नई दिल्ली (केंद्रीय जोन)' : 'New Delhi (Central Zone)'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-black font-semibold block">
                            {lang === 'HI' ? 'स्वीकृत क्षमता' : 'Sanctioned Capacity'}
                          </span>
                          <span className="font-bold text-black">
                            {lang === 'HI' ? '50 वृद्धजन' : '50 Senior Citizens'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-black font-semibold block">
                            {lang === 'HI' ? 'जीपीएस अक्षांश/देशांतर' : 'GPS Coordinates'}
                          </span>
                          <span className="font-mono font-bold text-black">28.6139° N, 77.2090° E</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-300 shadow-xs">
                      <div className="text-xs font-black text-black mb-1 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>
                          {lang === 'HI'
                            ? 'जियो-फेंसिंग एवं नोडल सत्यापन पूर्ण'
                            : 'Geo-Fencing & Nodal Verification Complete'}
                        </span>
                      </div>
                      <p className="text-[11px] text-black font-medium">
                        {lang === 'HI'
                          ? 'जिला समाज कल्याण अधिकारी (DSWO) द्वारा ऑन-साइट भौतिक निरीक्षण एवं डिजिटल हस्ताक्षर से सत्यापित।'
                          : 'On-site physical inspection and digital signature authentication verified by the District Social Welfare Officer (DSWO).'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 2 Preview: 24/7 CCTV & Biometric Headcount Matching */}
                {activeStep === 2 && (
                  <div className="mt-4 space-y-4">
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                      <div className="text-xs font-black text-black mb-2 flex items-center justify-between">
                        <span>
                          {lang === 'HI'
                            ? '📹 लाइव कैमरा व बायोमेट्रिक मिलान'
                            : '📹 Live CCTV & Biometric Headcount Reconciliation'}
                        </span>
                        <span className="text-[10px] font-mono text-black font-bold">🟢 LIVE 30 FPS</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-center">
                          <span className="text-[10px] text-black font-semibold block">
                            {lang === 'HI' ? 'बायोमेट्रिक पंच' : 'Biometric Census'}
                          </span>
                          <span className="text-lg font-black text-black font-mono">48 / 50</span>
                          <span className="text-[9px] text-black font-bold block mt-0.5">
                            {lang === 'HI' ? 'उपस्थित (96%)' : 'Present (96%)'}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-center">
                          <span className="text-[10px] text-black font-semibold block">
                            {lang === 'HI' ? 'सीसीटीवी एआई काउंट' : 'CCTV Visual Count'}
                          </span>
                          <span className="text-lg font-black text-black font-mono">48</span>
                          <span className="text-[9px] text-black block mt-0.5 font-bold">
                            {lang === 'HI' ? 'सटीक मिलान (100%)' : 'Exact Match (100%)'}
                          </span>
                        </div>
                        <div className="col-span-2 sm:col-span-1 p-2.5 rounded-lg bg-white border border-slate-200 text-center">
                          <span className="text-[10px] text-black font-semibold block">
                            {lang === 'HI' ? 'एआई विसंगति स्कोर' : 'Anomaly Risk Index'}
                          </span>
                          <span className="text-lg font-black text-black font-mono">0 / 100</span>
                          <span className="text-[9px] text-black block mt-0.5 font-bold">
                            {lang === 'HI' ? 'शून्य विसंगति' : 'Zero Discrepancy'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-300 shadow-xs">
                      <div className="text-xs font-black text-black mb-1 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-black" />
                        <span>
                          {lang === 'HI'
                            ? 'लाइव टेलीमेट्री एवं एनआईसी वॉल्ट एन्क्रिप्शन'
                            : 'Live Telemetry & NIC Vault Encryption'}
                        </span>
                      </div>
                      <p className="text-[11px] text-black font-medium">
                        {lang === 'HI'
                          ? 'प्रत्येक फ्रेम को 256-बिट टीएलएस एन्क्रिप्शन के साथ एनआईसी डेटा सेंटर में सुरक्षित रूप से दर्ज किया जाता है।'
                          : 'Every camera frame and biometric timestamp is cryptographically secured with 256-bit TLS encryption in the NIC Government Cloud.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 3 Preview: Surprise Video Audit & Direct Benefit Transfer */}
                {activeStep === 3 && (
                  <div className="mt-4 space-y-4">
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                      <div className="text-xs font-black text-black mb-2 flex items-center justify-between">
                        <span>
                          {lang === 'HI'
                            ? '📞 औचक वीडियो कॉल सत्यापन परिणाम'
                            : '📞 Spot Video Inspection Audit Result'}
                        </span>
                        <span className="text-[10px] font-mono text-black font-bold">
                          {lang === 'HI' ? 'संपन्न' : 'Completed'}
                        </span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between py-1 border-b border-slate-200">
                          <span className="text-black font-medium">
                            {lang === 'HI' ? 'निरीक्षण अधिकारी:' : 'Inspecting Officer:'}
                          </span>
                          <span className="font-bold text-black">
                            {lang === 'HI'
                              ? 'श्री अनुराग शर्मा (वरिष्ठ निरीक्षण अधिकारी, DoSJE)'
                              : 'Shri Anurag Sharma (Senior Inspection Officer, DoSJE)'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-slate-200">
                          <span className="text-black font-medium">
                            {lang === 'HI' ? 'कॉल समय व माध्यम:' : 'Call Timestamp & Gateway:'}
                          </span>
                          <span className="font-bold font-mono text-black">
                            11:42 AM • {lang === 'HI' ? 'सुरक्षित टोल-फ्री वीडियो ब्रिज' : 'Secure Toll-Free Video Bridge'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <span className="text-black font-medium">
                            {lang === 'HI' ? 'अधिकारी टिप्पणी:' : 'Officer Remarks:'}
                          </span>
                          <span className="font-bold text-black">
                            {lang === 'HI'
                              ? 'लाभार्थी उपस्थिति, भोजन गुणवत्ता व चिकित्सा रिकॉर्ड पूर्णतया संतोषजनक।'
                              : 'Resident attendance, meal quality, and physical registers fully satisfactory.'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-300 shadow-xs">
                      <div className="text-xs font-black text-black mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <BadgeCheck className="w-4 h-4 text-emerald-600" />
                          <span>
                            {lang === 'HI'
                              ? 'कैग (CAG) अनुपालन संवितरण प्रमाण पत्र'
                              : 'CAG Compliance & Grant Clearance Certificate'}
                          </span>
                        </span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-black text-white">
                          {lang === 'HI' ? 'अनुमोदित' : 'APPROVED'}
                        </span>
                      </div>
                      <p className="text-[11px] text-black font-medium">
                        {lang === 'HI'
                          ? 'प्रत्यक्ष लाभ अंतरण (DBT) के अंतर्गत त्रैमासिक वित्तीय सहायता सीधे संस्थान के पीएफएमएस (PFMS) बैंक खाते में जारी करने हेतु अनुमोदित।'
                          : 'Quarterly grant-in-aid disbursement approved for direct DBT release to the institutional PFMS bank account under CAG guidelines.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Metadata Footer */}
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-black font-bold">
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {lang === 'HI' ? 'डिजिटल इंडिया ई-गवर्नेंस मानक 3.0' : 'Digital India e-Governance Standard 3.0'}
                </span>
                <span className="font-mono text-[10px] text-black font-black">
                  {lang === 'HI' ? '24×7 स्वचालित निगरानी सक्रिय' : '24×7 Automated Surveillance Grid Active'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
