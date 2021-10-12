// Based on the work of Daniel Shiffman, http://codingtra.in, https://youtu.be/CKeyIbT3vXI
import p5 = require('p5');
import { p } from './index';

export class Firework {
  public static gravity: p5.Vector;
  private static gravityAmount = 0.005;

  private color: number;
  private position: p5.Vector;
  private velocity: p5.Vector;
  private acceleration: p5.Vector;
  private particles: Particle[] = [];
  private exploded: boolean = false;
  private spread: number;

  constructor(color?: number, x?: number, height?: number, spread?: number) {
    this.color = color ?? p.random(255);

    x = x ?? p.random(20, p.width - 20);
    this.position = p.createVector(x, p.height);

    this.spread = spread ?? p.random(10, 30);

    height = height ?? p.random(50, 100);
    let velocity = (((-1 * Math.sqrt(p.height)) / 2) * height) / 100;
    this.velocity = p.createVector(0, velocity);
    this.acceleration = p.createVector(0, 0);

    if (!Firework.gravity) {
      Firework.gravity = p.createVector(0, Firework.gravityAmount);
    }
  }

  draw() {
    this.applyForce();

    p.colorMode(p.HSB);

    if (!this.exploded) {
      p.stroke(this.color, 100, 100);
      p.strokeWeight(4);
      p.point(this.position.x, this.position.y);
    } else {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        this.particles[i].draw();
        if (this.particles[i].isDone) {
          this.particles.splice(i, 1);
        }
      }
    }
  }

  explode() {
    for (let i = 0; i < 300; i++) {
      const particle = new Particle(
        p,
        this.position.x,
        this.position.y,
        this.color + p.random(-10, 10),
        this.spread
      );
      this.particles.push(particle);
    }
    this.exploded = true;
  }

  applyForce() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.acceleration.add(Firework.gravity);
    if (!this.exploded && this.velocity.y > 0 && !this.particles.length) {
      this.explode();
    }
  }

  get isDone() {
    return this.exploded && this.particles.length == 0;
  }
}

class Particle {
  private velocity: p5.Vector;
  private position: p5.Vector;
  private lifespan: number;
  private lifespanDiff: number;
  private acceleration: p5.Vector;

  constructor(
    private p: p5,
    x: number,
    y: number,
    private color: number,
    spread: number = 30
  ) {
    this.velocity = p5.Vector.random2D();

    this.velocity.mult(p.random(0, spread));
    this.position = p.createVector(x, y);
    this.lifespan = 150;
    this.lifespanDiff = p.random(1.5, 8);
    this.acceleration = p.createVector(0, 0);
  }

  draw() {
    this.applyForce();

    p.colorMode(p.HSB);

    p.stroke(this.color, 100, this.lifespan);
    p.strokeWeight(2.5);
    p.point(this.position.x, this.position.y);
  }

  applyForce() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.acceleration.add(Firework.gravity);
    this.velocity.mult(0.9);
    this.lifespan -= this.lifespanDiff;
  }

  get isDone() {
    return this.lifespan <= 0;
  }
}

export function delay(millis: number): Promise<void> {
  return new Promise<void>((res) => setTimeout(res, millis));
}
