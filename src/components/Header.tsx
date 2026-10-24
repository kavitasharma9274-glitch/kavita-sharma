import React from 'react';
import { LetterData } from '../types';

interface HeaderProps {
  currentView: 'editor' | 'envelope' | 'games' | 'letter' | 'countdown';
  onNavigate: (view: 'editor' | 'envelope' | 'games' | 'letter' | 'countdown') => void;
  onShare: () => void;
  theme: LetterData['theme'];
  isLetterUnlocked?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onShare,
  theme,
  isLetterUnlocked = false,
}) => {
  const headerStyles = {
    minimalist: 'bg-[#FFF5F5]/90 border-rose-200 text-stone-900',
    romantic: 'bg-[#2D0A14]/90 border-rose-900/60 text-rose-50',
    luxurious: 'bg-[#FDFBF7]/90 border-amber-300/40 text-stone-900',
  }[theme];

  return (
    <header
      className={`sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-4 border-b backdrop-blur-md transition-colors no-print ${headerStyles}`}
    >
      {/* Zone 1: Wordmark leading to Welcome Screen */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onNavigate('envelope');
        }}
        className="text-lg sm:text-xl font-serif-editorial font-bold tracking-tight whitespace-nowrap shrink-0 hover:opacity-85 transition-opacity flex items-center gap-1.5"
      >
        <span>LovePaper</span>
        <span className="text-xs font-normal text-rose-500 font-sans">♡</span>
      </a>

      {/* Zone 2: Clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium opacity-85">
        <button
          onClick={() => onNavigate('envelope')}
          className={`hover:opacity-100 transition-opacity whitespace-nowrap shrink-0 cursor-pointer ${
            currentView === 'envelope' ? 'font-semibold underline underline-offset-4' : ''
          }`}
        >
          Welcome ♡
        </button>
        <button
          onClick={() => onNavigate('letter')}
          className={`hover:opacity-100 transition-opacity whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
            currentView === 'letter' ? 'font-semibold underline underline-offset-4' : ''
          }`}
        >
          <span>Love Letter 💌</span>
        </button>
        <button
          onClick={() => onNavigate('games')}
          className={`hover:opacity-100 transition-opacity whitespace-nowrap shrink-0 cursor-pointer ${
            currentView === 'games' ? 'font-semibold underline underline-offset-4' : ''
          }`}
        >
          Love Games 💖
        </button>
        <button
          onClick={() => onNavigate('countdown')}
          className={`hover:opacity-100 transition-opacity whitespace-nowrap shrink-0 cursor-pointer ${
            currentView === 'countdown' ? 'font-semibold underline underline-offset-4' : ''
          }`}
        >
          Countdown
        </button>
        <button
          onClick={() => onNavigate('editor')}
          className={`hover:opacity-100 transition-opacity whitespace-nowrap shrink-0 cursor-pointer opacity-75 hover:opacity-100 ${
            currentView === 'editor' ? 'font-semibold underline underline-offset-4' : ''
          }`}
        >
          Studio
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onShare}
          className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0 ${
            theme === 'romantic'
              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-950/20'
              : theme === 'luxurious'
              ? 'bg-amber-800 hover:bg-amber-900 text-amber-50 shadow-amber-950/20'
              : 'bg-stone-900 hover:bg-stone-800 text-white'
          }`}
        >
          Share Letter
        </button>
      </div>
    </header>
  );
};
