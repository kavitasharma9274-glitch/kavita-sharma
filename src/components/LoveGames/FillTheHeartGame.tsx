import React, { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, ArrowRight, RefreshCw, CheckCircle2, HelpCircle } from 'lucide-react';
import { ThemeId } from '../../types';
import { romanticAudio } from '../../utils/audioPlayer';

interface FillTheHeartGameProps {
  theme: ThemeId;
  recipientName?: string;
  senderName?: string;
  onComplete: () => void;
  isAllCompleted?: boolean;
  completedCount?: number;
  nextGameName?: string;
  onNextGame?: () => void;
}

interface PuzzlePieceData {
  id: string;
  index: number;
  title: string;
  subtitle: string;
  symbol: string;
  path: string;
  // Center in SVG viewBox 0..240, 0..220
  targetCenter: { x: number; y: number };
  gradient: {
    from: string;
    to: string;
    border: string;
  };
}

// 4 Interlocking Puzzle Pieces forming a perfect 240x220 Heart
const PUZZLE_PIECES: PuzzlePieceData[] = [
  {
    id: 'top-left',
    index: 1,
    title: 'First Spark',
    subtitle: 'The magic when we first met',
    symbol: '✨',
    path: `M 120 52 C 100 22, 60 12, 40 12 C 20 12, 0 38, 0 75 C 0 85, 0 95, 0 100 L 50 102 C 50 102, 46 118, 60 118 C 74 118, 70 102, 70 102 L 120 105 L 120 86 C 120 86, 135 88, 135 78 C 135 68, 120 70, 120 70 Z`,
    targetCenter: { x: 60, y: 60 },
    gradient: {
      from: '#f43f5e',
      to: '#be123c',
      border: '#fecdd3',
    },
  },
  {
    id: 'top-right',
    index: 2,
    title: 'Sweet Laughter',
    subtitle: 'Every smile you bring to my days',
    symbol: '🌸',
    path: `M 120 52 L 120 70 C 120 70, 135 68, 135 78 C 135 88, 120 86, 120 86 L 120 105 L 170 105 C 170 105, 166 121, 180 121 C 194 121, 190 105, 190 105 L 240 100 C 240 95, 240 85, 240 75 C 240 38, 220 12, 200 12 C 180 12, 140 22, 120 52 Z`,
    targetCenter: { x: 180, y: 60 },
    gradient: {
      from: '#fb7185',
      to: '#e11d48',
      border: '#ffe4e6',
    },
  },
  {
    id: 'bottom-left',
    index: 3,
    title: 'Deep Trust',
    subtitle: 'My safest haven in your arms',
    symbol: '🌹',
    path: `M 0 100 C 0 135, 45 175, 120 215 L 120 170 C 120 170, 135 172, 135 160 C 135 148, 120 150, 120 150 L 120 105 L 70 102 C 70 102, 74 118, 60 118 C 46 118, 50 102, 50 102 L 0 100 Z`,
    targetCenter: { x: 65, y: 155 },
    gradient: {
      from: '#e11d48',
      to: '#9f1239',
      border: '#fda4af',
    },
  },
  {
    id: 'bottom-right',
    index: 4,
    title: 'Forever Yours',
    subtitle: 'A love that only grows deeper',
    symbol: '💖',
    path: `M 120 215 L 120 170 C 120 170, 135 172, 135 160 C 135 148, 120 150, 120 150 L 120 105 L 170 105 C 170 105, 166 121, 180 121 C 194 121, 190 105, 190 105 L 240 100 C 240 135, 195 175, 120 215 Z`,
    targetCenter: { x: 175, y: 155 },
    gradient: {
      from: '#be123c',
      to: '#881337',
      border: '#f43f5e',
    },
  },
];

