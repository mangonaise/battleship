import { observer } from 'mobx-react-lite';
import React from 'react';
import Player from '../logic/player';
import '../styles/GameEndMessage.css';

const GameEndMessage: React.FC<{ players: Player[] }> = ({ players }) => {
  const loser = players.find(player => player.board.haveAllShipsSunk);
  if (!loser) return null;
  return (
    <div id="end-message-container">
      {loser.type === 'human' ? 
      <>
        <h3>Game over!</h3>
        <p>You fought valiantly, but your digital opponent ultimately prevailed.</p>
      </>
      :
      <>
        <h3>Victory!</h3>
        <p>Congratulations, human.<br/>You are a fine strategist.</p>
      </>}
      <button onClick={() => window.location.reload()} id="play-again-button">Play again</button>
    </div>
  )
}

export default observer(GameEndMessage);