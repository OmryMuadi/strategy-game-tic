import type { Language } from '../app/messages';

const key = 'Grid Duel.language';

export function readLanguage(): Language {
  try {
    const savedLanguage = localStorage.getItem(key) ?? localStorage.getItem('vertoxa.language');
    return savedLanguage === 'he' ? 'he' : 'en';
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

