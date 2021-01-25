import createShip from '../logic/ship';

describe('Ship', () => {
  it('initializes correctly', () => {
    const ship = createShip(4);
    expect(ship.size).toBe(4);
    expect(ship.hits).toEqual([false, false, false, false]);
  });

  it('can be hit', () => {
    const ship = createShip(3);
    ship.hit(1);
    expect(ship.hits).toEqual([false, true, false]);
    ship.hit(2);
    expect(ship.hits).toEqual([false, true, true]);
    ship.hit(0);
    expect(ship.hits).toEqual([true, true, true]);
  })

  it('becomes sunk if all units are hit', () => {
    const ship = createShip(2);
    expect(ship.isSunk).toEqual(false);
    ship.hit(0);
    ship.hit(1);
    expect(ship.isSunk).toEqual(true);
  })
});