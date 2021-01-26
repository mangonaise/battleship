import React from 'react';
import { CellState } from '../logic/gameBoard';
import Player from '../logic/player';
import '../styles/BoardCell.css';

const BoardCell: React.FC<{ cell: CellState, owner: Player, index: number }> = ({ cell, owner, index }) => {
  const board = owner.board;

  function handleClickCell(index: number) {
    const row = Math.floor(index / 10);
    const column = index % 10;
    const cellState = board.cells[row][column];

    if (board.arePositionsLocked) {
      owner.opponent?.attack([row, column]);
    }
    else {
      if (cellState === CellState.shipIntact) {
        board.rotateShipAt([row, column]);
      }
    }
  }

  function setCellStyle(cellState: CellState) {
    let style = '';
    const stateStyles = ['', 'cell-missed', '', 'cell-hit', 'cell-sunk', 'cell-known-empty'];
    style = stateStyles[cellState];
  
    if (owner.type === 'human') {
      if (cellState === CellState.shipIntact) {
        style += ' cell-revealed';
      }
      if (board.arePositionsLocked) {
        style += ' cell-uninteractable';
      }
    }
    else {
      if (cellState !== CellState.empty && cellState !== CellState.shipIntact) {
        style += ' cell-uninteractable';
      }
    }

    if (index === 0) style += ' cell-top-left';
    else if (index === 9) style += ' cell-top-right';
    else if (index === 90) style += ' cell-bottom-left';
    else if (index === 99) style += ' cell-bottom-right';
    
    return style;
  }

  return (
    <div
      className={`board-cell ${setCellStyle(cell)}`}
      onClick={() => handleClickCell(index)}
    />
  )
}

export default BoardCell;