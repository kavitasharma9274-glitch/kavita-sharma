import React, { useState, useEffect } from 'react';
import { LetterData } from './types';
import { INITIAL_LETTER, THEMES } from './data/templates';
import {
  decodeLetterFromHash,
  loadDraftFromStorage,
  saveDraftToStorage,
  saveLetterToHistory,
} from './utils/urlSharing';
import { Header } from './components/Header';
import { LetterEnvelope } from './components/LetterEnvelope';
import { LetterView } from './components/LetterView';
import { LetterEditor } from './components/LetterEditor/LetterEditor';
import { CountdownView } from './components/CountdownView';
import { PetalOverlay } from './components/PetalOverlay';
import { AudioWidget } from './components/AudioWidget';
import { PublishModal } from './components/PublishModal';
import { LoveGamesView } from './components/LoveGames/LoveGamesView';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [letter, setLetter] = useState<LetterData>(() => {
    // Check if opened via URL hash
    if (typeof window !== 'undefined' && window.location.hash) {
      const decoded = decodeLetterFromHash(window.location.hash);
      if (decoded) return decoded;
    }
    // Check local storage draft
    const saved = loadDraftFromStorage();
    if (saved) return saved;

    return INITIAL_LETTER;
  });

  const [currentView, setCurrentView] = useState<
    'editor' | 'envelope' | 'games' | 'letter' | 'countdown'
  >(() => {
    // If opened with hash link
    if (typeof window !== 'undefined' && window.location.hash) {
      const decoded = decodeLetterFromHash(window.location.hash);
      if (decoded?.isScheduled && decoded.scheduledDate) {
        const unlockTime = new Date(decoded.scheduledDate).getTime();
        if (unlockTime > Date.now()) {
          return 'countdown';
        }
      }
      return 'envelope';
    }
    // Default to the romantic welcome screen envelope
    return 'envelope';
  });

  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // Auto-save draft
  useEffect(() => {
    saveDraftToStorage(letter);
  }, [letter]);

  // Handle Hash changes (e.g. if user navigates or reloads)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash) {
        const decoded = decodeLetterFromHash(window.location.hash);
        if (decoded) {
          setLetter(decoded);
          if (decoded.isScheduled && decoded.scheduledDate) {
            const unlockTime = new Date(decoded.scheduledDate).getTime();
            if (unlockTime > Date.now()) {
              setCurrentView('countdown');
              return;
            }
          }
          setCurrentView('envelope');
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [completedGames, setCompletedGames] = useState<Record<string, boolean>>({
    fill: false,
    match: false,
    scratch: false,
    catch: false,
  });

  const allGamesCompleted = Boolean(
    completedGames.fill &&
    completedGames.match &&
    completedGames.scratch &&
    completedGames.catch
  );

  const handleGameCompleted = (gameKey: 'fill' | 'match' | 'scratch' | 'catch') => {
    setCompletedGames((prev) => ({
      ...prev,
      [gameKey]: true,
    }));
  };

  const handleUnlockAllGames = () => {
    setCompletedGames({
      fill: true,
      match: true,
      scratch: true,
      catch: true,
    });
  };

  const handleLetterChange = (updated: LetterData) => {
    setLetter(updated);
  };

  const handleOpenEnvelopeComplete = () => {
    setCurrentView('letter');
  };

  const currentTheme = THEMES[letter.theme] || THEMES.luxurious;

  return (
    <div
      className={`min-h-screen flex flex-col font-sans-clean transition-colors duration-500 relative ${currentTheme.backdropClass}`}
    >
      {/* Ambient Romantic Petals / Hearts / Stardust */}
      {letter.ambientPetals && (
        <PetalOverlay type={letter.petalsType || 'petals'} density={18} />
      )}

      {/* Persistent Audio Widget (Piano synthesizer or Spotify/YouTube player) */}
      <AudioWidget
        musicType={letter.musicType}
        musicTrack={letter.musicTrack}
        theme={letter.theme}
      />

      {/* Top Navigation Bar adhering to Top Bar Contract */}
      <Header
        currentView={currentView}
        isLetterUnlocked={allGamesCompleted}
        onNavigate={(view) => {
          if (view === 'countdown') {
            if (!letter.isScheduled || !letter.scheduledDate) {
              // Ensure scheduled date is set to a future date if user wants to test countdown
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              setLetter({
                ...letter,
                isScheduled: true,
                scheduledDate: tomorrow.toISOString().slice(0, 16),
              });
            }
          }
          setCurrentView(view);
        }}
        onShare={() => {
          saveLetterToHistory(letter);
          setIsPublishModalOpen(true);
        }}
        theme={letter.theme}
      />

      {/* Main Experience Router with Smooth Cinematic Transitions */}
      <main className="flex-1 flex flex-col items-center justify-start w-full relative z-10 py-4 sm:py-6 overflow-x-hidden">
        <AnimatePresence mode="wait">
          {/* VIEW 1: Studio Editor */}
          {currentView === 'editor' && (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex justify-center"
            >
              <LetterEditor
                letter={letter}
                onChange={handleLetterChange}
                onPreviewEnvelope={() => setCurrentView('envelope')}
                onPreviewGames={() => setCurrentView('games')}
                onPreviewLetter={() => setCurrentView('letter')}
                onPublish={() => {
                  saveLetterToHistory(letter);
                  setIsPublishModalOpen(true);
                }}
              />
            </motion.div>
          )}

          {/* VIEW 2: Sealed 3D Envelope */}
          {currentView === 'envelope' && (
            <motion.div
              key="envelope"
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -12 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex-1 flex flex-col items-center justify-center"
            >
              <LetterEnvelope
                letter={letter}
                onOpened={handleOpenEnvelopeComplete}
                isUnlocked={true}
              />
            </motion.div>
          )}

          {/* VIEW 2.5: Interactive Love Games Intermission */}
          {currentView === 'games' && (
            <motion.div
              key="games"
              initial={{ opacity: 0, scale: 0.96, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -12 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex-1 flex flex-col items-center justify-center"
            >
              <LoveGamesView
                letter={letter}
                completedGames={completedGames}
                onGameCompleted={handleGameCompleted}
                onProceedToLetter={() => setCurrentView('letter')}
                onBackToEnvelope={() => setCurrentView('envelope')}
                onUnlockAllGames={handleUnlockAllGames}
              />
            </motion.div>
          )}

          {/* VIEW 3: Unfolded Love Letter */}
          {currentView === 'letter' && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex flex-col items-center"
            >
              <LetterView
                letter={letter}
                onBackToEnvelope={() => setCurrentView('envelope')}
                onPlayGames={() => setCurrentView('games')}
                onEditLetter={() => setCurrentView('editor')}
                onShare={() => {
                  saveLetterToHistory(letter);
                  setIsPublishModalOpen(true);
                }}
              />
            </motion.div>
          )}

          {/* VIEW 4: Scheduled Countdown Lock Screen */}
          {currentView === 'countdown' && (
            <motion.div
              key="countdown"
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -12 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex-1 flex flex-col items-center justify-center"
            >
              <CountdownView
                letter={letter}
                onUnlocked={() => setCurrentView('envelope')}
                onBypassLock={() => setCurrentView('envelope')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Publish & Share Modal */}
      {isPublishModalOpen && (
        <PublishModal
          letter={letter}
          onClose={() => setIsPublishModalOpen(false)}
          onOpenRecipientView={() => {
            setIsPublishModalOpen(false);
            if (letter.isScheduled && letter.scheduledDate) {
              const diff = new Date(letter.scheduledDate).getTime() - Date.now();
              if (diff > 0) {
                setCurrentView('countdown');
                return;
              }
            }
            setCurrentView('envelope');
          }}
        />
      )}
    </div>
  );
}
