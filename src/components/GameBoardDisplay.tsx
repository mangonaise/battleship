import React from 'react';
import '../styles/GameBoardDisplay.css';
import { observer } from 'mobx-react-lite';
import Player from '../logic/player';
import BoardCell from './BoardCell';
import SunkShipIndicators from './SunkShipIndicators';

const GameBoardDisplay: React.FC<{ owner: Player }> = ({ owner }) => {
  const isGameOver = owner.board.haveAllShipsSunk || owner.opponent?.board.haveAllShipsSunk;
  return (
    <div className="board-display-container">
      <div className="board-owner-label">
        {owner.type === 'human' ? 'Your board' : `Opponent's board`}
      </div>
      <div className={`board-grid ${setStyle()}`}>
        {owner.board.cells.flat().map((cell, index) => (
          <BoardCell key={index} cell={cell} owner={owner} index={index}/>
        ))}
      </div>
      {(owner.type === 'cpu' && !isGameOver) && <SunkShipIndicators board={owner.board}/> }
    </div>
  )

  function setStyle() {
    let style = '';
    if (isGameOver) {
      style += 'disabled-board';
    } else if (owner.isPlayerTurn && owner.board.arePositionsLocked) {
      style += 'dimmed-board disabled-board';
    }
    
    return style;
  }
}

export default observer(GameBoardDisplay);