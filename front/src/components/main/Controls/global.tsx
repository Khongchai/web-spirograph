import React, { useContext } from "react";
import { Rerender, RerenderToggle } from "../../../contexts/rerenderToggle";
import CycloidControlsData from "../../../classes/domain/cycloidControls";
import ContentArray from "./shared/contentArray";
import Settings from "./shared/control";
import SettingsContainer from "./shared/ControlContainer";
import ControlSection from "./shared/ControlSection";
import Heading from "./shared/heading";
import colors from "../../../constants/colors";
import { RerenderReason } from "../../../types/contexts/rerenderReasons";

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
          paramName={"Global Timestep"}
          numberValue={cycloidControls.globalTimeStepScale}
          step={0.1}
          onDrag={(newValue: number) => {
            cycloidControls.globalTimeStepScale = newValue;
            rerenderToggle(RerenderReason.timeStep);
          }}
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
            cycloidControls.outermostBoundingCircle.setRadius(newValue);
            rerenderToggle(RerenderReason.radius);
          }}
          numberValue={cycloidControls.outermostBoundingCircle.getRadius()}
          paramName="Outer Bounding Circle Radius"
        />
        <Settings
          onClick={(newValue) => {
            cycloidControls.showAllCycloids = newValue;
          }}
          paramName="Show all cycloids"
          defaultBooleanValue={cycloidControls.showAllCycloids}
        />
        <Settings
          onClick={(newValue) => {
            cycloidControls.traceAllCycloids = newValue;
            rerenderToggle(RerenderReason.undefined);
          }}
          paramName="Trace all cycloids"
          defaultBooleanValue={cycloidControls.traceAllCycloids}
        />
        <Settings
          onLeftClicked={() => {
            cycloidControls.cycloidManager.addCycloid({
              animationSpeedScale: Math.round(Math.random() * 100) / 100,
              boundingColor: colors.purple.light,
              moveOutSideOfParent: false,
              radius: Math.round(Math.random() * 100),
              rodLengthScale: (Math.round(Math.random() * 5) * 100) / 100,
              rotationDirection:
                Math.random() > 0.5 ? "clockwise" : "counterclockwise",
            });
            rerenderToggle(RerenderReason.addOrRemoveCycloid);
          }}
          onRightClicked={() => {
            cycloidControls.cycloidManager.removeLastCycloid(
              ({ idOfRemovedCycloid, cycloidParamsAfterRemoval }) => {
                const selectedCycloidIdBeforeRemoval =
                  cycloidControls.currentCycloidId;

                if (selectedCycloidIdBeforeRemoval === idOfRemovedCycloid) {
                  cycloidControls.currentCycloidId =
                    cycloidParamsAfterRemoval[
                      cycloidParamsAfterRemoval.length - 1
                    ].id;
                }
                rerenderToggle(RerenderReason.addOrRemoveCycloid);
              }
            );
          }}
          paramName={"Add Or Remove Cycloids"}
        />

        <ContentArray
          paramName={"Current Cycloid"}
          values={cycloidControls.cycloidManager.allCycloidParams.map(
            (cycloid) => cycloid.id
          )}
          targetValue={cycloidControls.currentCycloidId}
          onClick={(newId: number) => {
            cycloidControls.currentCycloidId = newId;
            //If all are shown, there's no need to clear the canvas to repaint another one
            //We'll just need to update the settings UI
            if (!cycloidControls.showAllCycloids) {
              rerenderToggle(RerenderReason.changedFocusedCycloid);
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
