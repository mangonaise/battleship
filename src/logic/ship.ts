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
  }
}

export default createShip;