export const FillTheHeartGame: React.FC<FillTheHeartGameProps> = ({
  theme,
  recipientName = 'My Love',
  senderName = 'Your Love',
  onComplete,
  isAllCompleted = false,
  completedCount = 1,
  nextGameName = 'Memory Match',
  onNextGame,
}) => {
  // Track which pieces are placed
  const [placedPieces, setPlacedPieces] = useState<Record<string, boolean>>({
    'top-left': false,
    'top-right': false,
    'bottom-left': false,
    'bottom-right': false,
  });

  // Dragging state
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [hoveredSlotId, setHoveredSlotId] = useState<string | null>(null);
  const [recentSnapId, setRecentSnapId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const boardRef = useRef<SVGSVGElement | null>(null);

  const placedCount = Object.values(placedPieces).filter(Boolean).length;
  const isCompleted = placedCount === PUZZLE_PIECES.length;

  // Handle snap logic
  const snapPiece = useCallback(
    (id: string) => {
      if (placedPieces[id]) return;

      romanticAudio.playHeartChime();
      setRecentSnapId(id);
      setTimeout(() => setRecentSnapId(null), 800);

      setPlacedPieces((prev) => {
        const next = { ...prev, [id]: true };
        const newCount = Object.values(next).filter(Boolean).length;

        if (newCount === PUZZLE_PIECES.length) {
          // Immediately notify parent this game is completed
          onComplete();

          setTimeout(() => {
            romanticAudio.playSealBreakSound();
            try {
              confetti({
                particleCount: 75,
                spread: 90,
                origin: { y: 0.52 },
                colors: ['#E11D48', '#FB7185', '#FFE4E6', '#F59E0B', '#F43F5E'],
              });
            } catch {
              // Ignore
            }
          }, 300);
        }

        return next;
      });
    },
    [placedPieces, onComplete]
  );

  // Reset puzzle
  const resetPuzzle = () => {
    setPlacedPieces({
      'top-left': false,
      'top-right': false,
      'bottom-left': false,
      'bottom-right': false,
    });
    setActiveDragId(null);
    setDragPos(null);
    setHoveredSlotId(null);
    setRecentSnapId(null);
  };

  // Auto-solve one piece as hint
  const handleHint = () => {
    const unplaced = PUZZLE_PIECES.find((p) => !placedPieces[p.id]);
    if (unplaced) {
      snapPiece(unplaced.id);
    }
  };

  // Pointer Drag Handling
  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    if (placedPieces[id]) return;
    e.preventDefault();

    setActiveDragId(id);
    setDragPos({ x: e.clientX, y: e.clientY });

    // Track move and up on window to prevent lost captures
    const handlePointerMove = (ev: PointerEvent) => {
      setDragPos({ x: ev.clientX, y: ev.clientY });

      // Check proximity to target slot in board
      if (boardRef.current) {
        const boardRect = boardRef.current.getBoundingClientRect();
        const piece = PUZZLE_PIECES.find((p) => p.id === id);
        if (piece) {
          // Convert target center (0..240, 0..220) to viewport pixels
          const targetScreenX = boardRect.left + (piece.targetCenter.x / 240) * boardRect.width;
          const targetScreenY = boardRect.top + (piece.targetCenter.y / 220) * boardRect.height;
          const dist = Math.hypot(ev.clientX - targetScreenX, ev.clientY - targetScreenY);

          if (dist < 65) {
            setHoveredSlotId(id);
          } else {
            setHoveredSlotId(null);
          }
        }
      }
    };

    const handlePointerUp = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);

      // Check if dropped near target slot
      if (boardRef.current) {
        const boardRect = boardRef.current.getBoundingClientRect();
        const piece = PUZZLE_PIECES.find((p) => p.id === id);
        if (piece) {
          const targetScreenX = boardRect.left + (piece.targetCenter.x / 240) * boardRect.width;
          const targetScreenY = boardRect.top + (piece.targetCenter.y / 220) * boardRect.height;
          const dist = Math.hypot(ev.clientX - targetScreenX, ev.clientY - targetScreenY);

          if (dist < 65) {
            snapPiece(id);
          }
        }
      }

      setActiveDragId(null);
      setDragPos(null);
      setHoveredSlotId(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center max-w-lg w-full mx-auto select-none touch-none"
    >
      {/* Title & Instructions */}
      <div className="text-center mb-4">
        <span className="text-[11px] font-sans uppercase tracking-widest font-bold text-rose-300 block mb-1">
          Mini-Game: Fill The Heart
        </span>
        <h3 className="text-2xl font-serif-editorial font-bold text-white tracking-tight">
          Piece Together My Heart
        </h3>
        <p className="text-xs text-rose-200/80 mt-1 max-w-sm mx-auto">
          Drag the scattered pieces into the heart silhouette, or tap any piece to snap it into place.
        </p>
      </div>

      {/* Progress & Status Ribbon */}
      <div className="w-full bg-rose-950/60 px-4 py-2.5 rounded-xl border border-rose-900/60 mb-5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Heart
            size={16}
            className={`${
              isCompleted
                ? 'text-rose-400 fill-rose-400 animate-pulse'
                : 'text-rose-400/70'
            }`}
          />
          <span className="font-medium text-rose-200">
            {isCompleted ? 'Heart Complete!' : `Pieces placed: ${placedCount} of 4`}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {PUZZLE_PIECES.map((p) => (
            <div
              key={p.id}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                placedPieces[p.id]
                  ? 'bg-rose-400 scale-110 shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                  : 'bg-rose-950 border border-rose-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Central Heart Board (The Silhouette Target) */}
      <div className="relative w-full flex items-center justify-center py-2 mb-4">
        <div className="relative p-3 rounded-2xl bg-gradient-to-b from-[#2A060E]/90 to-[#180308]/90 border border-rose-500/40 shadow-xl shadow-rose-950/50 backdrop-blur-md">
          {/* Subtle glowing halo behind heart */}
          <div
            className={`absolute inset-4 rounded-full blur-2xl transition-all duration-700 pointer-events-none ${
              isCompleted
                ? 'bg-rose-500/35 scale-110'
                : 'bg-rose-600/15'
            }`}
          />

          <svg
            ref={boardRef}
            viewBox="0 0 240 220"
            className="w-56 h-52 sm:w-64 sm:h-60 relative z-10 overflow-visible transition-transform duration-500 drop-shadow-md"
            style={{
              transform: isCompleted ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            <defs>
              {/* Gradients for each piece */}
              {PUZZLE_PIECES.map((piece) => (
                <linearGradient
                  key={`grad-${piece.id}`}
                  id={`grad-${piece.id}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor={piece.gradient.from} />
                  <stop offset="100%" stopColor={piece.gradient.to} />
                </linearGradient>
              ))}

              {/* Golden seam glow for completion */}
              <filter id="golden-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background ghost slots for each piece */}
            {PUZZLE_PIECES.map((piece) => {
              const isPlaced = placedPieces[piece.id];
              const isHovered = hoveredSlotId === piece.id;
              const isRecent = recentSnapId === piece.id;

              return (
                <g key={`slot-${piece.id}`} onClick={() => !isPlaced && snapPiece(piece.id)}>
                  {/* Empty Slot Silhouette */}
                  {!isPlaced && (
                    <path
                      d={piece.path}
                      fill={isHovered ? 'rgba(244, 63, 94, 0.25)' : 'rgba(255, 255, 255, 0.04)'}
                      stroke={isHovered ? '#fb7185' : 'rgba(244, 63, 94, 0.35)'}
                      strokeWidth={isHovered ? '2.5' : '1.5'}
                      strokeDasharray={isHovered ? 'none' : '4 4'}
                      className="transition-all duration-200 cursor-pointer hover:stroke-rose-400"
                    />
                  )}

                  {/* Empty slot guide marker / symbol */}
                  {!isPlaced && (
                    <text
                      x={piece.targetCenter.x}
                      y={piece.targetCenter.y + 4}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="rgba(254, 205, 211, 0.45)"
                      fontSize="14"
                      className="font-serif cursor-pointer pointer-events-none"
                    >
                      {piece.symbol}
                    </text>
                  )}

                  {/* Placed Piece In Full Rich Render */}
                  {isPlaced && (
                    <g
                      className={`transition-all duration-500 ease-out ${
                        isRecent ? 'animate-in zoom-in-90 duration-300' : ''
                      }`}
                    >
                      <path
                        d={piece.path}
                        fill={`url(#grad-${piece.id})`}
                        stroke={isCompleted ? '#fef08a' : piece.gradient.border}
                        strokeWidth={isCompleted ? '1.5' : '1'}
                        className="transition-colors duration-500"
                        style={{
                          filter: isCompleted
                            ? 'drop-shadow(0 0 6px rgba(251, 113, 133, 0.5))'
                            : 'none',
                        }}
                      />

                      {/* Engraved romantic label & symbol in completed piece */}
                      <text
                        x={piece.targetCenter.x}
                        y={piece.targetCenter.y - 4}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#ffffff"
                        fontSize="15"
                        className="font-serif select-none pointer-events-none drop-shadow"
                      >
                        {piece.symbol}
                      </text>
                      <text
                        x={piece.targetCenter.x}
                        y={piece.targetCenter.y + 12}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="rgba(255, 255, 255, 0.95)"
                        fontSize="8.5"
                        fontWeight="600"
                        className="font-sans uppercase tracking-widest select-none pointer-events-none drop-shadow"
                      >
                        {piece.title}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Central Heartbeat Glow When Completed */}
            {isCompleted && (
              <circle
                cx="120"
                cy="105"
                r="30"
                fill="url(#grad-top-left)"
                opacity="0.15"
                className="animate-ping"
              />
            )}
          </svg>
        </div>
      </div>

      {/* Scattered Puzzle Pieces Tray */}
      {!isCompleted ? (
        <div className="w-full mt-2">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] font-semibold text-rose-300/80 uppercase tracking-wider flex items-center gap-1.5">
              <span>Scattered Pieces</span>
              <Sparkles size={12} className="text-rose-400" />
            </span>
            <button
              onClick={handleHint}
              className="inline-flex items-center gap-1 text-[11px] text-rose-300/80 hover:text-rose-100 transition-colors"
            >
              <HelpCircle size={12} />
              <span>Snap next piece</span>
            </button>
          </div>

          {/* Piece Cards Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {PUZZLE_PIECES.map((piece) => {
              const isPlaced = placedPieces[piece.id];
              const isBeingDragged = activeDragId === piece.id;

              if (isPlaced) {
                return (
                  <div
                    key={piece.id}
                    className="p-2.5 rounded-xl border border-rose-900/40 bg-rose-950/20 opacity-40 flex items-center gap-2.5"
                  >
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-rose-200 line-through truncate">
                        {piece.title}
                      </p>
                      <p className="text-[10px] text-rose-300/50 truncate">Fitted in heart</p>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={piece.id}
                  onPointerDown={(e) => handlePointerDown(e, piece.id)}
                  onClick={() => snapPiece(piece.id)}
                  className={`p-3 rounded-xl border border-rose-500/50 bg-gradient-to-br from-rose-950/80 via-rose-900/60 to-rose-950/90 cursor-grab active:cursor-grabbing hover:border-rose-400/80 transition-all duration-200 flex items-center gap-3 shadow-md hover:shadow-rose-900/40 group ${
                    isBeingDragged ? 'opacity-30 scale-95' : 'hover:-translate-y-0.5'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-600 to-rose-800 flex items-center justify-center text-white text-lg shrink-0 shadow-inner border border-rose-400/40 group-hover:scale-105 transition-transform">
                    {piece.symbol}
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-xs font-semibold text-rose-100 group-hover:text-white transition-colors truncate">
                      {piece.title}
                    </p>
                    <p className="text-[10px] text-rose-300/70 truncate">
                      Tap or drag into slot
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Sweet Unlocked 'I Love You' Celebration Card */
        <div className="w-full mt-2 animate-in zoom-in-95 duration-500">
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#3B0714] via-[#2A050E] to-[#1C0207] border-2 border-rose-400/70 shadow-2xl relative overflow-hidden text-center">
            {/* Glowing corner ornaments */}
            <div className="absolute top-2 left-2 text-rose-400/40">✨</div>
            <div className="absolute top-2 right-2 text-rose-400/40">✨</div>

            <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/20 border border-rose-400/50 text-rose-200 text-xs font-serif italic mb-3">
              <Sparkles size={13} className="text-amber-300" />
              <span>You have pieced my heart together</span>
            </div>

            <h4 className="text-2xl sm:text-3xl font-serif-editorial font-bold text-white tracking-wide mb-2">
              I Love You!
            </h4>

            <p className="text-xs sm:text-sm text-rose-100/90 font-serif leading-relaxed italic max-w-md mx-auto mb-4">
              "{recipientName ? `${recipientName}, you` : 'You'} hold every scattered piece of my heart.
              Every laugh, every quiet moment, and every dream is only complete because of you."
            </p>

            <p className="text-[11px] font-sans text-rose-300/80 mb-5">
              Forever & always yours,{' '}
              <span className="font-semibold text-white">{senderName}</span>
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {isAllCompleted ? (
                <button
                  onClick={onComplete}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-rose-600 to-rose-500 hover:from-emerald-500 hover:to-rose-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-950/60 transition-all hover:scale-105 active:scale-95 animate-pulse"
                >
                  <span>Read Full Love Letter</span>
                  <ArrowRight size={14} />
                </button>
              ) : onNextGame ? (
                <button
                  onClick={onNextGame}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-950/60 transition-all hover:scale-105 active:scale-95"
                >
                  <span>Play Next Challenge: {nextGameName}</span>
                  <ArrowRight size={14} />
                </button>
              ) : null}

              <button
                onClick={resetPuzzle}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs text-rose-300 hover:text-white hover:bg-rose-950/50 transition-colors"
              >
                <RefreshCw size={13} />
                <span>Reassemble</span>
              </button>
            </div>

            {!isAllCompleted && (
              <p className="text-[11px] text-rose-300/80 mt-3 font-serif italic">
                Challenge 1 of 4 Solved! Solve all 4 games to unlock the letter.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Floating Drag Avatar Following Cursor/Finger */}
      {activeDragId && dragPos && (
        <div
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
          style={{
            left: `${dragPos.x}px`,
            top: `${dragPos.y}px`,
          }}
        >
          {(() => {
            const piece = PUZZLE_PIECES.find((p) => p.id === activeDragId);
            if (!piece) return null;
            return (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 border-2 border-rose-200/90 shadow-[0_10px_25px_rgba(225,29,72,0.7)] flex flex-col items-center justify-center text-white scale-110">
                <span className="text-2xl">{piece.symbol}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">
                  {piece.title}
                </span>
              </div>
            );
          })()}
        </div>
      )}

      {/* Bottom utility controls when puzzle is not finished */}
      {!isCompleted && (
        <div className="flex items-center justify-between w-full pt-4 mt-2 border-t border-rose-900/40 text-xs">
          <button
            onClick={resetPuzzle}
            className="inline-flex items-center gap-1.5 text-rose-300/80 hover:text-rose-100 transition-colors"
          >
            <RefreshCw size={13} />
            <span>Reset Pieces</span>
          </button>

          <span className="text-[11px] text-rose-300/60 italic font-serif">
            Place all 4 pieces to reveal the message
          </span>
        </div>
      )}
    </div>
  );
};
