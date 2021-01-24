import { Ship } from './ship';

enum CellState {
  empty,
  shipIntact,
  shipHit,
  shipSunk
}

type CellField = CellState[][];

export interface ShipPlacement {
  ship: Ship, 
  direction: 'horizontal' | 'vertical', 
  row: number, 
  column: number
}

const createGameBoard = () => {
  let cells: CellField = initializeBoard();
  let nextShipPlacement: ShipPlacement;
  let isNextShipPlacementValid = false;

  function initializeBoard() {
    return (
      Array.from({ length: 10 }).map(row => {
        return Array.from({ length: 10 }).map(column => CellState.empty)
      })
    )
  }

  function prepareToPlaceShip(shipPlacement: ShipPlacement) {
    const { ship, direction, row, column } = shipPlacement;

    const startPoint = direction === 'horizontal' ? column : row;
    
    const isShipWithinBoardEdges = 
      row >= 0 
      && column >= 0 
      && startPoint + ship.size <= 10;

    isNextShipPlacementValid = isShipWithinBoardEdges;

    nextShipPlacement = shipPlacement;
  }

  function getCellsInShip(shipPlacement: ShipPlacement) {
    const { ship, direction, row, column } = shipPlacement;

    let positions: [number, number][] = []

    for (let i = 0; i < ship.size; i++) {
      if (direction === 'horizontal') {
        positions.push([row, column + i]);
      } else if (direction === 'vertical') {
        positions.push([row + i, column]);
      }
    }

    return positions;
  }

  function setStateOfCells(positions: [number, number][], newState: CellState) {
    positions.forEach(pos => cells[pos[0]][pos[1]] = newState);
  }

  function placeShip() {
    if (!isNextShipPlacementValid) {
      throw new Error("Can't place ship as proposed placement is invalid.")
    }

    const cellPositions = getCellsInShip(nextShipPlacement)
    setStateOfCells(cellPositions, CellState.shipIntact);
  }

  return {
    get cells() { return cells; },
    get prepareToPlaceShip() { return prepareToPlaceShip; },
    get nextShipPlacement() { return nextShipPlacement; },
    get isNextShipPlacementValid() { return isNextShipPlacementValid; },
    get placeShip() { return placeShip; }
  }
}

export { CellState, createGameBoard };