import React, { useEffect, useRef, useState } from "react";
import useDragValue from "./utils/useDragValue";

interface DraggableValueProps {
  value: number;
  onDrag: (newValue: number) => void;
}

/*
  A controller that controls a number value.

  The provided value will be used as the starting value and when draggin,
  the value will be updated by 0.1 and passed to the onDrag callback.
*/
const DraggableValue: React.FC<DraggableValueProps> = ({ value, onDrag }) => {
  const [dragValue, setDragValue] = useDragValue(value);
  //For using outside of React
  const pointerDownPos = useRef(0);

  const manageDrag = (e: PointerEvent) => {
    _manageDrag(e, pointerDownPos, dragValue, (newValue: number) => {
      setDragValue(newValue);
      onDrag(newValue);
    });
  };
  const cancelDrag = () =>
    window.removeEventListener("pointermove", manageDrag);

  return (
    <div
      style={{ cursor: "ew-resize" }}
      onPointerDown={(e) => {
        pointerDownPos.current = e.clientX;
        window.addEventListener("pointermove", manageDrag);
        document.body.style.cursor = "ew-resize";
        document.body.style.userSelect = "none";
        const pointerRef = function () {
          cancelDrag();
          document.body.style.cursor = "auto";
          document.body.style.userSelect = "unset";
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
  setDragValueCallback: (newValue: number) => void
) {
  const difference = (e.clientX - pointerDownPos.current) * 0.1;
  const newValue = valueOnMouseDown + difference;
  const newValueRounded = Math.round(newValue * 10) / 10;
  setDragValueCallback(newValueRounded);
}
