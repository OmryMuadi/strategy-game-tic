import { useLayoutEffect, useState } from 'react';
import { Route, Routes } from 'react-router';
import { HomeButton } from '../components/HomeButton';
import { GamePage } from '../pages/GamePage';
import { HomePage } from '../pages/HomePage';
import { InstructionsPage } from '../pages/InstructionsPage';
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
    <Routes>
      <Route index element={<HomePage copy={copy} language={language} onLanguageChange={changeLanguage} />} />
      <Route path="classic" element={<GamePage key="classic" copy={copy} mode="classic" />} />
      <Route path="checkmate" element={<GamePage key="checkmate" copy={copy} mode="checkmate" />} />
      <Route path="instructions" element={<InstructionsPage copy={copy} />} />
      <Route path="*" element={<main className="game"><h1>{copy.unavailable}</h1><HomeButton label={copy.home} /></main>} />
    </Routes>
  );
}

