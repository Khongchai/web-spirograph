import React, { useContext } from "react";
import { RerenderToggle } from "../../contexts/rerenderToggle";
import CycloidControlsData from "../../classes/CycloidControls";
import ContentArray from "./shared/contentArray";
import Settings from "./shared/control";
import SettingsContainer from "./shared/ControlContainer";
import ControlSection from "./shared/ControlSection";
import Heading from "./shared/heading";

interface globalProps {
  cycloidControls: CycloidControlsData;
  tooltipText: string;
  forceUpdateSettingsUI: () => void;
}

const Global: React.FC<globalProps> = ({
  cycloidControls,
  tooltipText,
  forceUpdateSettingsUI,
}) => {
  const rerenderToggle = useContext(RerenderToggle);
  return (
    <ControlSection>
      <Heading tooltipText={tooltipText}>Global</Heading>
      <SettingsContainer>
        <Settings
          paramName={"Animation Speed Scale"}
          numberValue={cycloidControls.animationSpeed}
          onDrag={(newValue: number) =>
            (cycloidControls.animationSpeed = newValue)
          }
        />
        <Settings
          onClick={(newValue) =>
            (cycloidControls.clearTracedPathOnParamsChange = newValue)
          }
          paramName="Clear Traced Path on Params Change"
          defaultBooleanValue={cycloidControls.clearTracedPathOnParamsChange}
        />
        <Settings
          onDrag={(newValue: number) => {
            cycloidControls.outerMostBoundingCircle.setRadius(newValue);
            rerenderToggle();
          }}
          numberValue={cycloidControls.outerMostBoundingCircle.getRadius()}
          paramName="Outer Bounding Circle Radius"
        />
        <Settings
          onClick={(newValue) => {
            cycloidControls.showAllCycloids = newValue;
            rerenderToggle();
          }}
          paramName="Show all cycloids"
          defaultBooleanValue={cycloidControls.showAllCycloids}
        />
        <ContentArray
          paramName={"Current Cycloid"}
          values={cycloidControls.cycloidManager
            .getAllCycloidParams()
            .map((cycloid) => cycloid.id)}
          targetValue={cycloidControls.currentCycloidId}
          onClick={(newId: number) => {
            cycloidControls.currentCycloidId = newId;
            //If all are shown, there's no need to clear the canvas to repaint another one
            //We'll just need to update the settings UI
            if (!cycloidControls.showAllCycloids) {
              rerenderToggle();
            } else {
              forceUpdateSettingsUI();
            }
          }}
        />
      </SettingsContainer>
    </ControlSection>
  );
};

export default Global;
