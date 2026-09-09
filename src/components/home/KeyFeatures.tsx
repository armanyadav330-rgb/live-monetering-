import React from 'react';
import {
  BellRing,
  BarChart3,
  Video,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Fingerprint,
} from 'lucide-react';

interface KeyFeaturesProps {
  isDarkMode: boolean;
  lang: 'EN' | 'HI';
  onExploreFeature?: (featureName?: string) => void;
}

export const KeyFeatures: React.FC<KeyFeaturesProps> = ({
  isDarkMode,
  lang,
  onExploreFeature = (_featureName?: string) => {},
}) => {
  const features = [
    {
      id: 'cctv-matrix',
      title: lang === 'HI' ? '24×7 लाइव सीसीटीवी एवं औचक वीडियो कॉल' : '24/7 Live CCTV Feeds & Random Video Calls',
      subtitle: lang === 'HI' ? 'लाइव सीसीटीवी फीड व औचक सत्यापन' : 'Live CCTV Feeds & Random Video Call Verifications',
      description:
        lang === 'HI'
          ? 'सभी संस्थाओं के डाइनिंग हॉल, मुख्य द्वार व कक्षाओं के कैमरों का सीधा लाइव प्रसारण। अधिकारी बिना पूर्व सूचना के रैंडम वीडियो कॉल द्वारा मौके पर उपस्थिति व व्यवस्था की जांच कर सकते हैं।'
          : 'Direct live streaming from dining halls, main gates, and classrooms across all institutions. Authorized officers can initiate surprise video calls without prior notice to verify on-site operations.',
      icon: Video,
      badge: lang === 'HI' ? 'लाइव टेलीमेट्री' : 'Live Telemetry',
      badgeClass: 'bg-[#FF671F]/10 text-[#E65100] border-[#FF671F]/30',
      iconBg: 'bg-[#FF671F]/10 text-[#FF671F]',
      topStripe: 'bg-[#FF671F]',
    },
    {
      id: 'biometric-tracking',
      title: lang === 'HI' ? 'बायोमेट्रिक उपस्थिति एवं हेडकाउंट मिलान' : 'Biometric Attendance & Headcount Audit',
      subtitle: lang === 'HI' ? 'आधार से जुड़ी बायोमेट्रिक उपस्थिति' : 'Aadhaar-Linked Biometric Attendance & Headcount',
      description:
        lang === 'HI'
          ? 'आधार-सक्षम बायोमेट्रिक फिंगरप्रिंट व फेस स्कैनर द्वारा लाभार्थियों और कर्मचारियों की दैनिक लाइव उपस्थिति। फर्जी या डुप्लिकेट नामों (Ghost Beneficiaries) की तत्काल रोकथाम।'
          : 'Daily biometric fingerprint and facial verification for beneficiaries and staff. Instant detection and prevention of ghost beneficiaries and duplicate records.',
      icon: Fingerprint,
      badge: lang === 'HI' ? 'आधार सत्यापित' : 'Aadhaar Verified',
      badgeClass: 'bg-[#046A38]/10 text-[#046A38] border-[#046A38]/30',
      iconBg: 'bg-[#046A38]/10 text-[#046A38]',
      topStripe: 'bg-[#046A38]',
    },
    {
      id: 'ai-radar',
      title: lang === 'HI' ? 'एआई विसंगति रडार व धोखाधड़ी रोकथाम' : 'AI Anomaly Radar & Fraud Prevention',
      subtitle: lang === 'HI' ? 'एआई पूर्वानुमान विसंगति रडार' : 'AI Predictive Anomaly Radar & Fraud Detection',
      description:
        lang === 'HI'
          ? 'मशीन लर्निंग मॉडल सीसीटीवी हेडकाउंट और बायोमेट्रिक डेटा का स्वतः मिलान करते हैं। कैमरे बंद होने, असामान्य समय में हलचल या दर्ज संख्या में अंतर होने पर तुरंत रिस्क स्कोर जारी होता है।'
          : 'Automated reconciliation of CCTV visual headcount with registered biometric data. Instant risk scoring for offline cameras, off-hours movement, or census discrepancies.',
      icon: Sparkles,
      badge: lang === 'HI' ? 'जेमिनी एआई ऑडिट' : 'Gemini AI Audit',
      badgeClass: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30',
      iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      topStripe: 'bg-purple-600',
    },
    {
      id: 'automated-alerts',
      title: lang === 'HI' ? 'स्वचालित अलर्ट एवं बहु-स्तरीय सूचनाएं' : 'Automated Alerts & Escalation Matrix',
      subtitle: lang === 'HI' ? 'एसएमएस व ईमेल अलर्ट प्रणाली' : 'Automated Multi-Channel Escalations (SMS/Email)',
      description:
        lang === 'HI'
          ? 'किसी भी विसंगति पर संबंधित एनजीओ, जिला समाज कल्याण अधिकारी (DSWO) और राज्य नोडल टीम को तुरंत ईमेल, एसएमएस व डैशबोर्ड अलर्ट। 24 घंटे में समाधान न होने पर स्वतः उच्च अधिकारियों को प्रेषित।'
          : 'Instant SMS, email, and dashboard alerts dispatched to NGOs, District Social Welfare Officers (DSWO), and State Nodal officers with SLA-driven automated escalations.',
      icon: BellRing,
      badge: lang === 'HI' ? 'एसएमएस व ईमेल अलर्ट' : 'SMS & Email Alerts',
      badgeClass: 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30',
      iconBg: 'bg-amber-500/10 text-amber-600',
      topStripe: 'bg-amber-500',
    },
    {
      id: 'geo-tagged-inspections',
      title: lang === 'HI' ? 'जियो-टैग ऑन-साइट फील्ड निरीक्षण' : 'Geo-Tagged Field Inspections',
      subtitle: lang === 'HI' ? 'जीपीएस प्रमाणित फील्ड निरीक्षण' : 'Geo-Tagged Physical Field Inspection Dossier',
      description:
        lang === 'HI'
          ? 'निरीक्षण अधिकारियों द्वारा मौके पर जाकर जीपीएस (GPS) अक्षांश-देशांतर व समय-मुहर (Timestamp) के साथ फोटो, भोजन की गुणवत्ता, साफ-सफाई व भौतिक पंजी सत्यापन की रिपोर्ट दर्ज की जाती है।'
          : 'Field officers conduct on-site audits with tamper-proof GPS coordinates and timestamps, submitting photo evidence, meal quality logs, and physical muster checks.',
      icon: MapPin,
      badge: lang === 'HI' ? 'जीपीएस प्रमाणित' : 'GPS Verified',
      badgeClass: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
      iconBg: 'bg-blue-500/10 text-blue-600',
      topStripe: 'bg-blue-600',
    },
    {
      id: 'cag-audit-reports',
      title: lang === 'HI' ? 'डिजिटल ऑडिट डोजियर एवं कैग (CAG) अनुपालन' : 'Statutory Compliance & CAG Audit Dossier',
      subtitle: lang === 'HI' ? 'कैग अनुपालन व डीबीटी रिपोर्ट्स' : 'Statutory Compliance Reports & Direct Benefit Transfer',
      description:
        lang === 'HI'
          ? 'एक क्लिक में संपूर्ण ऐतिहासिक ऑडिट रिपोर्ट, विसंगति लॉग, उपस्थिति प्रतिशत व सीसीटीवी स्नैपशॉट पीडीएफ/एक्सेल में डाउनलोड करें। वित्तीय अनुदान जारी करने हेतु कैग नियमों के अनुरूप।'
          : 'Download complete historical audit trails, anomaly registers, and CCTV visual snapshots in PDF/Excel compliant with CAG and DBT grant-in-aid release requirements.',
      icon: BarChart3,
      badge: lang === 'HI' ? 'कैग अनुरूप' : 'CAG Compliant',
      badgeClass: 'bg-[#0b2545]/10 text-[#0b2545] dark:text-amber-300 border-[#0b2545]/30',
      iconBg: 'bg-[#0b2545]/10 text-[#0b2545] dark:text-white',
      topStripe: 'bg-[#0b2545]',
    },
  ];

  return (
    <section id="features" className="py-14 sm:py-18 bg-white border-t border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 text-black border border-slate-300">
            <ShieldCheck className="w-4 h-4 text-black" />
            <span>
              {lang === 'HI'
                ? 'केंद्रीय निगरानी प्रणाली के 6 प्रमुख स्तंभ • Core Statutory Pillars'
                : 'Central Surveillance System • 6 Core Statutory Pillars'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-black">
            {lang === 'HI'
              ? 'सरकारी निगरानी एवं पारदर्शिता के मुख्य मॉड्यूल'
              : 'Institutional Oversight & Governance Modules'}
          </h2>

          <p className="text-sm sm:text-base text-black leading-relaxed font-semibold">
            {lang === 'HI'
              ? 'देश भर के सामाजिक न्याय संस्थानों में निष्पक्षता, सुरक्षा व वित्तीय अनुशासन सुनिश्चित करने हेतु तैयार किया गया व्यापक सरकारी ढांचा।'
              : 'Comprehensive digital infrastructure ensuring accountability, safety, and financial discipline across social welfare institutions nationwide.'}
          </p>
        </div>

        {/* Features Grid (Responsive 1, 2, or 3 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {features.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => onExploreFeature(item.subtitle)}
                className="group p-6 rounded-2xl border border-slate-200 bg-white hover:border-black hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden"
              >
                {/* Top Colored Accent Stripe */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${item.topStripe}`} />

                <div>
                  {/* Top Bar: Icon & Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.iconBg} border border-current/10 shadow-xs group-hover:scale-105 transition-transform`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <span
                      className="text-[11px] font-black px-2.5 py-0.5 rounded-full border border-slate-300 bg-slate-100 text-black"
                    >
                      {item.badge}
                    </span>
                  </div>

                  {/* Title and Subtitle in Crisp Black */}
                  <h3 className="text-base font-black text-black transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <div className="text-[11px] font-black text-black mt-0.5">
                    {item.subtitle}
                  </div>

                  {/* Description in Solid Black */}
                  <p className="mt-2.5 text-xs sm:text-sm text-black leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-black text-black transition-colors">
                  <span>{lang === 'HI' ? 'मॉड्यूल देखें' : 'View Module'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-black" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
