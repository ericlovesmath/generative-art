import "./style.css";
import { CanvasBoard } from "../lib/canvas";
import { Flock } from "./objects/flock";

let coheranceSlider =
  document.querySelector<HTMLInputElement>("#coherance-slider")!;
let coheranceOutput =
  document.querySelector<HTMLOutputElement>("#coherance-output")!;
let alignmentSlider =
  document.querySelector<HTMLInputElement>("#alignment-slider")!;
let alignmentOutput =
  document.querySelector<HTMLOutputElement>("#alignment-output")!;
let separationSlider =
  document.querySelector<HTMLInputElement>("#separation-slider")!;
let separationOutput =
  document.querySelector<HTMLOutputElement>("#separation-output")!;
let restartButton =
  document.querySelector<HTMLButtonElement>("#restart-button")!;

const playground = new CanvasBoard(
  document.querySelector("#canvas-board")!,
  960,
  420
);

let flock = new Flock(playground, 100);

coheranceSlider.addEventListener("input", () => {
  coheranceOutput.textContent = coheranceSlider.value;
  flock.COHERANCE = (0.0005 * coheranceSlider.valueAsNumber) / 50;
});

alignmentSlider.addEventListener("input", () => {
  alignmentOutput.textContent = alignmentSlider.value;
  flock.ALIGNMENT = (0.05 * alignmentSlider.valueAsNumber) / 50;
});

separationSlider.addEventListener("input", () => {
  separationOutput.textContent = separationSlider.value;
  flock.SEPARATION = (0.01 * separationSlider.valueAsNumber) / 50;
});

restartButton.addEventListener("click", () => {
  flock.randomizeBoids();
});
