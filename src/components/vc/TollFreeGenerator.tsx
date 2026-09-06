import React, { useState } from 'react';
import {
  Phone,
  PhoneCall,
  Video,
  Sparkles,
  Copy,
  Check,
  Share2,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  QrCode,
  RefreshCw,
  Clock,
  Building2,
  Lock,
} from 'lucide-react';
import { Project } from '../../types';

interface TollFreeGeneratorProps {
  selectedProject: Project | null;
  participantName: string;
  participantPhone: string;
  onConnectVoiceCall: (tollFreeNumber: string, pin: string) => void;
  onConnectVideoCall: (tollFreeNumber: string, pin: string) => void;
}

interface GeneratedTollFree {
  tollFreeNumber: string;
  pin: string;
  validTill: string;
  bridgeStatus: 'ACTIVE' | 'BUSY' | 'STANDBY';
  videoBridgeUrl: string;
}

export const TollFreeGenerator: React.FC<TollFreeGeneratorProps> = ({
  selectedProject,
  participantName,
  participantPhone,
  onConnectVoiceCall,
  onConnectVideoCall,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tfnPrefix, setTfnPrefix] = useState<'1800-180' | '1800-200' | '1800-11'>('1800-180');
  const [activeTfn, setActiveTfn] = useState<GeneratedTollFree>(() => generateRandomTfn('1800-180'));

  function generateRandomTfn(prefix: string): GeneratedTollFree {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    const tfn = `${prefix}-${randomSuffix}`;
    const cleanPhone = participantPhone.replace(/[^0-9]/g, '');
    const videoUrl = `https://wa.me/${cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone}?text=${encodeURIComponent(
      `[DoSJE TOLL-FREE VERIFICATION BRIDGE]\nProject: ${selectedProject?.projectName || 'Central Verification'}\nToll-Free No: ${tfn}\nDirect PIN: ${pin}\nClick link to join Video Call directly.`
    )}`;

    const date = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return {
      tollFreeNumber: tfn,
      pin,
      validTill: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Tomorrow',
      bridgeStatus: 'ACTIVE',
      videoBridgeUrl: videoUrl,
    };
  }

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setActiveTfn(generateRandomTfn(tfnPrefix));
      setIsGenerating(false);
    }, 400);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Toll Free Hero Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-5 sm:p-6 text-white relative overflow-hidden shadow-md">
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                Govt. Toll-Free IVR &amp; Video Bridge Gateway
              </span>
              <span className="text-[11px] text-emerald-400/80 font-mono">100% Free for Caller</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              Dedicated Toll-Free Number Generator
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Generate an official zero-charge Toll-Free Number (TFN) and access PIN. Field beneficiaries, NGO heads, and inspectors can dial in for voice verification and upgrade directly to a live Video Call.
            </p>
          </div>

          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition self-start md:self-auto cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Generate New Toll-Free</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Toll-Free Display Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Assigned Helpline Number
              </span>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-700 tracking-tight">
                  {activeTfn.tollFreeNumber}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  ACTIVE
                </span>
              </div>
            </div>

            {/* Prefix Selector */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <span className="text-xs text-slate-500 font-medium">Prefix:</span>
              {(['1800-180', '1800-200', '1800-11'] as const).map((prefix) => (
                <button
                  key={prefix}
                  onClick={() => {
                    setTfnPrefix(prefix);
                    setActiveTfn(generateRandomTfn(prefix));
                  }}
                  className={`px-2 py-1 rounded text-xs font-mono font-semibold border transition ${
                    tfnPrefix === prefix
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {prefix}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Metrics & Bridge Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Direct IVR PIN</div>
              <div className="text-base font-mono font-extrabold text-slate-900 mt-0.5">
                {activeTfn.pin}
              </div>
              <div className="text-[9px] text-slate-500 mt-0.5">Press on dialer</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Calling Charges</div>
              <div className="text-base font-bold text-emerald-600 mt-0.5">₹0.00 (Free)</div>
              <div className="text-[9px] text-slate-500 mt-0.5">Zero cost to caller</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Video Bridge</div>
              <div className="text-base font-bold text-indigo-600 mt-0.5">Ready</div>
              <div className="text-[9px] text-slate-500 mt-0.5">1-click upgrade</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Validity</div>
              <div className="text-xs font-semibold text-slate-700 mt-1 truncate">
                {activeTfn.validTill}
              </div>
              <div className="text-[9px] text-slate-500 mt-0.5">Auto-renews</div>
            </div>
          </div>

          {/* Action Bar: Connect Voice Call & Connect Video Call */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold text-slate-700">
              Instant Connection Actions:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Button 1: Dial Voice Call on this Toll-Free */}
              <button
                onClick={() => onConnectVoiceCall(activeTfn.tollFreeNumber, activeTfn.pin)}
                className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Dial Voice Call on Toll-Free</span>
              </button>

              {/* Button 2: Connect Video Call directly */}
              <button
                onClick={() => onConnectVideoCall(activeTfn.tollFreeNumber, activeTfn.pin)}
                className="py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
              >
                <Video className="w-4 h-4" />
                <span>Connect Video Call Directly</span>
              </button>
            </div>

            {/* External Links */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href={activeTfn.videoBridgeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>Send Video Call Link on WhatsApp</span>
              </a>

              <button
                onClick={() =>
                  handleCopy(
                    `DoSJE Toll-Free Helpline: ${activeTfn.tollFreeNumber} | PIN: ${activeTfn.pin}\nProject: ${selectedProject?.projectName || ''}\nJoin Video Call: ${window.location.origin}/#vc`,
                    'ALL'
                  )
                }
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                {copiedField === 'ALL' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied Credentials</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy All Details</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Beneficiary Pass & Field Instructions */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Field Verification Pass</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-2.5 shadow-2xs">
            <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase font-bold">
              <span>Target Project</span>
              <span className="text-emerald-700 font-mono">TFN-VERIFIED</span>
            </div>
            <div className="font-bold text-slate-900 text-xs line-clamp-2">
              {selectedProject?.projectName || 'Selected Field Project'}
            </div>
            <div className="text-[11px] text-slate-500">
              Beneficiary: <strong className="text-slate-800">{participantName}</strong>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Phone: {participantPhone}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">IVR Dial Code:</span>
              <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                *{activeTfn.pin}#
              </span>
            </div>
          </div>

          {/* How It Works List */}
          <div className="space-y-2 text-xs text-slate-600">
            <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wide">
              How The Toll-Free Video Bridge Works:
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <span>User or caller dials <strong>{activeTfn.tollFreeNumber}</strong> from any mobile or landline without charge.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <span>Interactive IVR speaks: <em>"Press 1 to switch to high-definition video call"</em>.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <span>System immediately bridges to live camera stream with geotagged audit snapshot.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
