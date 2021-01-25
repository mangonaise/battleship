import { Ship } from './ship';

enum CellState {
  empty,
  missed,
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
  let ships: Ship[] = [];
  let nextShipPlacement: ShipPlacement;
  let shipToPlace: Ship | null;
  let isNextShipPlacementValid = false;

  function initializeBoard() {
    return (
      Array.from({ length: 10 }).map(row => {
        return Array.from({ length: 10 }).map(column => CellState.empty)
      })
    )
  }

  function placeShip() {
    if (!isNextShipPlacementValid) {
      throw new Error("Can't place ship as proposed placement is invalid.")
    }
    if (!shipToPlace) {
      throw new Error("Can't place ship as there isn't one ready to place.");
    }

    const newCellPositions = predictCellsInShip(nextShipPlacement)
    shipToPlace.cellPositions = newCellPositions;
    shipToPlace.direction = nextShipPlacement.direction;
    ships.push(shipToPlace);

    setStateOfCells(newCellPositions, CellState.shipIntact);
    
    isNextShipPlacementValid = false;
    shipToPlace = null;
  }

  function findShipAt(position: [number, number]) {
    return ships.find(ship => (
      ship.cellPositions.some(cellPos => (cellPos[0] === position[0] && cellPos[1] === position[1]))
    ))
  }

  function rotateShipAt(position: [number, number]) {
    const shipToRotate = findShipAt(position); 

    if (!shipToRotate) {
      throw new Error(`Can't rotate. No ship found at (${position[0]}, ${position[1]}).`);
    }

    setStateOfCells(shipToRotate.cellPositions, CellState.empty);
    ships = ships.filter(ship => ship !== shipToRotate);

    shipToRotate.direction = shipToRotate.direction === 'horizontal' ? 'vertical' : 'horizontal';
    const newShipPlacement: ShipPlacement = { 
      ship: shipToRotate, 
      direction: shipToRotate.direction,
      row: shipToRotate.originPosition[0],
      column: shipToRotate.originPosition[1]
    }
    prepareToPlaceShip(newShipPlacement);
    placeShip();
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
    shipToPlace = ship;
  }

  function wouldShipsBeInContact(proposedPlacement: ShipPlacement) {
    const proposedCells = predictCellsInShip(proposedPlacement);

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
        const cellsInRow = cells[checkedRow];
        const targetCell = cellsInRow ? cellsInRow[checkedColumn] : undefined;
        surroundingStates.push(targetCell);
        
      }
    }

    return surroundingStates;
  }

  function predictCellsInShip(shipPlacement: ShipPlacement) {
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
  
  function attack(position: [number, number]) {
    const attackedShip = findShipAt(position);
    setStateOfCells([position], attackedShip ? CellState.shipHit : CellState.missed);

    if (attackedShip) {
      const attackedCell = attackedShip.cellPositions.find(shipCellPos => (
        shipCellPos[0] === position[0] && shipCellPos[1] === position[1]
      ))

      if (attackedCell) {
        const attackedIndex = attackedShip.cellPositions.indexOf(attackedCell);
        attackedShip.hits[attackedIndex] = true;
      } else {
        throw new Error('Hmm... a ship was attacked but its attacked cell cannot be found.');
      }
    }
  }

  return {
    get cells() { return cells; },
    get prepareToPlaceShip() { return prepareToPlaceShip; },
    get nextShipPlacement() { return nextShipPlacement; },
    get isNextShipPlacementValid() { return isNextShipPlacementValid; },
    get placeShip() { return placeShip; },
    get rotateShipAt() { return rotateShipAt; },
    get attack() { return attack; },
  }
}

export { CellState, createGameBoard };