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
    <>
      <svg width={width} height={height}>
        <>
          {drawnCircles.svgCircles}
          {drawnCircles.svgLines}
        </>
      </svg>
      <h2 className="absolute bottom-0 p-4">This mode has some won't-fix bugs, and I probably won't fix them ever. But feel free to play around.</h2>
    </>
  );
};

export default RelationShipEditor;
