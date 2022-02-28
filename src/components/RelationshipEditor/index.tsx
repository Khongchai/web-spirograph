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
  const cycloids = cycloidControlsData.current.cycloids;

  const drawnCircles = generateNodes(boundingCircle, cycloids, {
    height,
    width,
  });

  return (
    <svg width={width} height={height}>
      {drawnCircles.svgCircles}
      {drawnCircles.svgLines}
    </svg>
  );
};

export default RelationShipEditor;
