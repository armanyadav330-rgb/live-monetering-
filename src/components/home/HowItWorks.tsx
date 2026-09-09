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
  isDarkMode: _isDarkMode,
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
              राष्ट्रीय निगरानी सांख्यिकी • National Grid Operations
            </span>
            <h3 className="text-xl sm:text-2xl font-black mt-1 text-black">
              केंद्रीय सामाजिक न्याय एवं अधिकारिता कमान ग्रिड
            </h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
            <div className="pt-4 sm:pt-0">
              <div className="text-2xl sm:text-4xl font-black text-black tracking-tight font-mono">
                99.9%
              </div>
              <div className="text-xs sm:text-sm font-black text-black mt-1">
                लाइव अपटाइम (SLA Met)
              </div>
              <div className="text-[11px] font-bold text-black mt-0.5">एनआईसी क्लाउड सर्वर</div>
            </div>

            <div className="pt-4 sm:pt-0 sm:pl-4">
              <div className="text-2xl sm:text-4xl font-black text-black tracking-tight font-mono">
                &lt; 10ms
              </div>
              <div className="text-xs sm:text-sm font-black text-black mt-1">
                टेलीमेट्री विलंबता (Latency)
              </div>
              <div className="text-[11px] font-bold text-black mt-0.5">वास्तविक समय डेटा स्ट्रीम</div>
            </div>

            <div className="pt-4 sm:pt-0 sm:pl-4">
              <div className="text-2xl sm:text-4xl font-black text-black tracking-tight font-mono">
                24×7
              </div>
              <div className="text-xs sm:text-sm font-black text-black mt-1">
                सतत निगरानी कमान
              </div>
              <div className="text-[11px] font-bold text-black mt-0.5">स्वचालित एआई विसंगति रडार</div>
            </div>

            <div className="pt-4 sm:pt-0 sm:pl-4">
              <div className="text-2xl sm:text-4xl font-black text-black tracking-tight font-mono">
                1,200+
              </div>
              <div className="text-xs sm:text-sm font-black text-black mt-1">
                पंजीकृत संस्थाएं एवं केंद्र
              </div>
              <div className="text-[11px] font-bold text-black mt-0.5">सभी 28 राज्य एवं 8 केंद्रशासित प्रदेश</div>
            </div>
          </div>
        </div>

        {/* SECTION HEADER: HOW IT WORKS */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 text-black border border-slate-300">
            <Radio className="w-3.5 h-3.5 text-black" />
            <span>कार्यप्रणाली • Statutory 3-Step Verification Pipeline</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-black">
            यह पोर्टल कैसे कार्य करता है? (How It Works)
          </h2>

          <p className="text-sm sm:text-base text-black leading-relaxed font-semibold">
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
                            चरण {s.num} • STEP {s.num}
                          </span>
                          {isActive && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-black border border-slate-300">
                              सक्रिय दृश्य
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
                <span>कमांड पोर्टल खोलें (Open Official Command Portal)</span>
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
                        राष्ट्रीय निरीक्षण एवं सत्यापन रिकॉर्ड (Statutory Dossier)
                      </div>
                      <div className="text-[10px] text-black font-mono font-bold">
                        DoSJE-REF-2026-DL-8842 • एनआईसी प्रमाणित
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-100 text-black border border-slate-300">
                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                    सत्यापित नोड
                  </span>
                </div>

                {/* Step 1 Preview: Facility Details & Geo-Tagging */}
                {activeStep === 1 && (
                  <div className="mt-4 space-y-4">
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                      <div className="text-xs font-black text-black mb-2 flex items-center justify-between">
                        <span>🏢 पंजीकृत संस्थान विवरण (Facility Profile)</span>
                        <span className="text-[10px] font-mono text-black font-bold">● सक्रिय (Active)</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] text-black font-semibold block">संस्थान का नाम</span>
                          <span className="font-bold text-black">सुरक्षा सीनियर केयर होम</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-black font-semibold block">जिला एवं राज्य</span>
                          <span className="font-bold text-black">नई दिल्ली (केंद्रीय जोन)</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-black font-semibold block">स्वीकृत क्षमता</span>
                          <span className="font-bold text-black">50 वृद्धजन (Senior Citizens)</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-black font-semibold block">जीपीएस अक्षांश/देशांतर</span>
                          <span className="font-mono font-bold text-black">28.6139° N, 77.2090° E</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-300 shadow-xs">
                      <div className="text-xs font-black text-black mb-1 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>जियो-फेंसिंग एवं नोडल सत्यापन पूर्ण</span>
                      </div>
                      <p className="text-[11px] text-black font-medium">
                        जिला समाज कल्याण अधिकारी (DSWO) द्वारा ऑन-साइट भौतिक निरीक्षण एवं डिजिटल हस्ताक्षर से सत्यापित।
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 2 Preview: 24/7 CCTV & Biometric Headcount Matching */}
                {activeStep === 2 && (
                  <div className="mt-4 space-y-4">
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                      <div className="text-xs font-black text-black mb-2 flex items-center justify-between">
                        <span>📹 लाइव कैमरा व बायोमेट्रिक मिलान (Headcount AI)</span>
                        <span className="text-[10px] font-mono text-black font-bold">🟢 लाइव 30 FPS</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-center">
                          <span className="text-[10px] text-black font-semibold block">बायोमेट्रिक पंच</span>
                          <span className="text-lg font-black text-black font-mono">48 / 50</span>
                          <span className="text-[9px] text-black font-bold block mt-0.5">उपस्थित (96%)</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-center">
                          <span className="text-[10px] text-black font-semibold block">सीसीटीवी एआई काउंट</span>
                          <span className="text-lg font-black text-black font-mono">48</span>
                          <span className="text-[9px] text-black block mt-0.5 font-bold">सटीक मिलान (100%)</span>
                        </div>
                        <div className="col-span-2 sm:col-span-1 p-2.5 rounded-lg bg-white border border-slate-200 text-center">
                          <span className="text-[10px] text-black font-semibold block">एआई विसंगति स्कोर</span>
                          <span className="text-lg font-black text-black font-mono">0 / 100</span>
                          <span className="text-[9px] text-black block mt-0.5 font-bold">शून्य विसंगति</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-300 shadow-xs">
                      <div className="text-xs font-black text-black mb-1 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-black" />
                        <span>लाइव टेलीमेट्री एवं एनआईसी वॉल्ट एन्क्रिप्शन</span>
                      </div>
                      <p className="text-[11px] text-black font-medium">
                        प्रत्येक फ्रेम को 256-बिट टीएलएस एन्क्रिप्शन के साथ एनआईसी डेटा सेंटर में सुरक्षित रूप से दर्ज किया जाता है।
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 3 Preview: Surprise Video Audit & Direct Benefit Transfer */}
                {activeStep === 3 && (
                  <div className="mt-4 space-y-4">
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                      <div className="text-xs font-black text-black mb-2 flex items-center justify-between">
                        <span>📞 औचक वीडियो कॉल सत्यापन परिणाम (Spot Verification)</span>
                        <span className="text-[10px] font-mono text-black font-bold">संपन्न (Completed)</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between py-1 border-b border-slate-200">
                          <span className="text-black font-medium">निरीक्षण अधिकारी:</span>
                          <span className="font-bold text-black">श्री अनुराग शर्मा (वरिष्ठ निरीक्षण अधिकारी, DoSJE)</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-slate-200">
                          <span className="text-black font-medium">कॉल समय व माध्यम:</span>
                          <span className="font-bold font-mono text-black">11:42 AM • सुरक्षित टोल-फ्री वीडियो ब्रिज</span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <span className="text-black font-medium">अधिकारी टिप्पणी:</span>
                          <span className="font-bold text-black">
                            लाभार्थी उपस्थिति, भोजन गुणवत्ता व चिकित्सा रिकॉर्ड पूर्णतया संतोषजनक।
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-300 shadow-xs">
                      <div className="text-xs font-black text-black mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <BadgeCheck className="w-4 h-4 text-emerald-600" />
                          <span>कैग (CAG) अनुपालन संवितरण प्रमाण पत्र</span>
                        </span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-black text-white">
                          अनुमोदित (APPROVED)
                        </span>
                      </div>
                      <p className="text-[11px] text-black font-medium">
                        प्रत्यक्ष लाभ अंतरण (DBT) के अंतर्गत त्रैमासिक वित्तीय सहायता सीधे संस्थान के पीएफएमएस (PFMS) बैंक खाते में जारी करने हेतु अनुमोदित।
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Metadata Footer */}
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-black font-bold">
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  डिजिटल इंडिया ई-गवर्नेंस मानक 3.0
                </span>
                <span className="font-mono text-[10px] text-black font-black">
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
