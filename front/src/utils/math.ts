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

const max = Math.max;
const pow = Math.pow;
const round = Math.round;

/**
 *
 * @Deprecated use rust's fractional_lcm instead.
 */
export function fractionalLcm(numbers: number[]): number {
  let longestFractions = 0;

  for (let i = 0; i < numbers.length; i++) {
    // Number not a fraction
    if (numbers[i] % 1 == 0) continue;

    longestFractions = max(
      longestFractions,
      numbers[i].toString().split(".")[1].length
    );
  }

  const powerOfTen = pow(10, longestFractions);
  const result = powerOfTen / gcd(numbers.map((n) => round(n * powerOfTen)));

  return result;
}

function gcd(numbers: number[]): number {
  let result = numbers[0] ?? 1;

  function _gcd(a: number, b: number) {
    while (b) {
      const tmp = b;
      b = a % b;
      a = tmp;
    }

    return a;
  }

  for (let i = 1; i < numbers.length; i++) {
    result = _gcd(result, numbers[i]);
  }

  return result;
}
