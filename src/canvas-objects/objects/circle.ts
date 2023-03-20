import { Point } from "../utils";
import { CanvasBoard, CanvasObject } from "../canvas";

/** CanvasObject representing a 2D circle */
export abstract class Circle extends CanvasObject {

  center: Point;
  rad: number;

  constructor(board: CanvasBoard, x: number, y: number, rad: number) {
    super(board);
    this.center = new Point(x, y);
    this.rad = rad;
  }

  abstract update(): void;

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.center.x, this.center.y, this.rad, 0, 2 * Math.PI);
    this.ctx.stroke();
  }
}
