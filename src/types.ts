export type Occasion =
  | 'anniversary'
  | 'birthday'
  | 'proposal'
  | 'valentine'
  | 'long_distance'
  | 'apology'
  | 'friendship'
  | 'just_because';

export type ThemeId = 'minimalist' | 'romantic' | 'luxurious';

export type FontId =
  | 'script'
  | 'handwriting'
  | 'serif-editorial'
  | 'serif-luxury'
  | 'typewriter'
  | 'sans-clean';

export type PaperTexture = 'parchment' | 'linen' | 'clean' | 'deckled';

export interface PhotoMemory {
  id: string;
  url: string;
  caption: string;
  dateLocation: string;
  description: string;
}

export interface LetterData {
  recipientName: string;
  senderName: string;
  occasion: Occasion;
  theme: ThemeId;
  font: FontId;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  paperTexture: PaperTexture;
  greeting: string;
  openingReason: string;
  memories: string;
  smallThings: string;
  feelings: string;
  ending: string;
  signature: string;
  sealStyle: 'heart' | 'monogram' | 'rose' | 'infinity';
  isScheduled: boolean;
  scheduledDate: string; // ISO string YYYY-MM-DDTHH:mm
  scheduledTeaser: string;
  musicType: 'curated' | 'spotify' | 'youtube' | 'none';
  musicTrack: string;
  ambientPetals: boolean;
  petalsType: 'petals' | 'hearts' | 'gold_dust';
  photos: PhotoMemory[];
}
