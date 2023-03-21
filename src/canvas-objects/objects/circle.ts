import { Vec } from "../utils";
import { CanvasBoard, CanvasObject, PeriodicDrawer } from "../canvas";

/** CanvasObject representing a 2D circle */
abstract class Circle extends CanvasObject {
  center: Vec;
  rad: number;

  constructor(board: CanvasBoard, x: number, y: number, rad: number) {
    super(board);
    this.center = new Vec(x, y);
    this.rad = rad;
  }

  abstract update(): void;

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.center.x, this.center.y, this.rad, 0, 2 * Math.PI);
    this.ctx.stroke();
  }
}

/** Circle CanvasObject that moves towards mouse */
export class FollowingCircle extends Circle {
  animator: PeriodicDrawer;

  constructor(board: CanvasBoard, x: number, y: number, rad: number) {
    super(board, x, y, rad);
    this.animator = new PeriodicDrawer(this, 120, false);

    this.board.canvas.addEventListener("mouseenter", () => {
      this.animator.startRefresh();
    });
    this.board.canvas.addEventListener("mouseleave", () => {
      this.animator.stopRefresh();
    });
  }

  /** Moves towards mouse, exponential interpolation */
  update() {
    let speed = 5;
    let dist = this.center.distance(this.board.mouse);

    if (dist < speed) {
      this.center = this.board.mouse.copy();
    } else {
      this.center.x += (speed * (this.board.mouse.x - this.center.x)) / dist;
      this.center.y += (speed * (this.board.mouse.y - this.center.y)) / dist;
    }
  }
}
