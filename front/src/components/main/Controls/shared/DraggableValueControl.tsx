import React, { useRef } from "react";
import useStateEffect from "../utils/useStateEffect";

interface DraggableValueProps {
  value: number;
  step?: number;
  onDrag: (newValue: number) => void;
  constraints?: { min: number; max: number };
}

/*
  A controller that controls a number value.

  The provided value will be used as the starting value and when draggin,
  the value will be updated by 0.1 and passed to the onDrag callback.
*/
const DraggableValue: React.FC<DraggableValueProps> = ({
  value,
  onDrag,
  step,
  constraints,
}) => {
  const [dragValue, setDragValue] = useStateEffect(value);
  //For using outside of React
  const pointerDownPos = useRef(0);

  const manageDrag = (e: PointerEvent) => {
    _manageDrag(
      e,
      pointerDownPos,
      dragValue,
      (newValue: number) => {
        setDragValue(newValue);
        onDrag(newValue);
      },
      constraints,
      step
    );
  };

  return (
    <div
      style={{ cursor: "ew-resize" }}
      onPointerDown={(e) => {
        pointerDownPos.current = e.clientX;
        window.addEventListener("pointermove", manageDrag);
        document.body.style.cursor = "ew-resize";
        document.body.style.userSelect = "none";
        const pointerRef = function () {
          document.body.style.cursor = "auto";
          document.body.style.userSelect = "unset";
          window.removeEventListener("pointermove", manageDrag);
          window.removeEventListener("pointerup", pointerRef);
        };
        window.addEventListener("pointerup", pointerRef);
      }}
    >
      <h3 className="text-white pointer-events-none select-none">
        {dragValue}
      </h3>
    </div>
  );
};

export default DraggableValue;

function _manageDrag(
  e: PointerEvent,
  pointerDownPos: React.MutableRefObject<number>,
  valueOnMouseDown: number,
  setDragValueCallback: (newValue: number) => void,
  constraints?: { min: number; max: number },
  steps?: number
) {
  const maxDecimal = 0.0001;
  const maxDecimalPlaces = 1000;

  const difference = e.clientX - pointerDownPos.current;
  const differenceStepped = difference * (steps ?? 1);
  const newValue =
    valueOnMouseDown + roundNearest(differenceStepped, maxDecimal);
  const newValueRounded =
    Math.round(newValue * maxDecimalPlaces) / maxDecimalPlaces;
  if (constraints) {
    setDragValueCallback(
      Math.max(constraints.min, Math.min(constraints.max, newValueRounded))
    );
  } else {
    setDragValueCallback(newValueRounded);
  }
}

function roundNearest(num: number, nearest: number) {
  return Math.round(num / nearest) * nearest;
}
