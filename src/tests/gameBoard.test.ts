import { create } from 'domain';
import { CellState, ShipPlacement, createGameBoard } from '../logic/gameBoard';
import createShip, { Ship } from '../logic/ship';

let board = createGameBoard();
const o = CellState.empty;
const S = CellState.shipIntact;
const H = CellState.shipHit;
const X = CellState.shipSunk;

describe('Game board', () => {
  beforeEach(() => board = createGameBoard());
  it('initializes empty board correctly', () => {
    
    expect(board.cells).toEqual([
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o]
    ]);
  });

  it('can place a ship horizontally', () => {
    const placement: ShipPlacement = { ship: createShip(4), direction: 'horizontal', row: 3, column: 4 };
    board.prepareToPlaceShip(placement);
    board.placeShip();
    expect(board.cells).toEqual([
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, S, S, S, S, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o]
    ]);
  });

  it('can place a ship vertically', () => {
    const placement: ShipPlacement = { ship: createShip(3), direction: 'vertical', row: 7, column: 8 }
    board.prepareToPlaceShip(placement);
    board.placeShip();
    expect(board.cells).toEqual([
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, S, o],
      [o, o, o, o, o, o, o, o, S, o],
      [o, o, o, o, o, o, o, o, S, o]
    ]);
  });

  it('will not allow a horizontal ship to be placed outside the board', () => {
    const invalidPlacement1: ShipPlacement = { ship: createShip(4), direction: 'horizontal', row: 0, column: 7 };
    board.prepareToPlaceShip(invalidPlacement1);
    expect(board.isNextShipPlacementValid).toBe(false);

    const invalidPlacement2: ShipPlacement = { ship: createShip(1), direction: 'horizontal', row: 4, column: -1 };
    board.prepareToPlaceShip(invalidPlacement2);
    expect(board.isNextShipPlacementValid).toBe(false);
  });

  it('will not allow a vertical ship to be placed outside the board', () => {
    const placement: ShipPlacement = { ship: createShip(3), direction: 'vertical', row: 8, column: 4 };
    board.prepareToPlaceShip(placement);
    expect(board.isNextShipPlacementValid).toBe(false);
  });

  it('will not allow a ship to be placed in the same location twice', () => {
    const placement: ShipPlacement = { ship: createShip(1), direction: 'vertical', row: 5, column: 5 };
    board.prepareToPlaceShip(placement);
    board.placeShip();
    board.prepareToPlaceShip(placement);
    expect(board.isNextShipPlacementValid).toBe(false);
  })

  it('will not allow a ship to be placed if touching the edge of another ship', () => {
    const validPlacement: ShipPlacement = { ship: createShip(3), direction: 'vertical', row: 7, column: 8 };
    board.prepareToPlaceShip(validPlacement);
    board.placeShip();

    const invalidPlacement: ShipPlacement = { ship: createShip(2), direction: 'vertical', row: 6, column: 7 };
    board.prepareToPlaceShip(invalidPlacement);
    expect(board.isNextShipPlacementValid).toBe(false);
  });

  it('will not allow a ship to be placed if touching the corner of another ship', () => {
    const validPlacement: ShipPlacement = { ship: createShip(1), direction: 'vertical', row: 5, column: 5 };
    board.prepareToPlaceShip(validPlacement);
    board.placeShip();

    const invalidPlacement: ShipPlacement = { ship: createShip(1), direction: 'vertical', row: 6, column: 6 };
    board.prepareToPlaceShip(invalidPlacement);
    expect(board.isNextShipPlacementValid).toBe(false);
  });

  it('throws an error if a ship placement is invalid but you try to place it anyway', () => {
    const invalidPlacement: ShipPlacement = { ship: createShip(1), direction: 'horizontal', row: 0, column: -5 };
    board.prepareToPlaceShip(invalidPlacement);
    expect(() => board.placeShip()).toThrow();
  })
});