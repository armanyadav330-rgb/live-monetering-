import React from 'react';

interface Robot3DAvatarProps {
  className?: string;
  size?: number;
}

export const Robot3DAvatar: React.FC<Robot3DAvatarProps> = ({
  className = '',
  size = 48,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full drop-shadow-[0_8px_16px_rgba(30,58,138,0.45)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* 3D Head Ceramic Material */}
          <radialGradient
            id="headCeramic"
            cx="38%"
            cy="32%"
            r="65%"
            fx="35%"
            fy="30%"
          >
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#F1F5F9" />
            <stop offset="65%" stopColor="#CBD5E1" />
            <stop offset="90%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#334155" />
          </radialGradient>

          {/* 3D Visor Dark Glass */}
          <radialGradient
            id="visorGlass"
            cx="45%"
            cy="35%"
            r="60%"
            fx="40%"
            fy="30%"
          >
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="60%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>

          {/* 3D Specular Visor Reflection */}
          <linearGradient id="visorReflection" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.0" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.25" />
          </linearGradient>

          {/* Glowing Eyes Glow */}
          <filter id="eyeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Metallic Gold Trim */}
          <linearGradient id="metallicGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="30%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          {/* 3D Metallic Blue Armor */}
          <radialGradient id="bodyBlue" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="40%" stopColor="#2563EB" />
            <stop offset="80%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#0F172A" />
          </radialGradient>

          {/* Soft 3D Ambient Drop Shadow */}
          <radialGradient id="bottomShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 3D Ground Floating Shadow */}
        <ellipse cx="60" cy="112" rx="28" ry="6" fill="url(#bottomShadow)" />

        {/* Antenna Stalk & Glowing 3D Orb */}
        <rect
          x="58"
          y="8"
          width="4"
          height="14"
          rx="2"
          fill="url(#metallicGold)"
        />
        {/* Antenna Orb Glow */}
        <circle cx="60" cy="8" r="6" fill="#38BDF8" filter="url(#eyeGlow)" />
        <circle cx="58.5" cy="6.5" r="2" fill="#FFFFFF" />

        {/* Left 3D Metallic Ear Muff / Headphone */}
        <ellipse cx="25" cy="50" rx="6" ry="11" fill="url(#metallicGold)" />
        <ellipse cx="23" cy="50" rx="3.5" ry="8" fill="#1E293B" />
        <circle cx="23" cy="50" r="2" fill="#38BDF8" />

        {/* Right 3D Metallic Ear Muff / Headphone */}
        <ellipse cx="95" cy="50" rx="6" ry="11" fill="url(#metallicGold)" />
        <ellipse cx="97" cy="50" rx="3.5" ry="8" fill="#1E293B" />
        <circle cx="97" cy="50" r="2" fill="#38BDF8" />

        {/* 3D Robot Torso / Collar */}
        <path
          d="M38 86 C38 78, 82 78, 82 86 L88 106 C88 109, 32 109, 32 106 Z"
          fill="url(#bodyBlue)"
        />
        {/* Torso Gold Emblem */}
        <path
          d="M60 84 L64 92 L56 92 Z"
          fill="url(#metallicGold)"
        />

        {/* 3D Head Ceramic Shell */}
        <rect
          x="28"
          y="18"
          width="64"
          height="62"
          rx="24"
          fill="url(#headCeramic)"
          stroke="#E2E8F0"
          strokeWidth="1.2"
        />

        {/* 3D Head Top Specular Highlight */}
        <ellipse
          cx="48"
          cy="26"
          rx="16"
          ry="6"
          fill="#FFFFFF"
          fillOpacity="0.65"
        />

        {/* 3D Visor Recessed Frame */}
        <rect
          x="34"
          y="28"
          width="52"
          height="42"
          rx="16"
          fill="#020617"
          stroke="#475569"
          strokeWidth="1"
        />

        {/* 3D Curved Visor Glass Screen */}
        <rect
          x="35.5"
          y="29.5"
          width="49"
          height="39"
          rx="14.5"
          fill="url(#visorGlass)"
        />

        {/* Visor Glass Reflection Arc */}
        <path
          d="M37 32 C48 30, 72 30, 83 33 C81 40, 70 42, 39 37 Z"
          fill="url(#visorReflection)"
        />

        {/* Glowing 3D Cyan Eyes */}
        <g filter="url(#eyeGlow)">
          {/* Left Eye */}
          <circle cx="49" cy="48" r="4.5" fill="#38BDF8" />
          <circle cx="47.5" cy="46.5" r="1.5" fill="#FFFFFF" />

          {/* Right Eye */}
          <circle cx="71" cy="48" r="4.5" fill="#38BDF8" />
          <circle cx="69.5" cy="46.5" r="1.5" fill="#FFFFFF" />

          {/* Cute Friendly Glowing Smile Arc */}
          <path
            d="M55 57 Q60 61 65 57"
            stroke="#38BDF8"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
};
