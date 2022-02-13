import React, { useState } from "react";
import CycloidControls from "../../types/cycloidControls";
import Controls from "../Controls";
import RelationShipEditor from "../RelationshipEditor";
import IconButton from "./IconButton";

interface ControlsOrRelationshipEditorProps {
  cycloidControls: React.MutableRefObject<CycloidControls>;
  clearCanvasToggle: () => void;
}

const ControlsOrRelationshipEditor: React.FC<
  ControlsOrRelationshipEditorProps
> = ({ cycloidControls, clearCanvasToggle }) => {
  const [controlsOrRelationshipEditor, setControlsOrRelationshipEditor] =
    useState<"controls" | "relationship-editor">("controls");

  return (
    <div className="flex justify-between  align-top">
      {controlsOrRelationshipEditor === "controls" ? (
        <Controls
          cycloidControls={cycloidControls}
          clearCanvasToggle={clearCanvasToggle}
        />
      ) : (
        <RelationShipEditor />
      )}
      <div
        style={{ height: "fit-content" }}
        className="hover:rotate-2 cursor-pointer"
        onClick={() =>
          setControlsOrRelationshipEditor(
            controlsOrRelationshipEditor === "controls"
              ? "relationship-editor"
              : "controls"
          )
        }
      >
        {controlsOrRelationshipEditor === "controls" ? (
          <IconButton
            iconUrl="relationship-editor-icon.svg"
            alt="An icon used to open the relationship editor section"
          />
        ) : (
          <IconButton
            iconUrl="controls-icon.svg"
            alt="An icon used to open the controls section"
          />
        )}
      </div>
    </div>
  );
};

export default ControlsOrRelationshipEditor;
