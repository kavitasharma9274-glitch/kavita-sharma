import React from 'react';
import { Heart, Infinity as InfinityIcon } from 'lucide-react';

interface WaxSealProps {
  style?: 'heart' | 'monogram' | 'rose' | 'infinity';
  recipientName?: string;
  senderName?: string;
  color?: string; // hex color
  size?: number; // diameter in px
  onClick?: () => void;
  isBroken?: boolean;
  pulse?: boolean;
}

export const WaxSeal: React.FC<WaxSealProps> = ({
  style = 'heart',
  recipientName = 'E',
  senderName = 'J',
  color = '#8C2B2B',
  size = 72,
  onClick,
  isBroken = false,
  pulse = false,
}) => {
  const rInitial = recipientName.trim().charAt(0).toUpperCase() || 'E';
  const sInitial = senderName.trim().charAt(0).toUpperCase() || 'J';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      className={`relative rounded-full select-none cursor-pointer group focus:outline-hidden transition-all duration-400 ease-cinematic active:scale-95 ${
        pulse ? 'animate-seal-pulse hover:scale-105' : 'hover:scale-105'
      } ${isBroken ? 'opacity-0 scale-125 pointer-events-none' : 'opacity-100'}`}
      title={onClick ? 'Click to break the wax seal and open the letter' : 'Wax seal'}
    >
      {/* Outer irregular wax puddle edge */}
      <div
        className="absolute inset-0 rounded-full shadow-lg"
        style={{
          background: `radial-gradient(circle at 35% 35%, #FF7F7F, ${color} 65%, #380B0B 100%)`,
          boxShadow: `0 8px 18px rgba(0,0,0,0.35), inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -3px 6px rgba(0,0,0,0.5)`,
        }}
      />

      {/* Wax drip details */}
      <div
        className="absolute -top-1 left-2 w-3 h-3 rounded-full opacity-80"
        style={{ backgroundColor: color }}
      />
      <div
        className="absolute -bottom-1.5 right-4 w-4 h-4 rounded-full opacity-70"
        style={{ backgroundColor: color }}
      />
      <div
        className="absolute top-1/2 -left-1.5 w-3.5 h-3.5 rounded-full opacity-60"
        style={{ backgroundColor: color }}
      />

      {/* Inner embossed stamp circle */}
      <div
        className="absolute inset-2 rounded-full flex items-center justify-center border border-white/20"
        style={{
          background: `radial-gradient(circle at 40% 40%, rgba(255,255,255,0.18), rgba(0,0,0,0.4))`,
          boxShadow: `inset 0 3px 6px rgba(0,0,0,0.6), 0 1px 2px rgba(255,255,255,0.25)`,
        }}
      >
        {/* Emblem */}
        {style === 'heart' && (
          <Heart
            className="text-rose-100/90 drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)] group-hover:scale-110 transition-transform"
            size={size * 0.42}
            fill="currentColor"
          />
        )}

        {style === 'monogram' && (
          <span
            className="font-serif-luxury font-bold text-rose-100/90 tracking-tighter drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform"
            style={{ fontSize: `${size * 0.32}px` }}
          >
            {rInitial}&{sInitial}
          </span>
        )}

        {style === 'infinity' && (
          <InfinityIcon
            className="text-rose-100/90 drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)] group-hover:scale-110 transition-transform"
            size={size * 0.44}
          />
        )}

        {style === 'rose' && (
          <svg
            width={size * 0.45}
            height={size * 0.45}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-rose-100/90 drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)] group-hover:scale-110 transition-transform"
          >
            <path d="M12 21a9 9 0 0 0 9-9c0-4.97-4.03-9-9-9s-9 4.03-9 9a9 9 0 0 0 9 9Z" />
            <path d="M12 7c2 1 3 3 2 5-1 2-3 2-4 1s-1-3 0-4c1-1 2-2 2-2Z" />
            <path d="M12 12c-2 2-3 4-2 6" />
          </svg>
        )}
      </div>
    </button>
  );
};
