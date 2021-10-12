import './style.css';
import p5 = require('p5');
import { Firework, delay } from './firework';

const fireworks: Firework[] = [];

export let p: p5;
new p5((p5: p5) => {
  p = p5;
  p.setup = setup;
  p.draw = draw;
});

async function setup() {
  p.createCanvas(p.windowWidth, p.windowHeight);
  Firework.gravity = p.createVector(0, 0.005);

  // Zum Ausprobieren schießen wir am Beginn
  // eine einzelne Rakete ab. Das werden wir in unseren
  // Übungen ändern, damit das Feuerwerk spannender wird.
  //
  // Größe der Explosion -------------------------------+
  // Höhe (0 bis 100) ------------------------------+   |
  // X-Position (horizontal) ----------+            |   |
  // Farbe -------------------+        |            |   |
  //                          V        V            V   V
  fireworks.push(new Firework(60, (p.width * 2) / 4, 75, 25));
}

function draw() {
  p.colorMode(p.RGB);
  p.background(0, 0, 0, 25);

  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].draw();

    if (fireworks[i].isDone) {
      fireworks.splice(i, 1);
    }
  }
}
