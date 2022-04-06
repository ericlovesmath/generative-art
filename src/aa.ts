const canvas = document.querySelector<HTMLCanvasElement>("#aa")!;
const ctx = canvas.getContext("2d")!;

const width = 320;
const height = 320;
canvas.width = width;
canvas.height = height;

/** Creates diagonal lines in a grid pattern, facing a random direction */
export function aa() {

  const size = 20;
  ctx.lineWidth = 1;

  /** Draws line to center in a random direction */
  function drawRandomCenterLine() {
    ctx.moveTo(width / 2, height / 2);
    let x = Math.random() * width * 0.9;
    let y = Math.random() * height * 0.9;
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  for (let i = 0; i < size; i++) {
    drawRandomCenterLine();
  }
}
