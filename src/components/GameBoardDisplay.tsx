import React from 'react';
import '../styles/GameBoardDisplay.css';
import { observer } from 'mobx-react-lite';
import Player from '../logic/player';
import BoardCell from './BoardCell';
import SunkShipIndicators from './SunkShipIndicators';

const GameBoardDisplay: React.FC<{ owner: Player }> = ({ owner }) => {
  return (
    <div className="board-display-container">
      <div className="board-owner-label">
        {owner.type === 'human' ? 'Your board' : `Opponent's board`}
      </div>
      <div className={`board-grid ${owner.isPlayerTurn && owner.board.arePositionsLocked ? 'disabled-board' : ''}`}>
        {owner.board.cells.flat().map((cell, index) => (
          <BoardCell key={index} cell={cell} owner={owner} index={index}/>
        ))}
      </div>
      {owner.type === 'cpu' && <SunkShipIndicators board={owner.board}/> }
    </div>
  )
}

export default observer(GameBoardDisplay);