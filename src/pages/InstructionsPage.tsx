import { HomeButton } from '../components/HomeButton';
import type { Messages } from '../app/messages';

export function InstructionsPage({ copy }: { copy: Messages }) {
  return (
    <main className="game instructions">
      <HomeButton label={copy.home} />
      <h1>{copy.instructions}</h1>
      <section>
        <h2>{copy.startHeading}</h2>
        <ol>
          <li>{copy.boardRule}</li>
          <li>{copy.openingRule}</li>
          <li>{copy.sendRule}</li>
        </ol>
        <figure>
          <div className="move-example" dir="ltr" aria-hidden="true">
            <div className="example-grid">
              {Array.from({ length: 9 }, (_, cell) => (
                <span key={cell} data-mark={cell === 4 ? 'X' : undefined}>{cell === 4 ? '×' : ''}</span>
              ))}
            </div>
            <span>→</span>
            <div className="example-grid">
              {Array.from({ length: 9 }, (_, board) => (
                <span key={board} className={board === 4 ? 'example-target' : undefined} />
              ))}
            </div>
          </div>
          <figcaption>{copy.moveExample}</figcaption>
        </figure>
      </section>
      <section>
        <h2>{copy.classic}</h2>
        <p>{copy.winRule}</p>
        <p>{copy.closedRule}</p>
      </section>
      <section>
        <h2>{copy.checkmate}</h2>
        <p>{copy.checkmateRule}</p>
        <p>{copy.checkmateWinRule}</p>
      </section>
      <section>
        <h2>{copy.drawHeading}</h2>
        <p>{copy.instructionsDrawRule}</p>
      </section>
    </main>
  );
}

