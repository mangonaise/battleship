import React from 'react';
import '../styles/GameBoardDisplay.css';
import { CellState } from '../logic/gameBoard';
import { observer } from 'mobx-react-lite';
import Player from '../logic/player';
import BoardCell from './BoardCell';

const GameBoardDisplay: React.FC<{ owner: Player }> = ({ owner }) => {
  return (
    <div className="board-display-container">
      <p>{owner.type === 'human' ? 'Your board' : `Opponent's board`}</p>
      <div className={`board-grid ${owner.isPlayerTurn ? 'disabled-board' : ''}`}>
        {owner.board.cells.flat().map((cell, index) => (
          <BoardCell key={index} cell={cell} owner={owner} index={index}/>
        ))}
      </div>
    </div>
  )
}

export default observer(GameBoardDisplay);