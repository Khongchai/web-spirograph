import React, { useRef, useState } from "react";
import CycloidControlsData from "../../../classes/domain/cycloidControls";
import { LoginRegisterLogoutButton } from "../Auth/LoginRegisterLogoutButton";
import Controls from "../Controls";
import RelationShipEditor from "../RelationshipEditor";
import Button from "../Shared/Button";
import IconButton from "./IconButton";

interface ControlsOrRelationshipEditorProps {
  cycloidControls: React.MutableRefObject<CycloidControlsData>;
  onRelationshipEditorToggle: () => void;
  onControlsToggle: () => void;
}

const ControlsOrRelationshipEditor: React.FC<
  ControlsOrRelationshipEditorProps
> = ({ cycloidControls, onRelationshipEditorToggle, onControlsToggle }) => {
  const [controlsOrRelationshipEditor, setControlsOrRelationshipEditor] =
    useState<"controls" | "relationship-editor">("controls");
  const wrapperRef = useRef<any>();

  return (
    <div
      ref={wrapperRef}
      className="flex justify-between align-top h-full w-full"
    >
      {controlsOrRelationshipEditor === "controls" ? (
        <Controls cycloidControls={cycloidControls} />
      ) : (
        <RelationShipEditor
          cycloidControlsData={cycloidControls}
          wrapperRef={wrapperRef}
        />
      )}
      <div className="flex-row flex h-fit items-center gap-4">
        <div
          style={{ height: "fit-content" }}
          className="hover:scale-105 cursor-pointer"
          onClick={() => {
            const isControls = controlsOrRelationshipEditor === "controls";
            if (isControls) {
              onRelationshipEditorToggle();
              setControlsOrRelationshipEditor("relationship-editor");
            } else {
              onControlsToggle();
              setControlsOrRelationshipEditor("controls");
            }
          }}
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
        <LoginRegisterLogoutButton />
      </div>
    </div>
  );
};

export default ControlsOrRelationshipEditor;
