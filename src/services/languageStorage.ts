import type { Language } from '../app/messages';

const key = 'vertoxa.language';

export function readLanguage(): Language {
  try {
    return localStorage.getItem(key) === 'he' ? 'he' : 'en';
  } catch {
    return 'en';
  }
}

export function saveLanguage(language: Language): void {
  try {
    localStorage.setItem(key, language);
  } catch {
    // Language changes still work during this session.
  }
}

