import { Vec, mod } from "../../lib/utils";
import { CanvasBoard, CanvasObject, PeriodicDrawer } from "../../lib/canvas";

class Boid extends CanvasObject {
  pos: Vec;
  vel: Vec;
  acc: Vec;
  RAD = 7;

  MAX_FORCE = 0.05;

  constructor(board: CanvasBoard, pos: Vec, vel: Vec) {
    super(board);
    this.pos = pos;
    this.vel = vel;
    this.acc = new Vec(0, 0);
  }

  /** Flies towards average position of local boids */
  cohere(locals: Boid[], coherance: number) {
    if (locals.length == 0) {
      return;
    }
    let avgPosition = new Vec(0, 0);
    for (let curr of locals) {
      avgPosition = avgPosition.add(curr.pos);
    }
    avgPosition = avgPosition.scale(1 / locals.length);
    let steering = avgPosition.subtract(this.pos).scale(coherance);
    this.acc = this.acc.add(steering.clamp(this.MAX_FORCE));
  }

  /** Steers to avoid crowding local flock */
  separate(locals: Boid[], separation: number) {
    if (locals.length == 0) {
      return;
    }
    let target = new Vec(0, 0);
    for (let curr of locals) {
      let diff = this.pos.subtract(curr.pos);
      diff.scale(1 / diff.magnitude() ** 2);
      target = target.add(diff);
    }
    target = target.scale(1 / locals.length);
    let steering = target.subtract(this.vel).scale(separation);
    this.acc = this.acc.add(steering.clamp(this.MAX_FORCE));
  }

  /** Steers towards average velocity of local flock */
  align(locals: Boid[], alignment: number) {
    if (locals.length == 0) {
      return;
    }
    let avgVelocity = new Vec(0, 0);
    for (let curr of locals) {
      avgVelocity = avgVelocity.add(curr.vel);
    }
    avgVelocity = avgVelocity.scale(1 / locals.length);
    let steering = avgVelocity.subtract(this.vel).scale(alignment);
    this.acc = this.acc.add(steering.clamp(this.MAX_FORCE));
  }

  update() {
    this.vel = this.vel.add(this.acc);
    this.pos = this.pos.add(this.vel);
    this.pos.x = mod(this.pos.x, this.board.width);
    this.pos.y = mod(this.pos.y, this.board.height);
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.pos.x, this.pos.y, this.RAD, 0, 2 * Math.PI);

    this.ctx.moveTo(this.pos.x, this.pos.y);
    let target = this.vel
      .normalized()
      .scale(this.RAD * 2)
      .add(this.pos);
    this.ctx.lineTo(target.x, target.y);

    this.ctx.stroke();

    /* this.ctx.strokeStyle = "red";
    this.ctx.beginPath();

    this.ctx.moveTo(this.pos.x, this.pos.y);
    target = this.acc
      .normalized()
      .scale(this.RAD * 2)
      .add(this.pos);
    this.ctx.lineTo(target.x, target.y);

    this.ctx.stroke();
    this.ctx.strokeStyle = "black"; */
  }
}

export class Flock extends CanvasObject {
  animator: PeriodicDrawer;
  boids: Boid[];
  count: number;
  MAX_VELOCITY = 3;

  COHERANCE = 0.0005;
  ALIGNMENT = 0.05;
  SEPARATION = 0.05;

  PERCEPTION = 70;
  THRESHOLD = 30;

  constructor(board: CanvasBoard, count: number) {
    super(board);
    this.animator = new PeriodicDrawer(this, 120);

    this.count = count;
    this.boids = [];
    for (let i = 0; i < count; i++) {
      this.boids.push(this.getRandomBoid());
    }

    this.animator.startRefresh();
  }

  getRandomBoid(): Boid {
    let dir = Math.random() * 2 * Math.PI;
    return new Boid(
      this.board,
      new Vec(
        Math.floor(Math.random() * this.board.width * 0.8),
        Math.floor(Math.random() * this.board.height * 0.8)
      ),
      new Vec(Math.cos(dir), Math.sin(dir)).scale(2)
    );
  }

  getLocalBoids(boid: Boid, rad: number): Boid[] {
    let localBoids: Boid[] = [];
    for (let curr of this.boids) {
      if (boid != curr && boid.pos.distance(curr.pos) < rad) {
        localBoids.push(curr);
      }
    }
    return localBoids;
  }

  update() {
    this.boids.forEach((boid: Boid) => {
      boid.acc = new Vec(0, 0);
      boid.align(this.getLocalBoids(boid, this.PERCEPTION), this.ALIGNMENT);
      boid.cohere(this.getLocalBoids(boid, this.PERCEPTION), this.COHERANCE);
      boid.separate(this.getLocalBoids(boid, this.THRESHOLD), this.SEPARATION);
      boid.vel = boid.vel.clamp(this.MAX_VELOCITY);
      boid.update();
    });
  }

  draw() {
    this.boids.forEach((boid: Boid) => {
      boid.draw();
    });
  }
}
