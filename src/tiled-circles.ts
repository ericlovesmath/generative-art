const canvas = document.querySelector<HTMLCanvasElement>("#tiled-circles")!;
const ctx = canvas.getContext("2d")!;

const width = 320;
canvas.width = width;
canvas.height = width;

/** Creates curved lines in a grid pattern, facing a random direction */
export function tiledCircles() {

  // Variables
  const step = 32;
  ctx.lineCap = 'square';
  ctx.lineWidth = 2;

  /** Draws curved sets of lines in a random direction */
  function curvedLines(x: number, y: number, width: number) {
    ctx.beginPath();
    if (Math.random() > 0.5) {
      ctx.arc(x + width, y, width / 2, Math.PI, Math.PI / 2, true);
      ctx.moveTo(x + width / 2, y + width);
      ctx.arc(x, y + width, width / 2, 0, 3 * Math.PI / 2, true);
    } else {
      ctx.arc(x, y, width / 2, 0, Math.PI / 2, false);
      ctx.moveTo(x + width / 2, y + width);
      ctx.arc(x + width, y + width, width / 2, Math.PI, 3 * Math.PI / 2, false);
    }
    ctx.stroke();
  }

  for (let x = 0; x < width; x += step) {
    for (let y = 0; y < width; y += step) {
      curvedLines(x, y, step);
    }
  }
}
