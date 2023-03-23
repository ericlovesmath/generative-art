import { Vec, mod } from "../../lib/utils";
import { CanvasBoard, CanvasObject, PeriodicDrawer } from "../../lib/canvas";

class Boid {
  pos: Vec;
  vel: Vec;
  acc: Vec;

  RAD = 7;

  constructor(pos: Vec, vel: Vec) {
    this.pos = pos;
    this.vel = vel;
    this.acc = new Vec(0, 0);
  }

  /** Returns steering force to fly towards average position of local boids */
  cohere(locals: Boid[]): Vec {
    let avgPosition = new Vec(0, 0);
    for (let curr of locals) {
      avgPosition = avgPosition.add(curr.pos);
    }
    if (locals.length == 0) {
      return avgPosition;
    }
    return avgPosition.scale(1 / locals.length).subtract(this.pos);
  }

  /** Returns steering force to avoid crowding local flock */
  separate(locals: Boid[]): Vec {
    let target = new Vec(0, 0);
    for (let curr of locals) {
      let diff = this.pos.subtract(curr.pos);
      diff.scale(1 / diff.magnitude() ** 2);
      target = target.add(diff);
    }
    if (locals.length == 0) {
      return target;
    }
    return target.scale(1 / locals.length).subtract(this.vel);
  }

  /** Returns steering force to match average velocity of local flock */
  align(locals: Boid[]): Vec {
    let avgVelocity = new Vec(0, 0);
    for (let curr of locals) {
      avgVelocity = avgVelocity.add(curr.vel);
    }
    if (locals.length == 0) {
      return avgVelocity;
    }
    return avgVelocity.scale(1 / locals.length).subtract(this.vel);
  }

  /** TODO: Returns steering force to avoid border */
  avoidBorder(width: number, height: number): Vec {
    let steering = new Vec(0, 0);
    if (this.pos.x < 0) {
      steering.x = 1;
    }
    if (this.pos.y < 0) {
      steering.y = 1;
    }
    if (this.pos.x > width) {
      steering.x = -1;
    }
    if (this.pos.y > height) {
      steering.y = -1;
    }

    return steering.subtract(this.vel);
  }

  /** Updates position of boid based on pos/vel/acc
   * Wraps around canvas */
  update(width: number, height: number) {
    this.vel = this.vel.add(this.acc);
    this.pos = this.pos.add(this.vel);
    this.pos.x = mod(this.pos.x, width);
    this.pos.y = mod(this.pos.y, height);
  }

  /** Draws boid */
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.RAD, 0, 2 * Math.PI);

    ctx.moveTo(this.pos.x, this.pos.y);
    let target = this.vel
      .normalized()
      .scale(this.RAD * 2)
      .add(this.pos);
    ctx.lineTo(target.x, target.y);

    ctx.stroke();

    ctx.strokeStyle = "red";
    ctx.beginPath();

    ctx.moveTo(this.pos.x, this.pos.y);
    target = this.acc
      .normalized()
      .scale(this.RAD * 1)
      .add(this.pos);
    ctx.lineTo(target.x, target.y);

    ctx.stroke();
    ctx.strokeStyle = "black";
  }
}

export class Flock extends CanvasObject {
  animator: PeriodicDrawer;
  boids: Boid[] = [];
  count: number;

  MAX_FORCE = 0.05;
  MAX_VELOCITY = 5;

  COHERANCE = 0.0005;
  ALIGNMENT = 0.05;
  SEPARATION = 0.01;

  PERCEPTION = 70;
  THRESHOLD = 25;

  BORDER_FORCE = 0.05;

  constructor(board: CanvasBoard, count: number) {
    super(board);
    this.animator = new PeriodicDrawer(this, 120);

    this.count = count;
    this.randomizeBoids();

    this.animator.startRefresh();
  }

  /** Replaces all boids flock with new random boids */
  randomizeBoids() {
    this.boids = [];
    for (let i = 0; i < this.count; i++) {
      this.boids.push(this.getRandomBoid());
    }
  }

  /** Returns new boid with random position and velocity */
  getRandomBoid(): Boid {
    let dir = Math.random() * 2 * Math.PI;
    return new Boid(
      new Vec(
        Math.floor(Math.random() * this.board.width * 0.8),
        Math.floor(Math.random() * this.board.height * 0.8)
      ),
      new Vec(Math.cos(dir), Math.sin(dir)).scale(2)
    );
  }

  /** Gets boids around boid within certain radius */
  getLocalBoids(boid: Boid, rad: number): Boid[] {
    let localBoids: Boid[] = [];
    for (let curr of this.boids) {
      if (boid != curr && boid.pos.distance(curr.pos) < rad) {
        localBoids.push(curr);
      }
    }
    return localBoids;
  }

  /** Applies forces on boid and updates each accordingly */
  update() {
    this.boids.forEach((boid: Boid) => {
      boid.acc = new Vec(0, 0);

      boid.acc = boid.acc.add(
        boid
          .align(this.getLocalBoids(boid, this.PERCEPTION))
          .scale(this.ALIGNMENT)
          .clamp(this.MAX_FORCE)
      );

      boid.acc = boid.acc.add(
        boid
          .cohere(this.getLocalBoids(boid, this.PERCEPTION))
          .scale(this.COHERANCE)
          .clamp(this.MAX_FORCE)
      );

      boid.acc = boid.acc.add(
        boid
          .separate(this.getLocalBoids(boid, this.THRESHOLD))
          .scale(this.SEPARATION)
          .clamp(this.MAX_FORCE)
      );

      // boid.avoidBorder(this.board.width, this.board.height, this.BORDER_FORCE);

      boid.update(this.board.width, this.board.height);
      boid.vel = boid.vel.clamp(this.MAX_VELOCITY);
    });
  }

  /** Draws each boid */
  draw() {
    this.boids.forEach((boid: Boid) => {
      boid.draw(this.ctx);
    });
  }
}
