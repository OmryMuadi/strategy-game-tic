import type { Messages } from '../app/messages';
import { isDrawn } from '../game/rules';
import { positions, type GameState, type Move } from '../game/types';

interface BoardProps {
  copy: Messages;
  state: GameState;
  legalMoves: readonly Move[];
  onPlay: (move: Move) => void;
}

export function Board({ copy, state, legalMoves, onPlay }: BoardProps) {
  return (
    <div className="board" dir="ltr" aria-label={copy.gameBoard} role="group">
      {positions.map((board) => {
        const cells = state.boards[board];
        const available = legalMoves.filter((move) => move.board === board);
        const drawn = isDrawn(cells);
        const won = state.result.kind === 'win' && state.result.board === board;
        const winningLine = state.result.kind === 'win' && won ? state.result.line : [];
        const appearance = won ? 'won' : drawn ? 'drawn' : available.length ? 'available' : 'inactive';
        return (
          <div className="small-board" data-state={appearance} key={board}
            role="group" aria-label={`${copy.board(board + 1)}${drawn ? `, ${copy.drawnBoard}` : won ? `, ${copy.wonBoard}` : ''}`}>
            {positions.map((cell) => {
              const mark = cells[cell];
              const playable = available.some((move) => move.cell === cell);
              const last = state.lastMove?.board === board && state.lastMove.cell === cell;
              return (
                <button type="button" className="cell" key={cell} disabled={!playable}
                  data-mark={mark} data-last={last} data-winning={winningLine.includes(cell)}
                  aria-label={copy.square(board + 1, cell + 1, mark ?? copy.empty)}
                  onClick={() => onPlay({ board, cell })}>
                  {mark && <span aria-hidden="true">{mark === 'X' ? '×' : '○'}</span>}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
