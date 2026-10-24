import { Occasion, ThemeId, FontId, LetterData, PhotoMemory } from '../types';

export interface OccasionConfig {
  id: Occasion;
  label: string;
  tagline: string;
  defaultGreeting: string;
  sampleOpening: string;
  sampleMemories: string;
  sampleSmallThings: string;
  sampleFeelings: string;
  sampleEnding: string;
  sampleSignature: string;
}

export const OCCASIONS: OccasionConfig[] = [
  {
    id: 'anniversary',
    label: 'Anniversary',
    tagline: 'Celebrating our journey, another year together',
    defaultGreeting: 'To My Favourite Person in the Entire World,',
    sampleOpening:
      'Looking back on every single moment we have shared, I am still in awe that I get to love you. You came into my life like the softest sunrise and turned ordinary days into something quietly extraordinary.',
    sampleMemories:
      'I still remember our first rainy walk when we lost track of time and talked about everything under the sun until the coffee got cold. I remember the seaside evening where we laughed until our ribs ached, your hair tangled in the salty wind.',
    sampleSmallThings:
      'It is the little things: the way your eyes crinkle when something genuinely delights you, the gentle habit you have of holding my sleeve when we walk through crowds, and the warm sigh you give when you rest your head on my shoulder.',
    sampleFeelings:
      'Being with you feels like arriving home after a lifetime of searching. You make me want to be gentler, kinder, and bolder. No matter what tomorrow brings, my heart is completely and securely yours.',
    sampleEnding:
      'Thank you for loving me, for choosing me, and for filling my world with sweetness. Happy Anniversary, my darling.',
    sampleSignature: 'Forever and always yours,',
  },
  {
    id: 'birthday',
    label: 'Birthday',
    tagline: 'Honouring the day you brought your light into the world',
    defaultGreeting: 'Happy Birthday, My Beautiful Girl,',
    sampleOpening:
      'Today is the celebration of the single greatest gift this earth has ever given me—your existence. I hope today you feel even a fraction of the love and light that you pour so effortlessly into everyone around you.',
    sampleMemories:
      'I think of all the birthdays and everyday celebrations we have had, and how every single memory with you becomes my new favorite story to tell.',
    sampleSmallThings:
      'I love your sudden bursts of excitement over the smallest wonders, the songs you hum under your breath when you are happy, and how you make every cup of tea taste like a celebration.',
    sampleFeelings:
      'Watching you grow, dream, and conquer every hurdle is one of the greatest privileges of my life. You deserve all the stars, all the gentle mornings, and every dream your heart holds.',
    sampleEnding:
      'May this new year bring you uninterrupted joy, peace in your mind, and boundless laughter. Happy Birthday, my love.',
    sampleSignature: 'With all my heart,',
  },
  {
    id: 'valentine',
    label: "Valentine's Day",
    tagline: 'A timeless declaration of devotion and sweet love',
    defaultGreeting: 'To The One Who Holds My Heart,',
    sampleOpening:
      'They say love is patient, but with you, love is also thrilling, safe, and deeply peaceful all at once. Today is simply an excuse to say what my heart whispers to you every single day.',
    sampleMemories:
      'From stolen glances across crowded rooms to quiet midnight conversations where we whispered secrets we had never told another soul—each moment with you is etched into my soul.',
    sampleSmallThings:
      'The sweet way you reach for my hand without even thinking, the warmth of your laughter, and the way you always save the sweetest bite for me.',
    sampleFeelings:
      'You are my haven in a noisy world. If I had to live a thousand lifetimes, I would search the universe just to find you and love you in every single one.',
    sampleEnding:
      'Be my Valentine today, tomorrow, and through every season of our lives.',
    sampleSignature: 'Devotedly and completely,',
  },
  {
    id: 'proposal',
    label: 'Proposal / Future Together',
    tagline: 'Asking for forever, side by side',
    defaultGreeting: 'My Dearest, My Partner, My Future,',
    sampleOpening:
      'From the moment I realized how deeply woven you are into my thoughts and hopes, I knew there was no future I could ever imagine without your hand in mine.',
    sampleMemories:
      'I remember realizing I loved you—not in a grand cinematic flash, but in the quiet safety of a quiet Tuesday evening, watching you smile and realizing: this is who I want to wake up next to for the rest of my days.',
    sampleSmallThings:
      'I love the kindness you carry, the sound of your laugh filling our home, and the way your hand fits into mine like two pieces made just for one another.',
    sampleFeelings:
      'I promise to protect your peace, to cheer for your triumphs, to hold you through every storm, and to cherish you more with every passing sunrise.',
    sampleEnding:
      'Will you take this journey with me, build our dreams together, and let me love you for all the days of our lives?',
    sampleSignature: 'With every breath,',
  },
  {
    id: 'long_distance',
    label: 'Long Distance',
    tagline: 'Bridging the miles between two hearts',
    defaultGreeting: 'To My Love Across the Miles,',
    sampleOpening:
      'Even with miles and time zones stretched between us, there is not a single hour where you do not cross my mind and brighten my world.',
    sampleMemories:
      'I replay the memory of our airport goodbyes and the sweetest reunions—that breathless second when the crowd parts and I finally hold you tight, feeling your heartbeat against mine.',
    sampleSmallThings:
      'The good-morning texts that start my day with sunlight, the sleepy voice notes you send before bed, and how you wear my oversized sweater so you can feel close.',
    sampleFeelings:
      'Distance only proves how strong and worthwhile what we have truly is. No amount of kilometers can ever diminish the bond between us; they only make me count down every second until we are together again.',
    sampleEnding:
      'Hold onto this letter, close your eyes, and know that across every mile, my thoughts are wrapped around you.',
    sampleSignature: 'Counting every second until I hold you,',
  },
  {
    id: 'just_because',
    label: 'Just Because',
    tagline: 'A spontaneous reminder of how deeply you are cherished',
    defaultGreeting: 'To My Sweetest Girl,',
    sampleOpening:
      'There is no special date on the calendar today, no anniversary to mark. I just looked at you earlier and felt so overwhelmed with gratitude that I had to put it into words.',
    sampleMemories:
      'Like our quiet sunday mornings where we do not have to say anything at all to feel completely understood and content in each other’s presence.',
    sampleSmallThings:
      'The funny little dances you do when you like your food, the way you scrunch your nose when you concentrate, and the way you make the most mundane grocery trip feel like an adventure.',
    sampleFeelings:
      'You make my life so much softer, richer, and brighter. I never want you to forget how loved, cherished, and uniquely irreplaceable you are to me.',
    sampleEnding:
      'Just a gentle reminder today that you are my favorite person, always.',
    sampleSignature: 'Always in your corner,',
  },
  {
    id: 'apology',
    label: 'Apology & Reconciliation',
    tagline: 'Heartfelt words to mend, comfort, and reassure',
    defaultGreeting: 'My Dearest One,',
    sampleOpening:
      'I am writing this because my heart feels heavy knowing I hurt you, and your peace of mind and smile mean more to me than anything else in this world.',
    sampleMemories:
      'I treasure everything we have built together—our tender trust, our laughs, and the sanctuary we created for each other.',
    sampleSmallThings:
      'Your gentle patience, your warmth, and the kindness you have shown me even on days when I fell short of what you deserved.',
    sampleFeelings:
      'I am deeply, truly sorry for my words and mistakes. My love for you is steadfast, and I am committed to listening, learning, and loving you with the care you deserve every single day.',
    sampleEnding:
      'Please take your time. I am right here, loving you unconditionally and ready to hold your hand.',
    sampleSignature: 'With regret, humility, and endless love,',
  },
  {
    id: 'friendship',
    label: 'Soulmate & Friendship',
    tagline: 'Celebrating our deepest companionship and shared joy',
    defaultGreeting: 'To My Best Friend and Love of My Life,',
    sampleOpening:
      'Before anything else, you are the person I want to tell every silly joke to, the one whose opinion matters most, and my favorite companion in this life.',
    sampleMemories:
      'Our late night drives singing along off-key, the secret looks we share across rooms where one look says a thousand words, and the times we couldn’t stop giggling.',
    sampleSmallThings:
      'How you know exactly what I am thinking before I even speak, and how you make even tough days bearable just by being in the room.',
    sampleFeelings:
      'To love someone is wonderful, but to be truly best friends with the love of your life is the greatest fortune I could ever ask for.',
    sampleEnding:
      'Thank you for being my anchor, my partner in crime, and my sweetest love.',
    sampleSignature: 'Your teammate forever,',
  },
];

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  tagline: string;
  description: string;
  previewBg: string;
  previewCard: string;
  previewBorder: string;
  previewText: string;
  previewAccent: string;
  letterBg: string;
  letterBorder: string;
  letterText: string;
  letterMuted: string;
  accentColor: string;
  waxSealColor: string;
  envelopeColor: string;
  envelopeLining: string;
  backdropClass: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  minimalist: {
    id: 'minimalist',
    name: 'Dreamy Blush & Rose',
    tagline: 'Soft pink, cream, blush, and subtle red accents',
    description: 'A warm, dreamy aesthetic with soft pink, cream, blush stationery, subtle red wax seal, and delicate floating hearts.',
    previewBg: '#FFF1F3',
    previewCard: '#FFFFFF',
    previewBorder: '#FDA4AF',
    previewText: '#4C0519',
    previewAccent: '#E11D48',
    letterBg: 'bg-gradient-to-b from-[#FFFDFD] via-[#FFF8F9] to-[#FFF1F4]',
    letterBorder: 'border-rose-200/90',
    letterText: 'text-stone-800',
    letterMuted: 'text-rose-900/70',
    accentColor: '#E11D48',
    waxSealColor: '#BE123C',
    envelopeColor: 'bg-gradient-to-br from-[#FFF7F8] via-[#FFEDF1] to-[#FFE2E8] border-rose-300 text-rose-950',
    envelopeLining: 'bg-[#FCD8E2]',
    backdropClass: 'bg-gradient-to-br from-[#FFF5F7] via-[#FFF0F4] to-[#FCE7ED]',
  },
  romantic: {
    id: 'romantic',
    name: 'Cheery Cherry Romance',
    tagline: 'Luminous cheery red & romantic candlelit ambiance',
    description: 'Vibrant cheery red on deep velvety wine stationery with glowing candlelit warmth and floating rose petals.',
    previewBg: '#2D0A14',
    previewCard: '#4C0519',
    previewBorder: '#E11D48',
    previewText: '#FFE4E6',
    previewAccent: '#F43F5E',
    letterBg: 'bg-gradient-to-b from-[#380715] to-[#24040E]',
    letterBorder: 'border-rose-500/50',
    letterText: 'text-rose-50',
    letterMuted: 'text-rose-200/80',
    accentColor: '#E11D48',
    waxSealColor: '#E11D48',
    envelopeColor: 'bg-gradient-to-br from-[#4C0519] to-[#2B050E] border-rose-500/60 text-rose-100',
    envelopeLining: 'bg-[#5F0A20]',
    backdropClass: 'bg-gradient-to-b from-[#2A050E] via-[#1B0309] to-[#0E0205]',
  },
  luxurious: {
    id: 'luxurious',
    name: 'Luxurious Theme',
    tagline: 'Rich champagne cream with antique foil gold styling',
    description: 'An opulent, royal stationery styling with antique deckled edge border and embossed cherry wax seal.',
    previewBg: '#1C1917',
    previewCard: '#FDFBF7',
    previewBorder: '#D97706',
    previewText: '#451A03',
    previewAccent: '#E11D48',
    letterBg: 'bg-[#FFFDF9]',
    letterBorder: 'border-amber-300/70',
    letterText: 'text-stone-900',
    letterMuted: 'text-amber-900/70',
    accentColor: '#E11D48',
    waxSealColor: '#BE123C',
    envelopeColor: 'bg-[#F9F5EC] border-amber-300/80 text-amber-950',
    envelopeLining: 'bg-[#F1E8D2]',
    backdropClass: 'bg-[#181411]',
  },
};

