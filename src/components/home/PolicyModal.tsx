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
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  initialPolicy = 'privacy',
  isDarkMode,
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
                Government of India · NIC Sovereign Standards
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#0b2545] dark:text-white">
                Statutory Compliance &amp; Governance Charter
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
            <span>Data Protection &amp; Privacy (DPDP)</span>
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
            <span>Terms &amp; Statutory Access</span>
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
            <span>Hyperlinking Policy</span>
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
            <span>Copyright &amp; Security</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                <div className="text-xs">
                  <strong>Digital Personal Data Protection Act, 2023 Compliant:</strong> Biometric attendance markers and live CCTV streams are collected solely for statutory verification of beneficiary services and stored in sovereign data centers within the Union of India.
                </div>
              </div>

              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                1. Information Collection &amp; Sovereign Data Residency
              </h4>
              <p>
                The Department of Social Justice and Empowerment (DoSJE) collects operational feeds, facility coordinates, biometric attendance logs, and video teleconference records strictly for government scheme monitoring and compliance audits. All telemetry is encrypted via TLS 1.3 / AES-256 and hosted exclusively within National Informatics Centre (NIC) sovereign cloud infrastructure.
              </p>

              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                2. Role-Based Access Isolation
              </h4>
              <p>
                Personal and audit data is strictly segregated. Non-Governmental Organizations (NGOs) and Care Institutions only have access to telemetry generated by their own authorized facility. State and District Authorities have scoped regional access, while full audit dossiers are restricted to accredited inspection officers and central ministry directors.
              </p>

              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                3. Retention &amp; Audit Logs
              </h4>
              <p>
                Telemetry records and tamper-evident audit trails are retained in accordance with Comptroller and Auditor General (CAG) compliance mandates for a minimum period of 365 days, following which automated purging cycles execute under DoSJE archival policy.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-900 dark:text-blue-300 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
                <div className="text-xs">
                  <strong>Authorized Official Use Only:</strong> Unauthorized attempts to upload or modify information on this service are strictly prohibited and punishable under Section 43, 66, and 70 of the Information Technology Act, 2000.
                </div>
              </div>

              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                1. System Access &amp; Credential Governance
              </h4>
              <p>
                Access to the National Surveillance and Inspection Command is provisioned strictly to verified government officials, appointed field inspectors, and authorized institution administrators. Sharing credentials or using automated scraping bots is a direct violation of service conditions.
              </p>

              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                2. Legal Validity of Inspection Dossiers
              </h4>
              <p>
                Reports, geo-tagged photographs, timestamped attendance captures, and video logs created through this portal constitute statutory audit evidence under the Department of Social Justice and Empowerment guidelines for grant-in-aid disbursement.
              </p>
            </div>
          )}

          {activeTab === 'hyperlink' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Guidelines on Linking to the DoSJE Smart Monitoring Portal
              </h4>
              <p>
                Prior permission is not required to link directly to information hosted on this portal. However, pages must load into a newly opened window of the user and must not be framed within external commercial website architectures.
              </p>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Outbound Links
              </h4>
              <p>
                Links to external government portals (such as Digital India, NIC, or state social welfare portals) are provided solely for user convenience. DoSJE does not guarantee the availability of such linked pages at all times.
              </p>
            </div>
          )}

          {activeTab === 'copyright' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Intellectual Property &amp; Sovereign Attribution
              </h4>
              <p>
                Material featured on this portal may be reproduced free of charge in any format or media without requiring specific permission, subject to the material being reproduced accurately and not being used in a derogatory or misleading context.
              </p>
              <p>
                Where the material is published or issued to others, the source must be prominently acknowledged as <em>"Department of Social Justice and Empowerment, Ministry of Social Justice and Empowerment, Government of India"</em>.
              </p>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">Central Helpdesk Contacts:</div>
                <div>National Informatics Centre (NIC) Support Desk: <strong>support-dosje@nic.in</strong></div>
                <div>Toll-Free Surveillance Grievance Helpline: <strong>1800-11-2026</strong></div>
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
            Acknowledge &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
