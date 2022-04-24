export function lerp(value: number, min: number, max: number): number {
  return min + (value - min) * (max - min);
}

export function inverseLerp(value: number, min: number, max: number): number {
  return (value - min) / (max - min);
}

export function remap(
  value: number,
  min1: number,
  max1: number,
  min2: number,
  max2: number
) {
  return min2 + ((value - min1) * (max2 - min2)) / (max1 - min1);
}
