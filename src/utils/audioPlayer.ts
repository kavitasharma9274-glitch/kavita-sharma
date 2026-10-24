// Web Audio romantic ambient generator and link helpers

class RomanticSynth {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timerId: number | null = null;
  private chordIndex = 0;
  private currentVolume = 0.3;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play gentle bell/chime for wax seal break
  public playSealBreakSound() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Soft paper rustle / high delicate chime
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
      osc1.frequency.exponentialRampToValueAtTime(1174.66, now + 0.4); // D6

      osc2.frequency.setValueAtTime(440, now);
      osc2.frequency.exponentialRampToValueAtTime(659.25, now + 0.2);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.25);
      osc2.stop(now + 1.25);
    } catch {
      // Audio might be blocked by browser policy until interaction
    }
  }

  // Play delicate romantic sparkle chime for heart reactions
  public playHeartChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Soft high sparkle frequencies (pentatonic bells: E6, G#6, B6, E7)
      const freqs = [1318.51, 1661.22, 1975.53, 2637.02];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.001, now + idx * 0.05);
        gain.gain.linearRampToValueAtTime(0.06 / (idx + 1), now + idx * 0.05 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.7);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.75);
      });
    } catch {
      // ignore
    }
  }

  // Play ambient romantic piano/strings progression
  public startAmbient(trackId: string = 'piano_sunset') {
    if (this.isPlaying) return;
    this.initCtx();
    if (!this.ctx) return;
    this.isPlaying = true;

    // Chord progressions in frequencies
    // Piano sunset: Cmaj9, G/B, Am9, Fmaj7
    const sunsetChords = [
      [130.81, 196.0, 246.94, 293.66, 329.63], // C, G, B, D, E (Cmaj9)
      [123.47, 196.0, 246.94, 293.66, 392.0],  // B, G, B, D, G (G/B)
      [110.0, 164.81, 220.0, 261.63, 329.63],  // A, E, A, C, E (Am9)
      [87.31, 174.61, 220.0, 261.63, 329.63],  // F, F, A, C, E (Fmaj7)
    ];

    // Acoustic cozy: G, Em, C, D
    const acousticChords = [
      [98.0, 146.83, 196.0, 246.94, 392.0],
      [82.41, 123.47, 164.81, 246.94, 329.63],
      [130.81, 164.81, 196.0, 261.63, 329.63],
      [146.83, 220.0, 293.66, 369.99, 440.0],
    ];

    // Midnight serenade: Dm9, Bbmaj7, Fmaj7, C
    const midnightChords = [
      [146.83, 220.0, 261.63, 329.63, 349.23],
      [116.54, 174.61, 220.0, 261.63, 349.23],
      [87.31, 174.61, 220.0, 261.63, 329.63],
      [130.81, 196.0, 261.63, 329.63, 392.0],
    ];

    const chords =
      trackId === 'acoustic_cozy'
        ? acousticChords
        : trackId === 'midnight_serenade'
        ? midnightChords
        : sunsetChords;

    const playChordStep = () => {
      if (!this.isPlaying || !this.ctx) return;
      const currentChord = chords[this.chordIndex % chords.length];
      this.chordIndex++;

      const now = this.ctx.currentTime;
      const duration = 4.2;

      // Arpeggiate notes softly
      currentChord.forEach((freq, idx) => {
        const noteDelay = idx * 0.14;
        const noteStart = now + noteDelay;

        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const filter = this.ctx!.createBiquadFilter();

        osc.type = idx === 0 ? 'sine' : idx % 2 === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);

        // Warm lowpass filter to make it sound soft like an upright felt piano
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800 + idx * 200, noteStart);
        filter.frequency.exponentialRampToValueAtTime(350, noteStart + duration);

        gain.gain.setValueAtTime(0.001, noteStart);
        gain.gain.linearRampToValueAtTime(
          (this.currentVolume * (0.16 / (idx + 1))),
          noteStart + 0.08
        );
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + duration - 0.1);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(noteStart);
        osc.stop(noteStart + duration);
      });

      this.timerId = window.setTimeout(playChordStep, 4000);
    };

    playChordStep();
  }

  public stopAmbient() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public setVolume(vol: number) {
    this.currentVolume = Math.max(0, Math.min(1, vol));
  }

  public getIsPlaying() {
    return this.isPlaying;
  }
}

export const romanticAudio = new RomanticSynth();

// Helper to sanitize Spotify / YouTube embeds
export function getEmbedUrl(url: string): { type: 'spotify' | 'youtube' | 'invalid'; embedUrl: string } {
  if (!url) return { type: 'invalid', embedUrl: '' };

  // Spotify check
  // e.g. https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT
  const spotifyTrackMatch = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
  if (spotifyTrackMatch) {
    return {
      type: 'spotify',
      embedUrl: `https://open.spotify.com/embed/track/${spotifyTrackMatch[1]}?utm_source=generator&theme=0`,
    };
  }

  const spotifyPlaylistMatch = url.match(/spotify\.com\/playlist\/([a-zA-Z0-9]+)/);
  if (spotifyPlaylistMatch) {
    return {
      type: 'spotify',
      embedUrl: `https://open.spotify.com/embed/playlist/${spotifyPlaylistMatch[1]}?utm_source=generator&theme=0`,
    };
  }

  // YouTube check
  // e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ or https://youtu.be/dQw4w9WgXcQ
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (ytMatch) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&loop=1`,
    };
  }

  return { type: 'invalid', embedUrl: '' };
}
