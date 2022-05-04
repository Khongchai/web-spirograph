/**
 * Data for controlling the spread weight of the repeller.
 */
export default interface RepellerData {
  /**
   * A flag for the lerp equation a + (b - a) * t.
   *
   * This is basically a + ((b - a) * beginLerping) * t.
   */
  beginLerping: 1 | 0;
  // The lerped weight value that will be calculated on every frame.
  repellerCurrentSize: number;
  desiredRepellerSize: number;
  lerpWeight: number;
}
