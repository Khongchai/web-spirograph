import { useRef, useState } from "react";

const TooltipWrapper: React.FC<{ tooltipText: string }> = ({
  children,
  tooltipText,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipTextPos, setTooltipTextPos] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  return (
    <div
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onMouseMove={(e) =>
        setTooltipTextPos({
          x: e.clientX - tooltipRef.current!.clientWidth,
          y: e.clientY,
        })
      }
    >
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
    </div>
  );
};

export default TooltipWrapper;
