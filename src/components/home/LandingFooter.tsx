import React from 'react';
import {
  Activity,
  ShieldCheck,
  Globe2,
  Lock,
  ExternalLink,
  CheckCircle2,
  Mail,
  Phone,
} from 'lucide-react';

interface LandingFooterProps {
  isDarkMode: boolean;
  onNavigateSection: (id: string) => void;
  onLaunchDashboard: () => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  isDarkMode,
  onNavigateSection,
  onLaunchDashboard,
  onOpenPrivacy = () => {},
  onOpenTerms = () => {},
}) => {
  return (
    <footer
      className={`border-t transition-colors relative ${
        isDarkMode
          ? 'bg-slate-950 border-slate-800 text-slate-400'
          : 'bg-[#0b2545] border-[#081d36] text-slate-300'
      }`}
    >
      {/* Official Tricolor Ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Column 1 & 2: Official Branding & Status */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-amber-300/30 flex items-center justify-center p-1.5 shrink-0">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                  alt="Emblem of India"
                  className="w-full h-full object-contain filter brightness-0 invert"
                />
              </div>
              <div>
                <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                  भारत सरकार • Government of India
                </div>
                <div className="font-extrabold text-base text-white tracking-tight">
                  National Live Surveillance &amp; Audit Command
                </div>
                <div className="text-[10px] text-slate-300">
                  Ministry of Social Justice and Empowerment (DoSJE)
                </div>
              </div>
            </div>

            <p className="text-xs leading-relaxed max-w-sm text-slate-300 font-normal">
              A sovereign oversight ecosystem empowering state nodal authorities, biometric attendance validation, and real-time CCTV anomaly radar across national social care institutions.
            </p>

            {/* System Status Indicator */}
            <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-950/40 max-w-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-xs font-bold text-emerald-400">
                  NIC Sovereign Grid Online
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400">
                99.99% UPTIME
              </span>
            </div>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateSection('features')}
                  className="hover:text-amber-300 transition cursor-pointer text-left"
                >
                  Core Modules
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('how-it-works')}
                  className="hover:text-amber-300 transition cursor-pointer text-left"
                >
                  Statutory Ingestion Pipeline
                </button>
              </li>
              <li>
                <button
                  onClick={onLaunchDashboard}
                  className="hover:text-amber-300 transition cursor-pointer text-left font-semibold text-white"
                >
                  Live Command Preview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('status')}
                  className="hover:text-amber-300 transition cursor-pointer text-left"
                >
                  Regional Cluster Status
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('pricing')}
                  className="hover:text-amber-300 transition cursor-pointer text-left"
                >
                  Deployment Tiers
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Solutions & Modules */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Statutory Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onLaunchDashboard}
                  className="hover:text-amber-300 transition cursor-pointer text-left"
                >
                  CCTV RTSP Grid &amp; Pan-Tilt
                </button>
              </li>
              <li>
                <button
                  onClick={onLaunchDashboard}
                  className="hover:text-amber-300 transition cursor-pointer text-left"
                >
                  Toll-Free Surprise Video Verification
                </button>
              </li>
              <li>
                <button
                  onClick={onLaunchDashboard}
                  className="hover:text-amber-300 transition cursor-pointer text-left"
                >
                  Geo-Tagged Field Inspection Dossiers
                </button>
              </li>
              <li>
                <button
                  onClick={onLaunchDashboard}
                  className="hover:text-amber-300 transition cursor-pointer text-left"
                >
                  Gemini AI Anomaly Scoring
                </button>
              </li>
              <li>
                <button
                  onClick={onLaunchDashboard}
                  className="hover:text-amber-300 transition cursor-pointer text-left"
                >
                  CAG Audit Compliance Generator
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Compliance & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Government Policies
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="hover:text-amber-300 transition cursor-pointer text-left"
                >
                  Privacy Policy &amp; Data Protection
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTerms}
                  className="hover:text-amber-300 transition cursor-pointer text-left"
                >
                  Terms &amp; Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTerms}
                  className="hover:text-amber-300 transition cursor-pointer text-left"
                >
                  Hyperlinking Policy
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="hover:text-amber-300 transition cursor-pointer text-left"
                >
                  Copyright &amp; Security Policy
                </button>
              </li>
              <li>
                <div className="pt-2 flex flex-col gap-1 text-slate-300 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-[#FF671F]" />
                    <span>support-dosje@nic.in</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-[#046A38]" />
                    <span>Toll-Free: 1800-11-2026</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Official NIC & Ministry Disclaimer */}
        <div className="mt-12 pt-6 border-t border-white/10 text-xs text-slate-300 space-y-3">
          <p className="leading-relaxed">
            <span className="font-bold text-white">Disclaimer:</span> Website Content Managed by{' '}
            <strong className="text-white">Department of Social Justice and Empowerment, Ministry of Social Justice and Empowerment, Government of India</strong>. Designed, Developed and Hosted by{' '}
            <strong className="text-white">National Informatics Centre (NIC)</strong>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-[11px] text-slate-300">
            <div className="flex flex-wrap items-center gap-2">
              <span>&copy; {new Date().getFullYear()} Government of India. All rights reserved.</span>
              <span>•</span>
              <span className="text-amber-300 font-semibold">GIGW 3.0 Compliant</span>
              <span>•</span>
              <span>Last Reviewed: 07 September 2026</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                STQC &amp; Cert-In Certified
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-amber-200">Digital India Initiative</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
