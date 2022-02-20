import React, { useRef, useState } from "react";
import CycloidControlsData from "../../types/cycloidControls";
import Controls from "../Controls";
import RelationShipEditor from "../RelationshipEditor";
import IconButton from "./IconButton";

interface ControlsOrRelationshipEditorProps {
  cycloidControls: React.MutableRefObject<CycloidControlsData>;
  clearCanvasToggle: () => void;
}

const ControlsOrRelationshipEditor: React.FC<
  ControlsOrRelationshipEditorProps
> = ({ cycloidControls, clearCanvasToggle }) => {
  const [controlsOrRelationshipEditor, setControlsOrRelationshipEditor] =
    useState<"controls" | "relationship-editor">("controls");
  const wrapperRef = useRef<any>();

  return (
    <div
      ref={wrapperRef}
      className="flex justify-between align-top h-full w-full"
    >
      {controlsOrRelationshipEditor === "controls" ? (
        <Controls
          cycloidControls={cycloidControls}
          clearCanvasToggle={clearCanvasToggle}
        />
      ) : (
        <RelationShipEditor
          cycloidControlsData={cycloidControls}
          wrapperRef={wrapperRef}
        />
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
