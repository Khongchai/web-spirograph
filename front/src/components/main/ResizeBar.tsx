import { ReactNode, useRef, useState } from "react";
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

  function preventEventPropagation(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
  }

  return (
    <DragWrapper className=" relative" onDrag={onDrag}>
      <div
        ref={resizeBarRef as any}
        className="bg-purple-vivid w-4 h-full cursor-w-resize z-50 opacity-10 absolute right-1
        transition-opacity hover:opacity-70
      "
        onClick={preventEventPropagation}
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
  const [blockEvents, setBlockEvents] = useState(false);

  function onPointerUp() {
    document.removeEventListener("mouseup", onPointerUp);
    document.removeEventListener("touchend", onPointerUp);
    document.removeEventListener("mousemove", onPointerMove);
    document.removeEventListener("touchmove", onPointerMove);
    setBlockEvents(false);
  }

  function onPointerDown() {
    document.addEventListener("mouseup", onPointerUp);
    document.addEventListener("touchend", onPointerUp, { passive: false });
    document.addEventListener("mousemove", onPointerMove);
    document.addEventListener("touchmove", onPointerMove, { passive: false });
    setBlockEvents(true);
  }

  function onPointerMove(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    e.stopPropagation();
    let cursorPos = { x: 0, y: 0 };
    if (e instanceof MouseEvent) {
      cursorPos = {
        x: Math.max(0, e.x / window.innerWidth),
        y: Math.max(0, e.y / window.innerHeight),
      };
    } else {
      cursorPos = {
        x: Math.max(0, e.touches[0].clientX / window.innerWidth),
        y: Math.max(0, e.touches[0].clientY / window.innerHeight),
      }
    }

    onDrag(cursorPos);
  }

  return (
    <>
      <div className={className} onPointerDown={onPointerDown}>
        {children}
      </div>
      {
        blockEvents ? <div className="fixed w-full h-full " > </div>
          : <></>
      }
    </>
  );
}
