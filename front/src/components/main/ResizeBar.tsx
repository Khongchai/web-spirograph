import React, { ReactNode, useEffect, useState } from "react";
export default function ResizeBar() {
  function onDrag(e: { x: number; y: number }) {}
  return (
    <DragWrapper className="w-4 relative" onDrag={onDrag}>
      <div
        className="bg-purple-vivid w-4 h-full cursor-w-resize z-50 opacity-20 absolute right-4
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
   * Where x and y are the absolute percentage of the cursor
   * on the screen
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
