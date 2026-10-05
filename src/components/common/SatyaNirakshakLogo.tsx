import React from 'react';

interface SatyaNirakshakLogoProps {
  className?: string;
  size?: number;
  variant?: 'icon' | 'full' | 'horizontal';
  showText?: boolean;
  textColor?: string;
}

export const SatyaNirakshakLogo: React.FC<SatyaNirakshakLogoProps> = ({
  className = '',
  size = 40,
  variant = 'icon',
  showText,
  textColor,
}) => {
  // Determine text visibility
  const isHorizontal = variant === 'horizontal';
  const isFull = variant === 'full' || showText === true;
  const isIconOnly = variant === 'icon' && !showText;

  // The Crest SVG graphic (Shield, Radar Arcs, Network Nodes, Eye & Lens)
  const CrestGraphic = (
    <svg
      viewBox="0 0 400 300"
      width={size}
      height={size}
      className={`shrink-0 select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Satya Nirakshak Official Emblem"
    >
      <defs>
        <linearGradient id="snNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#144376" />
          <stop offset="100%" stopColor="#0B2545" />
        </linearGradient>

        <linearGradient id="snGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>

        <linearGradient id="snShieldLeft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0E3867" />
          <stop offset="100%" stopColor="#082342" />
        </linearGradient>

        <linearGradient id="snShieldRight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1C5289" />
          <stop offset="100%" stopColor="#113D6B" />
        </linearGradient>
      </defs>

      {/* 1. LEFT RADAR WAVES */}
      <path
        d="M 125 105 A 110 110 0 0 0 125 215"
        stroke="#124376"
        strokeWidth="8.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 140 118 A 95 95 0 0 0 140 202"
        stroke="#17508B"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 155 132 A 80 80 0 0 0 155 188"
        stroke="#1D5D9F"
        strokeWidth="9.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* 2. RIGHT RADAR WAVES */}
      <path
        d="M 275 105 A 110 110 0 0 1 275 215"
        stroke="#124376"
        strokeWidth="8.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 260 118 A 95 95 0 0 1 260 202"
        stroke="#17508B"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 245 132 A 80 80 0 0 1 245 188"
        stroke="#1D5D9F"
        strokeWidth="9.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* 3. TOP CONSTELLATION / NETWORK GRAPH NODES */}
      <path
        d="M 160 100 A 75 75 0 0 1 240 100"
        stroke="#144376"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      <line x1="172" y1="120" x2="200" y2="92" stroke="#1E5C96" strokeWidth="3" />
      <line x1="200" y1="92" x2="228" y2="120" stroke="#1E5C96" strokeWidth="3" />
      <line x1="172" y1="120" x2="228" y2="120" stroke="#1E5C96" strokeWidth="2.5" />
      <line x1="150" y1="135" x2="172" y2="120" stroke="#1E5C96" strokeWidth="3" />
      <line x1="228" y1="120" x2="250" y2="135" stroke="#1E5C96" strokeWidth="3" />
      <line x1="172" y1="120" x2="200" y2="132" stroke="#1E5C96" strokeWidth="2" />
      <line x1="228" y1="120" x2="200" y2="132" stroke="#1E5C96" strokeWidth="2" />

      {/* Network Node Dots */}
      <circle cx="200" cy="92" r="5" fill="#144376" />
      <circle cx="172" cy="120" r="4.5" fill="#144376" />
      <circle cx="228" cy="120" r="4.5" fill="#10B981" />
      <circle cx="150" cy="135" r="4" fill="#144376" />
      <circle cx="250" cy="135" r="4" fill="#144376" />

      {/* 4. SHIELD BOTTOM CREST */}
      <path
        d="M 148 185 C 160 215, 185 240, 200 252 L 200 215 C 185 205, 165 195, 148 185 Z"
        fill="url(#snShieldLeft)"
      />
      <path
        d="M 252 185 C 240 215, 215 240, 200 252 L 200 215 C 215 205, 235 195, 252 185 Z"
        fill="url(#snShieldRight)"
      />

      {/* 5. MAIN CENTRAL SURVEILLANCE EYE */}
      {/* Upper Eyelid (Navy) */}
      <path
        d="M 112 165 C 145 118, 255 118, 288 165 C 250 138, 150 138, 112 165 Z"
        fill="#0B2545"
      />

      {/* Lower Eyelid (Emerald Green) */}
      <path
        d="M 112 165 C 145 212, 255 212, 288 165 C 250 192, 150 192, 112 165 Z"
        fill="url(#snGreenGrad)"
      />

      {/* White sclera / inner background ring */}
      <ellipse cx="200" cy="165" rx="36" ry="36" fill="white" />

      {/* Iris */}
      <circle cx="200" cy="165" r="32" fill="url(#snGreenGrad)" />

      {/* Aperture ring */}
      <circle cx="200" cy="165" r="21" fill="#0B2545" />

      {/* Camera Lens Pupil */}
      <circle cx="200" cy="165" r="14" fill="#06182C" />

      {/* Lens Glare Highlight Arcs */}
      <path
        d="M 188 152 A 15 15 0 0 1 212 152"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="193" cy="159" r="2.5" fill="white" />
    </svg>
  );

  if (isIconOnly) {
    return CrestGraphic;
  }

  if (isHorizontal) {
    return (
      <div className={`inline-flex items-center gap-2.5 sm:gap-3 ${className}`}>
        {CrestGraphic}
        <div className="flex flex-col leading-none">
          <div
            className={`font-black tracking-tight text-sm sm:text-base md:text-lg ${
              textColor || 'text-[#0B2545]'
            }`}
          >
            <span>SATYA </span>
            <span className="text-[#144376]">NIRAKSHAK</span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider ${
                textColor ? 'opacity-85' : 'text-slate-600'
              }`}
            >
              LIVE MONITORING SYSTEM
            </span>
            <span
              className={`text-[8px] font-black px-1 py-0.2 rounded border uppercase ${
                textColor
                  ? 'border-white/30 text-white bg-white/10'
                  : 'border-[#0B2545]/30 text-[#0B2545] bg-[#0B2545]/5'
              }`}
            >
              NGO
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Full Vertical Stack Variant (Emblem on top + Typography below matching uploaded reference image)
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {CrestGraphic}
      <div className="mt-1 flex flex-col items-center">
        <h2
          className={`font-black text-xl sm:text-2xl tracking-wider leading-tight ${
            textColor || 'text-[#0B2545]'
          }`}
        >
          SATYA
        </h2>
        <h2
          className={`font-black text-xl sm:text-2xl tracking-normal leading-tight ${
            textColor || 'text-[#0B2545]'
          }`}
        >
          NIRAKSHAK
        </h2>
        <p
          className={`text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase mt-0.5 ${
            textColor || 'text-[#0B2545]'
          }`}
        >
          LIVE MONITORING SYSTEM
        </p>
        <div className="flex items-center justify-center gap-2 mt-1">
          <div
            className={`h-0.5 w-8 rounded-full ${
              textColor ? 'bg-current opacity-70' : 'bg-[#0B2545]'
            }`}
          />
          <span
            className={`text-xs font-black tracking-widest ${
              textColor || 'text-[#0B2545]'
            }`}
          >
            NGO
          </span>
          <div
            className={`h-0.5 w-8 rounded-full ${
              textColor ? 'bg-current opacity-70' : 'bg-[#0B2545]'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
