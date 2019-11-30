"use strict";

let root2;

let d = 0;
let sound;
let fft;
let spectrum;

function preload() {
  sound = loadSound("./track.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  fft = new p5.FFT();
  colorMode(HSB);
  angleMode(DEGREES);
  rectMode(CENTER);
  noFill();
  root2 = sqrt(2);
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
    const s = S / root2 * pow(f, 3);
    const h = a;
    const o = 1 - pow(f, 1 / 3);

    push();
    {
      translate(x, y);
      rotate(a + d);
      stroke((360 + h - d) % 360, 100, 100, o);
      square(0, 0, s);
    }
    pop();
  }
  d = d < 360 ? d + 1 : 0;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  console.log(spectrum);
  togglePlay();
}

function togglePlay() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
}
