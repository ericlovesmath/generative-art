const canvas = document.querySelector<HTMLCanvasElement>("#joy-division")!;
const ctx = canvas.getContext("2d")!;

const width = 320;
const height = 320;
canvas.width = width;
canvas.height = height;
type Point = {
  x: number;
  y: number;
}

/** Offsets each point in row randomly, with larger scalars when closer to the middle */
export function joyDivision() {

  // Variables
  const step = 10;
  const lines: Point[][] = [];
  ctx.lineWidth = 2;

  // Generate Points so *lines* holds a list of a *line* horizontal points
  for (let y = step; y <= height - step; y += step) {
    let line: Point[] = [];
    for (let x = step; x <= width - step; x += step) {

      let distanceToCenter = Math.abs(x - width / 2);
      let variance = Math.max(width / 2 - 50 - distanceToCenter, 0);
      let randint = Math.random() * variance / 2 * -1;

      line.push({
        x,
        y: y + randint
      });

    }
    lines.push(line);
  }

  // Draws each line for line in lines
  // TODO: WITH FOREACH?
  for (let x = 5; x < lines.length; x++) {
    ctx.beginPath();
    ctx.moveTo(lines[x][0].x, lines[x][0].y);

    for (let y = 0; y < lines[x].length - 1; y++) {
      let xc = (lines[x][y].x + lines[x][y + 1].x) / 2;
      let yc = (lines[x][y].y + lines[x][y + 1].y) / 2;
      ctx.quadraticCurveTo(lines[x][y].x, lines[x][y].y, xc, yc);
    }

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fill();
    ctx.restore();
    ctx.stroke();
  }

}
