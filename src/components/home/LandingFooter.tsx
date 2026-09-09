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
  isDarkMode: _isDarkMode,
  onNavigateSection,
  onLaunchDashboard,
  onOpenPrivacy = () => {},
  onOpenTerms = () => {},
}) => {
  return (
    <footer
      className="border-t border-slate-200 bg-white text-black relative"
    >
      {/* Official Tricolor Ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#FF671F] via-slate-300 to-[#046A38]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Column 1 & 2: Official Branding & Status */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center p-1.5 shrink-0">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                  alt="Emblem of India"
                  className="w-full h-full object-contain filter brightness-0"
                />
              </div>
              <div>
                <div className="text-[11px] font-black text-black uppercase tracking-wider">
                  भारत सरकार • Government of India
                </div>
                <div className="font-black text-base text-black tracking-tight">
                  National Live Surveillance &amp; Audit Command
                </div>
                <div className="text-[10px] text-black font-semibold">
                  Ministry of Social Justice and Empowerment (DoSJE)
                </div>
              </div>
            </div>

            <p className="text-xs leading-relaxed max-w-sm text-black font-medium">
              A sovereign oversight ecosystem empowering state nodal authorities, biometric attendance validation, and real-time CCTV anomaly radar across national social care institutions.
            </p>

            {/* System Status Indicator */}
            <div className="p-3 rounded-xl border border-slate-300 bg-slate-50 max-w-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
                </span>
                <span className="text-xs font-black text-black">
                  NIC Sovereign Grid Online
                </span>
              </div>
              <span className="text-[10px] font-mono font-black text-black">
                99.99% UPTIME
              </span>
            </div>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-black">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateSection('features')}
                  className="text-black font-semibold hover:underline transition cursor-pointer text-left"
                >
                  Core Modules
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('how-it-works')}
                  className="text-black font-semibold hover:underline transition cursor-pointer text-left"
                >
                  Statutory Ingestion Pipeline
                </button>
              </li>
              <li>
                <button
                  onClick={onLaunchDashboard}
                  className="text-black hover:underline transition cursor-pointer text-left font-black"
                >
                  Live Command Preview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('status')}
                  className="text-black font-semibold hover:underline transition cursor-pointer text-left"
                >
                  Regional Cluster Status
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('pricing')}
                  className="text-black font-semibold hover:underline transition cursor-pointer text-left"
                >
                  Deployment Tiers
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Solutions & Modules */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-black">
              Statutory Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onLaunchDashboard}
                  className="text-black font-semibold hover:underline transition cursor-pointer text-left"
                >
                  CCTV RTSP Grid &amp; Pan-Tilt
                </button>
              </li>
              <li>
                <button
                  onClick={onLaunchDashboard}
                  className="text-black font-semibold hover:underline transition cursor-pointer text-left"
                >
                  Toll-Free Surprise Video Verification
                </button>
              </li>
              <li>
                <button
                  onClick={onLaunchDashboard}
                  className="text-black font-semibold hover:underline transition cursor-pointer text-left"
                >
                  Geo-Tagged Field Inspection Dossiers
                </button>
              </li>
              <li>
                <button
                  onClick={onLaunchDashboard}
                  className="text-black font-semibold hover:underline transition cursor-pointer text-left"
                >
                  Gemini AI Anomaly Scoring
                </button>
              </li>
              <li>
                <button
                  onClick={onLaunchDashboard}
                  className="text-black font-semibold hover:underline transition cursor-pointer text-left"
                >
                  CAG Audit Compliance Generator
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Compliance & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-black">
              Government Policies
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="text-black font-semibold hover:underline transition cursor-pointer text-left"
                >
                  Privacy Policy &amp; Data Protection
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTerms}
                  className="text-black font-semibold hover:underline transition cursor-pointer text-left"
                >
                  Terms &amp; Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTerms}
                  className="text-black font-semibold hover:underline transition cursor-pointer text-left"
                >
                  Hyperlinking Policy
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="text-black font-semibold hover:underline transition cursor-pointer text-left"
                >
                  Copyright &amp; Security Policy
                </button>
              </li>
              <li>
                <div className="pt-2 flex flex-col gap-1 text-black text-[11px] font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-black" />
                    <span>support-dosje@nic.in</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-black" />
                    <span>Toll-Free: 1800-11-2026</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Official NIC & Ministry Disclaimer */}
        <div className="mt-12 pt-6 border-t border-slate-200 text-xs text-black space-y-3">
          <p className="leading-relaxed">
            <span className="font-black text-black">Disclaimer:</span> Website Content Managed by{' '}
            <strong className="text-black font-black">Department of Social Justice and Empowerment, Ministry of Social Justice and Empowerment, Government of India</strong>. Designed, Developed and Hosted by{' '}
            <strong className="text-black font-black">National Informatics Centre (NIC)</strong>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-[11px] text-black font-semibold">
            <div className="flex flex-wrap items-center gap-2">
              <span>&copy; {new Date().getFullYear()} Government of India. All rights reserved.</span>
              <span>•</span>
              <span className="text-black font-black">GIGW 3.0 Compliant</span>
              <span>•</span>
              <span>Last Reviewed: 07 September 2026</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-black font-black">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                STQC &amp; Cert-In Certified
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-black font-black">Digital India Initiative</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

