import SelectionButton from "./SelectionButton";

import React from "react";

export default function ContentArray<T>({
  targetValue,
  onClick,
  paramName,
  values,
}: {
  paramName: string;
  values: T[];
  targetValue: T;
  onClick: (newVal: T) => void;
}) {
  return (
    <div>
      <h2 className="font-bold text-base mr-1.5">{paramName}: </h2>
      <div className="flex mt-2">
        {values.map((value, i) => (
          <SelectionButton
            onClick={() => onClick(value)}
            key={paramName + i}
            blur={value !== targetValue}
            innerHTML={(value as any).toString()}
          />
        ))}
      </div>
    </div>
  );
}
