import { Vector2 } from "../../../classes/DTOInterfaces/vector2";
import { Vector3 } from "../../../classes/DTOInterfaces/vector3";

export default class Particle implements Vector3 {
  initialX: number;
  initialY: number;
  initialZ: number;
  vx: number;
  vz: number;
  vy: number;
  radius: number;
  x: number;
  y: number;
  z: number;
  color: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
  shadowColor: {
    r: number;
    g: number;
    b: number;
    a: number;
  };

  constructor({
    x,
    y,
    z,
    initialX,
    initialY,
    initialZ,
    radius,
    color,
    shadowColor,
  }: {
    x: number;
    y: number;
    z: number;
    initialX: number;
    initialY: number;
    initialZ: number;
    radius: number;
    color: {
      r: number;
      g: number;
      b: number;
      a: number;
    };
    shadowColor: {
      r: number;
      g: number;
      b: number;
      a: number;
    };
  }) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.initialX = initialX;
    this.initialY = initialY;
    this.initialZ = initialZ;
    this.radius = radius;
    this.color = color;
    this.shadowColor = shadowColor;
    this.vx = 0;
    this.vy = 0;
    this.vz = 0;
  }

  update() {
    this.x += this.vx ?? 0;
    this.y += this.vy ?? 0;
    this.z += this.vz ?? 0;
  }

  getInitialPos() {
    return {
      x: this.initialX,
      y: this.initialY,
      z: this.initialZ,
    };
  }

  /**
   * Returns the projected 2d coordinate of this particle on the screen.
   *
   * This works only for 2.5d particles.
   */
  getProjected2dCoordinate({ perspective }: { perspective: number }): Vector2 {
    return {
      x: this.x * perspective,
      y: this.y * perspective,
    };
  }
}
