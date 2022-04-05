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

export function joyDivision() {

  // Variables
  const step = 10;
  const lines: Point[][] = [];

  // Generate Points so *lines* holds a list of a *line* horizontal points
  for (let y = step; y <= height - step; y += step) {
    let line: Point[] = [];
    for (let x = step; x <= width - step; x += step) {
      let randint = Math.random() * 10;
      line.push({
        x,
        y: y + randint
      });

    }
    lines.push(line);
  }

  // Draws each line for line in lines
  // TODO: WITH FOREACH?
  for (let x = 0; x < lines.length; x++) { 
    ctx.beginPath();
    ctx.moveTo(lines[x][0].x, lines[x][0].y);
    for (let y = 0; y < lines[x].length; y++) {
      ctx.lineTo(lines[x][y].x, lines[x][y].y);
    }
    ctx.stroke();
  }


}
