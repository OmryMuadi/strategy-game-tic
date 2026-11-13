import { useLayoutEffect, useState } from 'react';
import { Link, Route, Routes } from 'react-router';
import { GamePage } from '../pages/GamePage';
import { readLanguage, saveLanguage } from '../services/languageStorage';
import { messages, type Language } from './messages';

export function App() {
  const [language, setLanguage] = useState(readLanguage);
  const copy = messages[language];

  useLayoutEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
  }, [language]);

  function changeLanguage(next: Language) {
    setLanguage(next);
    saveLanguage(next);
  }

  return (
    <>
      <div className="language-picker">
        <select className="secondary" dir="ltr" value={language}
          aria-label={language === 'he' ? 'שפה' : 'Language'}
          onChange={(event) => changeLanguage(event.currentTarget.value === 'he' ? 'he' : 'en')}>
          <option value="en" lang="en" aria-label="English">EN</option>
          <option value="he" lang="he" aria-label="עברית">HE</option>
        </select>
      </div>
      <Routes>
        <Route index element={<GamePage copy={copy} />} />
        <Route path="*" element={<main className="game"><h1>{copy.unavailable}</h1><Link to="/">{copy.back}</Link></main>} />
      </Routes>
    </>
  );
}

