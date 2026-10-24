import React, { useState } from 'react';
import { LetterData } from '../../types';
import { MemoryMatchGame } from './MemoryMatchGame';
import { ScratchCardGame } from './ScratchCardGame';
import { CatchHeartsGame } from './CatchHeartsGame';
import { FillTheHeartGame } from './FillTheHeartGame';
import { ArrowRight, Sparkles, Lock, Unlock, CheckCircle, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { romanticAudio } from '../../utils/audioPlayer';

interface LoveGamesViewProps {
  letter: LetterData;
  completedGames: Record<string, boolean>;
  onGameCompleted: (gameKey: 'fill' | 'match' | 'scratch' | 'catch') => void;
  onProceedToLetter: () => void;
  onBackToEnvelope: () => void;
  onUnlockAllGames?: () => void;
}

type GameMode = 'fill' | 'match' | 'scratch' | 'catch';

const GAME_SEQUENCE: { id: GameMode; title: string; shortTitle: string; icon: string }[] = [
  { id: 'fill', title: 'Fill the Heart', shortTitle: 'Fill Heart', icon: '🧩' },
  { id: 'match', title: 'Memory Match', shortTitle: 'Match', icon: '🃏' },
  { id: 'scratch', title: 'Scratch Note', shortTitle: 'Scratch', icon: '🪙' },
  { id: 'catch', title: 'Catch Hearts', shortTitle: 'Catch', icon: '💖' },
];

export const LoveGamesView: React.FC<LoveGamesViewProps> = ({
  letter,
  completedGames,
  onGameCompleted,
  onProceedToLetter,
  onBackToEnvelope,
  onUnlockAllGames,
}) => {
  const [activeGame, setActiveGame] = useState<GameMode>('fill');

  const completedCount = Object.values(completedGames).filter(Boolean).length;
  const isAllCompleted = completedCount === 4;

  // Helper to find next game in sequence
  const getNextIncompleteGame = (current: GameMode): { id: GameMode; title: string } => {
    const currentIndex = GAME_SEQUENCE.findIndex((g) => g.id === current);
    for (let i = 1; i <= 4; i++) {
      const nextIndex = (currentIndex + i) % 4;
      const candidate = GAME_SEQUENCE[nextIndex];
      if (!completedGames[candidate.id]) {
        return candidate;
      }
    }
    // If all completed, return next in sequence
    return GAME_SEQUENCE[(currentIndex + 1) % 4];
  };

  const handleNextGame = (current: GameMode) => {
    const next = getNextIncompleteGame(current);
    setActiveGame(next.id);
  };

  const nextGameInfo = getNextIncompleteGame(activeGame);

  const handleFinalLetterUnlock = () => {
    romanticAudio.playSealBreakSound();
    try {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#E11D48', '#FDA4AF', '#F43F5E', '#F59E0B', '#FFF1F2'],
      });
    } catch {
      // ignore
    }
    onProceedToLetter();
  };

  return (
    <div className="w-full max-w-xl mx-auto py-4 px-4 flex flex-col items-center select-none">
      {/* Top Utility Ribbon: Back to Envelope & Lock Status */}
      <div className="w-full flex items-center justify-between gap-3 mb-4 no-print">
        <button
          onClick={onBackToEnvelope}
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-200/80 hover:text-white hover:bg-rose-950/60 transition-colors"
        >
          ← Back to Envelope
        </button>

        {isAllCompleted ? (
          <button
            onClick={handleFinalLetterUnlock}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 via-rose-600 to-rose-500 hover:from-emerald-400 hover:to-rose-400 text-white shadow-lg shadow-rose-950/50 transition-all hover:scale-105 animate-pulse"
          >
            <Unlock size={13} />
            <span>Open Love Letter (Unlocked)</span>
            <ArrowRight size={13} />
          </button>
        ) : (
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-950/80 border border-rose-800/80 text-rose-300"
            title="Complete all 4 games to unlock the letter"
          >
            <Lock size={12} className="text-rose-400" />
            <span>Letter Locked ({completedCount}/4 Games)</span>
          </div>
        )}
      </div>

      {/* Quest Progress Tracker Bar */}
      <div className="w-full bg-gradient-to-r from-[#24040B] via-[#1A0308] to-[#24040B] border border-rose-500/40 rounded-2xl p-4 mb-5 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Trophy size={16} className={isAllCompleted ? 'text-amber-400' : 'text-rose-400'} />
            <span className="text-xs font-bold text-white tracking-wide uppercase">
              Love Quest: {completedCount} of 4 Completed
            </span>
          </div>
          <span className="text-[11px] font-sans text-rose-300 font-semibold">
            {Math.round((completedCount / 4) * 100)}%
          </span>
        </div>

        {/* Progress Fill Line */}
        <div className="w-full h-2 rounded-full bg-rose-950/90 border border-rose-900/80 overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-rose-600 via-pink-500 to-amber-400 transition-all duration-500 ease-out"
            style={{ width: `${(completedCount / 4) * 100}%` }}
          />
        </div>

        <p className="text-[11px] text-rose-200/80 italic font-serif text-center">
          {isAllCompleted
            ? '✨ All four love games are complete! The wax seal has broken and your letter is unlocked.'
            : 'Complete all four games to unlock and read your letter.'}
        </p>
      </div>

      {/* Main Game Stage Card */}
      <div className="w-full rounded-2xl p-5 sm:p-7 border border-rose-500/50 bg-gradient-to-b from-[#2E050F]/95 via-[#1E030A]/95 to-[#120206]/95 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Subtle romantic corner accents */}
        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-rose-500/40 pointer-events-none" />
        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-rose-500/40 pointer-events-none" />

        {/* Game Selection Segmented Control */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 bg-black/40 rounded-xl mb-6 border border-rose-900/60 max-w-md mx-auto">
          {GAME_SEQUENCE.map((game) => {
            const isDone = completedGames[game.id];
            const isActive = activeGame === game.id;

            return (
              <button
                key={game.id}
                onClick={() => setActiveGame(game.id)}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all text-center flex items-center justify-center gap-1 ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-xs font-semibold'
                    : 'text-rose-200/70 hover:text-white'
                }`}
              >
                <span>
                  {game.icon} {game.shortTitle}
                </span>
                {isDone && <CheckCircle size={11} className="text-emerald-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Selected Game Component with Multi-Game Quest Linking */}
        {activeGame === 'fill' && (
          <FillTheHeartGame
            theme={letter.theme}
            recipientName={letter.recipientName}
            senderName={letter.senderName}
            isAllCompleted={isAllCompleted}
            completedCount={completedCount}
            nextGameName={nextGameInfo.title}
            onNextGame={() => handleNextGame('fill')}
            onComplete={() => onGameCompleted('fill')}
          />
        )}

        {activeGame === 'match' && (
          <MemoryMatchGame
            theme={letter.theme}
            isAllCompleted={isAllCompleted}
            completedCount={completedCount}
            nextGameName={nextGameInfo.title}
            onNextGame={() => handleNextGame('match')}
            onComplete={() => onGameCompleted('match')}
          />
        )}

        {activeGame === 'scratch' && (
          <ScratchCardGame
            theme={letter.theme}
            recipientName={letter.recipientName}
            senderName={letter.senderName}
            isAllCompleted={isAllCompleted}
            completedCount={completedCount}
            nextGameName={nextGameInfo.title}
            onNextGame={() => handleNextGame('scratch')}
            onComplete={() => onGameCompleted('scratch')}
          />
        )}

        {activeGame === 'catch' && (
          <CatchHeartsGame
            theme={letter.theme}
            isAllCompleted={isAllCompleted}
            completedCount={completedCount}
            nextGameName={nextGameInfo.title}
            onNextGame={() => handleNextGame('catch')}
            onComplete={() => onGameCompleted('catch')}
          />
        )}

        {/* Grand Final Unlocked Notification Banner inside card when all 4 completed */}
        {isAllCompleted && (
          <div className="mt-6 pt-5 border-t border-rose-500/40 text-center animate-in fade-in duration-500">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold mb-2">
              <Sparkles size={13} className="text-amber-300" />
              <span>All 4 Challenges Finished!</span>
            </div>
            <h4 className="font-serif-editorial text-xl font-bold text-white mb-1">
              Your Letter is Ready
            </h4>
            <p className="text-xs text-rose-200/90 font-serif italic max-w-sm mx-auto mb-4">
              You have assembled the heart, matched our memories, uncovered the secret note, and caught every blessing.
            </p>
            <button
              onClick={handleFinalLetterUnlock}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-rose-600 to-rose-500 hover:from-emerald-500 hover:to-rose-400 text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-rose-950/60 transition-all hover:scale-105 active:scale-95 animate-pulse"
            >
              <span>Open & Read Your Love Letter</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Bottom helper & preview unlock link */}
      <div className="w-full flex items-center justify-between mt-4 text-[11px] text-rose-300/60 px-1 font-serif italic">
        <span>
          A loving challenge from {letter.senderName || 'Your Love'}
        </span>

        {/* Discreet preview helper for testing all games completed */}
        {onUnlockAllGames && !isAllCompleted && (
          <button
            onClick={onUnlockAllGames}
            className="text-[10px] text-rose-400/60 hover:text-rose-200 underline transition-colors cursor-pointer not-italic font-sans"
            title="Complete all 4 games immediately for testing"
          >
            ⚡ Complete All 4 (Test Preview)
          </button>
        )}
      </div>
    </div>
  );
};
