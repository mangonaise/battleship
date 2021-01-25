import { GameBoard } from "./gameBoard";

class Player {
  public board: GameBoard;
  private opponent: Player | null = null;

  constructor() {
    this.board = new GameBoard();
  }

  public setOpponent(otherPlayer: Player) {
    this.opponent = otherPlayer;
  }

  public attack(position: [number, number]) {
    if (!this.opponent) throw new Error("Can't attack as there is no opponent.");
    this.opponent.board.receiveAttack(position);
  }
}

export default Player;