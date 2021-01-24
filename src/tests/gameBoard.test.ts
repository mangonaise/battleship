import { CellState, createGameBoard } from '../logic/gameBoard';

describe('Game board', () => {
  it('initializes empty board correctly', () => {
    const board = createGameBoard();
    const empty = CellState.empty;
    expect(board.cells).toEqual([
      [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty],
      [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty],
      [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty],
      [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty],
      [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty],
      [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty],
      [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty],
      [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty],
      [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty],
      [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty]
    ]);
  })
});