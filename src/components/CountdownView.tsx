import React, { useState, useEffect } from 'react';
import { Lock, Clock, Calendar, Sparkles, Unlock } from 'lucide-react';
import { LetterData } from '../types';
import { THEMES } from '../data/templates';
import confetti from 'canvas-confetti';

interface CountdownViewProps {
  letter: LetterData;
  onUnlocked: () => void;
  onBypassLock: () => void;
}

export const CountdownView: React.FC<CountdownViewProps> = ({
  letter,
  onUnlocked,
  onBypassLock,
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  const targetDate = new Date(letter.scheduledDate);
  const formattedDate = !isNaN(targetDate.getTime())
    ? targetDate.toLocaleString(undefined, {
        dateStyle: 'full',
        timeStyle: 'short',
      })
    : 'Upcoming Moment';

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const target = new Date(letter.scheduledDate).getTime();
      const diff = target - now;

      if (diff <= 0 || isNaN(diff)) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        confetti({
          particleCount: 50,
          spread: 80,
          origin: { y: 0.5 },
        });
        onUnlocked();
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [letter.scheduledDate, onUnlocked]);

  const themeConfig = THEMES[letter.theme];

  return (
    <div className="min-h-[580px] flex flex-col items-center justify-center p-6 text-center select-none">
      {/* Decorative Lock Badge */}
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-xl border animate-bounce ${
          letter.theme === 'romantic'
            ? 'bg-rose-950/80 border-rose-800 text-rose-300'
            : letter.theme === 'luxurious'
            ? 'bg-amber-100 border-amber-300 text-amber-800'
            : 'bg-stone-100 border-stone-300 text-stone-700'
        }`}
      >
        <Lock size={28} />
      </div>

      <span
        className={`text-xs uppercase tracking-widest font-sans font-bold block mb-2 ${
          letter.theme === 'romantic' ? 'text-rose-200' : 'text-stone-900'
        }`}
      >
        Scheduled Surprise Experience
      </span>

      <h1
        className={`text-3xl md:text-4xl font-serif-editorial font-bold mb-3 tracking-tight ${
          letter.theme === 'romantic' ? 'text-white drop-shadow-sm' : 'text-black font-black'
        }`}
      >
        A Sealed Surprise For {letter.recipientName || 'You'}
      </h1>

      <p
        className={`max-w-md text-sm md:text-base italic mb-8 font-semibold ${
          letter.theme === 'romantic' ? 'text-rose-100' : 'text-stone-950'
        }`}
      >
        "{letter.scheduledTeaser || 'A heartfelt letter has been sealed with love and scheduled to unlock at the exact chosen moment.'}"
      </p>

      {/* Countdown Box */}
      <div
        className={`max-w-xl w-full p-6 md:p-8 rounded-2xl border-2 shadow-2xl backdrop-blur-md mb-8 ${
          letter.theme === 'romantic'
            ? 'bg-[#1E040B]/95 border-rose-500/70 text-rose-50 shadow-rose-950/70'
            : 'bg-white border-stone-300 text-stone-950 shadow-stone-900/10'
        }`}
      >
        <div
          className={`flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider mb-6 ${
            letter.theme === 'romantic' ? 'text-rose-200' : 'text-stone-900'
          }`}
        >
          <Calendar size={15} />
          <span>Unlocks On: {formattedDate}</span>
        </div>

        <div className="grid grid-cols-4 gap-3 md:gap-4">
          <div
            className={`flex flex-col items-center p-3 rounded-xl border ${
              letter.theme === 'romantic'
                ? 'bg-rose-950/70 border-rose-800/60'
                : 'bg-stone-50 border-stone-300'
            }`}
          >
            <span
              className={`text-2xl md:text-4xl font-serif font-black tabular-nums ${
                letter.theme === 'romantic' ? 'text-white' : 'text-black'
              }`}
            >
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span
              className={`text-[10px] md:text-xs uppercase tracking-widest font-bold mt-1 ${
                letter.theme === 'romantic' ? 'text-rose-200' : 'text-stone-900'
              }`}
            >
              Days
            </span>
          </div>

          <div
            className={`flex flex-col items-center p-3 rounded-xl border ${
              letter.theme === 'romantic'
                ? 'bg-rose-950/70 border-rose-800/60'
                : 'bg-stone-50 border-stone-300'
            }`}
          >
            <span
              className={`text-2xl md:text-4xl font-serif font-black tabular-nums ${
                letter.theme === 'romantic' ? 'text-white' : 'text-black'
              }`}
            >
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span
              className={`text-[10px] md:text-xs uppercase tracking-widest font-bold mt-1 ${
                letter.theme === 'romantic' ? 'text-rose-200' : 'text-stone-900'
              }`}
            >
              Hours
            </span>
          </div>

          <div
            className={`flex flex-col items-center p-3 rounded-xl border ${
              letter.theme === 'romantic'
                ? 'bg-rose-950/70 border-rose-800/60'
                : 'bg-stone-50 border-stone-300'
            }`}
          >
            <span
              className={`text-2xl md:text-4xl font-serif font-black tabular-nums ${
                letter.theme === 'romantic' ? 'text-white' : 'text-black'
              }`}
            >
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span
              className={`text-[10px] md:text-xs uppercase tracking-widest font-bold mt-1 ${
                letter.theme === 'romantic' ? 'text-rose-200' : 'text-stone-900'
              }`}
            >
              Minutes
            </span>
          </div>

          <div
            className={`flex flex-col items-center p-3 rounded-xl border ${
              letter.theme === 'romantic'
                ? 'bg-rose-950/70 border-rose-800/60'
                : 'bg-stone-50 border-stone-300'
            }`}
          >
            <span
              className={`text-2xl md:text-4xl font-serif font-black tabular-nums ${
                letter.theme === 'romantic' ? 'text-white' : 'text-black'
              }`}
            >
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span
              className={`text-[10px] md:text-xs uppercase tracking-widest font-bold mt-1 ${
                letter.theme === 'romantic' ? 'text-rose-200' : 'text-stone-900'
              }`}
            >
              Seconds
            </span>
          </div>
        </div>

        <div
          className={`mt-6 flex items-center justify-center gap-2 text-xs font-semibold ${
            letter.theme === 'romantic' ? 'text-rose-200' : 'text-stone-900'
          }`}
        >
          <Clock size={15} />
          <span>The countdown runs in real-time. Once the timer reaches zero, the wax seal becomes breakable.</span>
        </div>
      </div>

      {/* Creator Test Bypass button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBypassLock}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-semibold transition-colors ${
            letter.theme === 'romantic'
              ? 'border-rose-500/60 bg-rose-950/80 text-rose-100 hover:bg-rose-900'
              : 'border-stone-400 bg-white text-stone-900 hover:bg-stone-100 shadow-2xs'
          }`}
          title="Sender preview to inspect how the letter opens"
        >
          <Unlock size={14} />
          <span>Preview Unlocked Now (Sender Mode)</span>
        </button>
      </div>
    </div>
  );
};
