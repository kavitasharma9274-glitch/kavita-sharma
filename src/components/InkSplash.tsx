import React from 'react';
import { ThemeId } from '../types';

interface InkSplashProps {
  theme?: ThemeId;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const InkSplash: React.FC<InkSplashProps> = ({
  theme = 'romantic',
  className = '',
  size = 'md',
}) => {
  // Theme color palettes for authentic ink washes
  const colors = {
    romantic: {
      primary: '#E11D48', // Vibrant cherry red
      secondary: '#BE123C', // Deep ruby cherry
      tertiary: '#FDA4AF', // Soft blush
      glow: '#F43F5E',
      opacity: 'opacity-40 dark:opacity-30',
    },
    luxurious: {
      primary: '#B45309', // Antique gold bronze
      secondary: '#D97706', // Warm amber
      tertiary: '#FDE68A', // Pale gold
      glow: '#F59E0B',
      opacity: 'opacity-35',
    },
    minimalist: {
      primary: '#44403C', // Fountain pen charcoal sepia
      secondary: '#78716C', // Warm gray ink
      tertiary: '#E7E5E4', // Soft wash
      glow: '#57534E',
      opacity: 'opacity-25',
    },
  }[theme];

  const dimensions = {
    sm: { width: 180, height: 80 },
    md: { width: 260, height: 110 },
    lg: { width: 340, height: 140 },
  }[size];

  return (
    <div
      className={`pointer-events-none select-none absolute z-0 overflow-visible transition-opacity duration-700 ease-out ${colors.opacity} ${className}`}
      aria-hidden="true"
      style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
      }}
    >
      <svg
        viewBox="0 0 340 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transform -rotate-1 scale-105"
      >
        <defs>
          <radialGradient
            id={`ink-grad-${theme}`}
            cx="48%"
            cy="52%"
            r="55%"
            fx="40%"
            fy="45%"
          >
            <stop offset="0%" stopColor={colors.primary} stopOpacity="0.85" />
            <stop offset="45%" stopColor={colors.secondary} stopOpacity="0.55" />
            <stop offset="78%" stopColor={colors.primary} stopOpacity="0.25" />
            <stop offset="100%" stopColor={colors.tertiary} stopOpacity="0" />
          </radialGradient>

          <filter id={`ink-blur-${theme}`} x="-15%" y="-15%" width="130%" height="130%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Central watercolor blot pool */}
        <path
          d="M 65,72 
             C 42,65 30,52 45,35 
             C 62,16 95,24 135,18 
             C 178,11 215,22 255,30 
             C 292,38 318,52 305,75 
             C 292,98 250,92 215,102 
             C 172,114 130,108 95,115 
             C 68,121 48,110 40,95 
             C 32,80 50,76 65,72 Z"
          fill={`url(#ink-grad-${theme})`}
          filter={`url(#ink-blur-${theme})`}
        />

        {/* Secondary organic bleeding bloom */}
        <path
          d="M 80,68 
             C 65,58 72,40 98,38 
             C 130,35 165,48 200,42 
             C 238,36 270,48 260,68 
             C 250,88 210,80 178,85 
             C 142,91 108,82 90,80 
             C 75,78 72,74 80,68 Z"
          fill={colors.secondary}
          fillOpacity="0.3"
        />

        {/* Delicate fountain pen spatter droplets */}
        <circle cx="28" cy="42" r="3.2" fill={colors.primary} fillOpacity="0.75" />
        <circle cx="18" cy="58" r="1.8" fill={colors.secondary} fillOpacity="0.6" />
        <circle cx="36" cy="24" r="2.2" fill={colors.primary} fillOpacity="0.5" />
        <circle cx="25" cy="85" r="1.5" fill={colors.secondary} fillOpacity="0.4" />

        {/* Top-right flying ink droplets */}
        <circle cx="318" cy="28" r="2.8" fill={colors.primary} fillOpacity="0.7" />
        <circle cx="332" cy="45" r="1.6" fill={colors.secondary} fillOpacity="0.55" />
        <circle cx="295" cy="18" r="2.1" fill={colors.primary} fillOpacity="0.6" />
        <circle cx="324" cy="88" r="2.4" fill={colors.primary} fillOpacity="0.65" />
        <circle cx="335" cy="72" r="1.4" fill={colors.secondary} fillOpacity="0.4" />

        {/* Tiny heart-shaped romantic ink droplet */}
        <path
          d="M 302,96 
             C 300,94 296,94 295,97 
             C 294,99 295,101 298,104 
             L 302,107 
             L 306,104 
             C 309,101 310,99 309,97 
             C 308,94 304,94 302,96 Z"
          fill={colors.primary}
          fillOpacity="0.75"
        />

        {/* Natural ink bleed wisps / tendrils */}
        <path
          d="M 120,20 Q 128,8 135,14"
          stroke={colors.primary}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeOpacity="0.5"
        />
        <path
          d="M 230,105 Q 242,122 250,115"
          stroke={colors.secondary}
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeOpacity="0.5"
        />
        <path
          d="M 52,98 Q 42,112 36,105"
          stroke={colors.primary}
          strokeWidth="1"
          strokeLinecap="round"
          strokeOpacity="0.45"
        />
      </svg>
    </div>
  );
};
