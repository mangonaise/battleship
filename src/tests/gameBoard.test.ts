import { CellState, ShipPlacement, createGameBoard } from '../logic/gameBoard';
import createShip, { Ship } from '../logic/ship';

let board = createGameBoard();
const o = CellState.empty;
const m = CellState.missed;
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
    const ship = createShip(4);
    const placement: ShipPlacement = { ship, direction: 'horizontal', row: 3, column: 4 };
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
    expect(ship.cellPositions).toEqual([[3, 4], [3, 5], [3, 6], [3, 7]]);
    expect(ship.hits).toEqual(['intact', 'intact', 'intact', 'intact']);
    expect(ship.originPosition).toEqual([3, 4]);
    expect(ship.direction).toBe('horizontal');
    expect(ship.isSunk).toBe(false);
  });

  it('can place a ship vertically', () => {
    const ship = createShip(3);
    const placement: ShipPlacement = { ship, direction: 'vertical', row: 7, column: 8 }
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
    expect(ship.cellPositions).toEqual([[7, 8], [8, 8], [9, 8]]);
    expect(ship.hits).toEqual(['intact', 'intact', 'intact']);
    expect(ship.originPosition).toEqual([7, 8]);
    expect(ship.direction).toBe('vertical');
    expect(ship.isSunk).toBe(false);
  });

  it('can rotate a ship', () => {
    const ship = createShip(3);
    const placement: ShipPlacement = { ship, direction: 'horizontal', row: 3, column: 4 };
    board.prepareToPlaceShip(placement);
    board.placeShip();
    const boardBeforeRoation = board.cells;
    const expectedBoardAfterRotation = [
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, S, o, o, o, o, o],
      [o, o, o, o, S, o, o, o, o, o],
      [o, o, o, o, S, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o]
    ];

    board.rotateShipAt([3, 6]);
    expect(board.cells).toEqual(expectedBoardAfterRotation);

    // Rotating it again is the same as undo.
    board.rotateShipAt([4, 4]);
    expect(board.cells).toEqual(boardBeforeRoation);
  });

  it('will not allow rotating a ship if it would go outside of board edges', () => {
    const ship = createShip(4);
    const placement: ShipPlacement = { ship, direction: 'vertical', row: 6, column: 7 };
    board.prepareToPlaceShip(placement);
    board.placeShip();

    expect(() => board.rotateShipAt([6, 7])).toThrow();
  })

  it('will not allow rotating a ship if it would collide with another ship', () => {
    const ship1 = createShip(1);
    const placement1: ShipPlacement = { ship: ship1, direction: 'vertical', row: 0, column: 3 };
    board.prepareToPlaceShip(placement1);
    board.placeShip();

    const ship2 = createShip(4);
    const placement2: ShipPlacement = { ship: ship2, direction: 'vertical', row: 0, column: 0};
    board.prepareToPlaceShip(placement2);
    board.placeShip();

    expect(() => board.rotateShipAt([3, 0])).toThrow("Can't place ship as proposed placement is invalid.");
  })

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
    const ship1 = createShip(1);
    let placement: ShipPlacement = { ship: ship1, direction: 'vertical', row: 5, column: 5 };
    board.prepareToPlaceShip(placement);
    board.placeShip();

    const ship2 = createShip(1);
    placement.ship = ship2;
    board.prepareToPlaceShip(placement);
    expect(board.isNextShipPlacementValid).toBe(false);
  });

  it('will not allow a ship to be placed if there is already a ship there', () => {
    const ship1 = createShip(1);
    const placement1: ShipPlacement = { ship: ship1, direction: 'vertical', row: 0, column: 3 };
    board.prepareToPlaceShip(placement1);
    board.placeShip();

    const ship2 = createShip(4);
    const placement2: ShipPlacement = { ship: ship2, direction: 'horizontal', row: 0, column: 0 };
    board.prepareToPlaceShip(placement2);

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
  });

  it('throws an error if you try to place a ship without preparing first', () => {
    expect(() => board.placeShip()).toThrow();

    const placement: ShipPlacement = { ship: createShip(1), direction: 'vertical', row: 5, column: 5 };
    board.prepareToPlaceShip(placement);
    board.placeShip();
    expect(() => board.placeShip()).toThrow();
  });

  test('attacking an empty cell sets its state to "missed"', () => {
    expect(board.cells[5][8]).toEqual(CellState.empty);
    board.receiveAttack([5, 8]);
    expect(board.cells[5][8]).toEqual(CellState.missed);
  });

  test('hitting a ship works', () => {
    const ship = createShip(4);
    const placement: ShipPlacement = { ship, direction: 'horizontal', row: 3, column: 4 };
    board.prepareToPlaceShip(placement);
    board.placeShip();

    board.receiveAttack([3, 6]);

    expect(board.cells).toEqual([
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, S, S, H, S, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o]
    ]);

    expect(ship.hits).toEqual(['intact', 'intact', 'hit', 'intact']);
    expect(ship.isSunk).toBe(false);
  });

  test('hitting an entire ship will sink it', () => {
    const ship = createShip(3);
    const placement: ShipPlacement = { ship, direction: 'vertical', row: 5, column: 3 };
    board.prepareToPlaceShip(placement);
    board.placeShip();

    board.receiveAttack([5, 3]);
    board.receiveAttack([6, 3]);
    expect(ship.isSunk).toBe(false);

    board.receiveAttack([7, 3]);
    expect(ship.isSunk).toBe(true);
  });

  test('sinking all ships will cause board to update "haveAllShipsSunk"', () => {
    const ship1 = createShip(1);
    const placement1: ShipPlacement = { ship: ship1, direction: 'vertical', row: 0, column: 0 };
    const ship2 = createShip(1);
    const placement2: ShipPlacement = { ship: ship2, direction: 'vertical', row: 1, column: 2 };

    board.prepareToPlaceShip(placement1);
    board.placeShip();
    board.prepareToPlaceShip(placement2);
    board.placeShip();

    board.receiveAttack([0,0]);
    expect(board.haveAllShipsSunk).toBe(false);

    board.receiveAttack([1,2]);
    expect(board.haveAllShipsSunk).toBe(true);
  });
});