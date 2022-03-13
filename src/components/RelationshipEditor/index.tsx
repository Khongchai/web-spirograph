import React from "react";
import CycloidControlsData from "../../types/cycloidControls";
import generateNodes from "./utils/generateNodes";

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

  const boundingCircle = cycloidControlsData.current.outerMostBoundingCircle;

  const drawnCircles = generateNodes(
    boundingCircle,
    cycloidControlsData,
    {
      height,
      width,
    },
    30
  );

  return (
    <svg width={width} height={height}>
      {drawnCircles.svgCircles}
      {drawnCircles.svgLines}
    </svg>
  );
};

export default RelationShipEditor;
