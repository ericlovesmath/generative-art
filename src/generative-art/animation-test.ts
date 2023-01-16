const canvas = document.querySelector<HTMLCanvasElement>("#animation-test")!;
const ctx = canvas.getContext("2d")!;

const width = 320
const height = 320
canvas.width = width;
canvas.height = height;
// ctx.scale(scale, scale);

/** Testing with Basic Animations */
export function animationTest() {
  const scale = 0.9;
  const fps = 5;
  ctx.lineWidth = 1;

  ctx.moveTo(width / 2, height / 2);
  requestAnimationFrame(loop);

  /** Draws line in a random direction */
  function draw() {
    let x = Math.random() * width * scale + (width * (1 - scale)) / 2;
    let y = Math.random() * height * scale + (width * (1 - scale)) / 2;
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
