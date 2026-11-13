import { useLayoutEffect, useRef } from 'react';
import { messages, type Messages } from '../app/messages';
import { Board } from '../components/Board';
import type { GameMode } from '../game/types';
import { useGame } from '../hooks/useGame';

const modes: readonly GameMode[] = ['classic', 'checkmate'];

export function GamePage({ copy = messages.en }: { copy?: Messages }) {
  const { state, legalMoves, play, restart, changeMode } = useGame();
  const boardContainer = useRef<HTMLDivElement>(null);
  const playAgain = useRef<HTMLButtonElement>(null);
  const shouldMoveFocus = useRef(false);
  const { result, requiredBoard, turn, mode } = state;

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
      <header className="game-header">
        <div><p className="mode">{copy.local}</p><h1>Vertoxa</h1></div>
        <button className="secondary" type="button" onClick={() => {
          shouldMoveFocus.current = true;
          restart();
        }}>{copy.restart}</button>
      </header>

      <div className="mode-picker" role="group" aria-label={copy.mode} aria-describedby="mode-help">
        {modes.map((option) => (
          <button key={option} className="secondary" type="button" aria-pressed={mode === option}
            onClick={() => changeMode(option)}>{copy[option]}</button>
        ))}
      </div>
      <p className="mode-help" id="mode-help">{copy.modeHelp}</p>

      <div className="match-status" role="status">
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

      {result.kind === 'playing' ? (
        <details className="rules">
          <summary>{copy.rules}</summary>
          <p>{copy.openingRule}</p>
          <p>{copy.classicRule}</p>
          {mode === 'checkmate' && <p>{copy.checkmateRule}</p>}
        </details>
      ) : (
        <button ref={playAgain} className="primary" type="button" onClick={() => {
          shouldMoveFocus.current = true;
          restart();
        }}>{copy.playAgain}</button>
      )}
    </main>
  );
}
