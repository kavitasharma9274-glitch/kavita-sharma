# Floating Heart React Button with Animated Emojis

Implement a delightful, interactive floating "heart react" button in `LetterView` that allows the recipient to react to the love letter with floating heart emojis, a sweet reaction counter, and an intimate audio chime.

## User Review & Critical Decisions

> [!IMPORTANT]
> The user confirmed preferences in Phase 1:
> - **Placement**: Floating in the bottom-right corner with a sweet reaction counter badge (symmetrically balancing the audio widget in the bottom-left).
> - **Sensory Effect**: Upward-drifting heart emojis (`❤️`, `💖`, `💕`, `✨`) with natural sinusoidal float and a soft musical chime on tap.

- **Confirmed Decision 1**: Render the button as an elevated floating pill/circular control in the bottom-right viewport with an active tap bounce.
- **Confirmed Decision 2**: Spawn dynamic lightweight floating heart particles that drift upwards across the screen with randomized sway, scaling, and fade.
- **Confirmed Decision 3**: Include a gentle sparkle chime using the browser Web Audio synthesizer and save reaction count to `localStorage`.

---

## 1. Overview & Core Concept

When the girlfriend reads her letter, she can tap the floating heart button to shower the screen in loving hearts. Each tap produces a cluster of animated heart emojis drifting gently toward the sky with a soft music chime, and increments a reaction counter (e.g., `"Loved 12 times"`).

---

## 2. User Experience & Visual Design

### A. The Floating React Button (`HeartReactButton.tsx`)
```
┌──────────────────────────────────────────────────────────────┐
│                    LETTER VIEW VIEWPORT                      │
│                                                              │
│  [Audio Player]                          [ ❤️ Loved 14 ]    │
│  (Bottom-Left)                           (Bottom-Right)      │
└──────────────────────────────────────────────────────────────┘
```
- **Styling**: Tactile cherry red / rose pill with an embossed heart icon, counter badge, and glowing romantic pulse.
- **Micro-Interaction**: Gentle spring compression (`scale: 0.92 -> 1.1 -> 1.0`) on tap with an expanding cherry ring wave.

### B. Upward-Drifting Heart Emoji Physics
- Each tap spawns 5–8 emoji particles (`❤️`, `💖`, `💕`, `💓`, `✨`).
- Particles launch upward from the button with randomized horizontal trajectories (`-40px` to `+40px`), varied upward speeds (2.5s–4s), and gentle 3D tilt.
- Zero layout recalculations: Managed via pure compositor properties (`transform`, `opacity`) with automated cleanup after completion.

### C. Sensory Polish
- Gentle high-frequency pentatonic chime synthesized in `RomanticSynth` via Web Audio API.
- Counter increments seamlessly with sweet tooltip ("Send love back").

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Client-Side React Particle State with Keyed List**
  - *Chosen Approach*: Maintain an active particles list in component state with automated cleanup timers.
  - *Why*: Lightweight, instant 60fps performance, and zero external dependency footprint.
  - *Alternatives Considered*: Canvas rendering (unnecessary DOM overhead for small bursts of emojis).

- **Decision 2: Balanced Viewport Floating Zones**
  - *Chosen Approach*: Position the heart react button at `fixed bottom-5 right-5 z-40`, perfectly balancing the audio player at `bottom-5 left-5`.
  - *Why*: Adheres to Rule 1I (Overlay & Sticky Surface Governance) by keeping mobile overlay under 15% viewport height and never obstructing central letter reading.

---

## 4. Technical Architecture & Component Mapping

```
┌──────────────────────────────────────────────────────────────────┐
│                            LetterView                            │
│                                │                                 │
│        ┌───────────────────────┴───────────────────────┐         │
│        ▼                                               ▼         │
│ ┌───────────────┐                             ┌────────────────┐ │
│ │ Stationery    │                             │ HeartReact     │ │
│ │ Prose & Ink   │                             │ Floating Button│ │
│ └───────────────┘                             └───────┬────────┘ │
│                                                       │          │
│                                         ┌─────────────▼────────┐ │
│                                         │ FloatingHeartEmitter │ │
│                                         │ (Upward Emojis &     │ │
│                                         │  Sparkle Chime)      │ │
│                                         └──────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

- **`src/utils/audioPlayer.ts`**: Add `playHeartChime()` method creating a soft, bell-like musical sparkle.
- **`src/components/HeartReactButton.tsx`**: New component with floating layout, reaction counter, particle emitter, and spring tap feedback.
- **`src/components/LetterView.tsx`**: Mount `HeartReactButton` with theme support.
