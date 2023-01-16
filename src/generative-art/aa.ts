const canvas = document.querySelector<HTMLCanvasElement>("#aa")!;
const ctx = canvas.getContext("2d")!;

const width = 320;
const height = 320;
canvas.width = width;
canvas.height = height;

/** Creates diagonal lines in a grid pattern, facing a random direction */
export function aa() {

  const count = 20;         // Number of lines
  const circle_scale = 15;  // Rate of circle radius change
  const scale = 0.9;        // Amount of square where points are chosen from
  ctx.lineWidth = 1;

  /** Draws line to center in a random direction */
  function drawRandomCenterLine() {

    // Line
    ctx.moveTo(width / 2, height / 2);
    let x = Math.random() * width * scale + width * (1 - scale) / 2;
    let y = Math.random() * height * scale + width * (1 - scale) / 2;
    ctx.lineTo(x, y);

    // Circle at end of line
    ctx.moveTo(x, y);
    let rad = Math.floor(distToCenter(x, y) / circle_scale);
    ctx.arc(x, y, rad, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

  }

  /** Returns floor of distance to center of canvas given x and y */
  function distToCenter(x: number, y: number) {
    let distX = Math.abs(x - (width / 2));
    let distY = Math.abs(y - (height / 2));
    return Math.floor(Math.sqrt(distX * distX + distY * distY));
  }

  for (let i = 0; i < count; i++) {
    drawRandomCenterLine();
  }
}
