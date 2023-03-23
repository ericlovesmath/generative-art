import "./style.css";
import { CanvasBoard } from "../lib/canvas";
import { Flock } from "./objects/flock";

const playground = new CanvasBoard(
  document.querySelector("#canvas-board")!,
  960,
  500
);

new Flock(playground, 100);
