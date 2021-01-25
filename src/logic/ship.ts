import { CellState } from "./gameBoard";

type HitState = 'intact' | 'hit';

export interface Ship {
  size: number,
  hits: HitState[],
  hit: (index: number) => void,
  isSunk: boolean,
  cellPositions: [number, number][],
  originPosition: [number, number],
  direction: 'horizontal' | 'vertical'
}

const createShip = (initSize: number) => {
  let hits: HitState[] = initializeHits();
  let isSunk = false;
  let cellPositions: [number, number][] = [];
  let originPosition: [number, number] = [-1, -1];
  let direction: 'horizontal' | 'vertical' = 'horizontal';

  function initializeHits() {
    return Array.from({ length: initSize }).map(x => 'intact' as HitState);
  }

  function hit(index: number) {
    hits[index] = 'hit';
    isSunk = hits.every(state => state === 'hit');
  }

  function setCellPositions(newPositions: [number, number][]) {
    cellPositions = newPositions;
    originPosition = newPositions.reduce((origin, position) => {
      return [Math.min(origin[0], position[0]), Math.min(origin[1], position[1])];
    }, [10, 10]);
  }

  let output: Ship = {
    get size() { return initSize; },
    get hits() { return hits; },
    get hit() { return hit; },
    get isSunk() { return isSunk; },
    get cellPositions() { return cellPositions; },
    set cellPositions(newPositions) { setCellPositions(newPositions); },
    get originPosition() { return originPosition; },
    direction
  }

  return output;
}

export default createShip;