import { LetterData } from '../types';

export function encodeLetterToHash(letter: LetterData): string {
  try {
    const jsonStr = JSON.stringify(letter);
    // URL-safe base64 encoding with UTF-8 support
    const encoded = btoa(encodeURIComponent(jsonStr));
    return encoded;
  } catch {
    return '';
  }
}

export function decodeLetterFromHash(hash: string): LetterData | null {
  try {
    if (!hash) return null;
    let cleanHash = hash;
    if (cleanHash.startsWith('#')) cleanHash = cleanHash.slice(1);
    if (cleanHash.startsWith('letter=')) cleanHash = cleanHash.replace('letter=', '');
    if (!cleanHash) return null;

    const decodedJson = decodeURIComponent(atob(cleanHash));
    const data = JSON.parse(decodedJson) as LetterData;
    return data;
  } catch {
    return null;
  }
}

const STORAGE_KEY_CURRENT = 'lovepaper_draft_v1';
const STORAGE_KEY_HISTORY = 'lovepaper_saved_letters';

export function saveDraftToStorage(letter: LetterData) {
  try {
    localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(letter));
  } catch {
    // Storage quota or private browsing
  }
}

export function loadDraftFromStorage(): LetterData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CURRENT);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return null;
}

export function saveLetterToHistory(letter: LetterData) {
  try {
    const existing = getSavedLettersHistory();
    const updated = [letter, ...existing.filter((item) => item.recipientName !== letter.recipientName || item.senderName !== letter.senderName)].slice(0, 10);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export function getSavedLettersHistory(): LetterData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [];
}
