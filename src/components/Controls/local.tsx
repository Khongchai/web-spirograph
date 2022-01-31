import CycloidParams from "../../types/cycloidParams";
import useForceUpdate from "../../utils/hooks/useForceUpdate";
import Control from "./shared/control";
import ControlContainer from "./shared/ControlContainer";
import ControlSection from "./shared/ControlSection";
import Heading from "./shared/heading";
import SelectionButton from "./shared/SelectionButton";

const Local: React.FC<{
  cycloid: CycloidParams;
  tooltipText: string;
  clearCanvasToggle: () => void;
}> = ({ cycloid, tooltipText, clearCanvasToggle }) => {
  const forceUpdate = useForceUpdate();

  return (
    <ControlSection>
      <Heading tooltipText={tooltipText}>Local</Heading>
      <ControlContainer>
        <Control
          paramName={"Rod Length Scale"}
          numberValue={cycloid.rodLengthScale}
          onDrag={(newValue: number) => {
            cycloid.rodLengthScale = newValue;
            clearCanvasToggle();
          }}
          registerChangeOnlyOnMouseUp={false}
        />
        <Control
          paramName={"Cycloid Speed Scale"}
          onDrag={(newValue: number) => {
            cycloid.animationSpeedScale = newValue;
            clearCanvasToggle();
          }}
          numberValue={cycloid.animationSpeedScale}
          registerChangeOnlyOnMouseUp={false}
        />
        <Control
          paramName={"Move Outside of Parent"}
          booleanValue={cycloid.moveOutSideOfParent}
          onClick={(newValue: boolean) => {
            cycloid.moveOutSideOfParent = newValue;
            clearCanvasToggle();
          }}
        />
        {/* TODO refactor this into content? */}
        <h2 className="font-bold text-base mr-1.5">Rotation Direction: </h2>
        <div className="flex">
          <SelectionButton
            blur={cycloid.rotationDirection !== "clockwise"}
            innerHTML="Clockwise"
            onClick={() => {
              cycloid.rotationDirection = "clockwise";
              forceUpdate();
              clearCanvasToggle();
            }}
          />
          <SelectionButton
            blur={cycloid.rotationDirection !== "counterclockwise"}
            innerHTML="Counter Clockwise"
            onClick={() => {
              cycloid.rotationDirection = "counterclockwise";
              forceUpdate();
              clearCanvasToggle();
            }}
          />
        </div>
      </ControlContainer>
    </ControlSection>
  );
};

export default Local;
