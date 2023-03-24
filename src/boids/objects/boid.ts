import { Vec, mod } from "../../lib/utils";

export class Boid {
  pos: Vec;
  vel: Vec;
  acc: Vec;

  RAD = 5;

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
  borderForce(width: number, height: number): Vec {
    let PAD = this.RAD * 20;
    let steering = new Vec(0, 0);
    if (this.pos.x < PAD) {
      steering.x = 1
      steering.x = ((PAD - this.pos.x) / this.RAD) ** 2;
    }
    if (this.pos.y < PAD) {
      steering.y = 1
      steering.y = ((PAD - this.pos.y) / this.RAD) ** 2;
    }
    if (this.pos.x + PAD > width) {
      steering.x = -1
      steering.x = -1 * ((this.pos.x + PAD - width) / this.RAD) ** 2;
    }
    if (this.pos.y + PAD > height) {
      steering.y = -1
      steering.y = -1 * ((this.pos.y + PAD - height) / this.RAD) ** 2;
    }

    return steering;
  }

  /** Updates position of boid based on pos/vel/acc */
  update(maxVel: number) {
    this.vel = this.vel.add(this.acc).clamp(maxVel);
    this.pos = this.pos.add(this.vel);
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
