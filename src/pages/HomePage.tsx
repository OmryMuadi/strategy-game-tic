import { Link } from 'react-router';
import type { Language, Messages } from '../app/messages';

interface HomePageProps {
  copy: Messages;
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export function HomePage({ copy, language, onLanguageChange }: HomePageProps) {
  return (
    <main className="game home">
      <div className="language-picker">
        <select className="secondary" dir="ltr" value={language}
          aria-label={language === 'he' ? 'שפה' : 'Language'}
          onChange={(event) => onLanguageChange(event.currentTarget.value === 'he' ? 'he' : 'en')}>
          <option value="en" lang="en" aria-label="English">EN</option>
          <option value="he" lang="he" aria-label="עברית">HE</option>
        </select>
      </div>
      <header><p className="mode">{copy.local}</p><h1>Vertoxa</h1></header>
      <nav className="home-actions" aria-label={copy.mode}>
        <Link className="primary" to="/classic">{copy.classic}</Link>
        <Link className="secondary" to="/checkmate">{copy.checkmate}</Link>
        <Link className="secondary" to="/instructions">{copy.instructions}</Link>
      </nav>
    </main>
  );
}

