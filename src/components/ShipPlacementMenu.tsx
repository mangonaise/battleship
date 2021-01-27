import { faArrowsAltH, faArrowsAltV, faDice, faPlay, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import Player from '../logic/player';
import '../styles/ShipPlacementMenu.css';
import DraggableShip from './DraggableShip';

const ShipPlacementMenu: React.FC<{ user: Player }> = ({ user }) => {
  const [direction, setDirection] = useState<'horizontal' | 'vertical'>('horizontal');

  return (
    <div id="ship-placer-container">
      <h3>Place your ships.</h3>
      <button onClick={() => user.board.clear()} className="placement-option-button">
        <FontAwesomeIcon className="placement-option-icon" icon={faSyncAlt} /> Clear board
      </button>
      <button onClick={() => user.placeRandomShips(true)} className="placement-option-button">
        <FontAwesomeIcon className="placement-option-icon" icon={faDice} /> Place randomly
      </button>
      {user.board.ships.length < 10 ? 
      <div>
        <div id="manual-placement-text">Drag & drop</div>
        <div className="direction-toggle-container">
          <button
            onClick={() => setDirection('horizontal')}
            className={`placement-direction-button ${direction === 'horizontal' ? 'active-direction-button' : ''}`}>
            <FontAwesomeIcon icon={faArrowsAltH} />
          </button>
          <button
            className={`placement-direction-button ${direction === 'vertical' ? 'active-direction-button' : ''}`}
            onClick={() => setDirection('vertical')}>
            <FontAwesomeIcon icon={faArrowsAltV} />
          </button>
          <p>placing {direction}ly</p>
        </div>
      </div>
      : 
      <>
        <h3 style={{marginTop: '10px'}}>Good to go!</h3>
        <button onClick={() => user.board.lockShipsInPlace()} id="start-button" className="placement-option-button">
          <FontAwesomeIcon className="placement-option-icon" icon={faPlay}/> Start game
        </button>
      </>}

      <div>
        <div className="draggable-ship-group">
          <DraggableShip size={4} display={user.board.numberOfShipsWithSize(4) < 1} direction={direction} />
        </div>
        <div className="draggable-ship-group">
          {Array.from({ length: 2 }).map((_, index) => (
            <DraggableShip key={index} size={3} display={user.board.numberOfShipsWithSize(3) <= index} direction={direction} />
          ))}
        </div>
        <div className="draggable-ship-group">
          {Array.from({ length: 3 }).map((_, index) => (
            <DraggableShip key={index} size={2} display={user.board.numberOfShipsWithSize(2) <= index} direction={direction} />
          ))}
        </div>
        <div className="draggable-ship-group">
          {Array.from({ length: 4 }).map((_, index) => (
            <DraggableShip key={index} size={1} display={user.board.numberOfShipsWithSize(1) <= index} direction={direction} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default observer(ShipPlacementMenu);