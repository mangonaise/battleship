import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef } from 'react';
import { CellState, ShipPlacement } from '../logic/gameBoard';
import Player from '../logic/player';
import Ship from '../logic/ship';
import '../styles/BoardCell.css';
import { ShipDragEvent } from './DraggableShip';

interface Props {
  cell: CellState;
  owner: Player;
  index: number;
}

const BoardCell: React.FC<Props> = ({ cell, owner, index }) => {
  const cellRef: any = useRef(null);
  const board = owner.board;

  useEffect(() => {
    const cellRefInit = cellRef.current;
    cellRefInit.addEventListener('shipDrag', handleShipDrag);
    return () => cellRefInit.removeEventListener('shipDrag', handleShipDrag);
  }, []);

  function getCellPositionFromIndex() {
    const row = Math.floor(index / 10);
    const column = index % 10;
    return [row, column];
  }

  function handleShipDrag(event: ShipDragEvent) {
    const [row, column] = getCellPositionFromIndex();
    const { size, direction, dragStop, setIsDropPositionValid } = event.detail;
    const ship = new Ship(size);
    const placement: ShipPlacement = { ship, direction, row, column };
    board.prepareToPlaceShip(placement);
    if (board.isNextShipPlacementValid) {
      setIsDropPositionValid(true);
      if (dragStop) {
        board.placeShip();
      }
    } else {
      setIsDropPositionValid(false);
    }
  }

  function handleClickCell() {
    const [row, column] = getCellPositionFromIndex();

    if (board.arePositionsLocked) {
      owner.opponent?.attack([row, column]);
    } else {
      if (board.cells[row][column] === CellState.shipIntact) {
        board.removeShipAt([row, column]);
      }
    }
  }

  function setCellStyle(cellState: CellState) {
    let style = '';
    const stateStyles = ['', 'cell-missed', '', 'cell-hit', 'cell-sunk', 'cell-known-empty'];
    style = stateStyles[cellState];
  
    if (owner.type === 'human') {
      if (cellState === CellState.shipIntact) {
        style += ' cell-user';
        if (!board.arePositionsLocked) {
          style += ' cell-removeable';
        }
      }
      if (board.arePositionsLocked) {
        style += ' cell-uninteractable';
      }
    }
    else {
      if (cellState !== CellState.empty && cellState !== CellState.shipIntact) {
        style += ' cell-uninteractable';
      } else if (cellState === CellState.shipIntact) {
        if (board.haveAllShipsSunk || owner.opponent?.board.haveAllShipsSunk) {
          style += ' cell-user';
        }
      }
    }

    if (index === 0) style += ' cell-top-left';
    else if (index === 9) style += ' cell-top-right';
    else if (index === 90) style += ' cell-bottom-left';
    else if (index === 99) style += ' cell-bottom-right';

    if (owner.type === 'cpu') style += ' cell-hoverable';
    
    return style;
  }

  return (
    <div
      ref={cellRef}
      className={`board-cell ${setCellStyle(cell)}`}
      onClick={handleClickCell}
    />
  )
}

export default observer(BoardCell);