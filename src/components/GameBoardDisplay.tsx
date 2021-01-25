import React from 'react';
import '../styles/GameBoardDisplay.css';
import { CellState } from '../logic/gameBoard';
import { observer } from 'mobx-react-lite';
import Player from '../logic/player';

const GameBoardDisplay: React.FC<{ player: Player }> = ({ player }) => {
  const board = player.board;

  function handleClickCell(index: number) {
    const row = Math.floor(index / 10);
    const column = index % 10;

    const cellState = board.cells[row][column];

    if (board.arePositionsLocked) {
      board.receiveAttack([row, column]);
    }
    else {
      if (cellState === CellState.shipIntact) {
        board.rotateShipAt([row, column]);
      }
    }
  }

  return (
    <div className="board-display-container">
      <p>{player.type === 'human' ? 'Your board' : `Opponent's board`}</p>
      <div className="board-grid">
        {board.cells.flat().map((cell, index) => (
          <div 
            key={index} 
            className={`board-cell ${getCellStyle(cell, player.showUnhitShips)}`}  
            onClick={() => handleClickCell(index)}
          >
          </div>
        ))}
      </div>
    </div>
  )
}

function getCellStyle(cellState: CellState, showUnhit: boolean) {
  let style = '';
  switch(cellState) {
    case CellState.missed: 
      style = 'cell-missed';
      break;
    case CellState.shipHit:
      style = 'cell-hit';
      break;
    case CellState.shipSunk:
      style = 'cell-sunk';
      break; 
  }
  if (showUnhit && cellState === CellState.shipIntact) style += ' cell-revealed';
  return style;
}

export default observer(GameBoardDisplay);