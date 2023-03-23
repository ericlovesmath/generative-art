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
    return this.subtract(other).magnitude();
  }

  /** Returns new vector from this to other */
  subtract(other: Vec): Vec {
    return new Vec(this.x - other.x, this.y - other.y);
  }

  /** Returns sum of two vectors */
  add(other: Vec): Vec {
    return new Vec(other.x + this.x, other.y + this.y);
  }

  /** Returns magnitude of vector */
  magnitude(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  /** Returns normalized vector of vector */
  normalized(): Vec {
    return this.scale(1 / this.magnitude());
  }

  /** Scales vector by scalar */
  scale(scalar: number): Vec {
    return new Vec(this.x * scalar, this.y * scalar);
  }

  /** Returns deep copy of Point */
  copy() {
    return new Vec(this.x, this.y);
  }

  /** Clamps vector to max velocity */
  clamp(maxVel: number) {
    if (this.magnitude() > maxVel) {
      return this.normalized().scale(maxVel);
    }
    return this.copy();
  }
}

/** For when you realized % is rem not mod */
export function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}
