const canvas = document.querySelector<HTMLCanvasElement>("#tiled-lines")!;
const ctx = canvas.getContext("2d")!;

const width = 320;
const height = 320;
const step = 32;

ctx.lineCap = 'square';
ctx.lineWidth = 2;

canvas.width = width;
canvas.height = height;

export function tiledLines() {

  /** Draws diagonal line in a random direction */
  function diagLine(x: number, y: number, width: number, height: number) {
    if (Math.random() > 0.5) {
      ctx.moveTo(x, y);
      ctx.lineTo(x + width, y + height);
    } else {
      ctx.moveTo(x + width, y);
      ctx.lineTo(x, y + height);

    }
    ctx.stroke();
  }

  for (let x = 0; x < width; x += step) {
    for (let y = 0; y < height; y += step) {
      diagLine(x, y, step, step);
    }
  }
}
