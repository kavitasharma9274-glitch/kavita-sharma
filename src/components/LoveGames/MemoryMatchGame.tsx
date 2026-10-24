import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Check, RefreshCw, ArrowRight } from 'lucide-react';
import { ThemeId } from '../../types';
import { romanticAudio } from '../../utils/audioPlayer';

interface CardItem {
  id: number;
  pairId: number;
  title: string;
  emoji: string;
  note: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryMatchGameProps {
  theme: ThemeId;
  onComplete: () => void;
  isAllCompleted?: boolean;
  completedCount?: number;
  nextGameName?: string;
  onNextGame?: () => void;
}

const CARDS_DATA = [
  { pairId: 1, title: 'Coffee Date', emoji: '☕', note: 'Our quiet sunday morning talks' },
  { pairId: 2, title: 'Sunset Shore', emoji: '🌅', note: 'Running by the tide with you' },
  { pairId: 3, title: 'Starry Night', emoji: '✨', note: 'Counting stars under one blanket' },
];

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({
  theme,
  onComplete,
  isAllCompleted = false,
  completedCount = 2,
  nextGameName = 'Scratch Note',
  onNextGame,
}) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [matchesCount, setMatchesCount] = useState(0);
  const [lastMatchedNote, setLastMatchedNote] = useState<string | null>(null);

  // Initialize and shuffle cards
  const initializeGame = () => {
    const deck: CardItem[] = [];
    let idCounter = 1;

    CARDS_DATA.forEach((item) => {
      // Add pair
      deck.push({
        id: idCounter++,
        pairId: item.pairId,
        title: item.title,
        emoji: item.emoji,
        note: item.note,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        id: idCounter++,
        pairId: item.pairId,
        title: item.title,
        emoji: item.emoji,
        note: item.note,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle deck
    deck.sort(() => Math.random() - 0.5);
    setCards(deck);
    setSelectedCards([]);
    setMatchesCount(0);
    setLastMatchedNote(null);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (cards[index].isFlipped || cards[index].isMatched || selectedCards.length === 2) {
      return;
    }

    romanticAudio.playHeartChime();

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      const firstIndex = newSelected[0];
      const secondIndex = newSelected[1];

      if (cards[firstIndex].pairId === cards[secondIndex].pairId) {
        // Match found!
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstIndex].isMatched = true;
          matchedCards[secondIndex].isMatched = true;
          setCards(matchedCards);
          setSelectedCards([]);
          setMatchesCount((prev) => prev + 1);
          setLastMatchedNote(cards[firstIndex].note);

          romanticAudio.playSealBreakSound();

          if (matchesCount + 1 === CARDS_DATA.length) {
            // Won game! Notify parent quest tracker
            onComplete();

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
        }, 500);
      } else {
        // No match - flip back
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstIndex].isFlipped = false;
          resetCards[secondIndex].isFlipped = false;
          setCards(resetCards);
          setSelectedCards([]);
        }, 900);
      }
    }
  };

  const isGameOver = matchesCount === CARDS_DATA.length;

  return (
    <div className="flex flex-col items-center max-w-md w-full mx-auto select-none">
      <div className="text-center mb-5">
        <span className="text-[11px] font-sans uppercase tracking-widest font-bold text-rose-300 block mb-1">
          Mini-Game 1: Memory Match
        </span>
        <h3 className="text-2xl font-serif-editorial font-bold text-white tracking-tight">
          Find The Matching Memories
        </h3>
        <p className="text-xs text-rose-200/80 mt-1">
          Flip the cards to match 3 pairs of our cherished moments.
        </p>
      </div>

      {/* Sweet match toast note */}
      {lastMatchedNote && (
        <div className="mb-4 px-4 py-1.5 rounded-full bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs font-serif italic animate-in fade-in zoom-in-95 flex items-center gap-2">
          <Sparkles size={13} className="text-rose-400" />
          <span>"{lastMatchedNote}"</span>
        </div>
      )}

      {/* 2x3 Card Grid */}
      <div className="grid grid-cols-3 gap-3 w-full mb-6 perspective-1000">
        {cards.map((card, idx) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(idx)}
            className="aspect-3/4 cursor-pointer relative"
          >
            <div
              className={`w-full h-full rounded-xl border transition-all duration-500 transform-style-3d ${
                card.isFlipped || card.isMatched ? 'rotate-y-180' : ''
              } ${
                card.isMatched
                  ? 'border-rose-400 shadow-[0_0_15px_rgba(225,29,72,0.4)]'
                  : 'border-rose-900/60 hover:border-rose-500/80'
              }`}
            >
              {/* Back of Card (Facedown) */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#4C0519] to-[#2B050E] flex flex-col items-center justify-center p-2 backface-hidden shadow-md">
                <span className="text-2xl opacity-75 transform hover:scale-110 transition-transform">
                  💌
                </span>
                <span className="text-[9px] uppercase tracking-wider font-sans text-rose-300/60 mt-1">
                  Memory
                </span>
              </div>

              {/* Front of Card (Faceup) */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FFF5F5] to-[#FFE4E6] text-stone-900 flex flex-col items-center justify-center p-2 rotate-y-180 backface-hidden shadow-lg border border-rose-200">
                <span className="text-3xl mb-1">{card.emoji}</span>
                <span className="text-[11px] font-bold text-center font-serif leading-tight">
                  {card.title}
                </span>
                {card.isMatched && (
                  <div className="mt-1 bg-rose-600 text-white p-0.5 rounded-full">
                    <Check size={10} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status & Action */}
      <div className="flex items-center justify-between w-full pt-2">
        <button
          onClick={initializeGame}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-rose-200 hover:text-white hover:bg-rose-950/60 transition-colors"
        >
          <RefreshCw size={13} />
          <span>Reset Cards</span>
        </button>

        {isGameOver ? (
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
            <span className="text-xs text-rose-300 font-medium">Memory Match Complete!</span>
          )
        ) : (
          <span className="text-xs font-sans text-rose-300/80">
            {matchesCount} of {CARDS_DATA.length} matched
          </span>
        )}
      </div>
    </div>
  );
};
