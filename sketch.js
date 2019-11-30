"use strict";

let d = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360);
  angleMode(DEGREES);
  rectMode(CENTER);
  noFill();
}

function draw() {
  const S = min(width, height);
  background(0);
  translate(width / 2, height / 2);
  for (let a = 0; a < 360 * 4; a++) {
    const x = cos(a) * S / 4;
    const y = sin(a) * S / 4;
    const s = S / 5;
    const h = a;

    push();
    {
      translate(x, y);
      rotate(a + d);
      stroke((360 + h - d) % 360, 360, 360, 30);
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
  noLoop();
}
