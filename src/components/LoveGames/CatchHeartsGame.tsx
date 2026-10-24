import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
import { ThemeId } from '../../types';
import { romanticAudio } from '../../utils/audioPlayer';

interface HeartTarget {
  id: number;
  compliment: string;
  x: number;
  delay: number;
  isCaught: boolean;
  emoji: string;
}

interface CatchHeartsGameProps {
  theme: ThemeId;
  onComplete: () => void;
  isAllCompleted?: boolean;
  completedCount?: number;
  nextGameName?: string;
  onNextGame?: () => void;
}

const COMPLIMENTS = [
  { text: 'Your infectious laugh!', emoji: '💖' },
  { text: 'The way you hold my hand!', emoji: '✨' },
  { text: 'Your gentle, caring soul!', emoji: '🌹' },
  { text: 'Your sleepy morning smile!', emoji: '☕' },
  { text: 'Being my favorite human!', emoji: '❤️' },
];

export const CatchHeartsGame: React.FC<CatchHeartsGameProps> = ({
  theme,
  onComplete,
  isAllCompleted = false,
  completedCount = 4,
  nextGameName = 'Fill The Heart',
  onNextGame,
}) => {
  const [hearts, setHearts] = useState<HeartTarget[]>([]);
  const [caughtCount, setCaughtCount] = useState(0);
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  const initGame = () => {
    setCaughtCount(0);
    setActiveMessage(null);
    const targets: HeartTarget[] = COMPLIMENTS.map((item, index) => ({
      id: index,
      compliment: item.text,
      emoji: item.emoji,
      x: 15 + index * 18, // distributed horizontally
      delay: index * 0.4,
      isCaught: false,
    }));
    setHearts(targets);
  };

  useEffect(() => {
    initGame();
  }, []);

  const catchHeart = (id: number) => {
    const target = hearts.find((h) => h.id === id);
    if (!target || target.isCaught) return;

    romanticAudio.playHeartChime();

    setHearts((prev) =>
      prev.map((h) => (h.id === id ? { ...h, isCaught: true } : h))
    );

    const newCount = caughtCount + 1;
    setCaughtCount(newCount);
    setActiveMessage(target.compliment);

    if (newCount === COMPLIMENTS.length) {
      onComplete();
      romanticAudio.playSealBreakSound();
      try {
        confetti({
          particleCount: 50,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#E11D48', '#FDA4AF', '#FFE4E6', '#F59E0B'],
        });
      } catch {
        // ignore
      }
    }
  };

  const isCompleted = caughtCount === COMPLIMENTS.length;

  return (
    <div className="flex flex-col items-center max-w-md w-full mx-auto select-none">
      <div className="text-center mb-4">
        <span className="text-[11px] font-sans uppercase tracking-widest font-bold text-rose-300 block mb-1">
          Mini-Game 3: Catch The Love
        </span>
        <h3 className="text-2xl font-serif-editorial font-bold text-white tracking-tight">
          Catch 5 Floating Hearts
        </h3>
        <p className="text-xs text-rose-200/80 mt-1">
          Tap each drifting heart to catch a reason why you are adored.
        </p>
      </div>

      {/* Love Meter Progress Bar */}
      <div className="w-full bg-rose-950/60 p-3 rounded-xl border border-rose-900/60 mb-4">
        <div className="flex items-center justify-between text-xs font-semibold text-rose-200 mb-1.5">
          <span>Love Meter</span>
          <span>{Math.round((caughtCount / COMPLIMENTS.length) * 100)}%</span>
        </div>
        <div className="w-full h-3 rounded-full bg-rose-950 border border-rose-800/80 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-500 ease-out"
            style={{ width: `${(caughtCount / COMPLIMENTS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Sweet Toast Callout */}
      {activeMessage && (
        <div className="mb-3 px-4 py-1.5 rounded-full bg-rose-900/60 border border-rose-500/60 text-rose-100 text-xs font-serif italic flex items-center gap-2 animate-in fade-in">
          <Sparkles size={14} className="text-rose-300" />
          <span>"{activeMessage}"</span>
        </div>
      )}

      {/* Interactive Floating Hearts Arena */}
      <div className="relative w-full h-64 rounded-2xl border border-rose-500/40 bg-gradient-to-b from-[#2B050E] to-[#170308] overflow-hidden mb-4 shadow-inner flex items-center justify-around px-4">
        {hearts.map((h) => {
          return (
            <div
              key={h.id}
              onClick={() => catchHeart(h.id)}
              className={`cursor-pointer transform transition-all duration-400 flex flex-col items-center group ${
                h.isCaught
                  ? 'scale-0 opacity-0 pointer-events-none'
                  : 'hover:scale-125 animate-bounce'
              }`}
              style={{
                animationDuration: `${2.2 + (h.id % 3) * 0.4}s`,
                animationDelay: `${h.delay}s`,
              }}
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-500 to-rose-700 shadow-[0_0_15px_rgba(225,29,72,0.6)] flex items-center justify-center text-white border border-rose-300/40 group-hover:from-rose-400 group-hover:to-rose-600 transition-colors">
                <span className="text-2xl">{h.emoji}</span>
              </div>
              <span className="text-[10px] text-rose-200/80 mt-1 font-sans opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Tap me!
              </span>
            </div>
          );
        })}

        {isCompleted && (
          <div className="absolute inset-0 bg-rose-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center animate-in zoom-in-95">
            <span className="text-4xl mb-2">🎉💖</span>
            <h4 className="font-serif-editorial text-xl font-bold text-white">
              All Hearts Caught!
            </h4>
            <p className="text-xs text-rose-200 mt-1">
              Your love meter is 100% full. Your letter is ready.
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between w-full pt-1">
        <button
          onClick={initGame}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-rose-200 hover:text-white hover:bg-rose-950/60 transition-colors"
        >
          <RefreshCw size={13} />
          <span>Reset Hearts</span>
        </button>

        {isCompleted ? (
          isAllCompleted ? (
            <button
              onClick={onComplete}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-rose-600 to-rose-500 hover:from-emerald-500 hover:to-rose-400 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-950/50 transition-all hover:scale-105 animate-pulse"
            >
              <span>Read Your Letter</span>
              <ArrowRight size={14} />
            </button>
          ) : onNextGame ? (
            <button
              onClick={onNextGame}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-950/50 transition-all hover:scale-105"
            >
              <span>Play Next: {nextGameName}</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <span className="text-xs text-rose-300 font-medium">All Hearts Caught!</span>
          )
        ) : (
          <span className="text-xs font-sans text-rose-300/80">
            {caughtCount} of {COMPLIMENTS.length} caught
          </span>
        )}
      </div>
    </div>
  );
};
