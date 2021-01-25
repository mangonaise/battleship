export interface Ship {
  size: number,
  hits: boolean[],
  hitShip: (index: number) => void,
  isSunk: boolean,
  cellPositions: [number, number][],
  originPosition: [number, number],
  direction: 'horizontal' | 'vertical'
}

const createShip = (initSize: number) => {
  let hits = initializeHits();
  let cellPositions: [number, number][] = [];
  let originPosition: [number, number] = [-1, -1];
  let direction: 'horizontal' | 'vertical' = 'horizontal';

  function initializeHits() {
    return Array.from({ length: initSize }).map(x => false);
  }

  function hitShip(index: number) {
    hits[index] = true;
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
    get hitShip() { return hitShip; },
    get isSunk() { return hits.every(hit => hit === true); },
    get cellPositions() { return cellPositions; },
    set cellPositions(newPositions) { setCellPositions(newPositions); },
    get originPosition() { return originPosition; },
    direction
  }

  return output;
}

export default createShip;