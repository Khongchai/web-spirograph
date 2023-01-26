import React from "react";
import CycloidControlsData from "../../../classes/domain/cycloidControls";
import useGenerateNodes from "./utils/generateNodes";

interface RelationShipEditorProps {
  cycloidControlsData: React.MutableRefObject<CycloidControlsData>;
  wrapperRef: React.MutableRefObject<HTMLElement>;
}

const RelationShipEditor: React.FC<RelationShipEditorProps> = ({
  cycloidControlsData,
  wrapperRef,
}) => {
  const height = wrapperRef.current.clientHeight;
  const width = wrapperRef.current.clientWidth;

  const boundingCircle = cycloidControlsData.current.outermostBoundingCircle;

  const drawnCircles = useGenerateNodes(
    boundingCircle,
    cycloidControlsData,
    {
      height: height,
      width: width / 2,
    },
    30
  );

  return (
    <svg width={width} height={height}>
      <>
        {drawnCircles.svgCircles}
        {drawnCircles.svgLines}
      </>
    </svg>
  );
};

export default RelationShipEditor;
