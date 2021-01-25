import Ship from './ship';
import { makeAutoObservable } from 'mobx';

type CellField = CellState[][];

enum CellState {
  empty,
  missed,
  shipIntact,
  shipHit,
  shipSunk
}

export type ShipPlacement = {
  ship: Ship, 
  direction: 'horizontal' | 'vertical', 
  row: number, 
  column: number
} | null

class GameBoard {
  public cells: CellField;
  public nextShipPlacement: ShipPlacement = null;
  public isNextShipPlacementValid = false;
  public haveAllShipsSunk = false;
  private ships: Ship[] = [];

  constructor() {
    makeAutoObservable(this);
    this.cells = this.initializeBoard();
  }

  private initializeBoard() {
    return (
      Array.from({ length: 10 }).map(row => {
        return Array.from({ length: 10 }).map(column => CellState.empty)
      })
    )
  }

  public prepareToPlaceShip(shipPlacement: ShipPlacement) {
    if (!shipPlacement) throw new Error("No ship placement provided.");

    const { ship, direction, row, column } = shipPlacement;

    const startPoint = direction === 'horizontal' ? column : row;
    const isShipWithinBoardEdges = row >= 0 && column >= 0 && startPoint + ship.size <= 10;

    this.isNextShipPlacementValid = isShipWithinBoardEdges && !this.wouldShipsBeInContact(shipPlacement);
    this.nextShipPlacement = shipPlacement;
  }

  public placeShip() {
    if (!this.isNextShipPlacementValid) {
      throw new Error("Can't place ship as proposed placement is invalid.")
    }
    if (!this.nextShipPlacement) {
      throw new Error("Can't place ship as there isn't one ready to place.");
    }

    const newCellPositions = this.predictCellsInShip(this.nextShipPlacement);
    const shipToPlace = this.nextShipPlacement.ship;
    shipToPlace.cellPositions = newCellPositions;
    shipToPlace.direction = this.nextShipPlacement.direction;

    this.setStateOfCells(newCellPositions, CellState.shipIntact);
    
    this.ships.push(shipToPlace);
    this.isNextShipPlacementValid = false;
  }

  public receiveAttack(position: [number, number]) {
    const attackedShip = this.findShipAt(position);
    this.setStateOfCells([position], attackedShip ? CellState.shipHit : CellState.missed);

    if (attackedShip) {
      const attackedCell = attackedShip.cellPositions.find(shipCellPos => (
        shipCellPos[0] === position[0] && shipCellPos[1] === position[1]
      ));

      if (!attackedCell) {
        throw new Error('Hmm... a ship was attacked but its attacked cell cannot be found.');
      } 

      const attackedIndex = attackedShip.cellPositions.indexOf(attackedCell);
      attackedShip.hit(attackedIndex);
      this.haveAllShipsSunk = this.ships.every(ship => ship.hits.every(hit => hit === 'hit'));
    }
  }

  public rotateShipAt(position: [number, number]) {
    const shipToRotate = this.findShipAt(position); 

    if (!shipToRotate) {
      throw new Error(`Can't rotate. No ship found at (${position[0]}, ${position[1]}).`);
    }

    this.setStateOfCells(shipToRotate.cellPositions, CellState.empty);
    this.ships = this.ships.filter(ship => ship !== shipToRotate);

    shipToRotate.direction = shipToRotate.direction === 'horizontal' ? 'vertical' : 'horizontal';
    const newShipPlacement: ShipPlacement = { 
      ship: shipToRotate, 
      direction: shipToRotate.direction,
      row: shipToRotate.originPosition[0],
      column: shipToRotate.originPosition[1]
    }
    this.prepareToPlaceShip(newShipPlacement);
    this.placeShip();
  }

  private findShipAt(position: [number, number]) {
    return this.ships.find(ship => (
      ship.cellPositions.some(cellPos => (cellPos[0] === position[0] && cellPos[1] === position[1]))
    ));
  }

  private wouldShipsBeInContact(proposedPlacement: ShipPlacement) {
    const proposedCells = this.predictCellsInShip(proposedPlacement);

    for (const cell of proposedCells) {
      const surroundingCellStates = this.getSurroundingCellStates(cell).filter(state => state !== undefined);
      const isContact = !surroundingCellStates.every(state => state === CellState.empty);
      if (isContact) return true;
    }

    return false;
  }

  private getSurroundingCellStates(cell: [number, number]) {
    const row = cell[0];
    const column = cell[1];
    const surroundingStates: (CellState | undefined)[] = [];

    for (let checkedRow = row - 1; checkedRow <= row + 1; checkedRow++) {
      for (let checkedColumn = column - 1; checkedColumn <= column + 1; checkedColumn++) {
        const cellsInRow = this.cells[checkedRow];
        const targetCell = cellsInRow ? cellsInRow[checkedColumn] : undefined;
        surroundingStates.push(targetCell);
      }
    }

    return surroundingStates;
  }

  private predictCellsInShip(shipPlacement: ShipPlacement) {
    if (!shipPlacement) throw new Error("No ship placement provided.");
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

  private setStateOfCells(positions: [number, number][], newState: CellState) {
    positions.forEach(pos => this.cells[pos[0]][pos[1]] = newState);
  }
}

export { CellState, GameBoard };