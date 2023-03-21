import "./style.css";
import { CanvasBoard } from "./canvas";
import { FollowingCircle } from "./objects/circle";
import { DraggableSquare } from "./objects/draggable";

const playground = new CanvasBoard(
  document.querySelector("#canvas-board")!,
  320,
  320
);

new FollowingCircle(playground, 20, 20, 10);
new DraggableSquare(playground, 100, 100, 50);
