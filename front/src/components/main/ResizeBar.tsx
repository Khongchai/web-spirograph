import { ReactNode, useRef } from "react";
import { Vector2 } from "../../classes/DTOInterfaces/vector2";

export default function ResizeBar({
  onResizeBarDragged,
}: {
  onResizeBarDragged?: (e: Vector2) => void;
}) {
  const resizeBarRef = useRef<HTMLElement | null>(null);

  function onDrag(e: Vector2) {
    //TODO refactor to dynamic values.
    const totalWidthAsFraction = 16 / window.innerWidth;

    onResizeBarDragged?.({
      x: e.x + totalWidthAsFraction,
      y: e.y,
    });
  }
  return (
    <DragWrapper className=" relative" onDrag={onDrag}>
      <div
        ref={resizeBarRef as any}
        className="bg-purple-vivid w-4 h-full cursor-w-resize z-50 opacity-10 absolute right-1
        transition-opacity hover:opacity-70
      "
      ></div>
    </DragWrapper>
  );
}

function DragWrapper({
  className,
  children,
  onDrag,
}: {
  className: string;
  children: ReactNode;
  /**
   * Where x and y are the absolute fraction of the cursor
   * on the screen.
   *
   * Both x and y ranges from 0 to (1 - fractionOfFixedWidthElements)
   * (0, 0) left top
   * (1, 1) right bottom
   *
   */
  onDrag: (e: { x: number; y: number }) => void;
}) {
  function onMouseUp() {
    window.removeEventListener("mouseup", onMouseUp);
    window.removeEventListener("mousemove", onMouseMove);
  }

  function onMouseDown() {
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
  }

  function onMouseMove(e: MouseEvent) {
    e.preventDefault();
    const mousePos = {
      x: Math.max(0, e.x / window.innerWidth),
      y: Math.max(0, e.y / window.innerHeight),
    };

    onDrag(mousePos);
  }

  return (
    <div className={className} onMouseDown={onMouseDown}>
      {children}
    </div>
  );
}
