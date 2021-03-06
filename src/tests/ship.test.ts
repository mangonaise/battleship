import Ship from '../logic/ship';

describe('Ship', () => {
  it('initializes correctly', () => {
    const ship = new Ship(4);
    expect(ship.size).toBe(4);
    expect(ship.hits).toEqual(['intact', 'intact', 'intact', 'intact']);
  });

  it('can be hit', () => {
    const ship = new Ship(3);
    ship.hit(1);
    expect(ship.hits).toEqual(['intact', 'hit', 'intact']);
    ship.hit(2);
    expect(ship.hits).toEqual(['intact', 'hit', 'hit']);
    ship.hit(0);
    expect(ship.hits).toEqual(['hit', 'hit', 'hit']);
  })

  it('becomes sunk if all units are hit', () => {
    const ship = new Ship(2);
    expect(ship.isSunk).toEqual(false);
    ship.hit(0);
    ship.hit(1);
    expect(ship.isSunk).toEqual(true);
  })
});