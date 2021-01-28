import Player from "../logic/player";
import Ship from "../logic/ship";
import { CellState, GameBoard } from '../logic/gameBoard';
import { toJS } from "mobx";

const o = CellState.empty;
const m = CellState.missed;
const S = CellState.shipIntact;
const H = CellState.shipHit;
const X = CellState.shipSunk;

describe('Player', () => {
  test('new player has an empty board', () => {
    const player = new Player();
    const rows = player.board.cells[0].length;
    const columns = player.board.cells.length;
    expect(rows * columns).toBe(100);
  });

  test(`player can attack opponent's board`, () => {
    const p1 = new Player('human');
    const p2 = new Player('human');

    p1.opponent = p2;
    p2.opponent = p1;

    p2.board.prepareToPlaceShip({ ship: new Ship(3), direction: 'vertical', row: 5, column: 5 });
    p2.board.placeShip();

    p1.attack([6, 5]);

    expect(toJS(p2.board.cells)).toEqual([
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, S, o, o, o, o],
      [o, o, o, o, o, H, o, o, o, o],
      [o, o, o, o, o, S, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o],
      [o, o, o, o, o, o, o, o, o, o]
    ]);

    p1.attack([5, 5]);
    p1.attack([7, 5]);
    expect(p2.board.haveAllShipsSunk).toBe(true);
  });

  test('cpu will automatically place ships at random', () => {
    const cpu = new Player('cpu');
    expect(cpu.board.ships.length).toBe(10);
  });

  test('human gets first turn, and turns are swapped after that', () => {
    const human = new Player('human');
    const cpu = new Player('cpu');
    human.opponent = cpu;
    cpu.opponent = human;
    cpu.board = new GameBoard();

    expect(human.isPlayerTurn).toBe(true);
    expect(cpu.isPlayerTurn).toBe(false);

    human.attack([4,5]);
    expect(human.isPlayerTurn).toBe(false);
    expect(cpu.isPlayerTurn).toBe(true);

    cpu.attack([0,3]);
    expect(human.isPlayerTurn).toBe(true);
    expect(cpu.isPlayerTurn).toBe(false);
  });

  test('computer starts by hunting a random cell', () => {
    const human = new Player('human');
    const cpu = new Player('cpu');
    human.opponent = cpu;
    cpu.opponent = human;

    cpu.makeSmartMove();

    expect(cpu.opponent.board.cells.some(row => 
      row.some(state => 
        state === CellState.missed || state === CellState.shipHit || state === CellState.shipSunk
      )
    )).toBe(true);
  })

  test('computer will check in a line if 3 cells surrounding a hit cell are missed', () => {
    const human = new Player('human');
    const cpu = new Player('cpu');
    human.opponent = cpu;
    cpu.opponent = human;

    human.board.prepareToPlaceShip({ ship: new Ship(3), direction: 'horizontal', row: 3, column: 3 });
    human.board.placeShip();

    cpu.attack([2, 3]);
    cpu.attack([3, 2]);
    cpu.attack([4, 3]);
    cpu.attack([3, 3]);

    cpu.makeSmartMove();
    expect(cpu.opponent.board.cells[3][4]).toBe(CellState.shipHit);

    cpu.makeSmartMove();
    expect(cpu.opponent.board.cells[3][5]).toBe(CellState.shipSunk);
    expect(human.board.ships[0].isSunk).toBe(true);
  });

  test('computer will make right decision in the corner of the board', () => {
    const human = new Player('human');
    const cpu = new Player('cpu');
    human.opponent = cpu;
    cpu.opponent = human;

    human.board.prepareToPlaceShip({ ship: new Ship(4), direction: 'vertical', row: 6, column: 9 });
    human.board.placeShip();

    cpu.attack([9, 8]);
    cpu.attack([9, 9]);
    cpu.makeSmartMove();
    cpu.makeSmartMove();
    expect(human.board.haveAllShipsSunk).toBe(false);
    cpu.makeSmartMove();
    expect(human.board.haveAllShipsSunk).toBe(true);    
  });

  test('player gets extra turn after successful hit', () => {
    const human = new Player('human');
    const cpu = new Player('cpu');
    cpu.board.clear();
    human.opponent = cpu;
    cpu.opponent = human;

    human.board.prepareToPlaceShip({ ship: new Ship(4), direction: 'vertical', row: 0, column: 0 });
    human.board.placeShip();

    human.attack([5, 5]);

    expect(cpu.isPlayerTurn).toBe(true);
    cpu.attack([0, 0]);
    expect(cpu.isPlayerTurn).toBe(true);
    expect(cpu.hasExtraTurn).toBe(true);
    cpu.attack([9,9]);
    expect(cpu.hasExtraTurn).toBe(false);
  })
})