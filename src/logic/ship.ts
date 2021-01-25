type HitState = 'intact' | 'hit';

class Ship {
  public size;
  public hits: HitState[];
  public isSunk = false;
  public direction: 'horizontal' | 'vertical' = 'horizontal';
  private _cellPositions: [number, number][] = [];
  private _originPosition: [number, number] = [-1, -1];

  constructor(initSize: number) {
    this.size = initSize;
    this.hits = this.initializeHits();
  }

  public get cellPositions() { return this._cellPositions; }
  public set cellPositions(newPositions: [number, number][]) {
    this._cellPositions = newPositions;
    this._originPosition = newPositions.reduce((origin, position) => {
      return [Math.min(origin[0], position[0]), Math.min(origin[1], position[1])];
    }, [10, 10]);
  }

  public get originPosition() { return this._originPosition; }

  private initializeHits() {
    return Array.from({ length: this.size }).map(x => 'intact' as HitState);
  }

  public hit(index: number) {
    this.hits[index] = 'hit';
    this.isSunk = this.hits.every(state => state === 'hit');
  }
}

export default Ship;