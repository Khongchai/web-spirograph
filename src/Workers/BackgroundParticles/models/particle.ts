import { Vector3 } from "../../../classes/vector3";

export default interface Particle extends Vector3 {
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
}
