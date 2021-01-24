export interface Ship {
  size: number,
  hits: boolean[],
  hitShip: (index: number) => void,
  isSunk: boolean
}

const createShip = (initSize: number) => {
  let hits = initializeHits();

  function initializeHits() {
    return Array.from({ length: initSize }).map(x => false);
  }

  function hitShip(index: number) {
    hits[index] = true;
  }

  return {
    get size() { return initSize; },
    get hits() { return hits; },
    get hitShip() { return hitShip; },
    get isSunk() { return hits.every(hit => hit === true); }
  } as Ship
}

export default createShip;