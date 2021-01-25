import { GameBoard } from "./gameBoard";
import repeat from 'lodash/times';
import Ship from "./ship";

class Player {
  public board: GameBoard;
  public type: 'human' | 'cpu';
  public showUnhitShips = false;
  private opponent: Player | null = null;

  constructor(type: 'human' | 'cpu' = 'human') {
    this.board = new GameBoard();
    this.type = type;
    if (this.type === 'cpu') {
      this.placeRandomShips();
      this.board.lockShipsInPlace();
    } else {
      this.showUnhitShips = true;
    }
  }

  public setOpponent(otherPlayer: Player) {
    this.opponent = otherPlayer;
  }

  public attack(position: [number, number]) {
    if (!this.opponent) throw new Error("Can't attack as there is no opponent.");
    this.opponent.board.receiveAttack(position);
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