import React from 'react';
import { LetterData } from '../types';
import { THEMES, FONTS } from '../data/templates';
import { PhotoGallery } from './PhotoGallery';
import { WaxSeal } from './WaxSeal';
import { InkSplash } from './InkSplash';
import { HeartReactButton } from './HeartReactButton';
import { ArrowLeft, Printer, Share2, Edit3, Heart } from 'lucide-react';

interface LetterViewProps {
  letter: LetterData;
  onBackToEnvelope: () => void;
  onEditLetter: () => void;
  onShare: () => void;
  onPlayGames?: () => void;
}

export const LetterView: React.FC<LetterViewProps> = ({
  letter,
  onBackToEnvelope,
  onEditLetter,
  onShare,
  onPlayGames,
}) => {
  const themeConfig = THEMES[letter.theme];
  const fontConfig = FONTS.find((f) => f.id === letter.font) || FONTS[0];

  const fontSizeClasses = {
    sm: 'text-sm md:text-base leading-relaxed',
    md: 'text-base md:text-lg leading-relaxed',
    lg: 'text-lg md:text-xl leading-relaxed',
    xl: 'text-xl md:text-2xl leading-relaxed',
  }[letter.fontSize];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full flex flex-col items-center py-6 px-3 sm:px-6">
      {/* Top Floating Utility Bar (Hidden during print) */}
      <div className="w-full max-w-3xl flex items-center justify-between gap-3 mb-6 no-print">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToEnvelope}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-white/80 dark:bg-stone-800/80 hover:bg-white dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xs transition-colors backdrop-blur-xs"
          >
            <ArrowLeft size={14} />
            <span>Fold Into Envelope</span>
          </button>

          {onPlayGames && (
            <button
              onClick={onPlayGames}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-300/80 shadow-xs transition-colors backdrop-blur-xs cursor-pointer"
            >
              <span>💖 Love Games</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/80 dark:bg-stone-800/80 hover:bg-white dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xs transition-colors backdrop-blur-xs"
            title="Print or Save as PDF Keepsake"
          >
            <Printer size={14} />
            <span className="hidden sm:inline">Print Keepsake</span>
          </button>

          <button
            onClick={onEditLetter}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/80 dark:bg-stone-800/80 hover:bg-white dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xs transition-colors backdrop-blur-xs"
          >
            <Edit3 size={14} />
            <span className="hidden sm:inline">Edit Letter</span>
          </button>

          <button
            onClick={onShare}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium text-white shadow-xs transition-colors ${
              letter.theme === 'romantic'
                ? 'bg-rose-600 hover:bg-rose-700'
                : letter.theme === 'luxurious'
                ? 'bg-amber-800 hover:bg-amber-900'
                : 'bg-stone-900 hover:bg-stone-800'
            }`}
          >
            <Share2 size={14} />
            <span>Share Link</span>
          </button>
        </div>
      </div>

      {/* Main Letter Stationery Paper */}
      <article
        className={`w-full max-w-3xl rounded-xl p-8 sm:p-12 md:p-16 border shadow-2xl transition-all duration-500 letter-paper-print relative overflow-hidden ${
          themeConfig.letterBg
        } ${themeConfig.letterBorder} ${themeConfig.letterText} ${
          letter.paperTexture === 'deckled'
            ? 'border-2 border-dashed'
            : letter.paperTexture === 'linen'
            ? 'shadow-[inset_0_0_80px_rgba(0,0,0,0.03)]'
            : ''
        }`}
      >
        {/* Luxury Gold Corner Filigree Accents (For luxurious theme) */}
        {letter.theme === 'luxurious' && (
          <>
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-400/60 pointer-events-none" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-400/60 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-400/60 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-400/60 pointer-events-none" />
          </>
        )}

        {/* Cherry Red Corner Filigree Accents (For romantic theme) */}
        {letter.theme === 'romantic' && (
          <>
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-rose-400/70 pointer-events-none" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-rose-400/70 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-rose-400/70 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-rose-400/70 pointer-events-none" />
          </>
        )}

        {/* Quiet Editorial Header Metadata */}
        <div className="flex items-center justify-between text-xs tracking-widest uppercase mb-8 pb-4 border-b border-current opacity-40 font-sans">
          <span>{letter.occasion.replace('_', ' ')} Letter</span>
          <span>·</span>
          <span>Handcrafted For {letter.recipientName || 'You'}</span>
          <span>·</span>
          <span>Keepsake</span>
        </div>

        {/* Opening Salutation */}
        <header className="mb-8">
          <h1
            className={`text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight ${
              letter.theme === 'romantic' ? 'text-rose-200' : ''
            } ${fontConfig.cssClass}`}
          >
            {letter.greeting || `To My Favourite Person,`}
          </h1>
        </header>

        {/* Letter Body Content */}
        <div className={`space-y-6 ${fontConfig.cssClass} ${fontSizeClasses}`}>
          {/* Section 1: Opening & Why I Love You */}
          {letter.openingReason && (
            <div className="text-justify leading-relaxed">
              <span className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:opacity-90">
                {letter.openingReason}
              </span>
            </div>
          )}

          {/* Section 2: Favourite Memories */}
          {letter.memories && (
            <div className="pt-2">
              <h2 className="text-xs uppercase tracking-widest font-sans opacity-50 mb-2">
                Memories I Revisit
              </h2>
              <p className="leading-relaxed opacity-95">{letter.memories}</p>
            </div>
          )}

          {/* Photographs Section (Polaroid Scrapbook) */}
          {letter.photos && letter.photos.length > 0 && (
            <PhotoGallery photos={letter.photos} theme={letter.theme} />
          )}

          {/* Section 3: The Little Things */}
          {letter.smallThings && (
            <div className="pt-2">
              <h2 className="text-xs uppercase tracking-widest font-sans opacity-50 mb-2">
                The Little Things You Do
              </h2>
              <p className="leading-relaxed opacity-95">{letter.smallThings}</p>
            </div>
          )}

          {/* Section 4: My Feelings & Promises */}
          {letter.feelings && (
            <div className="pt-2">
              <h2 className="text-xs uppercase tracking-widest font-sans opacity-50 mb-2">
                What My Heart Knows
              </h2>
              <p className="leading-relaxed opacity-95">{letter.feelings}</p>
            </div>
          )}

          {/* Section 5: Heartfelt Ending & Signature */}
          {letter.ending && (
            <div className="pt-4 pb-2">
              <p className="leading-relaxed font-medium">{letter.ending}</p>
            </div>
          )}
        </div>

        {/* Letter Sign-off and Wax Stamp Seal */}
        <footer className="mt-12 pt-8 border-t border-current/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative">
          <div className={`relative z-10 ${fontConfig.cssClass}`}>
            {/* Decorative Handcrafted Ink Splash Effect */}
            <InkSplash
              theme={letter.theme}
              size="md"
              className="-left-8 -top-4"
            />
            <p className="text-sm opacity-70 italic font-serif relative z-10">
              {letter.signature || 'With all my heart,'}
            </p>
            <p className="text-2xl md:text-3xl font-bold tracking-wide mt-1 relative z-10">
              {letter.senderName || 'Your Love'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <WaxSeal
              style={letter.sealStyle}
              recipientName={letter.recipientName}
              senderName={letter.senderName}
              color={themeConfig.waxSealColor}
              size={54}
            />
            <div className="text-[10px] uppercase tracking-wider opacity-60 font-sans leading-tight">
              <span>Sealed with Love</span>
              <br />
              <span>Permanent Keepsake</span>
            </div>
          </div>
        </footer>
      </article>

      {/* Floating Heart React Button for Recipient */}
      <HeartReactButton
        theme={letter.theme}
        recipientName={letter.recipientName}
      />

      {/* Tiny Footer: "Made with love, just for you. ♡" */}
      <footer className="mt-8 pt-4 pb-2 text-center text-xs font-serif italic text-rose-900/60 no-print">
        <span>Made with love, just for you. ♡</span>
      </footer>
    </div>
  );
};
