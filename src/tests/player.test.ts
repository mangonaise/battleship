import Player from "../logic/player";
import Ship from "../logic/ship";
import { CellState } from '../logic/gameBoard';

const o = CellState.empty;
const m = CellState.missed;
const S = CellState.shipIntact;
const H = CellState.shipHit;
const X = CellState.shipSunk;

describe('Player', () => {
  test('new player has an empty board', () => {
    const player = new Player();
    const rows = player.board.cells[0].length;
    const columns = player.board.cells.length;
    expect(rows * columns).toBe(100);
  });

  test(`player can attack opponent's board`, () => {
    const player = new Player();
    const opponent = new Player();

    player.setOpponent(opponent);
    opponent.setOpponent(player);

    opponent.board.prepareToPlaceShip({ ship: new Ship(3), direction: 'vertical', row: 5, column: 5 });
    opponent.board.placeShip();

    player.attack([6, 5]);

    expect(opponent.board.cells).toEqual([
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, S, o, o, o, o],
      [o, o, o, o, o, H, o, o, o, o],
      [o, o, o, o, o, S, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o]
    ]);

    player.attack([5, 5]);
    player.attack([7, 5]);
    expect(opponent.board.haveAllShipsSunk).toBe(true);
  });
})