/** Defines vector in 2D space with x and y coordinates
 * Contains utility functions with points */
export class Vec {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /** Returns Euclidean distance to another vector */
  distance(other: Vec): number {
    return this.subtract(other).norm();
  }

  /** Returns new vector from this to other */
  subtract(other: Vec): Vec {
    return new Vec(other.x - this.x, other.y - this.y);
  }

  /** Returns sum of two vectors */
  add(other: Vec): Vec {
    return new Vec(other.x + this.x, other.y + this.y);
  }

  /** Returns magnitude of vector */
  norm(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  /** Returns deep copy of Point */
  copy() {
    return new Vec(this.x, this.y);
  }
}
