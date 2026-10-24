import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { LetterData } from '../types';
import { THEMES } from '../data/templates';
import { WaxSeal } from './WaxSeal';
import { romanticAudio } from '../utils/audioPlayer';
import { Sparkles, Heart } from 'lucide-react';

interface LetterEnvelopeProps {
  letter: LetterData;
  onOpened: () => void;
  isUnlocked?: boolean;
}

export const LetterEnvelope: React.FC<LetterEnvelopeProps> = ({
  letter,
  onOpened,
  isUnlocked = true,
}) => {
  const [isOpening, setIsOpening] = useState(false);
  const [flapOpen, setFlapOpen] = useState(false);
  const [paperSlide, setPaperSlide] = useState(false);

  const themeConfig = THEMES[letter.theme] || THEMES.minimalist;
  const recipient = letter.recipientName || 'Harshita';

  const handleOpen = () => {
    if (!isUnlocked || isOpening) return;
    setIsOpening(true);

    // 1. Play delicate sound chime on wax seal break
    setTimeout(() => {
      romanticAudio.playSealBreakSound();
    }, 120);

    // 2. Open top flap in 3D with graceful deceleration
    setTimeout(() => {
      setFlapOpen(true);
    }, 320);

    // 3. Slide letter paper upwards with smooth ease-out
    setTimeout(() => {
      setPaperSlide(true);
    }, 720);

    // 4. Release rose petal & heart confetti celebration at apex
    setTimeout(() => {
      try {
        confetti({
          particleCount: 50,
          spread: 80,
          origin: { y: 0.52 },
          colors: ['#E11D48', '#BE123C', '#FDA4AF', '#FFE4E6', '#F43F5E'],
          ticks: 240,
          gravity: 0.75,
          scalar: 1.1,
        });
      } catch {
        // ignore
      }
    }, 1150);

    // 5. Complete cinematic transition into personal love letter
    setTimeout(() => {
      onOpened();
    }, 1700);
  };

  return (
    <div className="w-full flex flex-col items-center justify-between min-h-[calc(100vh-140px)] py-4 sm:py-6 px-4 select-none relative">
      {/* Subtle Floating Hearts & Tiny Sparkles ambient layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Soft floating sparkle 1 */}
        <div className="absolute top-12 left-[12%] animate-sparkle" style={{ animationDelay: '0s' }}>
          <Sparkles className="w-4 h-4 text-rose-300/80" />
        </div>
        {/* Soft floating sparkle 2 */}
        <div className="absolute top-28 right-[14%] animate-sparkle" style={{ animationDelay: '1.2s' }}>
          <Sparkles className="w-5 h-5 text-pink-400/75" />
        </div>
        {/* Soft floating heart 1 */}
        <div className="absolute top-1/3 left-[8%] animate-sparkle" style={{ animationDelay: '2s' }}>
          <Heart className="w-3.5 h-3.5 text-rose-300/70 fill-rose-300/40" />
        </div>
        {/* Soft floating heart 2 */}
        <div className="absolute top-2/3 right-[10%] animate-sparkle" style={{ animationDelay: '1.6s' }}>
          <Heart className="w-4 h-4 text-rose-400/70 fill-rose-400/40" />
        </div>
        {/* Soft floating sparkle 3 */}
        <div className="absolute bottom-24 left-[15%] animate-sparkle" style={{ animationDelay: '0.8s' }}>
          <Sparkles className="w-4 h-4 text-amber-300/80" />
        </div>
        {/* Soft floating sparkle 4 */}
        <div className="absolute bottom-32 right-[18%] animate-sparkle" style={{ animationDelay: '2.4s' }}>
          <Sparkles className="w-3.5 h-3.5 text-rose-300/80" />
        </div>
      </div>

      {/* Top Welcome Section: Heading & Heartfelt Message */}
      <div className="text-center max-w-xl mx-auto z-10 pt-2 pb-6 px-2">
        {/* Delicate Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/70 border border-rose-200/60 text-rose-800 text-[11px] font-medium tracking-wide mb-3 backdrop-blur-xs shadow-xs">
          <Heart size={11} className="text-rose-500 fill-rose-500" />
          <span>A Private Corner Of The Internet</span>
        </div>

        {/* Heading in elegant typography: "Hey, Harshita ♡" */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif-editorial font-bold tracking-tight text-rose-950 mb-3 drop-shadow-xs">
          Hey, {recipient} ♡
        </h1>

        {/* Heartfelt Message Box in Soft Pink, Cream & Blush */}
        <div className="relative bg-white/75 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-rose-200/70 shadow-sm shadow-rose-950/5 max-w-lg mx-auto">
          <p className="text-xs sm:text-sm md:text-base leading-relaxed text-stone-700 font-sans font-normal">
            "I made a little something for you. It's not perfect, but every little part of it comes from my heart. So, take your time, explore it, and just know that this little corner of the internet is all yours. ♡"
          </p>
        </div>
      </div>

      {/* Main Center Animated 3D Envelope */}
      <div className="relative w-full max-w-[440px] sm:max-w-[480px] h-[260px] sm:h-[300px] perspective-1000 my-auto z-20">
        {/* Sliding Letter Inside */}
        <div
          className={`absolute left-4 right-4 sm:left-6 sm:right-6 top-3 bottom-3 rounded-lg shadow-md p-5 sm:p-6 border transition-all duration-1000 ease-cinematic z-10 ${
            themeConfig.letterBg
          } ${themeConfig.letterBorder} ${
            paperSlide
              ? '-translate-y-48 sm:-translate-y-56 scale-[1.02] opacity-100 shadow-2xl'
              : 'translate-y-0 opacity-75'
          }`}
        >
          <div className="border-b border-rose-200/60 pb-2 mb-2 flex items-center justify-between text-[11px] text-rose-800/70">
            <span className="font-serif italic">For Harshita</span>
            <span className="flex items-center gap-1">
              <Heart size={10} className="fill-rose-500 text-rose-500" /> Personal Letter
            </span>
          </div>
          <h4 className="font-serif-luxury text-base font-semibold text-rose-950">
            {letter.greeting || `Hey, ${recipient} ♡`}
          </h4>
          <p className="text-xs mt-2 line-clamp-3 text-stone-600 font-serif italic leading-relaxed">
            {letter.openingReason ||
              "I made a little something for you. It's not perfect, but every little part of it comes from my heart..."}
          </p>
        </div>

        {/* Physical Envelope Shell */}
        <div
          className={`relative w-full h-full rounded-2xl shadow-xl border overflow-visible transition-all duration-500 z-20 ${
            themeConfig.envelopeColor
          }`}
          style={{
            boxShadow:
              '0 20px 45px -10px rgba(225, 29, 72, 0.22), 0 0 25px rgba(253, 164, 175, 0.35)',
          }}
        >
          {/* Triangular Top Flap with 3D Flip */}
          <div
            className={`absolute top-0 left-0 right-0 h-[130px] sm:h-[150px] origin-top transition-transform duration-900 ease-flap z-30 ${
              flapOpen ? '-rotate-x-180 pointer-events-none' : 'rotate-x-0'
            }`}
            style={{
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              background:
                letter.theme === 'romantic'
                  ? 'linear-gradient(to bottom, #881337, #4C0519)'
                  : letter.theme === 'luxurious'
                  ? 'linear-gradient(to bottom, #F9F5EC, #EDE5D3)'
                  : 'linear-gradient(to bottom, #FFF7F8, #FFE2E8)',
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
            }}
          />

          {/* Envelope Body Fold Lines (Bottom & Sides) */}
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden"
            style={{
              clipPath: 'polygon(0 0, 50% 50%, 100% 0, 100% 100%, 0 100%)',
              background:
                letter.theme === 'romantic'
                  ? 'linear-gradient(135deg, rgba(136,19,55,0.92), rgba(76,5,25,0.96))'
                  : letter.theme === 'luxurious'
                  ? 'linear-gradient(135deg, rgba(253,251,247,0.9), rgba(245,238,222,0.95))'
                  : 'linear-gradient(135deg, rgba(255,248,249,0.95), rgba(255,232,238,0.95))',
            }}
          />

          {/* Postal stamp & Calligraphy on Envelope Face */}
          <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-between pointer-events-none z-20">
            {/* Top row: Return address & Vintage Airmail Stamp */}
            <div className="flex items-start justify-between">
              {/* Return address */}
              <div className="text-[11px] leading-tight text-rose-900/80 font-serif italic max-w-[140px]">
                <span className="block not-italic font-sans text-[9px] uppercase tracking-wider text-rose-500 font-semibold">
                  From:
                </span>
                {letter.senderName || 'Your Love'} ♡
              </div>

              {/* Romantic Vintage Stamp */}
              <div className="w-13 sm:w-14 h-15 sm:h-16 rounded border border-dashed border-rose-300 bg-white/70 p-1 flex flex-col items-center justify-between text-center shadow-xs">
                <span className="text-[7.5px] uppercase tracking-widest block font-sans text-rose-700 font-bold">
                  Airmail
                </span>
                <Heart size={14} className="text-rose-500 fill-rose-500/80 my-0.5" />
                <span className="text-[7.5px] font-mono block text-rose-600 font-semibold">
                  2026 ♡
                </span>
              </div>
            </div>

            {/* Recipient calligraphy in center */}
            <div className="text-center my-auto py-1">
              <span className="text-[10px] uppercase tracking-widest font-sans text-rose-700/70 block mb-0.5 font-semibold">
                Delivered With All My Heart To
              </span>
              <p className="font-script text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide text-rose-950">
                {recipient}
              </p>
              <div className="w-20 sm:w-28 h-px bg-rose-300 mx-auto mt-1" />
            </div>

            {/* Bottom note */}
            <div className="flex items-center justify-between text-[10px] text-rose-700/60 font-serif italic">
              <span>Handle with tenderness</span>
              <span>Open with care ♡</span>
            </div>
          </div>

          {/* Center Wax Seal Positioned exactly at the flap tip */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 top-[102px] sm:top-[122px] z-40 transition-all duration-500 ease-cinematic ${
              flapOpen ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100'
            }`}
          >
            <WaxSeal
              style={letter.sealStyle || 'heart'}
              recipientName={recipient}
              senderName={letter.senderName || 'Love'}
              color={themeConfig.waxSealColor}
              size={64}
              onClick={handleOpen}
              pulse={isUnlocked && !isOpening}
            />
          </div>
        </div>
      </div>

      {/* Bottom CTA Button Section */}
      <div className="flex flex-col items-center gap-3 mt-6 sm:mt-8 z-30 w-full max-w-sm px-4">
        {/* Animated "Open Your Little Surprise 💌" Button */}
        <button
          onClick={handleOpen}
          disabled={!isUnlocked || isOpening}
          className={`relative group overflow-hidden w-full sm:w-auto px-8 py-3.5 rounded-full font-sans font-semibold text-sm sm:text-base tracking-wide text-white transition-all duration-300 ease-cinematic shadow-lg hover:scale-105 active:scale-98 cursor-pointer focus:outline-hidden ${
            isOpening
              ? 'bg-rose-400 cursor-wait'
              : 'bg-gradient-to-r from-rose-500 via-rose-600 to-red-500 hover:from-rose-600 hover:to-red-600 animate-pulse-glow'
          }`}
          style={{ minHeight: '48px' }}
        >
          {/* Shimmer light effect overlay */}
          <span className="absolute inset-0 pointer-events-none animate-shimmer" />

          <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-xs">
            {isOpening ? (
              <>
                <Sparkles size={18} className="animate-spin text-rose-100" />
                <span>Unfolding Your Surprise...</span>
              </>
            ) : (
              <>
                <span>Open Your Little Surprise 💌</span>
              </>
            )}
          </span>
        </button>

        <p className="text-xs text-rose-800/70 font-serif italic text-center">
          Tap the button or click the wax seal to unfold
        </p>
      </div>

      {/* Tiny Footer: "Made with love, just for you. ♡" */}
      <footer className="mt-8 pt-4 pb-2 text-center text-xs font-serif italic text-rose-900/60 z-10">
        <span>Made with love, just for you. ♡</span>
      </footer>
    </div>
  );
};
