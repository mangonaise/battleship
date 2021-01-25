import { Board, createGameBoard } from "./gameBoard";

interface Player {
  board: Board,
  setOpponent: (opponent: Player) => void,
  attack: (position: [number, number]) => void
}

const createPlayer = () => {
  let board = createGameBoard();
  let opponent: Player;

  function setOpponent(otherPlayer: Player) {
    opponent = otherPlayer;
  }

  function attack(position: [number, number]) {
    opponent.board.receiveAttack(position);
  }

  let output: Player = {
    get board() { return board; },
    get setOpponent() { return setOpponent; },
    get attack() { return attack; },
  }

  return output;
}

export default createPlayer;