import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Music, Disc3, ExternalLink } from 'lucide-react';
import { romanticAudio, getEmbedUrl } from '../utils/audioPlayer';
import { CURATED_TRACKS } from '../data/templates';

interface AudioWidgetProps {
  musicType: 'curated' | 'spotify' | 'youtube' | 'none';
  musicTrack: string;
  theme: 'minimalist' | 'romantic' | 'luxurious';
}

export const AudioWidget: React.FC<AudioWidgetProps> = ({
  musicType,
  musicTrack,
  theme,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Curated synth audio handling
  useEffect(() => {
    if (musicType === 'curated' && isPlaying && !isMuted) {
      romanticAudio.startAmbient(musicTrack);
    } else {
      romanticAudio.stopAmbient();
    }

    return () => {
      romanticAudio.stopAmbient();
    };
  }, [musicType, musicTrack, isPlaying, isMuted]);

  if (musicType === 'none') {
    return null;
  }

  const trackInfo =
    musicType === 'curated'
      ? CURATED_TRACKS.find((t) => t.id === musicTrack) || CURATED_TRACKS[0]
      : null;

  const embedInfo =
    musicType === 'spotify' || musicType === 'youtube'
      ? getEmbedUrl(musicTrack)
      : null;

  const themeStyles = {
    minimalist: 'bg-white/95 text-stone-800 border-rose-200 shadow-lg',
    romantic: 'bg-[#380715]/95 text-rose-100 border-rose-500/60 shadow-rose-950/60 shadow-xl',
    luxurious: 'bg-[#FFFDF9]/95 text-stone-900 border-amber-300/80 shadow-amber-950/20 shadow-xl',
  }[theme];

  return (
    <div className="fixed bottom-5 left-5 z-40 no-print">
      {/* Spotify Embed Player */}
      {musicType === 'spotify' && embedInfo?.embedUrl && (
        <div className="mb-2 w-72 rounded-xl overflow-hidden shadow-2xl border border-stone-200 bg-black">
          <iframe
            src={embedInfo.embedUrl}
            width="100%"
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Romantic Spotify Track"
          />
        </div>
      )}

      {/* YouTube Embed Player */}
      {musicType === 'youtube' && embedInfo?.embedUrl && (
        <div className="mb-2 w-72 rounded-xl overflow-hidden shadow-2xl border border-stone-200 bg-black">
          <iframe
            src={embedInfo.embedUrl}
            width="100%"
            height="150"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            title="Romantic Song"
          />
        </div>
      )}

      {/* Curated Ambient Synthesizer Player */}
      {musicType === 'curated' && (
        <div
          className={`flex items-center gap-3 px-3.5 py-2 rounded-full border backdrop-blur-md transition-all duration-300 ${themeStyles}`}
        >
          <button
            onClick={() => {
              if (!isPlaying) {
                setIsPlaying(true);
                setIsMuted(false);
              } else {
                setIsPlaying(false);
              }
            }}
            className="flex items-center gap-2 focus:outline-hidden"
            title={isPlaying ? 'Pause romantic melody' : 'Play romantic melody'}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-700 ${
                isPlaying ? 'animate-spin' : ''
              } ${
                theme === 'romantic'
                  ? 'bg-rose-500/20 text-rose-300'
                  : theme === 'luxurious'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-600'
              }`}
            >
              <Disc3 size={16} />
            </div>

            <div className="text-left text-xs max-w-[140px] truncate">
              <span className="font-semibold block truncate">
                {trackInfo?.title || 'Romantic Melody'}
              </span>
              <span className="text-[10px] opacity-70 block truncate">
                {isPlaying ? 'Now playing' : 'Click to play melody'}
              </span>
            </div>
          </button>

          {isPlaying && (
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-full hover:bg-black/5 transition-colors opacity-75 hover:opacity-100 focus:outline-hidden"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
