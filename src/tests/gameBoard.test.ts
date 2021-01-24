import { create } from 'domain';
import { CellState, createGameBoard } from '../logic/gameBoard';
import createShip from '../logic/ship';

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

  it('can have a ship placed on it horizontally', () => {
    let ship = createShip(4);
    board.prepareToPlaceShip(ship, 'horizontal', 3, 4);
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

  it('can have a ship placed on it vertically', () => {
    let ship = createShip(3);
    board.prepareToPlaceShip(ship, 'vertical', 7, 8);
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
    board.prepareToPlaceShip(createShip(4), 'horizontal', 0, 7);
    expect(board.nextShipPlacement.isValid).toBe(false);
    board.prepareToPlaceShip(createShip(1), 'horizontal', 4, -1);
    expect(board.nextShipPlacement.isValid).toBe(false);
  });

  it('will not allow a vertical ship to be placed outside the board', () => {
    board.prepareToPlaceShip(createShip(3), 'vertical', 8, 4);
    expect(board.nextShipPlacement.isValid).toBe(false);
  });

  it.todo('will not allow a ship to be placed if touching the edge of another ship');

  it.todo('will not allow a ship to be placed if touching the corner of another ship');

  it('throws an error if a ship placement is invalid but you try to place it anyway', () => {
    board.prepareToPlaceShip(createShip(1), 'horizontal', 0, -5);
    expect(() => board.placeShip()).toThrow();
  })
});