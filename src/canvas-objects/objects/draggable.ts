import { Vec } from "../utils";
import { CanvasBoard, CanvasObject, PeriodicDrawer } from "../canvas";

/** CanvasObject representing a 2D circle */
abstract class Square extends CanvasObject {
  center: Vec;
  width: number;

  constructor(board: CanvasBoard, x: number, y: number, width: number) {
    super(board);
    this.center = new Vec(x, y);
    this.width = width;
  }

  abstract update(): void;

  draw() {
    this.ctx.beginPath();
    this.ctx.rect(
      this.center.x - this.width / 2,
      this.center.y - this.width / 2,
      this.width,
      this.width
    );
    this.ctx.stroke();
  }

  getBounds(): [number, number, number, number] {
    return [
      this.center.x - this.width / 2,
      this.center.y - this.width / 2,
      this.center.x + this.width / 2,
      this.center.y + this.width / 2,
    ];
  }

  mouseInBounds(): boolean {
    let bounds = this.getBounds();
    return (
      bounds[0] < this.board.mouse.x &&
      bounds[2] > this.board.mouse.x &&
      bounds[1] < this.board.mouse.y &&
      bounds[3] > this.board.mouse.y
    );
  }
}

/** Circle CanvasObject that moves towards mouse */
export class DraggableSquare extends Square {
  animator: PeriodicDrawer;
  isDragging = false;
  dragOffset = new Vec(0, 0);

  constructor(board: CanvasBoard, x: number, y: number, rad: number) {
    super(board, x, y, rad);
    this.animator = new PeriodicDrawer(this, 120, false);

    this.board.canvas.addEventListener("mouseleave", () => {
      this.isDragging = false;
      this.animator.stopRefresh();
    });

    this.board.canvas.addEventListener("mouseup", () => {
      this.isDragging = false;
      this.animator.stopRefresh();
    });

    this.board.canvas.addEventListener("mousedown", () => {
      if (this.mouseInBounds()) {
        this.isDragging = true;
        this.dragOffset = this.board.mouse.subtract(this.center);
        this.animator.startRefresh();
      }
    });

    this.board.draw();
  }

  update() {
    if (this.isDragging) {
      this.center = this.board.mouse.add(this.dragOffset);
    }
  }
}
