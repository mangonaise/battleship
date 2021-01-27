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

const DraggableShip: React.FC<Props> = ({ size, display, direction }) => {
  // needed for react strict mode
  const nodeRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleDragStop(e: any) {
    const cell = document.elementsFromPoint(e.x, e.y).find(el => el.classList.contains('board-cell'));
    if (cell) {
      cell.dispatchEvent(new CustomEvent('shipDrop', { 'detail': { size, direction } }));
    }
    setZIndex(0);
    setIsDragging(false);
  }

  function handleDragStart() {
    setZIndex(1);
    setIsDragging(true);
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
        onStop={handleDragStop}>
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
              className={`ship-placer-cell ${index === 0 ? 'draggable-cell' : ''}`}
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