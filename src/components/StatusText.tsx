import { observer } from 'mobx-react-lite';
import React from 'react';
import Player from '../logic/player';

const StatusText: React.FC<{ user: Player }> = ({ user }) => {
  return (
    <h1 id="game-status">{getStatus()}</h1>
  )

  function getStatus() {
    let status = '';
    if (!user.board.arePositionsLocked) {
      status = 'Battleship';
    } else {
      if (user.board.haveAllShipsSunk) {
        status = 'You lose!';
      } else if (user.opponent?.board.haveAllShipsSunk) {
        status = 'You win!';
      } else {
        if (user.isPlayerTurn) {
          status = user.hasExtraTurn ? 'Hit! Extra move' : 'Your move';
        } else if (user.opponent?.isPlayerTurn) {
          status = 'Computer\'s move';
        }
      }
    }
    
    return status
  }
}

export default observer(StatusText);