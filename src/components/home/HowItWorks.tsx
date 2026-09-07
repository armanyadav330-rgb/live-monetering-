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
  onLaunchDashboard: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({
  isDarkMode,
  onLaunchDashboard,
}) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  const steps = [
    {
      num: 1,
      title: 'संस्थान पंजीकरण एवं जियो-टैगिंग',
      subtitle: 'Facility Registration & Geo-Tagging',
      description:
        'प्रत्येक अनुदान-प्राप्त वृद्धाश्रम, नशा मुक्ति केंद्र व दिव्यांगजन विद्यालय का एनआईसी पोर्टल पर पंजीकरण, नोडल अधिकारी नियुक्ति व अक्षांश-देशांतर (GPS) सत्यापन।',
      icon: Building2,
    },
    {
      num: 2,
      title: '24×7 सीसीटीवी एवं बायोमेट्रिक उपस्थिति एकीकरण',
      subtitle: '24/7 Live CCTV & Biometric Integration',
      description:
        'डाइनिंग हॉल, मुख्य द्वार व कक्षाओं के कैमरों का सीधा क्लाउड लिंक तथा आधार-सत्यापित बायोमेट्रिक मशीन द्वारा सभी लाभार्थियों व स्टाफ की दैनिक लाइव उपस्थिति।',
      icon: Video,
    },
    {
      num: 3,
      title: 'औचक वीडियो कॉल निरीक्षण एवं पारदर्शी अनुदान संवितरण',
      subtitle: 'Surprise Video Audit & Direct Fund Clearance',
      description:
        'निरीक्षण अधिकारियों द्वारा बिना पूर्व सूचना औचक वीडियो कॉल द्वारा मौके पर सत्यापन। एआई विसंगति जांच के उपरांत कैग (CAG) मानकों पर सीधा फंड ट्रांसफर।',
      icon: FileCheck2,
    },
  ];

  return (
    <section id="how-it-works" className="py-14 sm:py-20 border-t border-slate-200/80 dark:border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SOCIAL PROOF / TRUST METRICS BANNER */}
        <div
          className={`mb-14 p-6 sm:p-8 rounded-2xl border-2 transition-all relative overflow-hidden ${
            isDarkMode
              ? 'bg-gradient-to-r from-[#0b2545]/90 via-[#0a192f] to-[#061426] border-slate-700 shadow-xl'
              : 'bg-white border-[#0b2545]/30 shadow-md text-slate-900'
          }`}
        >
          {/* Top Tricolor stripe on banner */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF671F] via-white to-[#046A38]" />

          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF671F]">
              राष्ट्रीय निगरानी सांख्यिकी • National Grid Operations
            </span>
            <h3 className="text-xl sm:text-2xl font-black mt-1 text-[#0b2545] dark:text-white">
              केंद्रीय सामाजिक न्याय एवं अधिकारिता कमान ग्रिड
            </h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800">
            <div className="pt-4 sm:pt-0">
              <div className="text-2xl sm:text-4xl font-extrabold text-[#046A38] dark:text-emerald-400 tracking-tight font-mono">
                99.9%
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                लाइव अपटाइम (SLA Met)
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">एनआईसी क्लाउड सर्वर</div>
            </div>

            <div className="pt-4 sm:pt-0 sm:pl-4">
              <div className="text-2xl sm:text-4xl font-extrabold text-[#0b2545] dark:text-blue-400 tracking-tight font-mono">
                &lt; 10ms
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                टेलीमेट्री विलंबता (Latency)
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">वास्तविक समय डेटा स्ट्रीम</div>
            </div>

            <div className="pt-4 sm:pt-0 sm:pl-4">
              <div className="text-2xl sm:text-4xl font-extrabold text-[#FF671F] dark:text-amber-400 tracking-tight font-mono">
                24×7
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                सतत निगरानी कमान
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">स्वचालित एआई विसंगति रडार</div>
            </div>

            <div className="pt-4 sm:pt-0 sm:pl-4">
              <div className="text-2xl sm:text-4xl font-extrabold text-[#0b2545] dark:text-white tracking-tight font-mono">
                1,200+
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                पंजीकृत संस्थाएं एवं केंद्र
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">सभी 28 राज्य एवं 8 केंद्रशासित प्रदेश</div>
            </div>
          </div>
        </div>

        {/* SECTION HEADER: HOW IT WORKS */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#046A38]/10 text-[#046A38] dark:text-emerald-400 border border-[#046A38]/20">
            <Radio className="w-3.5 h-3.5" />
            <span>कार्यप्रणाली • Statutory 3-Step Verification Pipeline</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0b2545] dark:text-white">
            यह पोर्टल कैसे कार्य करता है? (How It Works)
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            संस्थान ऑनबोर्डिंग से लेकर 24×7 सीसीटीवी प्रसारण, औचक वीडियो निरीक्षण और कैग (CAG) अनुपालन आधारित फंड संवितरण की पारदर्शी प्रक्रिया।
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
                        ? isDarkMode
                          ? 'bg-slate-800/90 border-[#FF671F] shadow-lg shadow-orange-500/10 text-white'
                          : 'bg-white border-[#0b2545] shadow-md text-slate-900 ring-2 ring-[#0b2545]/30'
                        : isDarkMode
                        ? 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-800/50'
                        : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                          isActive
                            ? 'bg-[#0b2545] text-amber-300 dark:bg-[#FF671F] dark:text-slate-950 shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FF671F]">
                            चरण {s.num} • STEP {s.num}
                          </span>
                          {isActive && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#046A38]/15 text-[#046A38] dark:text-emerald-400">
                              सक्रिय दृश्य
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm sm:text-base text-[#0b2545] dark:text-white leading-snug">
                          {s.title}
                        </h4>
                        <div className="text-[11px] font-semibold text-slate-400">
                          {s.subtitle}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal pt-1">
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
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF671F] to-[#E65100] hover:from-[#e55917] hover:to-[#c94500] text-white font-bold text-xs shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer border border-amber-300/30"
              >
                <span>कमांड पोर्टल खोलें (Open Official Command Portal)</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Right Column: Authentic Government Verification Interactive Simulator (7 cols) */}
          <div className="lg:col-span-7 flex">
            <div
              className={`w-full rounded-2xl border p-5 sm:p-6 flex flex-col justify-between shadow-lg transition-all ${
                isDarkMode
                  ? 'bg-slate-900/90 border-slate-700 text-slate-100'
                  : 'bg-white border-slate-300 text-slate-900 shadow-slate-200'
              }`}
            >
              {/* Header of Simulated Verification Card */}
              <div>
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#0b2545] text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                      🇮🇳
                    </div>
                    <div>
                      <div className="font-extrabold text-xs text-[#0b2545] dark:text-white">
                        राष्ट्रीय निरीक्षण एवं सत्यापन रिकॉर्ड (Statutory Dossier)
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        DoSJE-REF-2026-DL-8842 • एनआईसी प्रमाणित
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#046A38]/10 text-[#046A38] dark:text-emerald-400 border border-[#046A38]/30">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    सत्यापित नोड
                  </span>
                </div>

                {/* Step 1 Preview: Facility Details & Geo-Tagging */}
                {activeStep === 1 && (
                  <div className="mt-4 space-y-4">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <div className="text-xs font-bold text-[#0b2545] dark:text-amber-300 mb-2 flex items-center justify-between">
                        <span>🏢 पंजीकृत संस्थान विवरण (Facility Profile)</span>
                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">● सक्रिय (Active)</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">संस्थान का नाम</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">सुरक्षा सीनियर केयर होम</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">जिला एवं राज्य</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">नई दिल्ली (केंद्रीय जोन)</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">स्वीकृत क्षमता</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">50 वृद्धजन (Senior Citizens)</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">जीपीएस अक्षांश/देशांतर</span>
                          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">28.6139° N, 77.2090° E</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                      <div className="text-xs font-bold text-[#046A38] dark:text-emerald-400 mb-1 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>जियो-फेंसिंग एवं नोडल सत्यापन पूर्ण</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        जिला समाज कल्याण अधिकारी (DSWO) द्वारा ऑन-साइट भौतिक निरीक्षण एवं डिजिटल हस्ताक्षर से सत्यापित।
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 2 Preview: 24/7 CCTV & Biometric Headcount Matching */}
                {activeStep === 2 && (
                  <div className="mt-4 space-y-4">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <div className="text-xs font-bold text-[#0b2545] dark:text-amber-300 mb-2 flex items-center justify-between">
                        <span>📹 लाइव कैमरा व बायोमेट्रिक मिलान (Headcount AI)</span>
                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">🟢 लाइव 30 FPS</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                          <span className="text-[10px] text-slate-400 block">बायोमेट्रिक पंच</span>
                          <span className="text-lg font-black text-[#046A38] dark:text-emerald-400 font-mono">48 / 50</span>
                          <span className="text-[9px] text-slate-500 block mt-0.5">उपस्थित (96%)</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                          <span className="text-[10px] text-slate-400 block">सीसीटीवी एआई काउंट</span>
                          <span className="text-lg font-black text-[#0b2545] dark:text-blue-400 font-mono">48</span>
                          <span className="text-[9px] text-emerald-600 dark:text-emerald-400 block mt-0.5 font-bold">सटीक मिलान (100%)</span>
                        </div>
                        <div className="col-span-2 sm:col-span-1 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                          <span className="text-[10px] text-slate-400 block">एआई विसंगति स्कोर</span>
                          <span className="text-lg font-black text-emerald-600 font-mono">0 / 100</span>
                          <span className="text-[9px] text-emerald-600 block mt-0.5 font-bold">शून्य विसंगति</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                      <div className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-1 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                        <span>लाइव टेलीमेट्री एवं एनआईसी वॉल्ट एन्क्रिप्शन</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        प्रत्येक फ्रेम को 256-बिट टीएलएस एन्क्रिप्शन के साथ एनआईसी डेटा सेंटर में सुरक्षित रूप से दर्ज किया जाता है।
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 3 Preview: Surprise Video Audit & Direct Benefit Transfer */}
                {activeStep === 3 && (
                  <div className="mt-4 space-y-4">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <div className="text-xs font-bold text-[#0b2545] dark:text-amber-300 mb-2 flex items-center justify-between">
                        <span>📞 औचक वीडियो कॉल सत्यापन परिणाम (Spot Verification)</span>
                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">संपन्न (Completed)</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                          <span className="text-slate-500">निरीक्षण अधिकारी:</span>
                          <span className="font-bold">श्री अनुराग शर्मा (वरिष्ठ निरीक्षण अधिकारी, DoSJE)</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                          <span className="text-slate-500">कॉल समय व माध्यम:</span>
                          <span className="font-bold font-mono">11:42 AM • सुरक्षित टोल-फ्री वीडियो ब्रिज</span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <span className="text-slate-500">अधिकारी टिप्पणी:</span>
                          <span className="font-bold text-[#046A38] dark:text-emerald-400">
                            लाभार्थी उपस्थिति, भोजन गुणवत्ता व चिकित्सा रिकॉर्ड पूर्णतया संतोषजनक।
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800">
                      <div className="text-xs font-bold text-amber-900 dark:text-amber-300 mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <BadgeCheck className="w-4 h-4 text-emerald-600" />
                          <span>कैग (CAG) अनुपालन संवितरण प्रमाण पत्र</span>
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white">
                          अनुमोदित (APPROVED)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300">
                        प्रत्यक्ष लाभ अंतरण (DBT) के अंतर्गत त्रैमासिक वित्तीय सहायता सीधे संस्थान के पीएफएमएस (PFMS) बैंक खाते में जारी करने हेतु अनुमोदित।
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Metadata Footer */}
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                  डिजिटल इंडिया ई-गवर्नेंस मानक 3.0
                </span>
                <span className="font-mono text-[10px] text-[#FF671F] font-bold">
                  24×7 स्वचालित निगरानी सक्रिय
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
