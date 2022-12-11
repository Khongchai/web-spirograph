//@ts-ignore
import { writeFileStrSync } from "https://deno.land/std@0.52.0/fs/mod.ts";

type FixedSizeDataArray = [number, number, number, number];

interface ComputedEpitrochoidArgs {
  data: FixedSizeDataArray[];
  theta: number;
  rodLength: number;
}

// For generating random test cases for rust.
function computedEpitrochoid(args: ComputedEpitrochoidArgs) {
  const { data, rodLength, theta } = args;
  if (data.length < 2) {
    throw new Error("Provide at least 2 cycloids");
  }

  const finalPoint = { x: 0, y: 0 };

  for (let i = 0; i < data.length; i++) {
    const currentData = data[i];

    finalPoint.x +=
      (currentData[0] + currentData[1]) *
      Math.cos(theta * currentData[3] - Math.PI * 0.5 * currentData[2]);
    finalPoint.y +=
      (currentData[0] + currentData[1]) *
      Math.sin(theta * currentData[3] + Math.PI * 0.5 * currentData[2]);
  }

  return {
    x: finalPoint.x + rodLength * Math.cos(theta),
    y: finalPoint.y + rodLength * Math.sin(theta),
  };
}

interface Output {
  result: { x: number; y: number };
  args: ComputedEpitrochoidArgs;
}

const outputs: Output[] = [];

for (let i = 0; i < 10; i++) {
  const args: ComputedEpitrochoidArgs = {
    data: Array(Math.round(Math.random() * 10) + 2)
      .fill(0)
      .map(
        (_) =>
          Array(4)
            .fill(0)
            .map((_) => Math.round(Math.random() * 10)) as FixedSizeDataArray
      ),
    rodLength: parseFloat((Math.random() * 10).toFixed(2)),
    theta: parseFloat((Math.random() * 5).toFixed(3)),
  };

  const result = computedEpitrochoid(args);

  outputs.push({
    args,
    result,
  } as Output);
}

console.log(outputs);

writeFileStrSync("../calc_lines/test_data.json", JSON.stringify(outputs));
