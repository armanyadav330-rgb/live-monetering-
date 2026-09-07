import React from 'react';
import {
  CheckCircle2,
  Shield,
  Zap,
  Globe2,
  Server,
  Activity,
  ArrowRight,
  FileText,
  Lock,
  Cpu,
} from 'lucide-react';

interface LiveStatusOverviewProps {
  isDarkMode: boolean;
  onLaunchDashboard: () => void;
  onOpenDocs?: () => void;
}

export const LiveStatusOverview: React.FC<LiveStatusOverviewProps> = ({
  isDarkMode,
  onLaunchDashboard,
  onOpenDocs = () => {},
}) => {
  const regions = [
    { name: 'उत्तरी ग्रिड • North (दिल्ली / पंजाब / हरियाणा / उप्र)', latency: '5.2ms', status: 'कार्यशील (Active)', uptime: '99.99%', load: '32%' },
    { name: 'पश्चिमी ग्रिड • West (महाराष्ट्र / गुजरात / राजस्थान)', latency: '6.8ms', status: 'कार्यशील (Active)', uptime: '100%', load: '28%' },
    { name: 'दक्षिणी ग्रिड • South (कर्नाटक / तमिलनाडु / आंध्र / तेलंगाना)', latency: '7.4ms', status: 'कार्यशील (Active)', uptime: '99.98%', load: '41%' },
    { name: 'पूर्वी एवं पूर्वोत्तर ग्रिड • East & NE (प. बंगाल / असम / ओडिशा)', latency: '9.1ms', status: 'कार्यशील (Active)', uptime: '99.95%', load: '36%' },
  ];

  const tiers = [
    {
      name: 'जिला एवं एनजीओ पायलट स्तर',
      subtitle: 'District & NGO Verification Tier',
      tag: 'स्थानीय संस्था स्तर',
      price: 'अनुदान आधारित',
      period: 'केंद्रीय सहायता (100% Grant)',
      description: 'जिला समाज कल्याण कार्यालय (DSWO) एवं सहायता-प्राप्त एनजीओ केयर होम्स के लिए प्राथमिक 24×7 सीसीटीवी व बायोमेट्रिक ऑनबोर्डिंग।',
      features: [
        '15 तक लाइव सीसीटीवी कैमरा स्ट्रीम',
        'आधार-सत्यापित बायोमेट्रिक उपस्थिति मिलान',
        'स्वचालित एसएमएस एवं ईमेल विसंगति अलर्ट',
        '30-दिवसीय डिजिटल ऑडिट डेटा रिकॉर्ड',
        'जिला स्तर पर नोडल ऑफिसर डैशबोर्ड एक्सेस',
      ],
      cta: 'पायलट मॉड्यूल से जुड़ें (District Access)',
      popular: false,
    },
    {
      name: 'राज्य एवं विभागीय कमान स्तर',
      subtitle: 'State & Ministry Oversight Grid',
      tag: 'राष्ट्रीय मानक • अनुशंसित',
      price: 'विभागीय स्वीकृत',
      period: 'नियमित परिचालन (Full Scheme)',
      description: 'राज्य स्तरीय नोडल निदेशालय हेतु पूर्ण लाइव नियंत्रण: जेमिनी एआई विसंगति रडार, औचक वीडियो कॉल सत्यापन व कैग (CAG) डिजिटल ऑडिट।',
      features: [
        'असीमित सीसीटीवी (RTSP/WebRTC) लाइव प्रसारण',
        'जेमिनी एआई विसंगति व हेडकाउंट स्कोरिंग रडार',
        'एकीकृत टोल-फ्री औचक वीडियो कॉल सत्यापन',
        'जियो-टैग ऑन-साइट फील्ड निरीक्षण डॉजियर',
        '24 घंटे में बहु-स्तरीय स्वचालित एस्केलेशन',
        '365-दिवसीय संपूर्ण ऐतिहासिक ऑडिट रिकॉर्ड',
        'एनआईसी क्लाउड सर्वर पर 24×7 प्राथमिकता सहायता',
      ],
      cta: 'कमान ग्रिड में लॉगिन करें (Directorate Login)',
      popular: true,
    },
    {
      name: 'राष्ट्रीय संप्रभु अपेक्स कमान',
      subtitle: 'National Apex Sovereign Grid',
      tag: 'मंत्रालय केंद्रीय कमान',
      price: 'केंद्रीय बजट',
      period: 'अखिल भारतीय स्तर (Nationwide)',
      description: 'केंद्रीय सामाजिक न्याय एवं अधिकारिता मंत्रालय (DoSJE) एवं नीति आयोग के लिए संपूर्ण 28 राज्यों व 8 केंद्रशासित प्रदेशों का एकीकृत डेशबोर्ड।',
      features: [
        'अखिल भारतीय राज्यवार मल्टी-टेनेंट कमान',
        'एनआईसी राष्ट्रीय डेटा सेंटर एवं सुरक्षा वॉल्ट',
        'कैग (CAG) एवं पीएफएमएस (PFMS) डायरेक्ट बेनिफिट लिंक',
        'राष्ट्रीय विसंगति एवं जोखिम हीटमैप',
        'हार्डवेयर स्तर का सुरक्षा मॉड्यूल (HSM Vault)',
      ],
      cta: 'अपेक्स पोर्टल विवरण (Ministry Apex Info)',
      popular: false,
    },
  ];

  return (
    <section id="status" className="py-14 sm:py-20 border-t border-slate-200/80 dark:border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SECTION 1: REGIONAL CLUSTER STATUS */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>राष्ट्रीय ग्रिड स्वास्थ्य • National Grid Live Telemetry</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b2545] dark:text-white">
                लाइव क्षेत्रीय क्लस्टर स्थिति (Live Regional Cluster Status)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                देशभर के क्षेत्रीय सर्वर नोड्स और डेटा गेटवे से प्राप्त वास्तविक समय की कनेक्टिविटी व पिंग स्थिति।
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold shrink-0">
              <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                सभी क्षेत्रीय नोड पूर्णतया सक्रिय (All Operational)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {regions.map((reg, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition ${
                  isDarkMode
                    ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-200 hover:border-[#0b2545]/40 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between text-xs gap-2">
                  <span className="font-bold text-[#0b2545] dark:text-white leading-tight">{reg.name}</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 mt-0.5" />
                </div>

                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {reg.latency}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    अपटाइम {reg.uptime}
                  </span>
                </div>

                <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2 font-mono">
                  <span>सर्वर लोड: {reg.load}</span>
                  <span className="text-[#046A38] dark:text-emerald-400 font-bold">{reg.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: STATUTORY DEPLOYMENT TIERS */}
        <div id="pricing" className="pt-4">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0b2545]/10 text-[#0b2545] dark:bg-amber-400/10 dark:text-amber-400 border border-[#0b2545]/20 dark:border-amber-400/30">
              <Shield className="w-3.5 h-3.5 text-[#FF671F]" />
              <span>प्रशासनिक परिनियोजन स्तर • Statutory Implementation Framework</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0b2545] dark:text-white">
              विभागीय एवं प्रशासनिक कार्यान्वयन स्तर
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              जिला समाज कल्याण कार्यालय, राज्य नोडल निदेशालय और केंद्रीय मंत्रालय स्तर के लिए निर्धारित परिचालन संरचना।
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {tiers.map((tier, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border-2 p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
                  tier.popular
                    ? isDarkMode
                      ? 'bg-slate-900/90 border-[#FF671F] shadow-xl shadow-orange-500/10 ring-1 ring-[#FF671F]'
                      : 'bg-white border-[#0b2545] shadow-lg shadow-slate-900/10 ring-2 ring-[#0b2545]/30'
                    : isDarkMode
                    ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FF671F] to-[#E65100] text-white text-[10px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md border border-amber-300/40">
                    {tier.tag}
                  </div>
                )}

                <div>
                  <div className="text-xs font-bold text-[#FF671F] uppercase tracking-wider">
                    {tier.subtitle}
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold mt-1 text-[#0b2545] dark:text-white">
                    {tier.name}
                  </h3>

                  <div className="mt-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                    <span className="text-base sm:text-lg font-black text-[#0b2545] dark:text-amber-300 block">
                      {tier.price}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">{tier.period}</span>
                  </div>

                  <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {tier.description}
                  </p>

                  <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      प्रमुख प्रावधान एवं सुविधाएं:
                    </div>
                    {tier.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#046A38] dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4">
                  <button
                    onClick={onLaunchDashboard}
                    className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      tier.popular
                        ? 'bg-gradient-to-r from-[#FF671F] to-[#E65100] hover:from-[#e55917] hover:to-[#c94500] text-white shadow-lg shadow-orange-500/20 border border-amber-300/30'
                        : isDarkMode
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        : 'bg-[#0b2545]/5 hover:bg-[#0b2545]/10 text-[#0b2545] border border-[#0b2545]/20'
                    }`}
                  >
                    <span>{tier.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