export interface FontConfig {
  id: FontId;
  name: string;
  styleLabel: string;
  cssClass: string;
  description: string;
}

export const FONTS: FontConfig[] = [
  {
    id: 'script',
    name: 'Dancing Script',
    styleLabel: 'Romantic Cursive',
    cssClass: 'font-script',
    description: 'Breezy, romantic handwritten calligraphy with flourishing curves',
  },
  {
    id: 'handwriting',
    name: 'Caveat',
    styleLabel: 'Intimate Note',
    cssClass: 'font-handwriting',
    description: 'Natural, tender everyday handwriting that feels genuine and personal',
  },
  {
    id: 'serif-editorial',
    name: 'Playfair Display',
    styleLabel: 'Editorial Romance',
    cssClass: 'font-serif-editorial',
    description: 'High-fashion editorial serif with timeless literary grace',
  },
  {
    id: 'serif-luxury',
    name: 'Cormorant Garamond',
    styleLabel: 'Classical Keepsake',
    cssClass: 'font-serif-luxury',
    description: 'Antique Renaissance book serif, poetic and dignified',
  },
  {
    id: 'typewriter',
    name: 'Special Elite',
    styleLabel: 'Vintage Typewriter',
    cssClass: 'font-typewriter',
    description: 'Authentic mechanical typewriter ink with nostalgic tactile warmth',
  },
  {
    id: 'sans-clean',
    name: 'Plus Jakarta Sans',
    styleLabel: 'Modern Minimalist',
    cssClass: 'font-sans-clean',
    description: 'Clean contemporary typographic clarity focusing purely on the message',
  },
];

