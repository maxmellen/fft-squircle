"use strict";

let d = 0;
let sound;
let fft;
let spectrum;

function setup() {
  const c = createCanvas(windowWidth, windowHeight);

  angleMode(DEGREES);
  rectMode(CENTER);
  colorMode(HSB);
  noFill();

  fft = new p5.FFT();
  c.drop(handleDrop);
}

function draw() {
  const S = min(width, height);
  background(0);
  spectrum = fft.analyze();
  translate(width / 2, height / 2);
  for (let a = 0, A = 360 * 3; a < A; a++) {
    const f = spectrum[round(a * 1024 / A) % 40] / 255;
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
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  if (getAudioContext().state !== "running") {
    getAudioContext().resume();
  }
}

function handleDrop(e) {
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
