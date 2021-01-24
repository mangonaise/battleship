import createShip from '../logic/ship';

describe('Ship', () => {
  it('initializes correctly', () => {
    const ship = createShip(4);
    expect(ship.size).toBe(4);
    expect(ship.hits).toEqual([false, false, false, false]);
  });

  it('can be hit', () => {
    const ship = createShip(3);
    ship.hitShip(1);
    expect(ship.hits).toEqual([false, true, false]);
    ship.hitShip(2);
    expect(ship.hits).toEqual([false, true, true]);
    ship.hitShip(0);
    expect(ship.hits).toEqual([true, true, true]);
  })

  it('becomes sunk if all units are hit', () => {
    const ship = createShip(2);
    expect(ship.isSunk).toEqual(false);
    ship.hitShip(0);
    ship.hitShip(1);
    expect(ship.isSunk).toEqual(true);
  })
})

