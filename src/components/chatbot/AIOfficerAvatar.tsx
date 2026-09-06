import React, { useEffect, useState } from 'react';
import { Shield, Sparkles, Volume2, Mic } from 'lucide-react';

interface AIOfficerAvatarProps {
  isSpeaking?: boolean;
  isListening?: boolean;
  currentWord?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  officerName?: string;
  officerRole?: string;
}

export const AIOfficerAvatar: React.FC<AIOfficerAvatarProps> = ({
  isSpeaking = false,
  isListening = false,
  currentWord = '',
  size = 'md',
  officerName = 'Dr. Aditi Verma, IAS',
  officerRole = 'Senior Grievance Resolution & Inspection Officer',
}) => {
  const [blink, setBlink] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);

  // Natural blinking interval
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 160);
    }, 3800);
    return () => clearInterval(blinkInterval);
  }, []);

  // Lip-sync animation when speaking
  useEffect(() => {
    if (!isSpeaking) {
      setMouthOpen(false);
      return;
    }
    const talkInterval = setInterval(() => {
      setMouthOpen((prev) => !prev);
    }, 120);
    return () => clearInterval(talkInterval);
  }, [isSpeaking]);

  const sizeStyles = {
    sm: { container: 'w-16 h-16', badge: 'text-[9px] px-1.5 py-0.5' },
    md: { container: 'w-24 h-24', badge: 'text-xs px-2 py-0.5' },
    lg: { container: 'w-36 h-36', badge: 'text-xs px-2.5 py-1' },
    xl: { container: 'w-48 h-48 sm:w-56 sm:h-56', badge: 'text-sm px-3 py-1' },
  }[size];

  return (
    <div className="flex flex-col items-center justify-center text-center select-none">
      {/* Outer Glow & Ripples when Speaking or Listening */}
      <div className="relative flex items-center justify-center">
        {isSpeaking && (
          <>
            <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
            <div className="absolute -inset-3 rounded-full border border-emerald-500/40 animate-pulse" />
          </>
        )}
        {isListening && !isSpeaking && (
          <>
            <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping" />
            <div className="absolute -inset-3 rounded-full border border-blue-500/40 animate-pulse" />
          </>
        )}

        {/* SVG Officer Graphic with Realistic Features */}
        <div
          className={`${sizeStyles.container} rounded-full overflow-hidden shadow-xl border-2 transition-all duration-300 ${
            isSpeaking
              ? 'border-emerald-500 shadow-emerald-500/30'
              : isListening
              ? 'border-blue-500 shadow-blue-500/30'
              : 'border-amber-500/60 shadow-black/20'
          } bg-gradient-to-b from-slate-800 to-slate-950 flex items-center justify-center relative`}
        >
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full object-cover"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Background gradient */}
              <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              {/* Officer Uniform Gradient - Navy Blue / DoSJE Formal */}
              <linearGradient id="uniformGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              {/* Gold Ribbon / Epaulettes */}
              <linearGradient id="goldRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              {/* Skin Tone Gradient */}
              <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fed7aa" />
                <stop offset="100%" stopColor="#fdba74" />
              </linearGradient>
            </defs>

            {/* Backdrop */}
            <rect width="200" height="200" fill="url(#bgGrad)" />

            {/* Subtle Government Crest Silhouette */}
            <circle cx="100" cy="100" r="85" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />

            {/* Shoulders & Uniform */}
            <path
              d="M 25 200 C 25 155, 60 145, 100 145 C 140 145, 175 155, 175 200 Z"
              fill="url(#uniformGrad)"
            />

            {/* Officer Lapels & Collar */}
            <path d="M 80 145 L 100 178 L 120 145 Z" fill="#ffffff" />
            <path d="M 92 145 L 100 178 L 108 145 Z" fill="#b91c1c" />
            <path d="M 68 148 L 84 175 L 80 195 L 45 185 Z" fill="#172554" />
            <path d="M 132 148 L 116 175 L 120 195 L 155 185 Z" fill="#172554" />

            {/* National Insignia Ribbon Pin */}
            <rect x="52" y="165" width="18" height="6" rx="2" fill="url(#goldRibbon)" />
            <circle cx="61" cy="168" r="1.5" fill="#1e3a8a" />

            {/* Neck */}
            <rect x="88" y="115" width="24" height="32" rx="4" fill="url(#skinGrad)" />

            {/* Head / Face */}
            <ellipse cx="100" cy="92" rx="38" ry="44" fill="url(#skinGrad)" />

            {/* Hair Style */}
            <path
              d="M 62 85 C 60 48, 140 48, 138 85 C 138 98, 142 110, 134 116 C 128 85, 122 72, 100 72 C 78 72, 72 85, 66 116 C 58 110, 62 98, 62 85 Z"
              fill="#1e1b4b"
            />

            {/* Eyebrows */}
            <path d="M 75 75 Q 86 71 93 75" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 107 75 Q 114 71 125 75" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />

            {/* Eyes (With blink state) */}
            {blink ? (
              <>
                <path d="M 76 88 Q 84 92 92 88" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 108 88 Q 116 92 124 88" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
              </>
            ) : (
              <>
                <ellipse cx="84" cy="87" rx="6.5" ry="4.5" fill="#ffffff" />
                <circle cx="84" cy="87" r="3.2" fill="#312e81" />
                <circle cx="85" cy="86" r="1" fill="#ffffff" />

                <ellipse cx="116" cy="87" rx="6.5" ry="4.5" fill="#ffffff" />
                <circle cx="116" cy="87" r="3.2" fill="#312e81" />
                <circle cx="117" cy="86" r="1" fill="#ffffff" />
              </>
            )}

            {/* Nose */}
            <path d="M 99 87 L 97 101 Q 100 104 103 101" fill="none" stroke="#ea580c" strokeWidth="1.8" strokeLinecap="round" opacity="0.75" />

            {/* Mouth (Lip sync when talking) */}
            {isSpeaking && mouthOpen ? (
              <ellipse cx="100" cy="116" rx="9" ry="5.5" fill="#881337" stroke="#fb7185" strokeWidth="1" />
            ) : (
              <path d="M 91 116 Q 100 120 109 116" fill="none" stroke="#be123c" strokeWidth="2.5" strokeLinecap="round" />
            )}

            {/* Professional Eyeglasses */}
            <rect x="71" y="80" width="24" height="15" rx="3" fill="none" stroke="#475569" strokeWidth="1.6" />
            <rect x="105" y="80" width="24" height="15" rx="3" fill="none" stroke="#475569" strokeWidth="1.6" />
            <line x1="95" y1="87" x2="105" y2="87" stroke="#475569" strokeWidth="1.6" />
          </svg>

          {/* Micro Status Chip */}
          <div className="absolute bottom-1 right-1 flex items-center justify-center">
            {isSpeaking ? (
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            ) : isListening ? (
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
            ) : (
              <span className="inline-flex rounded-full h-2.5 w-2.5 bg-slate-400"></span>
            )}
          </div>
        </div>
      </div>

      {/* Officer Title & Status Tag */}
      {size !== 'sm' && (
        <div className="mt-2.5 flex flex-col items-center">
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-slate-100 text-sm tracking-wide">{officerName}</span>
            <Shield className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="text-[11px] text-slate-400 max-w-[200px] truncate">{officerRole}</span>

          {/* Live Cadence Badge */}
          <div className="mt-1.5 flex items-center space-x-1">
            {isSpeaking ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Volume2 className="w-3 h-3 mr-1 animate-pulse" />
                Speaking Orally
              </span>
            ) : isListening ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                <Mic className="w-3 h-3 mr-1 animate-pulse" />
                Listening to You...
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                <Sparkles className="w-3 h-3 mr-1 text-amber-400" />
                Ready to Help
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
