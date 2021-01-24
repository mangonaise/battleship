import createShip from '../logic/ship';

describe('Ship', () => {
  it('Initializes correctly', () => {
    const ship = createShip(4);
    expect(ship.size).toBe(4);
  });
})

