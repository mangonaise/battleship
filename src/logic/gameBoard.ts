import { Ship } from './ship';

enum CellState {
  empty,
  shipIntact,
  shipHit,
  shipSunk
}

type CellField = CellState[][];
type Direction = 'horizontal' | 'vertical';

type ShipPlacement = {
  ship: Ship, 
  direction: Direction, 
  row: number, 
  column: number
  isValid: boolean
}

const createGameBoard = () => {
  let cells: CellField = initializeBoard();
  let nextShipPlacement: ShipPlacement;

  function initializeBoard() {
    return (
      Array.from({ length: 10 }).map(row => {
        return Array.from({ length: 10 }).map(column => CellState.empty)
      })
    )
  }

  function prepareToPlaceShip(ship: Ship, direction: Direction, row: number, column: number) {
    const startPoint = direction === 'horizontal' ? column : row;
    
    const isShipWithinEdges = 
      row >= 0 
      && column >= 0 
      && startPoint + ship.size <= 10;

    const isValid = isShipWithinEdges;

    nextShipPlacement = { ship, direction, row, column, isValid };
  }

  function placeShip() {
    const { ship, direction, row, column, isValid } = nextShipPlacement;

    if (!isValid) {
      throw new Error("Can't place ship as proposed placement is invalid!")
    }

    for (let i = 0; i < ship.size; i++) {
      if (direction === 'horizontal') {
        cells[row][column + i] = CellState.shipIntact;
      } else if (direction === 'vertical') {
        cells[row + i][column] = CellState.shipIntact;
      }
    }
  }

  return {
    get cells() { return cells; },
    get prepareToPlaceShip() { return prepareToPlaceShip; },
    get nextShipPlacement() { return nextShipPlacement; },
    get placeShip() { return placeShip; }
  }
}

export { CellState, createGameBoard };