import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { ThemeId } from '../types';
import { romanticAudio } from '../utils/audioPlayer';

interface HeartParticle {
  id: number;
  emoji: string;
  tx: number; // horizontal displacement
  rot: number; // rotation in deg
  size: number; // px size
  scale: number; // final scale
  dur: number; // duration in seconds
}

interface HeartReactButtonProps {
  theme: ThemeId;
  recipientName?: string;
}

const HEART_EMOJIS = ['❤️', '💖', '💕', '💓', '💗', '✨', '🌹'];
const STORAGE_KEY = 'lovepaper_reactions_count';

export const HeartReactButton: React.FC<HeartReactButtonProps> = ({
  theme,
  recipientName = 'Her',
}) => {
  const [count, setCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? parseInt(saved, 10) || 7 : 7;
    } catch {
      return 7;
    }
  });

  const [particles, setParticles] = useState<HeartParticle[]>([]);
  const [isBouncing, setIsBouncing] = useState(false);
  const particleIdRef = useRef(0);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, count.toString());
    } catch {
      // ignore
    }
  }, [count]);

  const handleReact = () => {
    // 1. Increment reaction count
    setCount((prev) => prev + 1);

    // 2. Play romantic sparkle chime
    romanticAudio.playHeartChime();

    // 3. Trigger button bounce
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 350);

    // 4. Spawn 6-8 upward drifting heart emojis
    const newCount = 6 + Math.floor(Math.random() * 3);
    const newParticles: HeartParticle[] = [];

    for (let i = 0; i < newCount; i++) {
      const id = ++particleIdRef.current;
      const emoji = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
      // Disperse horizontally around the button
      const tx = (Math.random() - 0.5) * 160;
      const rot = (Math.random() - 0.5) * 45;
      const size = 18 + Math.random() * 14;
      const scale = 0.8 + Math.random() * 0.5;
      const dur = 2.4 + Math.random() * 1.0;

      newParticles.push({ id, emoji, tx, rot, size, scale, dur });
    }

    setParticles((prev) => [...prev, ...newParticles]);

    // Automatically clean up spawned particles after animation finishes
    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.some((np) => np.id === p.id))
      );
    }, 3800);
  };

  const themeStyles = {
    romantic:
      'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white border-rose-400/50 shadow-rose-950/60 shadow-xl ring-2 ring-rose-400/30',
    luxurious:
      'bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-amber-50 border-amber-300/60 shadow-amber-950/40 shadow-xl ring-2 ring-amber-300/30',
    minimalist:
      'bg-stone-900 hover:bg-stone-800 text-white border-stone-700 shadow-stone-900/30 shadow-lg',
  }[theme];

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none no-print">
      {/* Upward Drifting Heart Emojis Container */}
      <div className="absolute bottom-12 right-4 pointer-events-none w-0 h-0 overflow-visible">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute bottom-0 right-0 animate-drift-heart flex items-center justify-center filter drop-shadow-md"
            style={
              {
                '--tx': `${p.tx}px`,
                '--rot': `${p.rot}deg`,
                '--s': p.scale,
                '--dur': `${p.dur}s`,
                fontSize: `${p.size}px`,
              } as React.CSSProperties
            }
          >
            {p.emoji}
          </div>
        ))}
      </div>

      {/* Floating React Button */}
      <button
        type="button"
        onClick={handleReact}
        className={`group relative flex items-center gap-2.5 px-4 py-2.5 rounded-full border backdrop-blur-md transition-all duration-300 ease-cinematic cursor-pointer active:scale-90 ${
          isBouncing ? 'scale-110' : 'hover:scale-105'
        } ${themeStyles}`}
        title={`Loved by ${recipientName}. Tap to release hearts!`}
      >
        {/* Subtle expanding ping wave on tap */}
        {isBouncing && (
          <span className="absolute inset-0 rounded-full animate-ping bg-rose-400/40 pointer-events-none" />
        )}

        <div className="relative">
          <Heart
            size={18}
            className={`transition-transform duration-300 ${
              isBouncing ? 'scale-125' : 'group-hover:scale-115'
            } ${theme === 'romantic' ? 'fill-rose-100 text-rose-100' : 'fill-current'}`}
          />
        </div>

        <div className="flex items-center gap-1.5 font-sans">
          <span className="text-xs font-bold tracking-tight tabular-nums">
            {count}
          </span>
          <span className="text-[11px] font-medium opacity-90 hidden sm:inline">
            Love
          </span>
        </div>

        <Sparkles
          size={13}
          className="opacity-70 group-hover:opacity-100 transition-opacity"
        />
      </button>
    </div>
  );
};
