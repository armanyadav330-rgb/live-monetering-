import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  FileText,
  Lock,
  ExternalLink,
  Scale,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export type PolicyType = 'privacy' | 'terms' | 'hyperlink' | 'copyright';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPolicy?: PolicyType;
  isDarkMode: boolean;
  lang?: 'EN' | 'HI';
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  initialPolicy = 'privacy',
  isDarkMode,
  lang = 'EN',
}) => {
  const [activeTab, setActiveTab] = useState<PolicyType>(initialPolicy);

  if (!isOpen) return null;

  return (
    <div
      id="policy-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all relative ${
          isDarkMode
            ? 'bg-slate-900 border-slate-700 text-slate-100'
            : 'bg-white border-slate-300 text-slate-900'
        }`}
      >
        {/* Official Header with Emblem & Tricolor */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38]" />

        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0b2545] text-amber-400 border border-amber-500/40 flex flex-col items-center justify-center shrink-0 p-1">
              <span className="text-base leading-none">🏛️</span>
              <span className="text-[7px] font-bold tracking-tighter text-amber-300 uppercase">
                DoSJE
              </span>
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#FF671F] uppercase tracking-wider">
                {lang === 'HI' ? 'भारत सरकार · एनआईसी संप्रभु मानक' : 'Government of India · NIC Sovereign Standards'}
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#0b2545] dark:text-white">
                {lang === 'HI' ? 'वैधानिक अनुपालन एवं अभिशासन चार्टर' : 'Statutory Compliance & Governance Charter'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-3 pb-2 border-b border-slate-200 dark:border-slate-800 flex gap-2 overflow-x-auto scrollbar-none shrink-0 bg-slate-100/50 dark:bg-slate-950/40 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'privacy'
                ? 'bg-[#0b2545] text-amber-300 dark:bg-slate-800 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{lang === 'HI' ? 'डेटा सुरक्षा एवं गोपनीयता (DPDP)' : 'Data Protection & Privacy (DPDP)'}</span>
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'terms'
                ? 'bg-[#0b2545] text-amber-300 dark:bg-slate-800 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>{lang === 'HI' ? 'नियम एवं वैधानिक पहुंच' : 'Terms & Statutory Access'}</span>
          </button>
          <button
            onClick={() => setActiveTab('hyperlink')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'hyperlink'
                ? 'bg-[#0b2545] text-amber-300 dark:bg-slate-800 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{lang === 'HI' ? 'हाइपरलिंकिंग नीति' : 'Hyperlinking Policy'}</span>
          </button>
          <button
            onClick={() => setActiveTab('copyright')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'copyright'
                ? 'bg-[#0b2545] text-amber-300 dark:bg-slate-800 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{lang === 'HI' ? 'कॉपीराइट एवं सुरक्षा' : 'Copyright & Security'}</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                <div className="text-xs">
                  {lang === 'HI' ? (
                    <>
                      <strong>डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम (DPDP 2023) अनुरूप:</strong> बायोमेट्रिक उपस्थिति चिह्न और लाइव सीसीटीवी स्ट्रीम केवल लाभार्थी सेवाओं के वैधानिक सत्यापन हेतु संगृहीत किए जाते हैं तथा भारत गणराज्य के भीतर संप्रभु डेटा केंद्रों में सुरक्षित रखे जाते हैं।
                    </>
                  ) : (
                    <>
                      <strong>Digital Personal Data Protection Act, 2023 Compliant:</strong> Biometric attendance markers and live CCTV streams are collected solely for statutory verification of beneficiary services and stored in sovereign data centers within the Union of India.
                    </>
                  )}
                </div>
              </div>

              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                {lang === 'HI' ? '1. सूचना संग्रह एवं संप्रभु डेटा निवास' : '1. Information Collection & Sovereign Data Residency'}
              </h4>
              <p>
                {lang === 'HI'
                  ? 'सामाजिक न्याय और अधिकारिता विभाग (DoSJE) सरकारी योजना निगरानी और अनुपालन ऑडिट के लिए सख्ती से परिचालन फीड, सुविधा निर्देशांक, बायोमेट्रिक उपस्थिति लॉग और वीडियो टेलीकांफ्रेंस रिकॉर्ड एकत्र करता है। सभी टेलीमेट्री टीएलएस 1.3 / एईएस-256 के माध्यम से एन्क्रिप्टेड है और केवल राष्ट्रीय सूचना विज्ञान केंद्र (एनआईसी) संप्रभु क्लाउड अवसंरचना के भीतर होस्ट की जाती है।'
                  : 'The Department of Social Justice and Empowerment (DoSJE) collects operational feeds, facility coordinates, biometric attendance logs, and video teleconference records strictly for government scheme monitoring and compliance audits. All telemetry is encrypted via TLS 1.3 / AES-256 and hosted exclusively within National Informatics Centre (NIC) sovereign cloud infrastructure.'}
              </p>

              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                {lang === 'HI' ? '2. भूमिका आधारित पहुंच अलगाव' : '2. Role-Based Access Isolation'}
              </h4>
              <p>
                {lang === 'HI'
                  ? 'व्यक्तिगत और ऑडिट डेटा सख्ती से अलग किया गया है। गैर-सरकारी संगठनों (NGOs) और केयर संस्थानों के पास केवल अपनी अधिकृत सुविधा द्वारा उत्पन्न टेलीमेट्री तक पहुंच है। राज्य और जिला अधिकारियों के पास क्षेत्रीय पहुंच है, जबकि पूर्ण ऑडिट डॉजियर मान्यता प्राप्त निरीक्षण अधिकारियों और केंद्रीय मंत्रालय के निदेशकों तक सीमित हैं।'
                  : 'Personal and audit data is strictly segregated. Non-Governmental Organizations (NGOs) and Care Institutions only have access to telemetry generated by their own authorized facility. State and District Authorities have scoped regional access, while full audit dossiers are restricted to accredited inspection officers and central ministry directors.'}
              </p>

              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                {lang === 'HI' ? '3. प्रतिधारण एवं ऑडिट लॉग्स' : '3. Retention & Audit Logs'}
              </h4>
              <p>
                {lang === 'HI'
                  ? 'टेलीमेट्री रिकॉर्ड और छेड़छाड़-रोधी ऑडिट ट्रेल्स को भारत के नियंत्रक और महालेखापरीक्षक (CAG) के अनुपालन शासनादेशों के अनुसार न्यूनतम 365 दिनों की अवधि के लिए बनाए रखा जाता है, जिसके बाद DoSJE अभिलेखीय नीति के तहत स्वचालित प्रक्रिया निष्पादित होती है।'
                  : 'Telemetry records and tamper-evident audit trails are retained in accordance with Comptroller and Auditor General (CAG) compliance mandates for a minimum period of 365 days, following which automated purging cycles execute under DoSJE archival policy.'}
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-900 dark:text-blue-300 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
                <div className="text-xs">
                  {lang === 'HI' ? (
                    <>
                      <strong>केवल अधिकृत आधिकारिक उपयोग हेतु:</strong> इस सेवा पर जानकारी अपलोड करने या संशोधित करने के अनधिकृत प्रयास सख्त वर्जित हैं और सूचना प्रौद्योगिकी अधिनियम, 2000 की धारा 43, 66 और 70 के तहत दंडनीय हैं।
                    </>
                  ) : (
                    <>
                      <strong>Authorized Official Use Only:</strong> Unauthorized attempts to upload or modify information on this service are strictly prohibited and punishable under Section 43, 66, and 70 of the Information Technology Act, 2000.
                    </>
                  )}
                </div>
              </div>

              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                {lang === 'HI' ? '1. सिस्टम पहुंच एवं क्रेडेंशियल अभिशासन' : '1. System Access & Credential Governance'}
              </h4>
              <p>
                {lang === 'HI'
                  ? 'राष्ट्रीय निगरानी और निरीक्षण कमान तक पहुंच केवल सत्यापित सरकारी अधिकारियों, नियुक्त फील्ड निरीक्षकों और अधिकृत संस्था व्यवस्थापकों को प्रदान की जाती है। क्रेडेंशियल साझा करना सेवा शर्तों का उल्लंघन है।'
                  : 'Access to the National Surveillance and Inspection Command is provisioned strictly to verified government officials, appointed field inspectors, and authorized institution administrators. Sharing credentials or using automated scraping bots is a direct violation of service conditions.'}
              </p>

              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                {lang === 'HI' ? '2. निरीक्षण डॉजियर की कानूनी वैधता' : '2. Legal Validity of Inspection Dossiers'}
              </h4>
              <p>
                {lang === 'HI'
                  ? 'इस पोर्टल के माध्यम से बनाए गए रिपोर्ट, जियो-टैग की गई तस्वीरें, टाइमस्टैम्प्ड उपस्थिति और वीडियो लॉग सहायता अनुदान संवितरण के लिए सामाजिक न्याय और अधिकारिता विभाग के दिशा-निर्देशों के तहत वैधानिक ऑडिट साक्ष्य हैं।'
                  : 'Reports, geo-tagged photographs, timestamped attendance captures, and video logs created through this portal constitute statutory audit evidence under the Department of Social Justice and Empowerment guidelines for grant-in-aid disbursement.'}
              </p>
            </div>
          )}

          {activeTab === 'hyperlink' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                {lang === 'HI'
                  ? 'Satya Nirakshak से लिंक करने के दिशा-निर्देश'
                  : 'Guidelines on Linking to Satya Nirakshak'}
              </h4>
              <p>
                {lang === 'HI'
                  ? 'इस पोर्टल पर होस्ट की गई जानकारी से सीधे लिंक करने के लिए पूर्व अनुमति की आवश्यकता नहीं है। हालांकि, पृष्ठ उपयोगकर्ता की एक नई खुली विंडो में लोड होने चाहिए और किसी बाहरी वाणिज्यिक वेबसाइट संरचना में फ़्रेम नहीं किए जाने चाहिए।'
                  : 'Prior permission is not required to link directly to information hosted on this portal. However, pages must load into a newly opened window of the user and must not be framed within external commercial website architectures.'}
              </p>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                {lang === 'HI' ? 'बाहरी लिंक्स (Outbound Links)' : 'Outbound Links'}
              </h4>
              <p>
                {lang === 'HI'
                  ? 'बाहरी सरकारी पोर्टलों (जैसे डिजिटल इंडिया, एनआईसी) के लिंक केवल उपयोगकर्ताओं की सुविधा के लिए प्रदान किए गए हैं।'
                  : 'Links to external government portals (such as Digital India, NIC, or state social welfare portals) are provided solely for user convenience. DoSJE does not guarantee the availability of such linked pages at all times.'}
              </p>
            </div>
          )}

          {activeTab === 'copyright' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                {lang === 'HI' ? 'बौद्धिक संपदा एवं संप्रभु श्रेय' : 'Intellectual Property & Sovereign Attribution'}
              </h4>
              <p>
                {lang === 'HI'
                  ? 'इस पोर्टल पर प्रदर्शित सामग्री को बिना किसी विशिष्ट अनुमति के किसी भी प्रारूप में निःशुल्क पुनरुत्पादित किया जा सकता है, बशर्ते सामग्री को सटीक रूप से प्रस्तुत किया जाए।'
                  : 'Material featured on this portal may be reproduced free of charge in any format or media without requiring specific permission, subject to the material being reproduced accurately and not being used in a derogatory or misleading context.'}
              </p>
              <p>
                {lang === 'HI' ? (
                  <>
                    स्रोत को <em>"सामाजिक न्याय और अधिकारिता विभाग, सामाजिक न्याय और अधिकारिता मंत्रालय, भारत सरकार"</em> के रूप में प्रमुखता से स्वीकार किया जाना चाहिए।
                  </>
                ) : (
                  <>
                    Where the material is published or issued to others, the source must be prominently acknowledged as <em>"Department of Social Justice and Empowerment, Ministry of Social Justice and Empowerment, Government of India"</em>.
                  </>
                )}
              </p>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">
                  {lang === 'HI' ? 'केंद्रीय हेल्पडेस्क संपर्क:' : 'Central Helpdesk Contacts:'}
                </div>
                <div>
                  {lang === 'HI' ? 'एनआईसी सपोर्ट डेस्क:' : 'National Informatics Centre (NIC) Support Desk:'} <strong>support-dosje@nic.in</strong>
                </div>
                <div>
                  {lang === 'HI' ? 'टोल-फ्री हेल्पलाइन:' : 'Toll-Free Surveillance Grievance Helpline:'} <strong>1800-11-2026</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-slate-950">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Guidelines for Indian Government Websites (GIGW 3.0)</span>
          </span>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#0b2545] dark:bg-slate-800 hover:bg-[#13315C] dark:hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
          >
            {lang === 'HI' ? 'स्वीकार करें एवं बंद करें' : 'Acknowledge & Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
