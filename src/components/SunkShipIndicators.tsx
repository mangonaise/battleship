import { observer } from 'mobx-react-lite';
import React from 'react';
import { GameBoard } from '../logic/gameBoard';
import '../styles/SunkShipIndicators.css';

const SunkShipIndicators: React.FC<{ board: GameBoard }> = ({ board }) => {
  let sunkShipsInfo: { shipSize: number, quantity: number, sunk: number }[] = [];

  for (const key in board.sunkShipsInfo) {
    sunkShipsInfo.push({
      shipSize: parseInt(key),
      quantity: board.sunkShipsInfo[key].quantity,
      sunk: board.sunkShipsInfo[key].sunk
    });
  }

  return (
    <div className="sunk-indicators-container">
      <div className="sunk-ships-indicator-label">Sunk ships</div>
      {sunkShipsInfo.map(info => (
        <div key={info.shipSize}>
          {Array.from({ length: info.quantity }).map((_, index) => (
            <span key={index} className="sunk-indicator">
              {Array.from({ length: info.shipSize }).map((_, key) =>
                <span
                  key={key}
                  className={`indicator-cell ${index < info.sunk ? "indicator-sunk" : "indicator-not-sunk"}`}
                />
              )}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

export default observer(SunkShipIndicators);