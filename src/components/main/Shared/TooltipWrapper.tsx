import React, { useEffect } from "react";
import { useRef, useState } from "react";

const TooltipWrapper: React.FC<{
  tooltipText: string;
  wrapperType?: string;
  wrapperProps?: any;
}> = ({ children, tooltipText, wrapperType, wrapperProps }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipTextPos, setTooltipTextPos] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Not using jsx because we need to conditionally render the tooltip wrapper
  const returnElem = React.createElement(
    wrapperType ?? "div",
    {
      onMouseEnter: () => setShowTooltip(true),
      onMouseLeave: () => setShowTooltip(false),
      onMouseMove: (e) =>
        setTooltipTextPos({
          x: e.clientX - tooltipRef.current!.clientWidth,
          y: e.clientY,
        }),
    },
    <>
      {children}
      <div
        ref={tooltipRef}
        className="tooltip absolute bg-purple-grey p-3 rounded-md 
    transition-opacity pointer-events-none max-w-sm z-50"
        style={{
          opacity: showTooltip ? 1 : 0,
          top: tooltipTextPos.y,
          left: tooltipTextPos.x,
        }}
      >
        {tooltipText}
      </div>
    </>
  );

  return returnElem;
};

export default TooltipWrapper;
