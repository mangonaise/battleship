import { CellState, GameBoard } from "./gameBoard";
import repeat from 'lodash/times';
import Ship from "./ship";
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
    else {
      if (this.type === 'cpu' && this.autoAttackDelay > 0) {
        this.autoAttack();
      }
    }
  }

  private autoAttack() {
    if (!this.opponent) throw new Error("Can't auto attack. Opponent not found.");
    setTimeout(() => {
      if (!this.opponent) return;
      const freeCells = this.opponent.board.findFreeCells();
      const randomCellIndex = Math.floor(Math.random() * freeCells.length);
      this.attack(freeCells[randomCellIndex]);
    }, this.autoAttackDelay * 1000);
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
}

export default Player;