export const CURATED_PHOTOS: PhotoMemory[] = [
  {
    id: 'photo-1',
    url: '/src/assets/images/sunset_beach_walk_1792832961458.jpg',
    caption: 'Golden Shoreline Walk',
    dateLocation: 'Sunset Beach · August 14',
    description: 'The evening we kicked off our shoes, ran towards the tide, and forgot all about the real world.',
  },
  {
    id: 'photo-2',
    url: '/src/assets/images/cozy_coffee_date_1792832961931.jpg',
    caption: 'Our Sunday Morning Haven',
    dateLocation: 'Little Corner Café · Rainy Morning',
    description: 'Two warm cups, your sleepy smile across the wooden table, and hours of talking about everything.',
  },
  {
    id: 'photo-3',
    url: '/src/assets/images/stargazing_night_1792832963007.jpg',
    caption: 'Under the Milky Way',
    dateLocation: 'Lookout Hill · Midnight',
    description: 'Wrapped tight in that knitted wool blanket, watching city lights blink while you pointed out constellations.',
  },
  {
    id: 'photo-4',
    url: '/src/assets/images/vintage_flowers_note_1792832962850.jpg',
    caption: 'Keepsakes & Pressed Petals',
    dateLocation: 'Our Memory Box',
    description: 'Every dried flower and little ticket stub I have saved because it touched your hands.',
  },
];

