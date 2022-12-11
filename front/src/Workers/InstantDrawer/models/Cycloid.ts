export default interface InstantDrawCycloid {
  isOutsideOfParent: boolean;
  radius: number;
  /**
   * The arc direction around the parent cycloid
   */
  isClockwise: boolean;
  /**
   * The rotation ratio between this cycloid and its parent.
   *
   * To move without sliding, the ratio should be r1 * theta / r2
   * 
   * The base bounding circle does not have a beta scale.
   */
  thetaScale: number;

  rodLength: number;
}
