import "./style.css";
import { CanvasBoard } from "../lib/canvas";
import { Flock } from "./objects/flock";

let coheranceSlider = document.querySelector<HTMLInputElement>("#cohere")!;
let coheranceOutput = document.querySelector<HTMLOutputElement>("#cohere-out")!;
let alignmentSlider = document.querySelector<HTMLInputElement>("#align")!;
let alignmentOutput = document.querySelector<HTMLOutputElement>("#align-out")!;
let separationSlider = document.querySelector<HTMLInputElement>("#sep")!;
let separationOutput = document.querySelector<HTMLOutputElement>("#sep-out")!;
let restartButton = document.querySelector<HTMLButtonElement>("#restart")!;
let wrapButton = document.querySelector<HTMLButtonElement>("#wrap-button")!;

const playground = new CanvasBoard( document.querySelector("#canvas-board")!,
  450,
  450
);

let flock = new Flock(playground, 50);

coheranceSlider.addEventListener("input", () => {
  coheranceOutput.textContent = coheranceSlider.value;
  flock.COHERANCE = (0.0003 * coheranceSlider.valueAsNumber) / 50;
});

alignmentSlider.addEventListener("input", () => {
  alignmentOutput.textContent = alignmentSlider.value;
  flock.ALIGNMENT = (0.05 * alignmentSlider.valueAsNumber) / 50;
});

separationSlider.addEventListener("input", () => {
  separationOutput.textContent = separationSlider.value;
  flock.SEPARATION = (0.0025 * separationSlider.valueAsNumber) / 50;
});

restartButton.addEventListener("click", () => {
  flock.randomizeBoids();
});

wrapButton.addEventListener("click", () => {
  flock.WRAP = !flock.WRAP;
});
