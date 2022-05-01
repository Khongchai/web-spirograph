import TooltipWrapper from "../../Shared/TooltipWrapper";

const Heading: React.FC<{ tooltipText: string }> = ({
  children,
  tooltipText,
}) => {
  return (
    <TooltipWrapper tooltipText={tooltipText}>
      <h1 className="text-white tracking-wider font-bold text-lg cursor-help w-auto inline-block">
        {children}
      </h1>
    </TooltipWrapper>
  );
};

export default Heading;