export const CURATED_TRACKS = [
  {
    id: 'piano_sunset',
    title: 'Sunset Piano Reverie',
    artist: 'Soft Romantic Melody',
    description: 'Gentle, heartwarming piano chords with ambient string swell',
    chords: ['C', 'G', 'Am', 'F'],
  },
  {
    id: 'acoustic_cozy',
    title: 'Acoustic Love Song',
    artist: 'Warm Fingerpicking',
    description: 'Intimate nylon-string acoustic guitar and cozy vinyl warmth',
    chords: ['G', 'Em', 'C', 'D'],
  },
  {
    id: 'midnight_serenade',
    title: 'Midnight Serenade',
    artist: 'Dreamy Ambient Strings',
    description: 'Atmospheric midnight lullaby with starry harmonics',
    chords: ['Dm', 'Bb', 'F', 'C'],
  },
];

export const INITIAL_LETTER: LetterData = {
  recipientName: 'Harshita',
  senderName: 'With all my love',
  occasion: 'just_because',
  theme: 'minimalist',
  font: 'serif-luxury',
  fontSize: 'lg',
  paperTexture: 'deckled',
  greeting: 'Hey, Harshita ♡',
  openingReason:
    "I made a little something for you. It's not perfect, but every little part of it comes from my heart. So, take your time, explore it, and just know that this little corner of the internet is all yours. ♡",
  memories:
    'From our late-night conversations where hours felt like seconds, to all the quiet, goofy everyday moments—every memory with you is my favourite place to revisit.',
  smallThings:
    'The sweet way your eyes crinkle when you laugh, the warmth of your smile, and how you make everything around you feel safe, comfortable, and sunny.',
  feelings:
    'You make my life so much softer, brighter, and infinitely more meaningful just by being in it. Loving you is the easiest and most natural thing in the world.',
  ending:
    'Thank you for being you, Harshita. I hope this little surprise brings the biggest smile to your face today and reminds you how deeply you are adored.',
  signature: 'Forever with love ♡,',
  sealStyle: 'heart',
  isScheduled: false,
  scheduledDate: '',
  scheduledTeaser: 'A special surprise for Harshita is waiting for you... ♡',
  musicType: 'curated',
  musicTrack: 'piano_sunset',
  ambientPetals: true,
  petalsType: 'hearts',
  photos: [CURATED_PHOTOS[0], CURATED_PHOTOS[1], CURATED_PHOTOS[2]],
};
