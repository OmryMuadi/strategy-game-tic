import { useLayoutEffect, useRef } from 'react';
import { HomeButton } from '../components/HomeButton';
import { messages, type Messages } from '../app/messages';
import { Board } from '../components/Board';
import type { GameMode } from '../game/types';
import { useGame } from '../hooks/useGame';

export function GamePage({ copy = messages.en, mode }: { copy?: Messages; mode: GameMode }) {
  const { state, legalMoves, play, restart } = useGame(mode);
  const boardContainer = useRef<HTMLDivElement>(null);
  const playAgain = useRef<HTMLButtonElement>(null);
  const shouldMoveFocus = useRef(false);
  const { result, requiredBoard, turn } = state;

  useLayoutEffect(() => {
    if (!shouldMoveFocus.current) return;
    shouldMoveFocus.current = false;
    if (result.kind === 'playing') {
      boardContainer.current?.querySelector<HTMLButtonElement>('.cell:enabled')?.focus();
    } else {
      playAgain.current?.focus();
    }
  }, [state, result.kind]);

  const title = result.kind === 'win' ? copy.win(result.player)
    : result.kind === 'checkmate' ? copy.mate(result.player)
    : result.kind === 'draw' ? copy.draw : copy.turn(turn);
  const detail = result.kind === 'win' ? copy.winDetail(result.board + 1)
    : result.kind === 'checkmate' ? copy.mateDetail
    : result.kind === 'draw' ? copy.drawDetail
    : requiredBoard === null ? copy.opening : copy.target(requiredBoard + 1);

  return (
    <main className="game">
      <HomeButton label={copy.home} />
      <header className="game-header">
        <div><p className="mode">{copy[mode]}</p><h1>Vertoxa</h1></div>
        <button className="secondary" type="button" onClick={() => {
          shouldMoveFocus.current = true;
          restart();
        }}>{copy.restart}</button>
      </header>

      <div className="match-status" role="status" data-player={result.kind === 'playing' ? turn : result.kind === 'draw' ? undefined : result.player}>
        <div>
          <h2>{title}</h2>
          <p>{detail}</p>
        </div>
        {result.kind === 'playing' && <span className="turn-mark" data-mark={turn} aria-hidden="true">{turn === 'X' ? '×' : '○'}</span>}
      </div>

      <div ref={boardContainer}>
        <Board copy={copy} state={state} legalMoves={legalMoves} onPlay={(move) => {
          shouldMoveFocus.current = true;
          play(move);
        }} />
      </div>

      {result.kind !== 'playing' && (
        <button ref={playAgain} className="primary" type="button" onClick={() => {
          shouldMoveFocus.current = true;
          restart();
        }}>{copy.playAgain}</button>
      )}
    </main>
  );
}
