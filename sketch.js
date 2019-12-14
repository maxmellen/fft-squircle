"use strict";

let d = 0;
let mic;
let fft;
let spectrum;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  rectMode(CENTER);
  colorMode(HSB);
  noFill();

  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
}

function draw() {
  const S = min(width, height);
  strokeWeight(S / 360);
  background(0);
  spectrum = fft.analyze();
  translate(width / 2, height / 2);
  for (let a = 0; a < 360 * 6; a++) {
    const f = spectrum[round(a * 1024 / 360) % 360] / 255;
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
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
}
