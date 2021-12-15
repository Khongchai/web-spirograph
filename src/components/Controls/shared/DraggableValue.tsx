import React, { useRef, useState } from "react";

interface DraggableValueProps {
  value: number;
  onDrag: (newValue: number) => void;
}

// String value because it can be boolean as well
const DraggableValue: React.FC<DraggableValueProps> = ({ value, onDrag }) => {
  const [dragValue, setDragValue] = useState(value);
  const [pointerDownPos, setPointerDownPos] = useState(0);

  const _manageDrag = (e: PointerEvent) => manageDrag(e, pointerDownPos);
  const _cancelDrag = () =>
    window.removeEventListener("pointermove", _manageDrag);

  return (
    <div
      style={{ cursor: "ew-resize" }}
      onPointerDown={(e) => {
        setPointerDownPos(e.clientX);
        window.addEventListener("pointermove", _manageDrag);
        document.body.style.cursor = "ew-resize";
        document.body.style.userSelect = "none";
        const pointerRef = function () {
          _cancelDrag();
          document.body.style.cursor = "auto";
          document.body.style.userSelect = "unset";
          window.removeEventListener("pointerup", pointerRef);
        };
        window.addEventListener("pointerup", pointerRef);
      }}
    >
      <h3 className="text-white pointer-events-none select-none">{value}</h3>
    </div>
  );
};

export default DraggableValue;

function manageDrag(e: PointerEvent, pointerDownPos: number) {
  const dragValue = e.clientX - pointerDownPos;
  console.log(dragValue);
}
