import { OpponentIcon } from '../components/OpponentIcon';
import { useState } from 'react';
import { Link } from 'react-router';
import type { Language, Messages } from '../app/messages';

interface HomePageProps {
  copy: Messages;
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export function HomePage({ copy, language, onLanguageChange }: HomePageProps) {
  const [solo, setSolo] = useState(false);
  const textDirection = language === 'he' ? 'rtl' : 'ltr';

  return (
    <main className="game home" dir="ltr">
      <div className="language-picker">
        <div className="language-control">
          <span className="language-globe" aria-hidden="true" />
          <select value={language}
            aria-label={language === 'he' ? 'שפה' : 'Language'}
            onChange={(event) => onLanguageChange(event.currentTarget.value === 'he' ? 'he' : 'en')}>
            <option value="en" lang="en" aria-label="English">EN</option>
            <option value="he" lang="he" aria-label="עברית">HE</option>
          </select>
        </div>
      </div>
      <header className="home-hero">
        <div className="home-hero-copy"><h1 lang="en">Grid Duel</h1><p className="home-intro" dir={textDirection}>{copy.intro}</p></div>
        <div className="hero-board" dir="ltr" aria-hidden="true">
          {['X', '', 'O', '', 'X', '', 'O', '', 'X'].map((mark, index) => (
            <span key={index} data-mark={mark}>{mark === 'X' ? '×' : mark === 'O' ? '○' : ''}</span>
          ))}
        </div>
      </header>
      <div className="opponent-picker" role="group" aria-label={copy.opponent}>
        <button className="secondary" type="button" aria-pressed={!solo} onClick={() => setSolo(false)}><OpponentIcon solo={false} />{copy.localPlayers}</button>
        <button className="secondary" type="button" aria-pressed={solo} onClick={() => setSolo(true)}><OpponentIcon solo />{copy.playBot}</button>
      </div>
      <nav className="home-actions" aria-label={copy.mode}>
        {(['classic', 'checkmate'] as const).map((mode) => (
          <Link key={mode} className={`secondary mode-card mode-card-${mode}`} to={`/${mode}${solo ? '/bot' : ''}`}
            aria-labelledby={`label-${mode}`} aria-describedby={`description-${mode}`}>
            <span className="mode-card-icon" data-mark={mode === 'classic' ? 'X' : 'O'} aria-hidden="true">
              {mode === 'classic' ? '×' : '○'}
            </span>
            <span className="mode-card-text" dir={textDirection}>
              <span id={`label-${mode}`}>{copy[mode]}</span>
              <small id={`description-${mode}`}>{mode === 'classic' ? copy.classicDescription : copy.checkmateDescription}</small>
            </span>
            <span className="mode-card-arrow" aria-hidden="true">→</span>
          </Link>
        ))}
        <Link className="secondary instructions-link" to="/instructions"><span dir={textDirection}>{copy.instructions}</span></Link>
      </nav>
    </main>
  );
}

