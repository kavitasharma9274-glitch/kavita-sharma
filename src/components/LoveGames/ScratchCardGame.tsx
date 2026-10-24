import React, { useRef, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
import { ThemeId } from '../../types';
import { romanticAudio } from '../../utils/audioPlayer';

interface ScratchCardGameProps {
  theme: ThemeId;
  recipientName?: string;
  senderName?: string;
  onComplete: () => void;
  isAllCompleted?: boolean;
  completedCount?: number;
  nextGameName?: string;
  onNextGame?: () => void;
}

export const ScratchCardGame: React.FC<ScratchCardGameProps> = ({
  theme,
  recipientName = 'My Love',
  senderName = 'Your Love',
  onComplete,
  isAllCompleted = false,
  completedCount = 3,
  nextGameName = 'Catch Hearts',
  onNextGame,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isScratchedEnough, setIsScratchedEnough] = useState(false);
  const [percentRevealed, setPercentRevealed] = useState(0);
  const isDrawingRef = useRef(false);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset state
    setIsScratchedEnough(false);
    setPercentRevealed(0);

    const width = canvas.width;
    const height = canvas.height;

    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';

    // Draw luxury cherry-ruby / gold foil gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    if (theme === 'luxurious') {
      grad.addColorStop(0, '#D97706');
      grad.addColorStop(0.5, '#F59E0B');
      grad.addColorStop(1, '#92400E');
    } else {
      grad.addColorStop(0, '#E11D48');
      grad.addColorStop(0.5, '#BE123C');
      grad.addColorStop(1, '#881337');
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Subtle pattern & text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    for (let i = 0; i < width; i += 24) {
      for (let j = 0; j < height; j += 24) {
        ctx.beginPath();
        ctx.arc(i, j, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Callout text on the foil
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 15px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ Scratch to Reveal Secret Note ✨', width / 2, height / 2 - 10);

    ctx.font = '11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillText('Rub with your finger or mouse', width / 2, height / 2 + 15);
  };

  useEffect(() => {
    initCanvas();
  }, [theme]);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    // Check scratch progress occasionally
    if (Math.random() < 0.25) {
      checkPercent();
    }
  };

  const checkPercent = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const imgData = ctx.getImageData(0, 0, width, height);
    let transparentPixels = 0;

    for (let i = 3; i < imgData.data.length; i += 16) {
      if (imgData.data[i] === 0) {
        transparentPixels++;
      }
    }

    const totalSamples = imgData.data.length / 16;
    const currentPercent = Math.min(100, Math.round((transparentPixels / totalSamples) * 100));
    setPercentRevealed(currentPercent);

    if (currentPercent >= 45 && !isScratchedEnough) {
      setIsScratchedEnough(true);
      onComplete();
      romanticAudio.playSealBreakSound();
      try {
        confetti({
          particleCount: 45,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E11D48', '#FDA4AF', '#FFE4E6'],
        });
      } catch {
        // ignore
      }
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
    checkPercent();
  };

  return (
    <div className="flex flex-col items-center max-w-md w-full mx-auto select-none">
      <div className="text-center mb-5">
        <span className="text-[11px] font-sans uppercase tracking-widest font-bold text-rose-300 block mb-1">
          Mini-Game 2: Scratch-Off Love Note
        </span>
        <h3 className="text-2xl font-serif-editorial font-bold text-white tracking-tight">
          Scratch To Reveal A Hidden Note
        </h3>
        <p className="text-xs text-rose-200/80 mt-1">
          Use your finger or mouse to scratch the shimmering foil layer.
        </p>
      </div>

      {/* Scratch Ticket Container */}
      <div className="relative w-full aspect-16/10 rounded-2xl overflow-hidden shadow-2xl border-2 border-rose-500/50 bg-[#FFF5F5] mb-5">
        {/* Underlying Hidden Secret Note */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between text-stone-900 bg-gradient-to-br from-[#FFFDFD] to-[#FFEBEF]">
          <div className="flex items-center justify-between border-b border-rose-200/60 pb-2">
            <span className="text-[10px] font-sans uppercase tracking-widest text-rose-600 font-bold">
              Secret Keepsake Note
            </span>
            <span className="text-xs font-serif italic text-stone-500">
              For {recipientName}
            </span>
          </div>

          <div className="my-auto py-2 text-center">
            <p className="font-handwriting text-xl sm:text-2xl font-bold text-rose-950 leading-relaxed">
              "Before you read your full letter, remember: loving you is the easiest, sweetest thing I have ever done."
            </p>
            <p className="font-script text-lg text-rose-700 mt-2">
              — Forever yours, {senderName}
            </p>
          </div>

          <div className="flex items-center justify-between text-[10px] text-stone-400 font-sans pt-1 border-t border-rose-200/40">
            <span>Special Love Intermission</span>
            <span>💖 Verified Secret Note</span>
          </div>
        </div>

        {/* Scratchable Canvas Overlay */}
        <canvas
          ref={canvasRef}
          width={380}
          height={240}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
        />
      </div>

      {/* Progress & Actions */}
      <div className="flex items-center justify-between w-full pt-2">
        <button
          onClick={initCanvas}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-rose-200 hover:text-white hover:bg-rose-950/60 transition-colors"
        >
          <RefreshCw size={13} />
          <span>Scratch Again</span>
        </button>

        {isScratchedEnough ? (
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
            <span className="text-xs text-rose-300 font-medium">Secret Note Unlocked!</span>
          )
        ) : (
          <span className="text-xs font-sans text-rose-300/80">
            {percentRevealed}% revealed (scratch to 45%+)
          </span>
        )}
      </div>
    </div>
  );
};
