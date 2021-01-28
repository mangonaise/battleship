import React from 'react';
import '../styles/GameRules.css';

const GameRules: React.FC = () => {
  return (
    <div id="game-rules-container">
      <div id="game-rules-text">
        Attack your opponent's board.<br/>
        Sink all the ships!<br/>
      </div>
      <div id="cell-preview-container">
        <div>
          <span className="rules-cell-preview board-cell cell-missed" />
          <div className="cell-preview-label">empty</div>
        </div>
        <div>
          <span className="rules-cell-preview board-cell cell-hit" />
          <div className="cell-preview-label">hit</div>
        </div>
        <div>
          <span className="rules-cell-preview board-cell cell-sunk" />
          <div className="cell-preview-label">sunk</div>
        </div>
      </div>
    </div>
  )
}

export default GameRules;