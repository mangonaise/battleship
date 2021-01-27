import { toJS } from 'mobx';
import { CellState, ShipPlacement, GameBoard } from '../logic/gameBoard';
import Ship from '../logic/ship';

let board = new GameBoard();
const o = CellState.empty;
const m = CellState.missed;
const S = CellState.shipIntact;
const H = CellState.shipHit;
const X = CellState.shipSunk;
const e = CellState.knownEmpty;

describe('Game board', () => {
  beforeEach(() => board = new GameBoard());
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
    const ship = new Ship(4);
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
    const ship = new Ship(3);
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
    const ship = new Ship(3);
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
    expect(toJS(board.cells)).toEqual(expectedBoardAfterRotation);

    // Rotating it again is the same as undo.
    board.rotateShipAt([4, 4]);
    expect(board.cells).toEqual(boardBeforeRoation);
  });

  it('will not do anything if you try to rotate a ship & would go outside of board edges', () => {
    const ship = new Ship(4);
    const placement: ShipPlacement = { ship, direction: 'vertical', row: 6, column: 9 };
    board.prepareToPlaceShip(placement);
    board.placeShip();

    const cellsBeforeAttempt = toJS(board.cells);
    board.rotateShipAt([6, 9]);
    expect(toJS(board.cells)).toStrictEqual(cellsBeforeAttempt);
  })

  it('will not do anything if you try to rotate a ship & it would collide with another ship', () => {
    const ship1 = new Ship(1);
    const placement1: ShipPlacement = { ship: ship1, direction: 'vertical', row: 0, column: 3 };
    board.prepareToPlaceShip(placement1);
    board.placeShip();

    const ship2 = new Ship(4);
    const placement2: ShipPlacement = { ship: ship2, direction: 'vertical', row: 0, column: 0};
    board.prepareToPlaceShip(placement2);
    board.placeShip();

    const cellsBeforeAttempt = toJS(board.cells);
    board.rotateShipAt([3, 0]);
    expect(toJS(board.cells)).toEqual(cellsBeforeAttempt);
  })

  it('will not allow a horizontal ship to be placed outside the board', () => {
    const invalidPlacement1: ShipPlacement = { ship: new Ship(4), direction: 'horizontal', row: 0, column: 7 };
    board.prepareToPlaceShip(invalidPlacement1);
    expect(board.isNextShipPlacementValid).toBe(false);

    const invalidPlacement2: ShipPlacement = { ship: new Ship(1), direction: 'horizontal', row: 4, column: -1 };
    board.prepareToPlaceShip(invalidPlacement2);
    expect(board.isNextShipPlacementValid).toBe(false);
  });

  it('will not allow a vertical ship to be placed outside the board', () => {
    const placement: ShipPlacement = { ship: new Ship(3), direction: 'vertical', row: 8, column: 4 };
    board.prepareToPlaceShip(placement);
    expect(board.isNextShipPlacementValid).toBe(false);
  });

  it('will not allow a ship to be placed in the same location twice', () => {
    const ship1 = new Ship(1);
    let placement: ShipPlacement = { ship: ship1, direction: 'vertical', row: 5, column: 5 };
    board.prepareToPlaceShip(placement);
    board.placeShip();

    const ship2 = new Ship(1);
    placement.ship = ship2;
    board.prepareToPlaceShip(placement);
    expect(board.isNextShipPlacementValid).toBe(false);
  });

  it('will not allow a ship to be placed if there is already a ship there', () => {
    const ship1 = new Ship(1);
    const placement1: ShipPlacement = { ship: ship1, direction: 'vertical', row: 0, column: 3 };
    board.prepareToPlaceShip(placement1);
    board.placeShip();

    const ship2 = new Ship(4);
    const placement2: ShipPlacement = { ship: ship2, direction: 'horizontal', row: 0, column: 0 };
    board.prepareToPlaceShip(placement2);

    expect(board.isNextShipPlacementValid).toBe(false);
  })

  it('will not allow a ship to be placed if touching the edge of another ship', () => {
    const validPlacement: ShipPlacement = { ship: new Ship(3), direction: 'vertical', row: 7, column: 8 };
    board.prepareToPlaceShip(validPlacement);
    board.placeShip();

    const invalidPlacement: ShipPlacement = { ship: new Ship(2), direction: 'vertical', row: 6, column: 7 };
    board.prepareToPlaceShip(invalidPlacement);
    expect(board.isNextShipPlacementValid).toBe(false);
  });

  it('will not allow a ship to be placed if touching the corner of another ship', () => {
    const validPlacement: ShipPlacement = { ship: new Ship(1), direction: 'vertical', row: 5, column: 5 };
    board.prepareToPlaceShip(validPlacement);
    board.placeShip();

    const invalidPlacement: ShipPlacement = { ship: new Ship(1), direction: 'vertical', row: 6, column: 6 };
    board.prepareToPlaceShip(invalidPlacement);
    expect(board.isNextShipPlacementValid).toBe(false);
  });

  it('throws an error if you try to place a ship without preparing first', () => {
    expect(() => board.placeShip()).toThrow();

    const placement: ShipPlacement = { ship: new Ship(1), direction: 'vertical', row: 5, column: 5 };
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
    const ship = new Ship(4);
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
    const ship = new Ship(3);
    const placement: ShipPlacement = { ship, direction: 'vertical', row: 5, column: 3 };
    board.prepareToPlaceShip(placement);
    board.placeShip();

    board.receiveAttack([5, 3]);
    board.receiveAttack([6, 3]);
    expect(ship.isSunk).toBe(false);

    board.receiveAttack([7, 3]);
    expect(ship.isSunk).toBe(true);
    expect(board.cells).toEqual([
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, e, e, e, o, o, o, o, o],
      [o, o, e, X, e, o, o, o, o, o],
      [o, o, e, X, e, o, o, o, o, o],
      [o, o, e, X, e, o, o, o, o, o],
      [o, o, e, e, e, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o]
    ])
  });

  test('sinking all ships will cause board to update "haveAllShipsSunk"', () => {
    const ship1 = new Ship(1);
    const placement1: ShipPlacement = { ship: ship1, direction: 'vertical', row: 0, column: 0 };
    const ship2 = new Ship(1);
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

  test('sinking ships correctly updates ship data', () => {
    for (let i = 0; i < 3; i++) {
      board.prepareToPlaceShip({ ship: new Ship(1), direction: 'horizontal', row: i*2, column: 0 });
      board.placeShip();
    }
    for (let i = 0; i < 2; i++) {
      board.prepareToPlaceShip({ ship: new Ship(3), direction: 'horizontal', row: i*2, column: 4 });
      board.placeShip();
    }
    
    expect(board.sunkShipsInfo[1]).toEqual({ quantity: 3, sunk: 0 });
    expect(board.sunkShipsInfo[3]).toEqual({ quantity: 2, sunk: 0 });

    board.receiveAttack([0, 0]);
    board.receiveAttack([2, 0]);
    board.receiveAttack([0, 4]);
    board.receiveAttack([0, 5]);
    board.receiveAttack([0, 6]);
    expect(board.sunkShipsInfo[1]).toEqual({ quantity: 3, sunk: 2 });
    expect(board.sunkShipsInfo[3]).toEqual({ quantity: 2, sunk: 1 });
  });

  test('can query the number of ships with a specified length', () => {
    board.prepareToPlaceShip({ ship: new Ship(1), direction: 'horizontal', row: 0, column: 0});
    board.placeShip();

    board.prepareToPlaceShip({ ship: new Ship(1), direction: 'horizontal', row: 2, column: 0});
    board.placeShip();

    board.prepareToPlaceShip({ ship: new Ship(3), direction: 'horizontal', row: 4, column: 0});
    board.placeShip();

    expect(board.numberOfShipsWithSize(1)).toEqual(2);
    expect(board.numberOfShipsWithSize(3)).toEqual(1);
  })

  test('clear board function works', () => {
    board.prepareToPlaceShip({ ship: new Ship(1), direction: 'horizontal', row: 0, column: 0});
    board.placeShip();
    expect(board.ships.length).toBe(1);
    board.clear();
    expect(board.ships.length).toBe(0);
  })
});