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

    isNextShipPlacementValid = isShipWithinBoardEdges && !wouldShipsBeInContact(shipPlacement);
    nextShipPlacement = shipPlacement;
  }

  function wouldShipsBeInContact(proposedPlacement: ShipPlacement) {
    const proposedCells = getCellsInShip(proposedPlacement);

    for (const cell of proposedCells) {
      const surrounding = getSurroundingCellStates(cell).filter(state => state !== undefined);
      const isContact = !surrounding.every(state => state === CellState.empty);
      if (isContact) return true;
    }

    return false;
  }

  function getSurroundingCellStates(cell: [number, number]) {
    const row = cell[0];
    const column = cell[1];
    const surroundingStates: (CellState | undefined)[] = [];

    for (let checkedRow = row - 1; checkedRow <= row + 1; checkedRow++) {
      for (let checkedColumn = column - 1; checkedColumn <= column + 1; checkedColumn++) {
        const cellsInRow = cells[checkedColumn];
        const targetCell = cellsInRow ? cellsInRow[checkedColumn] : undefined;
        surroundingStates.push(targetCell);
      }
    }

    return surroundingStates;
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
    isNextShipPlacementValid = false;
  }

  return {
    get cells() { return cells; },
    get prepareToPlaceShip() { return prepareToPlaceShip; },
    get nextShipPlacement() { return nextShipPlacement; },
    get isNextShipPlacementValid() { return isNextShipPlacementValid; },
    get placeShip() { return placeShip; },
  }
}

export { CellState, createGameBoard };