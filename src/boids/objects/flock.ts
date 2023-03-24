import { Vec, mod } from "../../lib/utils";
import { Boid } from "./boid";
import { CanvasBoard, CanvasObject, PeriodicDrawer } from "../../lib/canvas";

export class Flock extends CanvasObject {
  animator: PeriodicDrawer;
  boids: Boid[] = [];
  count: number;

  MAX_FORCE = 1;
  MAX_VELOCITY = 5;
  COHERANCE = 0.0003;
  ALIGNMENT = 0.05;
  SEPARATION = 0.005;

  PERCEPTION = 70;
  THRESHOLD = 25;

  BORDER = 0.001;
  WRAP = false;

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

      if (!this.WRAP) {
        boid.acc = boid.acc.add(
          boid
            .borderForce(this.board.width, this.board.height)
            .scale(this.BORDER)
        );
      }

      boid.update(this.MAX_VELOCITY);

      if (this.WRAP) {
        boid.pos.x = mod(boid.pos.x, this.board.width);
        boid.pos.y = mod(boid.pos.y, this.board.height);
      }
    });
  }

  /** Draws each boid */
  draw() {
    this.boids.forEach((boid: Boid) => {
      boid.draw(this.ctx);
    });
  }
}
