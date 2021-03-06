import Ship from './ship';
import { makeAutoObservable } from 'mobx';

type CellField = CellState[][];

enum CellState {
  empty,
  missed,
  shipIntact,
  shipHit,
  shipSunk,
  knownEmpty
}

export type ShipPlacement = {
  ship: Ship, 
  direction: 'horizontal' | 'vertical', 
  row: number, 
  column: number
} | null

export type SunkShipsInfo = {
  [key: number]: { quantity: number, sunk: number }
}

class GameBoard {
  public cells: CellField;
  public nextShipPlacement: ShipPlacement = null;
  public isNextShipPlacementValid = false;
  public haveAllShipsSunk = false;
  public ships: Ship[] = [];
  public sunkShipsInfo: SunkShipsInfo = {}
  private _arePositionsLocked = false;

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

  public clear() {
    this.ships = [];
    this.nextShipPlacement = null;
    this.haveAllShipsSunk = false;
    this.sunkShipsInfo = {};
    this.cells = this.initializeBoard();
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
    if (!this.nextShipPlacement) {
      throw new Error("Can't place ship as there isn't one ready to place.");
    }
    if (!this.isNextShipPlacementValid) {
      return;
    }

    const size = this.nextShipPlacement.ship.size;
    const newCellPositions = this.predictCellsInShip(this.nextShipPlacement);
    const shipToPlace = this.nextShipPlacement.ship;
    shipToPlace.cellPositions = newCellPositions;
    shipToPlace.direction = this.nextShipPlacement.direction;

    this.setStateOfCells(newCellPositions, CellState.shipIntact);
    
    this.ships.push(shipToPlace);
    this.isNextShipPlacementValid = false;
    this.nextShipPlacement = null;

    this.sunkShipsInfo[size] = {
      quantity: this.sunkShipsInfo[size] ? this.sunkShipsInfo[size].quantity + 1 : 1,
      sunk: 0
    };
  }

  public lockShipsInPlace() {
    this._arePositionsLocked = true;
  }

  public findCellsWithState(states: CellState[]) {
    const positions: [number, number][] = [];
    for (let row = 0; row < 10; row++) {
      for (let column = 0; column < 10; column++) {
        const cellState = this.cells[row][column];
        if (states.includes(cellState)) {
          positions.push([row, column]);
        }
      }
    }
    return positions;
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
      if (attackedShip.isSunk) {
        this.handleSunkShip(attackedShip);
      }
      this.haveAllShipsSunk = this.ships.every(ship => ship.hits.every(hit => hit === 'hit'));
    }
  }

  private handleSunkShip(attackedShip: Ship) {
    attackedShip.cellPositions.forEach(sunkPos => {
      this.cells[sunkPos[0]][sunkPos[1]] = CellState.shipSunk;
      let knownCellPositions = 
        [...this.getAdjacentCellPositions(sunkPos), ...this.getCornerCellPositions(sunkPos)]
          .filter((pos): pos is [number, number] => pos !== undefined)
          .filter(pos => {
            let cellState = this.cells[pos[0]][pos[1]];
            return cellState === CellState.empty;
          });
      this.setStateOfCells(knownCellPositions, CellState.knownEmpty);
    });

    this.sunkShipsInfo[attackedShip.size].sunk += 1;
  }

  public removeShipAt(position: [number, number]) {
    const shipToRemove = this.findShipAt(position);
    if (!shipToRemove) return;

    this.setStateOfCells(shipToRemove.cellPositions, CellState.empty);
    this.ships = this.ships.filter(ship => ship !== shipToRemove);
    this.sunkShipsInfo[shipToRemove.size].quantity -= 1;
  }

  public rotateShipAt(position: [number, number]) {
    const shipToRotate = this.findShipAt(position); 

    if (!shipToRotate) {
      throw new Error(`Can't rotate. No ship found at (${position[0]}, ${position[1]}).`);
    }

    const cellsBeforeRotation = shipToRotate.cellPositions;
    this.setStateOfCells(cellsBeforeRotation, CellState.empty);

    const newDirection = shipToRotate.direction === 'horizontal' ? 'vertical' : 'horizontal';
    const newShipPlacement: ShipPlacement = { 
      ship: shipToRotate, 
      direction: newDirection,
      row: shipToRotate.originPosition[0],
      column: shipToRotate.originPosition[1]
    }
    this.prepareToPlaceShip(newShipPlacement);

    if (this.isNextShipPlacementValid) {
      shipToRotate.direction = newDirection;
      this.ships = this.ships.filter(ship => ship !== shipToRotate);
      this.placeShip();
    } else {
      this.setStateOfCells(cellsBeforeRotation, CellState.shipIntact);
    }
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

  public getSurroundingCellStates(position: [number, number]) {
    const row = position[0];
    const column = position[1];
    const surroundingStates: (CellState | undefined)[] = [];

    for (let checkedRow = row - 1; checkedRow <= row + 1; checkedRow++) {
      for (let checkedColumn = column - 1; checkedColumn <= column + 1; checkedColumn++) {
        const isValidRow = checkedRow >= 0 && checkedRow <= 9;
        const isValidColumn = checkedColumn >= 0 && checkedColumn <= 9;
        const cellsInRow = isValidRow ? this.cells[checkedRow] : undefined;
        const targetCell = cellsInRow ? (isValidColumn ? cellsInRow[checkedColumn] : undefined) : undefined;
        surroundingStates.push(targetCell);
      }
    }

    return surroundingStates;
  }

  public getCornerCellStates(position: [number, number]) {
    const surrounding = this.getSurroundingCellStates(position);
    return [surrounding[0], surrounding[2], surrounding[6], surrounding[8]];
  }

  public getAdjacentCellStates(position: [number, number]) {
    const surrounding = this.getSurroundingCellStates(position);
    return [surrounding[1], surrounding[3], surrounding[5], surrounding[7]];
  }

  private getCornerCellPositions(position: [number, number]): ([number, number] | undefined)[] {
    const existsRowBefore = position[0] - 1 >= 0;
    const existsRowAfter = position[0] + 1 <= 9;
    const existsColumnBefore = position[1] - 1 >= 0;
    const existsColumnAfter = position[1] + 1 <= 9;
    return [
      existsRowBefore && existsColumnBefore ? [position[0] - 1, position[1] - 1] : undefined,
      existsRowBefore && existsColumnAfter ? [position[0] - 1, position[1] + 1] : undefined,
      existsRowAfter && existsColumnBefore ? [position[0] + 1, position[1] - 1] : undefined,
      existsRowAfter && existsColumnAfter ? [position[0] + 1, position[1] + 1] : undefined
    ];
  }

  public getAdjacentCellPositions(position: [number, number]): ([number, number] | undefined)[] {
    return [
      position[0] - 1 >= 0 ? [position[0] - 1, position[1]] : undefined,
      position[1] - 1 >= 0 ? [position[0], position[1] - 1] : undefined,
      position[1] + 1 <= 9 ? [position[0], position[1] + 1] : undefined,
      position[0] + 1 <= 9 ? [position[0] + 1, position[1]] : undefined,
    ];
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

  public get arePositionsLocked() { return this._arePositionsLocked; }

  public numberOfShipsWithSize(size: number) { 
    return this.ships.filter(ship => ship.size === size).length;
  }
}

export { CellState, GameBoard };