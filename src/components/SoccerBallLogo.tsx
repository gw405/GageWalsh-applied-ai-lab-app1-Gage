import React from 'react';

interface SoccerBallLogoProps {
  className?: string;
  size?: number;
}

export const SoccerBallLogo: React.FC<SoccerBallLogoProps> = ({
  className = '',
  size = 40,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center group cursor-pointer select-none transition-transform duration-300 hover:scale-110 ${className}`}
      title="Soccer Ball Logo"
      aria-label="Soccer Ball Logo"
    >
      {/* Neon glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#ff007f] to-[#ffe600] blur-md opacity-70 group-hover:opacity-100 transition-opacity" />

      {/* Outer ring */}
      <div className="relative p-1 rounded-full bg-slate-950/90 border border-yellow-300/40 shadow-lg shadow-pink-500/30 group-hover:border-yellow-300 transition-colors">
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className="transition-transform duration-700 ease-out group-hover:rotate-45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sphere Ball Base */}
          <circle cx="50" cy="50" r="46" fill="#f8fafc" stroke="#0f172a" strokeWidth="3.5" />

          {/* Central Pentagon */}
          <polygon
            points="50,33 66,45 60,63 40,63 34,45"
            fill="#0f172a"
          />

          {/* Radiating Seams from Central Pentagon */}
          <line x1="50" y1="33" x2="50" y2="15" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="66" y1="45" x2="82" y2="38" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="60" y1="63" x2="73" y2="78" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="40" y1="63" x2="27" y2="78" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="34" y1="45" x2="18" y2="38" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />

          {/* Peripheral Edge Pentagons/Patches */}
          <polygon points="50,15 37,8 63,8" fill="#0f172a" />
          <polygon points="82,38 93,25 96,43" fill="#0f172a" />
          <polygon points="73,78 89,74 81,92" fill="#0f172a" />
          <polygon points="27,78 11,74 19,92" fill="#0f172a" />
          <polygon points="18,38 7,25 4,43" fill="#0f172a" />

          {/* Connecting Seam Stitch Lines */}
          <line x1="37" y1="8" x2="19" y2="25" stroke="#0f172a" strokeWidth="3" />
          <line x1="63" y1="8" x2="81" y2="25" stroke="#0f172a" strokeWidth="3" />
          <line x1="96" y1="43" x2="89" y2="74" stroke="#0f172a" strokeWidth="3" />
          <line x1="4" y1="43" x2="11" y2="74" stroke="#0f172a" strokeWidth="3" />
          <line x1="81" y1="92" x2="50" y2="96" stroke="#0f172a" strokeWidth="3" />
          <line x1="19" y1="92" x2="50" y2="96" stroke="#0f172a" strokeWidth="3" />

          {/* 3D Sphere Depth Shading Overlay */}
          <circle cx="50" cy="50" r="46" fill="url(#soccerBallShade)" opacity="0.35" />

          <defs>
            <radialGradient id="soccerBallShade" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
              <stop offset="55%" stopColor="#000000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.6" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};
