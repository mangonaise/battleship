import { CellState, GameBoard } from "./gameBoard";
import Ship from "./ship";
import repeat from 'lodash/times';
import shuffle from 'lodash/shuffle';
import { makeAutoObservable } from "mobx";

class Player {
  public board: GameBoard;
  public type: 'human' | 'cpu';
  public opponent: Player | null = null;
  public isPlayerTurn = false;
  public autoAttackDelay = 0;

  constructor(type: 'human' | 'cpu' = 'human') {
    makeAutoObservable(this);
    this.board = new GameBoard();
    this.type = type;
    if (this.type === 'cpu') {
      this.placeRandomShips();
      this.board.lockShipsInPlace();
    } else if (this.type === 'human') {
      this.isPlayerTurn = true;
    }
  }

  public placeRandomShips() {
    for (let shipsToPlace = 1; shipsToPlace <= 4; shipsToPlace++) {
      repeat(shipsToPlace, () => {
        const shipSize = 5 - shipsToPlace;
        while(!this.board.isNextShipPlacementValid) {
          const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
          const unconstrainedPosition = Math.floor(Math.random() * 10);
          const constrainedPosition = Math.floor(Math.random() * (10 - shipSize));
          const origin = direction === 'horizontal' ?
            [unconstrainedPosition, constrainedPosition]
            : [constrainedPosition, unconstrainedPosition];
          this.board.prepareToPlaceShip({ ship: new Ship(shipSize), direction, row: origin[0], column: origin[1]})
        }
        this.board.placeShip();
      })
    }
  }

  public attack(position: [number, number]) {
    if (!this.opponent) throw new Error("Can't attack as there is no opponent.");
    this.opponent.board.receiveAttack(position);

    if (this.opponent.board.cells[position[0]][position[1]] === CellState.missed) {
      this.isPlayerTurn = false;
      this.opponent.isPlayerTurn = true;
      if (this.opponent.type === 'cpu' && this.opponent.autoAttackDelay > 0) {
        this.opponent.autoAttack();
      }
    }
    // Successful attack nets another turn.
    else {
      if (this.type === 'cpu' && this.autoAttackDelay > 0) {
        this.autoAttack();
      }
    }
  }

  private autoAttack() {
    if (!this.opponent) throw new Error("Can't auto attack. Opponent not found.");
    setTimeout(() => this.makeSmartMove(), this.autoAttackDelay * 1000);
  }

  // TODO: Try refactoring this into a non-monster function?
  public makeSmartMove() {
    if (!this.opponent) return;
    const opponentBoard = this.opponent.board;
    const hitPositions = opponentBoard.findCellsWithState([CellState.shipHit]);
    if (hitPositions.length > 0) {
      if (hitPositions.length === 1) {
        let adjacentPositions = 
          opponentBoard.getAdjacentCellPositions(hitPositions[0])
          .filter((pos): pos is [number, number] => pos !== undefined)
          .filter(pos => opponentBoard.cells[pos[0]][pos[1]] !== CellState.missed)
          .filter(pos => {
            const cornerStates = opponentBoard.getCornerCellStates(pos);
            return !cornerStates.some(state => state === CellState.shipHit || state === CellState.shipSunk);
          });
        adjacentPositions = shuffle(adjacentPositions);
        this.attack(adjacentPositions[0]);
        return;
      }

      let endPositions = hitPositions.filter(hitPos => {
        const adjacentStates = opponentBoard.getAdjacentCellStates(hitPos);
        return adjacentStates.filter(state => state === CellState.shipHit).length === 1;
      });

      endPositions = shuffle(endPositions);

      let extendedPositions: [number, number][] =
        endPositions
        .map(pos => {
          const adjacentStates = opponentBoard.getAdjacentCellStates(pos);
          const adjacentIndex = adjacentStates.indexOf(CellState.shipHit);
          // Finds the position opposite the hit cell.
          if (adjacentIndex === 0) return pos[0] + 1 <= 9 ? [pos[0] + 1, pos[1]] as [number, number] : undefined;
          if (adjacentIndex === 1) return pos[1] + 1 <= 9 ? [pos[0], pos[1] + 1] as [number, number] : undefined;
          if (adjacentIndex === 2) return pos[1] - 1 >= 0 ? [pos[0], pos[1] - 1] as [number, number] : undefined;
          if (adjacentIndex === 3) return pos[0] - 1 >= 0 ? [pos[0] - 1, pos[1]] as [number, number] : undefined;
          return undefined;
        })
        .filter((pos): pos is [number, number] => pos !== undefined)
        .filter(pos => {
          const cellState = opponentBoard.cells[pos[0]][pos[1]];
          return cellState === CellState.empty || cellState === CellState.shipIntact;
        });

      for (const unhitPos of extendedPositions) {
        const surroundingStates = opponentBoard.getSurroundingCellStates(unhitPos);
        const surroundingHitCells = surroundingStates.filter(state => state === CellState.shipHit || state === CellState.shipSunk);

        if (surroundingHitCells.length === 1) {
          this.attack(unhitPos);
          return unhitPos;
        }
      }

      throw new Error("Logic error! Checked either end of hit cells and found no available space to attack.");

    } else {
      this.attackRandomCell();
    }
  }

  private attackRandomCell() {
    const opponentBoard = this.opponent!.board;
    let freeCellPositions = opponentBoard.findCellsWithState([CellState.empty, CellState.shipIntact]);

    freeCellPositions = freeCellPositions.filter(pos => {
      const adjacentStates = opponentBoard.getAdjacentCellStates(pos);
      if (adjacentStates.some(adj => adj === CellState.shipHit || adj === CellState.shipSunk)) {
        return false;
      }
      const cornerStates = opponentBoard.getCornerCellStates(pos);
      if (cornerStates.some(corner => corner === CellState.shipHit || corner === CellState.shipSunk)) {
        return false;
      }
      return true;
    })

    if (freeCellPositions.length === 0) {
      throw new Error('No more positions for CPU to check. The game should have ended by now.');
    }
    
    const randomCellIndex = Math.floor(Math.random() * freeCellPositions.length);
    this.attack(freeCellPositions[randomCellIndex]);
  }
}

export default Player;