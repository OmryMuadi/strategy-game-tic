import { HomeButton } from '../components/HomeButton';
import type { Messages } from '../app/messages';

export function InstructionsPage({ copy }: { copy: Messages }) {
  return (
    <main className="game instructions">
      <HomeButton label={copy.home} />
      <h1>{copy.instructions}</h1>
      <section>
        <h2>{copy.classic}</h2>
        <p>{copy.openingRule}</p>
        <p>{copy.classicRule}</p>
      </section>
      <section>
        <h2>{copy.checkmate}</h2>
        <p>{copy.checkmateRule}</p>
      </section>
    </main>
  );
}

