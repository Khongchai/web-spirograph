/**
 * Data for controlling the spread weight of the repeller.
 */
export default interface RepellerData {
  // The weight value 0 or 1
  weight: 1 | 0;
  // The lerped weight value that will be calculated on every frame.
  lerpedWeight: number;
  desiredRepellerSize: number;
}
