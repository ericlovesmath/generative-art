/** Defines point in 2D space with x and y coordinates
 * Contains utility functions with points */
export class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /** Return Euclidean distance to another point */
  distance(other: Point): number {
    return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);
  }

  /** Returns deep copy of Point */
  copy() {
    return new Point(this.x, this.y);
  }
}
