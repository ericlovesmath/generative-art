import "./style.css";

import { CanvasBoard, PeriodicDrawer } from "./canvas";
import { Circle } from "./objects/circle";

/** Circle CanvasObject that moves towards mouse */
class FollowingCircle extends Circle {
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

const playground = new CanvasBoard(
  document.querySelector("#canvas-board")!,
  320,
  320
);

new FollowingCircle(playground, 20, 20, 10);
