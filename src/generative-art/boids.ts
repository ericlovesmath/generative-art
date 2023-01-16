function initCanvas(
  name: string,
  width: number,
  height: number
): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.querySelector<HTMLCanvasElement>("#" + name)!;
  const ctx = canvas.getContext("2d")!;
  const RATIO = window.devicePixelRatio;
  canvas.width = width * RATIO;
  canvas.height = height * RATIO;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.scale(RATIO, RATIO);
  return [canvas, ctx];
}

const WIDTH = 640;
const HEIGHT = 320;
const [canvas, ctx] = initCanvas("boids", WIDTH, HEIGHT);

// ctx.scale(scale, scale);

/** Testing with Boids */
export function boids() {
  const scale = 0.9;
  const fps = 5;
  ctx.lineWidth = 1;

  ctx.moveTo(WIDTH / 2, HEIGHT / 2);
  requestAnimationFrame(loop);

  /** Draws line in a random direction */
  function draw() {
    let x = Math.random() * WIDTH * scale + (WIDTH * (1 - scale)) / 2;
    let y = Math.random() * HEIGHT * scale + (WIDTH * (1 - scale)) / 2;
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  // Below is all animation helpers
  let animation = true;
  let lastTime = performance.now();

  canvas.addEventListener("click", () => {
    animation = !animation;
    if (animation) requestAnimationFrame(loop);
  });

  /** Animation Loop **/
  function loop(now: DOMHighResTimeStamp) {
    if (!animation) return;
    requestAnimationFrame(loop);

    if (!lastTime) lastTime = now;
    if (now - lastTime > 1000 / fps) {
      draw();
      lastTime = now;
    }
  }
}
