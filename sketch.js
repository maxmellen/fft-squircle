"use strict";

let d = 0;
let input;
let sound;
let bins = 512;
let fft;
let spectrum;
let debug = false;

function setup() {
  const c = createCanvas(windowWidth, windowHeight, WEBGL);

  angleMode(DEGREES);
  rectMode(CENTER);
  colorMode(HSB);
  noFill();

  input = createFileInput(handleFile);
  input.position(0, windowHeight);
  fft = new p5.FFT(0.8, bins);
  c.drop(handleFile);
}

function draw() {
  const S = min(width, height);
  background(0);
  spectrum = fft.analyze();
  for (let a = 0, A = 360 * 3; a < A; a++) {
    const f = spectrum[round(a * bins / A) % 40 + 32] / 255;
    const x = cos(a) * S / 4;
    const y = sin(a) * S / 4;
    const s = S / sqrt(2) * pow(f, 3);
    const o = 1 - pow(f, 1 / 2);

    push();
    translate(x, y);
    rotate(a + d);
    stroke((a + 360 - d) % 360, 100, 100, o);
    square(0, 0, s);
    pop();
  }
  d = d + 1 < 360 ? d + 1 : 0;

  if (debug) {
    translate(-width / 2, height / 2);
    stroke(120, 100, 100, 1);
    for (let x = 0; x < width; x++) {
      const y = -spectrum[round(x / width * bins)] / 255 * height;
      point(x, y);
    }
    stroke(60, 100, 100, 1);
    const x1 = 32 / bins * width;
    const x2 = 72 / bins * width;
    line(x1, 0, x1, -height);
    line(x2, 0, x2, -height);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  input && input.remove();
  input = createFileInput(handleFile);
  input.position(0, windowHeight);
}

function mousePressed() {
  if (getAudioContext().state !== "running") {
    getAudioContext().resume();
  }
}

function handleFile(e) {
  if (!e.file) return;
  if (!e.type) return;
  if (e.type !== "audio") return;

  loadSound(e.file, loaded => {
    if (sound && sound.isPlaying()) sound.stop();
    sound = loaded;
    sound.play();
  }, err => {
    console.warn("Error loading sound file:", err);
  });
}

function keyPressed() {
  if (key === "d") {
    debug = !debug;
  }
}
