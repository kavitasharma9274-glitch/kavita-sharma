import React, { useMemo } from 'react';

interface PetalOverlayProps {
  type?: 'petals' | 'hearts' | 'gold_dust';
  density?: number;
}

export const PetalOverlay: React.FC<PetalOverlayProps> = ({
  type = 'petals',
  density = 16,
}) => {
  const particles = useMemo(() => {
    return Array.from({ length: density }).map((_, i) => {
      const left = Math.random() * 100;
      const delay = Math.random() * 9;
      const dur = 9.5 + Math.random() * 7;
      const tx = (Math.random() - 0.5) * 110;
      const rot = 180 + Math.random() * 360;
      const size = 12 + Math.random() * 14;
      const opacity = 0.45 + Math.random() * 0.45;
      return { id: i, left, delay, dur, tx, rot, size, opacity };
    });
  }, [density]);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-20"
      aria-hidden="true"
    >
      {/* Ambient Romantic Candlelight Glow Orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-rose-600/10 blur-3xl animate-candle-glow pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-red-600/10 blur-3xl animate-candle-glow pointer-events-none" style={{ animationDelay: '2.5s' }} />

      {particles.map((p) => {
        const petalColor = p.id % 3 === 0 ? '#E11D48' : p.id % 3 === 1 ? '#BE123C' : '#F43F5E';
        const innerColor = p.id % 2 === 0 ? '#FDA4AF' : '#FFE4E6';

        return (
          <div
            key={p.id}
            className="absolute -top-6 animate-petal"
            style={
              {
                left: `${p.left}%`,
                '--delay': `${p.delay}s`,
                '--dur': `${p.dur}s`,
                '--tx': `${p.tx}px`,
                '--rot': `${p.rot}deg`,
                opacity: p.opacity,
              } as React.CSSProperties
            }
          >
            {type === 'petals' && (
              <svg
                width={p.size}
                height={p.size * 1.3}
                viewBox="0 0 30 40"
                fill="none"
                className="transform rotate-12 drop-shadow-md"
              >
                <path
                  d="M15 0 C25 8 30 22 24 34 C18 42 7 38 3 28 C-2 18 6 5 15 0 Z"
                  fill={petalColor}
                  fillOpacity="0.9"
                />
                <path
                  d="M15 4 C21 11 23 23 18 31 C13 37 6 33 5 26 C4 18 9 9 15 4 Z"
                  fill={innerColor}
                  fillOpacity="0.45"
                />
              </svg>
            )}

            {type === 'hearts' && (
              <svg
                width={p.size}
                height={p.size}
                viewBox="0 0 24 24"
                fill={petalColor}
                className="drop-shadow-sm"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            )}

            {type === 'gold_dust' && (
              <div
                style={{
                  width: `${p.size * 0.45}px`,
                  height: `${p.size * 0.45}px`,
                }}
                className="rounded-full bg-rose-400 shadow-[0_0_10px_#E11D48]"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
