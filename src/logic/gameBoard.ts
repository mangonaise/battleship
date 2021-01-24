enum CellState {
  empty,
  shipIntact,
  shipHit,
  shipSunk
}

const createGameBoard = () => {
  let cells = initializeBoard();

  function initializeBoard() {
    return (
      Array.from({ length: 10 }).map(x => {
        return Array.from({ length: 10 }).map(y => CellState.empty)
      })
    )
  }

  return {
    get cells() { return cells; }
  }
}

export { CellState, createGameBoard };