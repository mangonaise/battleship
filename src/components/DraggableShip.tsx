import React, { MutableRefObject, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/DraggableShip.css';
import Draggable from 'react-draggable';

interface Props {
  size: number, 
  display: boolean, 
  direction: 'horizontal' | 'vertical'
}

export type ShipDragEvent = CustomEvent<{
  size: number,
  direction: 'horizontal' | 'vertical',
  dragStop: boolean,
  setIsDropPositionValid: React.Dispatch<React.SetStateAction<boolean>>
}>

const DraggableShip: React.FC<Props> = ({ size, display, direction }) => {
  // needed for react strict mode
  const nodeRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [isDropPositionValid, setIsDropPositionValid] = useState(false);

  function handleDragStart() {
    setZIndex(1);
    setIsDragging(true);
  }

  function handleDragMove(e: MouseEvent) {
    const cell = findCellAtPoint(e.x, e.y);
    if (cell) {
      cell.dispatchEvent(createDragEvent(false));
    } else {
      setIsDropPositionValid(false);
    }
  }

  function handleDragStop(e: MouseEvent) {
    const cell = findCellAtPoint(e.x, e.y);
    if (cell) {
      cell.dispatchEvent(createDragEvent(true));
    }
    setZIndex(0);
    setIsDragging(false);
  }

  function findCellAtPoint(x: number, y: number) {
    return document.elementsFromPoint(x, y).find(el => el.classList.contains('board-cell'));
  }

  function createDragEvent(dragStop: boolean): ShipDragEvent {
    return new CustomEvent('shipDrag', { 'detail': {
      size,
      direction,
      dragStop,
      setIsDropPositionValid
    }});
  }

  function setZIndex(value: number) {
    if (nodeRef.current) {
      nodeRef.current.style.zIndex = value.toString();
    }
  }

  return (
    <div>
      <Draggable
        nodeRef={nodeRef}
        defaultPosition={{ x: 0, y: 0 }}
        position={{ x: 0, y: 0 }}
        scale={1}
        onStart={handleDragStart}
        onDrag={e => handleDragMove(e as MouseEvent)}
        onStop={e => handleDragStop(e as MouseEvent)}>
        <div
          ref={nodeRef}
          className="draggable-ship"
          style={{
            position: isDragging ? 'absolute' : 'relative',
            display: display ? 'inline-flex' : 'none',
            flexDirection: isDragging && direction === 'vertical' ? 'column' : 'row'
          }}>
          {Array.from({ length: size }).map((_, index) => (
            <span
              key={index}
              className={
                `ship-placer-cell 
                ${index === 0 ? 'draggable-cell' : ''} 
                ${isDragging ? (isDropPositionValid ? 'dragging-valid' : 'dragging-invalid') : ''}`
              }
              style={calculateBorderStyles(size, index)}
              >
              {index === 0 && <FontAwesomeIcon icon={faArrowsAlt} />}
            </span>
          ))}
        </div>
      </Draggable>
    </div>
  )

  function calculateBorderStyles(shipSize: number, cellIndex: number) {
    let borderRight = '';
    let borderBottom = '';
    if (isDragging && direction === 'vertical') {
      borderBottom = cellIndex < shipSize - 1 ? 'none': '';
    }
    else {
      borderRight = cellIndex < shipSize - 1 ? 'none' : '';
    }

    return { borderRight, borderBottom };
  }
}

export default DraggableShip;