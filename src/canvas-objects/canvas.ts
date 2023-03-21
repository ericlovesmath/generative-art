import { Vec } from "./utils";

/** Class intended to simplify access to the Canvas API
 * Create CanvasBoard for each canvas element
 * Holds CanvasObjects to draw on screen
 * Mouse utility to track mouse position */
class CanvasBoard {
  objects: CanvasObject[] = [];
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  mouse: Vec;

  constructor(canvas: HTMLCanvasElement, width: number, height: number) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d")!;

    let dpr = window.devicePixelRatio;
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.scale(dpr, dpr);

    this.mouse = new Vec(0, 0);
    this.canvas.addEventListener("mouseenter", (e: MouseEvent) => {
      this.mouse.x = e.offsetX;
      this.mouse.y = e.offsetY;
    });
    this.canvas.addEventListener("mousemove", (e) => {
      this.mouse.x = e.offsetX;
      this.mouse.y = e.offsetY;
    });
  }

  addObject(object: CanvasObject) {
    this.objects.push(object);
  }

  /** Runs *update()* for each CanvasObject */
  update() {
    this.objects.forEach((child) => {
      child.update();
    });
  }

  /** Redraws each CanvasObject */
  draw() {
    this.clear();
    this.objects.forEach((child) => {
      child.draw();
    });
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

/** Abstract Class to represent object in CanvasBoard */
abstract class CanvasObject {
  board: CanvasBoard;
  ctx: CanvasRenderingContext2D;

  constructor(canvasBoard: CanvasBoard) {
    this.board = canvasBoard;
    this.ctx = canvasBoard.canvas.getContext("2d")!;
    canvasBoard.addObject(this);
  }

  abstract draw(): void;
  abstract update(): void;
}

/** Updates CanvasObject and redraws board periodically
 * given refresh rate */
class PeriodicDrawer {
  object: CanvasObject;
  fps: number;
  isRefreshing: boolean;

  refresh = () => {
    if (!this.isRefreshing) return;
    setTimeout(() => {
      requestAnimationFrame(this.refresh);
      this.object.update();
      this.object.board.clear();
      this.object.board.draw();
    }, 1000 / this.fps);
  };

  constructor(object: CanvasObject, fps: number, isRefreshing: boolean) {
    this.object = object;
    this.fps = fps;
    this.isRefreshing = isRefreshing;
  }

  startRefresh() {
    this.isRefreshing = true;
    this.refresh();
  }

  stopRefresh() {
    this.isRefreshing = false;
  }
}

export { CanvasBoard, CanvasObject, PeriodicDrawer };
