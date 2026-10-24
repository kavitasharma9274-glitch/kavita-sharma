import React, { useState } from 'react';
import {
  LetterData,
  Occasion,
  ThemeId,
  FontId,
  PaperTexture,
  PhotoMemory,
} from '../../types';
import {
  OCCASIONS,
  THEMES,
  FONTS,
  CURATED_PHOTOS,
  CURATED_TRACKS,
} from '../../data/templates';
import {
  Heart,
  Palette,
  Type,
  PenTool,
  Image as ImageIcon,
  Music,
  Clock,
  Sparkles,
  CheckCircle,
  Plus,
  Trash2,
  Play,
  Square,
  Upload,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { romanticAudio } from '../../utils/audioPlayer';
import { InkSplash } from '../InkSplash';

interface LetterEditorProps {
  letter: LetterData;
  onChange: (updated: LetterData) => void;
  onPreviewEnvelope: () => void;
  onPreviewLetter: () => void;
  onPreviewGames?: () => void;
  onPublish: () => void;
}

type TabKey =
  | 'details'
  | 'theme'
  | 'typography'
  | 'writing'
  | 'photos'
  | 'music'
  | 'scheduling'
  | 'review';

export const LetterEditor: React.FC<LetterEditorProps> = ({
  letter,
  onChange,
  onPreviewEnvelope,
  onPreviewLetter,
  onPreviewGames,
  onPublish,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('details');
  const [testPlayingTrack, setTestPlayingTrack] = useState<string | null>(null);

  const updateField = <K extends keyof LetterData>(
    field: K,
    value: LetterData[K]
  ) => {
    onChange({ ...letter, [field]: value });
  };

  const currentOccasionConfig =
    OCCASIONS.find((o) => o.id === letter.occasion) || OCCASIONS[0];

  // Helper to load occasion starter template
  const applyOccasionTemplate = (occ: Occasion) => {
    const config = OCCASIONS.find((o) => o.id === occ);
    if (!config) return;
    onChange({
      ...letter,
      occasion: occ,
      greeting: config.defaultGreeting,
      openingReason: config.sampleOpening,
      memories: config.sampleMemories,
      smallThings: config.sampleSmallThings,
      feelings: config.sampleFeelings,
      ending: config.sampleEnding,
      signature: config.sampleSignature,
    });
  };

  const handleCustomPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const newPhoto: PhotoMemory = {
          id: `photo-custom-${Date.now()}`,
          url: reader.result,
          caption: 'Special Memory',
          dateLocation: 'Together',
          description: 'A moment with you I never want to forget.',
        };
        updateField('photos', [...letter.photos, newPhoto]);
      }
    };
    reader.readAsDataURL(file);
  };

  const addCuratedPhoto = (photo: PhotoMemory) => {
    if (letter.photos.some((p) => p.id === photo.id)) return;
    updateField('photos', [...letter.photos, photo]);
  };

  const removePhoto = (id: string) => {
    updateField(
      'photos',
      letter.photos.filter((p) => p.id !== id)
    );
  };

  const updatePhotoDetail = (
    id: string,
    field: keyof PhotoMemory,
    val: string
  ) => {
    updateField(
      'photos',
      letter.photos.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );
  };

  const handleTestAudio = (trackId: string) => {
    if (testPlayingTrack === trackId) {
      romanticAudio.stopAmbient();
      setTestPlayingTrack(null);
    } else {
      romanticAudio.startAmbient(trackId);
      setTestPlayingTrack(trackId);
    }
  };

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'details', label: '1. Names & Occasion', icon: <Heart size={15} /> },
    { key: 'theme', label: '2. Colour Theme', icon: <Palette size={15} /> },
    { key: 'typography', label: '3. Fonts & Paper', icon: <Type size={15} /> },
    { key: 'writing', label: '4. Love Letter', icon: <PenTool size={15} /> },
    { key: 'photos', label: '5. Photographs', icon: <ImageIcon size={15} /> },
    { key: 'music', label: '6. Music & Petals', icon: <Music size={15} /> },
    { key: 'scheduling', label: '7. Scheduled Date', icon: <Clock size={15} /> },
    { key: 'review', label: '8. Publish & Share', icon: <CheckCircle size={15} /> },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4">
      {/* Editorial Header */}
      <div className="text-center mb-8">
        <span className="text-xs uppercase tracking-widest text-stone-500 font-sans block mb-1">
          Handcrafted Letter Studio
        </span>
        <h1 className="text-3xl md:text-4xl font-serif-editorial font-medium text-stone-900">
          Create A Letter For Her
        </h1>
        <p className="text-stone-600 text-xs md:text-sm mt-1.5 max-w-lg mx-auto">
          Craft an intimate, sealed digital love letter with custom paper styling,
          photo memories, romantic melodies, and timed reveals.
        </p>

        {/* Live Preview Shortcuts */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={onPreviewEnvelope}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-xs font-medium text-stone-700 shadow-2xs transition-colors"
          >
            <Eye size={13} />
            <span>Preview Sealed Envelope</span>
          </button>
          <button
            onClick={onPreviewLetter}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-xs font-medium text-stone-700 shadow-2xs transition-colors"
          >
            <Eye size={13} />
            <span>Preview Unfolded Paper</span>
          </button>
        </div>
      </div>

      {/* Segmented Navigation Bar */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl mb-8 overflow-x-auto border border-stone-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === tab.key
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Form Content */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8 shadow-xs">
        {/* TAB 1: Starting details */}
        {activeTab === 'details' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-serif-editorial font-semibold text-stone-900 mb-1">
                1. Starting the Website
              </h2>
              <p className="text-xs md:text-sm text-stone-600">
                Begin by personalizing who this letter is for, who it is from, and
                the special occasion you are celebrating.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Recipient's Name or Nickname
                </label>
                <input
                  type="text"
                  value={letter.recipientName}
                  onChange={(e) => updateField('recipientName', e.target.value)}
                  placeholder="e.g. Eleanor, My Sunshine, Honey"
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-hidden transition-colors"
                />
                <span className="text-[11px] text-stone-500 mt-1 block">
                  This will be inscribed on the envelope and greeting.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Your Name or Nickname
                </label>
                <input
                  type="text"
                  value={letter.senderName}
                  onChange={(e) => updateField('senderName', e.target.value)}
                  placeholder="e.g. Julian, Your Bear"
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-hidden transition-colors"
                />
                <span className="text-[11px] text-stone-500 mt-1 block">
                  Appears on the return address and sign-off signature.
                </span>
              </div>
            </div>

            {/* Occasion Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Select Occasion
                </label>
                <span className="text-[11px] text-stone-500">
                  Picking an occasion loads custom romantic inspiration prompts
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {OCCASIONS.map((occ) => {
                  const isSelected = letter.occasion === occ.id;
                  return (
                    <button
                      key={occ.id}
                      type="button"
                      onClick={() => applyOccasionTemplate(occ.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                          : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100 text-stone-800'
                      }`}
                    >
                      <span className="font-semibold text-xs block mb-1">
                        {occ.label}
                      </span>
                      <span
                        className={`text-[10px] leading-tight line-clamp-2 ${
                          isSelected ? 'text-stone-300' : 'text-stone-500'
                        }`}
                      >
                        {occ.tagline}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveTab('theme')}
                className="px-6 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium tracking-wide transition-colors"
              >
                Continue to Colour Theme →
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Colour Theme */}
        {activeTab === 'theme' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-serif-editorial font-semibold text-stone-900 mb-1">
                2. Choosing the Colour Theme
              </h2>
              <p className="text-xs md:text-sm text-stone-600">
                LovePaper features three distinct design themes crafted for different moods.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Minimalist Theme Card */}
              <div
                onClick={() => updateField('theme', 'minimalist')}
                className={`cursor-pointer rounded-2xl border-2 p-5 transition-all relative ${
                  letter.theme === 'minimalist'
                    ? 'border-stone-900 shadow-md ring-2 ring-stone-900/10'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                {letter.theme === 'minimalist' && (
                  <div className="absolute top-3 right-3 text-stone-900">
                    <CheckCircle size={18} />
                  </div>
                )}
                <div className="h-28 rounded-xl bg-[#FAF8F5] border border-stone-200 p-4 flex flex-col justify-between mb-4 shadow-2xs">
                  <span className="text-[10px] uppercase tracking-widest text-stone-400 font-sans">
                    Minimalist Canvas
                  </span>
                  <div>
                    <span className="text-sm font-serif text-stone-800 block">
                      To My Favourite Person
                    </span>
                    <span className="text-[10px] text-stone-500 font-serif italic">
                      Warm alabaster & pure dark ink...
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold text-sm text-stone-900">
                  Minimalist Theme
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  A simple and clean design that focuses on the written message
                  rather than decorative elements. Warm parchment and crisp typography.
                </p>
              </div>

              {/* Romantic Theme Card */}
              <div
                onClick={() => updateField('theme', 'romantic')}
                className={`cursor-pointer rounded-2xl border-2 p-5 transition-all relative ${
                  letter.theme === 'romantic'
                    ? 'border-rose-600 shadow-md ring-2 ring-rose-600/10'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                {letter.theme === 'romantic' && (
                  <div className="absolute top-3 right-3 text-rose-600">
                    <CheckCircle size={18} />
                  </div>
                )}
                <div className="h-28 rounded-xl bg-gradient-to-br from-[#380715] to-[#24040E] border border-rose-500/50 p-4 flex flex-col justify-between mb-4 shadow-2xs">
                  <span className="text-[10px] uppercase tracking-widest text-rose-300/80 font-sans">
                    Cheery Cherry Romance
                  </span>
                  <div>
                    <span className="text-sm font-serif text-rose-50 block">
                      To The One I Cherish
                    </span>
                    <span className="text-[10px] text-rose-200/90 font-serif italic">
                      Cheery red accents & romantic candlelit ambiance...
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold text-sm text-stone-900">
                  Cheery Cherry Romance
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Luminous cheery red on deep velvety wine stationery with glowing candlelit
                  warmth, floating rose petals, and intimate romantic atmosphere.
                </p>
              </div>

              {/* Luxurious Theme Card */}
              <div
                onClick={() => updateField('theme', 'luxurious')}
                className={`cursor-pointer rounded-2xl border-2 p-5 transition-all relative ${
                  letter.theme === 'luxurious'
                    ? 'border-amber-600 shadow-md ring-2 ring-amber-600/10'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                {letter.theme === 'luxurious' && (
                  <div className="absolute top-3 right-3 text-amber-700">
                    <CheckCircle size={18} />
                  </div>
                )}
                <div className="h-28 rounded-xl bg-[#FDFBF7] border border-amber-300/80 p-4 flex flex-col justify-between mb-4 shadow-2xs">
                  <span className="text-[10px] uppercase tracking-widest text-amber-700/60 font-sans">
                    Luxurious Gold Foil
                  </span>
                  <div>
                    <span className="text-sm font-serif text-stone-900 block">
                      My Dearest Treasure
                    </span>
                    <span className="text-[10px] text-amber-800 font-serif italic">
                      Cream and antique gold styling...
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold text-sm text-stone-900">
                  Luxurious Theme
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Uses rich cream and gold styling for an elegant, premium
                  appearance with filigree accents and gold seal.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className="px-4 py-2 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('typography')}
                className="px-6 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium tracking-wide transition-colors"
              >
                Continue to Fonts & Paper →
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: Choosing the Font & Paper */}
        {activeTab === 'typography' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-serif-editorial font-semibold text-stone-900 mb-1">
                3. Choosing the Font & Stationery
              </h2>
              <p className="text-xs md:text-sm text-stone-600">
                The letter is designed to resemble a traditional personal letter.
                Select the typography and paper finish that suits your voice.
              </p>
            </div>

            {/* Font Family Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-3">
                Letter Typography
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {FONTS.map((f) => {
                  const isSelected = letter.font === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => updateField('font', f.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-stone-900 bg-stone-50 shadow-xs ring-1 ring-stone-900'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-stone-900">
                          {f.name}
                        </span>
                        <span className="text-[10px] text-stone-500 font-sans">
                          {f.styleLabel}
                        </span>
                      </div>
                      <p
                        className={`text-lg my-1.5 text-stone-800 ${f.cssClass}`}
                      >
                        I love you more each day
                      </p>
                      <p className="text-[11px] text-stone-500 font-sans">
                        {f.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Font Size & Paper Texture */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-100">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                  Reading Text Size
                </label>
                <div className="flex items-center gap-2 p-1 bg-stone-100 rounded-lg">
                  {(['sm', 'md', 'lg', 'xl'] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => updateField('fontSize', sz)}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        letter.fontSize === sz
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {sz.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                  Paper Texture & Edges
                </label>
                <div className="flex items-center gap-2 p-1 bg-stone-100 rounded-lg">
                  {(
                    [
                      { id: 'clean', label: 'Smooth' },
                      { id: 'parchment', label: 'Parchment' },
                      { id: 'linen', label: 'Cotton Linen' },
                      { id: 'deckled', label: 'Deckled Edge' },
                    ] as const
                  ).map((tex) => (
                    <button
                      key={tex.id}
                      type="button"
                      onClick={() => updateField('paperTexture', tex.id)}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        letter.paperTexture === tex.id
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {tex.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Wax Seal Emblem */}
            <div className="pt-4 border-t border-stone-100">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                Wax Seal Stamp Motif
              </label>
              <div className="flex flex-wrap items-center gap-3">
                {[
                  { id: 'heart', label: 'Heart Emblem' },
                  { id: 'monogram', label: 'Couple Monogram' },
                  { id: 'rose', label: 'Wild Rose' },
                  { id: 'infinity', label: 'Infinity Symbol' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() =>
                      updateField('sealStyle', s.id as LetterData['sealStyle'])
                    }
                    className={`px-4 py-2 rounded-lg border text-xs font-medium transition-all ${
                      letter.sealStyle === s.id
                        ? 'border-stone-900 bg-stone-900 text-white'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveTab('theme')}
                className="px-4 py-2 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('writing')}
                className="px-6 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium tracking-wide transition-colors"
              >
                Continue to Writing →
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: Writing the Love Letter */}
        {activeTab === 'writing' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-serif-editorial font-semibold text-stone-900 mb-1">
                  4. Writing the Love Letter
                </h2>
                <p className="text-xs md:text-sm text-stone-600">
                  Fill each heartfelt section, or click to load a pre-written starter template.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => applyOccasionTemplate(letter.occasion)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <RefreshCw size={13} />
                  <span>Reload Starter Template</span>
                </button>
              </div>
            </div>

            {/* Opening Greeting */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Opening Greeting
              </label>
              <input
                type="text"
                value={letter.greeting}
                onChange={(e) => updateField('greeting', e.target.value)}
                placeholder="e.g. To My Favourite Person, My Dearest Eleanor,"
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-hidden"
              />
            </div>

            {/* Paragraph 1: Why I Love Her */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Why I Love You (Opening Paragraph)
              </label>
              <textarea
                rows={4}
                value={letter.openingReason}
                onChange={(e) => updateField('openingReason', e.target.value)}
                placeholder="Express why she means so much to you and the quiet joy she brings into your life..."
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-hidden"
              />
            </div>

            {/* Paragraph 2: Favourite Memories Together */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Our Favourite Memories Together
              </label>
              <textarea
                rows={3}
                value={letter.memories}
                onChange={(e) => updateField('memories', e.target.value)}
                placeholder="Recall specific moments: rainy walks, midnight drives, that cozy cafe table..."
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-hidden"
              />
            </div>

            {/* Paragraph 3: The Small Things She Does */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                The Small Things You Do That Make Me Happy
              </label>
              <textarea
                rows={3}
                value={letter.smallThings}
                onChange={(e) => updateField('smallThings', e.target.value)}
                placeholder="The little quirks, the way she smiles, her sleepy voice, the tiny habits you adore..."
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-hidden"
              />
            </div>

            {/* Paragraph 4: Feelings About Your Relationship */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                My Feelings & Promises For Our Future
              </label>
              <textarea
                rows={3}
                value={letter.feelings}
                onChange={(e) => updateField('feelings', e.target.value)}
                placeholder="Share how you feel about your bond and the future you dream of building together..."
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-hidden"
              />
            </div>

            {/* Heartfelt Ending and Signature */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Heartfelt Ending
                </label>
                <input
                  type="text"
                  value={letter.ending}
                  onChange={(e) => updateField('ending', e.target.value)}
                  placeholder="e.g. Thank you for choosing me every single day."
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Signature Sign-off
                </label>
                <input
                  type="text"
                  value={letter.signature}
                  onChange={(e) => updateField('signature', e.target.value)}
                  placeholder="e.g. Forever and always yours,"
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-hidden"
                />
              </div>
            </div>

            {/* Live Handcrafted Signature Preview with Ink Splash */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/70">
              <span className="text-[10px] uppercase tracking-widest text-stone-500 font-sans block mb-2">
                Handcrafted Signature & Ink Splash Preview
              </span>
              <div className="relative p-6 bg-white rounded-lg border border-stone-200 overflow-hidden flex items-center justify-between">
                <div className="relative z-10">
                  <InkSplash
                    theme={letter.theme}
                    size="sm"
                    className="-left-6 -top-3"
                  />
                  <p className="text-xs text-stone-500 italic font-serif relative z-10">
                    {letter.signature || 'With all my heart,'}
                  </p>
                  <p className="text-xl font-bold tracking-wide text-stone-900 mt-0.5 relative z-10">
                    {letter.senderName || 'Your Love'}
                  </p>
                </div>
                <div className="text-right text-[10px] text-stone-400 font-sans">
                  <span>Decorative ink splash effect active</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveTab('typography')}
                className="px-4 py-2 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('photos')}
                className="px-6 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium tracking-wide transition-colors"
              >
                Continue to Photographs →
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: Photographs */}
        {activeTab === 'photos' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-serif-editorial font-semibold text-stone-900 mb-1">
                5. Adding Photographs (Scrapbook Memories)
              </h2>
              <p className="text-xs md:text-sm text-stone-600">
                Add pictures of you and your girlfriend inside the letter. You can
                write a sweet paragraph about each one to make the letter truly personal.
              </p>
            </div>

            {/* Custom Photo Upload & Curated Selectors */}
            <div className="flex flex-wrap items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium shadow-2xs transition-colors">
                <Upload size={14} />
                <span>Upload Your Own Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCustomPhotoUpload}
                  className="hidden"
                />
              </label>

              <span className="text-xs text-stone-500 font-sans">
                or add from curated romantic memories:
              </span>
            </div>

            {/* Curated Gallery Picker */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CURATED_PHOTOS.map((cp) => {
                const isAdded = letter.photos.some((p) => p.id === cp.id);
                return (
                  <div
                    key={cp.id}
                    className={`rounded-xl border p-2 text-left transition-all ${
                      isAdded
                        ? 'border-stone-900 bg-stone-50 opacity-80'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="aspect-4/3 rounded-lg overflow-hidden bg-stone-100 mb-2">
                      <img
                        src={cp.url}
                        alt={cp.caption}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="font-semibold text-xs text-stone-900 block truncate">
                      {cp.caption}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        isAdded ? removePhoto(cp.id) : addCuratedPhoto(cp)
                      }
                      className={`w-full mt-2 py-1 rounded text-[11px] font-medium transition-colors ${
                        isAdded
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                          : 'bg-stone-900 text-white hover:bg-stone-800'
                      }`}
                    >
                      {isAdded ? 'Remove' : '+ Add to Letter'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* List of Added Photos with Memory Paragraphs */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-800 mb-3">
                Current Photos in Letter ({letter.photos.length})
              </h3>

              {letter.photos.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-stone-200 rounded-xl text-stone-500 text-xs">
                  No photographs added yet. Choose a photo above or upload your own.
                </div>
              ) : (
                <div className="space-y-4">
                  {letter.photos.map((photo, idx) => (
                    <div
                      key={photo.id}
                      className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-xl border border-stone-200 bg-stone-50/50"
                    >
                      <div className="w-28 aspect-4/3 rounded-lg overflow-hidden bg-stone-200 shrink-0">
                        <img
                          src={photo.url}
                          alt={photo.caption}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="flex-1 space-y-2 w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={photo.caption}
                            onChange={(e) =>
                              updatePhotoDetail(
                                photo.id,
                                'caption',
                                e.target.value
                              )
                            }
                            placeholder="Polaroid caption (e.g. Golden Beach Walk)"
                            className="px-3 py-1.5 text-xs rounded border border-stone-300 focus:outline-hidden"
                          />
                          <input
                            type="text"
                            value={photo.dateLocation}
                            onChange={(e) =>
                              updatePhotoDetail(
                                photo.id,
                                'dateLocation',
                                e.target.value
                              )
                            }
                            placeholder="Date or Location (e.g. August 14 · Little Cafe)"
                            className="px-3 py-1.5 text-xs rounded border border-stone-300 focus:outline-hidden"
                          />
                        </div>

                        <textarea
                          rows={2}
                          value={photo.description}
                          onChange={(e) =>
                            updatePhotoDetail(
                              photo.id,
                              'description',
                              e.target.value
                            )
                          }
                          placeholder="Small heartfelt paragraph about this memory..."
                          className="w-full px-3 py-1.5 text-xs rounded border border-stone-300 focus:outline-hidden"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removePhoto(photo.id)}
                        className="p-2 text-stone-400 hover:text-rose-600 transition-colors"
                        title="Remove photo"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveTab('writing')}
                className="px-4 py-2 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('music')}
                className="px-6 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium tracking-wide transition-colors"
              >
                Continue to Music & Petals →
              </button>
            </div>
          </div>
        )}

        {/* TAB 6: Adding Music & Petals */}
        {activeTab === 'music' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-serif-editorial font-semibold text-stone-900 mb-1">
                6. Adding Music & Romantic Atmosphere
              </h2>
              <p className="text-xs md:text-sm text-stone-600">
                Attach a song that reminds you of her, or choose a delicate
                ambient piano melody.
              </p>
            </div>

            {/* Music Provider Selection */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'curated', label: 'Curated Piano Chords' },
                { id: 'spotify', label: 'Spotify Song Link' },
                { id: 'youtube', label: 'YouTube Song Link' },
                { id: 'none', label: 'No Background Music' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() =>
                    updateField('musicType', m.id as LetterData['musicType'])
                  }
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                    letter.musicType === m.id
                      ? 'border-stone-900 bg-stone-900 text-white'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Option 1: Curated Piano Tracks */}
            {letter.musicType === 'curated' && (
              <div className="space-y-3 p-4 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-2">
                  Select Romantic Instrumental Melodies
                </span>
                <div className="space-y-2">
                  {CURATED_TRACKS.map((track) => {
                    const isSelected = letter.musicTrack === track.id;
                    const isTesting = testPlayingTrack === track.id;
                    return (
                      <div
                        key={track.id}
                        onClick={() => updateField('musicTrack', track.id)}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-stone-900 bg-white shadow-xs'
                            : 'border-stone-200 bg-white/70 hover:bg-white'
                        }`}
                      >
                        <div>
                          <span className="font-semibold text-xs text-stone-900 block">
                            {track.title}
                          </span>
                          <span className="text-[11px] text-stone-500 block">
                            {track.description}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTestAudio(track.id);
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-stone-300 text-xs text-stone-700 hover:bg-stone-100"
                        >
                          {isTesting ? <Square size={12} /> : <Play size={12} />}
                          <span>{isTesting ? 'Stop' : 'Listen'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Option 2: Spotify Link */}
            {letter.musicType === 'spotify' && (
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Paste Spotify Song or Playlist URL
                </label>
                <input
                  type="text"
                  value={letter.musicTrack}
                  onChange={(e) => updateField('musicTrack', e.target.value)}
                  placeholder="https://open.spotify.com/track/..."
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-hidden bg-white"
                />
                <span className="text-[11px] text-stone-500 block">
                  Copy any track link from Spotify (Share → Copy Song Link) and paste it here.
                </span>
              </div>
            )}

            {/* Option 3: YouTube Link */}
            {letter.musicType === 'youtube' && (
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Paste YouTube Song URL
                </label>
                <input
                  type="text"
                  value={letter.musicTrack}
                  onChange={(e) => updateField('musicTrack', e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-hidden bg-white"
                />
                <span className="text-[11px] text-stone-500 block">
                  Copy link of your favourite song or lo-fi romantic video.
                </span>
              </div>
            )}

            {/* Romantic Atmosphere Particle Controls */}
            <div className="pt-4 border-t border-stone-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">
                    Floating Atmosphere Animation
                  </h3>
                  <p className="text-xs text-stone-500">
                    Gentle falling particles while reading the letter.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={letter.ambientPetals}
                    onChange={(e) =>
                      updateField('ambientPetals', e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-stone-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-stone-900" />
                </label>
              </div>

              {letter.ambientPetals && (
                <div className="flex items-center gap-2 p-1 bg-stone-100 rounded-lg max-w-sm">
                  {[
                    { id: 'petals', label: 'Rose Petals' },
                    { id: 'hearts', label: 'Floating Hearts' },
                    { id: 'gold_dust', label: 'Golden Dust' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() =>
                        updateField(
                          'petalsType',
                          p.id as LetterData['petalsType']
                        )
                      }
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        letter.petalsType === p.id
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveTab('photos')}
                className="px-4 py-2 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('scheduling')}
                className="px-6 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium tracking-wide transition-colors"
              >
                Continue to Scheduling →
              </button>
            </div>
          </div>
        )}

        {/* TAB 7: Scheduling the Letter */}
        {activeTab === 'scheduling' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-serif-editorial font-semibold text-stone-900 mb-1">
                7. Scheduling the Letter (Surprise Opening)
              </h2>
              <p className="text-xs md:text-sm text-stone-600">
                If you want to surprise her at a particular time (such as midnight
                on your anniversary or morning of her birthday), enable scheduled opening.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">
                    Enable Scheduled Opening Countdown
                  </h3>
                  <p className="text-xs text-stone-500">
                    When enabled, the recipient sees a sealed envelope with a live countdown clock until that moment.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={letter.isScheduled}
                    onChange={(e) =>
                      updateField('isScheduled', e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-stone-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-stone-900" />
                </label>
              </div>

              {letter.isScheduled && (
                <div className="pt-4 border-t border-stone-200 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                      Target Unlock Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={letter.scheduledDate}
                      onChange={(e) =>
                        updateField('scheduledDate', e.target.value)
                      }
                      className="w-full sm:w-auto px-4 py-2.5 text-sm rounded-lg border border-stone-300 bg-white focus:outline-hidden"
                    />
                    <span className="text-[11px] text-stone-500 mt-1 block">
                      Choose when the wax seal becomes breakable.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                      Teaser Note (Shown on locked screen)
                    </label>
                    <input
                      type="text"
                      value={letter.scheduledTeaser}
                      onChange={(e) =>
                        updateField('scheduledTeaser', e.target.value)
                      }
                      placeholder="e.g. A special anniversary letter from Julian is waiting for you... Unlocks at midnight!"
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-stone-300 bg-white focus:outline-hidden"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveTab('music')}
                className="px-4 py-2 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('review')}
                className="px-6 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium tracking-wide transition-colors"
              >
                Continue to Review & Publish →
              </button>
            </div>
          </div>
        )}

        {/* TAB 8: Review & Publish */}
        {activeTab === 'review' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-serif-editorial font-semibold text-stone-900 mb-1">
                8. Reviewing and Publishing
              </h2>
              <p className="text-xs md:text-sm text-stone-600">
                Go through the checklist before sending the letter to your girlfriend.
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-3">
              {[
                {
                  label: `Recipient Name: "${letter.recipientName || 'Not Set'}" and Your Name: "${letter.senderName || 'Not Set'}"`,
                  checked: Boolean(letter.recipientName && letter.senderName),
                },
                {
                  label: `Chosen Theme: ${THEMES[letter.theme].name} (${THEMES[letter.theme].tagline})`,
                  checked: true,
                },
                {
                  label: `Typography: ${FONTS.find((f) => f.id === letter.font)?.name} (${letter.fontSize.toUpperCase()} size)`,
                  checked: true,
                },
                {
                  label: `Photographs: ${letter.photos.length} photo memory card${letter.photos.length === 1 ? '' : 's'} included`,
                  checked: letter.photos.length > 0,
                },
                {
                  label: `Background Music: ${
                    letter.musicType === 'none'
                      ? 'No background audio'
                      : letter.musicType === 'curated'
                      ? 'Curated Ambient Piano'
                      : 'Custom Stream Link'
                  }`,
                  checked: true,
                },
                {
                  label: letter.isScheduled
                    ? `Scheduled Opening: Unlocks on ${new Date(letter.scheduledDate).toLocaleString()}`
                    : 'Scheduled Opening: Instant unsealing available',
                  checked: true,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium text-stone-800"
                >
                  <CheckCircle
                    size={16}
                    className={item.checked ? 'text-emerald-600' : 'text-stone-400'}
                  />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Interactive Previews & Publish Button */}
            <div className="p-6 rounded-2xl bg-stone-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div>
                <h3 className="font-serif-editorial text-lg font-semibold">
                  Ready to send your love letter?
                </h3>
                <p className="text-xs text-stone-300 mt-0.5">
                  Generate your private shareable link, QR code, or send via WhatsApp / iMessage.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onPublish}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold tracking-wider uppercase transition-colors shadow-lg"
                >
                  Publish & Get Share Link
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveTab('scheduling')}
                className="px-4 py-2 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900"
              >
                ← Back
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onPreviewEnvelope}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  Preview Envelope
                </button>
                {onPreviewGames && (
                  <button
                    type="button"
                    onClick={onPreviewGames}
                    className="px-4 py-2 rounded-lg border border-rose-300 text-xs font-medium text-rose-700 hover:bg-rose-50 transition-colors"
                  >
                    Play Love Games
                  </button>
                )}
                <button
                  type="button"
                  onClick={onPreviewLetter}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  Preview Letter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
