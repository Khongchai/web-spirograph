import React, { MutableRefObject } from "react";
import CycloidControls from "../../types/cycloidControls";
import useForceUpdate from "../../utils/hooks/useForceUpdate";
import Global from "./global";
import Local from "./local";
import NonCycloidControls from "./nonCycloidControls";
import "./style.css";

interface ControlsProps {
  cycloidControls: MutableRefObject<CycloidControls>;
}

const Controls: React.FC<ControlsProps> = ({ cycloidControls }) => {
  const i = cycloidControls.current.currentCycloid;
  const cycloid = cycloidControls.current.cycloids[i];

  const forceUpdate = useForceUpdate();

  return (
    <div
      className="all-container"
      style={{ paddingTop: "75px", paddingLeft: "75px" }}
    >
      <Local cycloid={cycloid} />
      <Global
        forceParentUpdate={forceUpdate}
        cycloidControls={cycloidControls.current}
      />
      <NonCycloidControls cycloidControls={cycloidControls.current} />
    </div>
  );
};

export default Controls;
