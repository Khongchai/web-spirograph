import React from "react";
import CycloidControls from "../../types/cycloidControls";
import Content from "./content";
import ContentArray from "./contentArray";
import ContentContainer from "./ContentContainer";
import ControlSection from "./ControlSection";
import Heading from "./heading";
import "./style.css";

/*
  TODO => basically rerender the whole thing every time the state changes
*/
interface ControlsProps {
  cycloidControls: CycloidControls;
}

const Controls: React.FC<ControlsProps> = ({ cycloidControls }) => {
  const cycloid = cycloidControls.cycloids[cycloidControls.currentCycloid];

  return (
    <div className="all-container" style={{ paddingTop: "75px" }}>
      <ControlSection>
        <Heading>Local</Heading>
        <ContentContainer>
          <Content
            paramName={"Rod Length Scale"}
            value={cycloid.rodLengthScale}
          ></Content>
          <Content
            paramName={"Cycloid Speed Scale"}
            value={cycloid.animationSpeedScale}
          ></Content>
          <Content
            paramName={"Rotation Direction"}
            value={cycloid.rotationDirection}
          ></Content>
          <Content
            paramName={"Move Outside of Parent"}
            value={cycloid.moveOutSideOfParent}
          ></Content>
        </ContentContainer>
      </ControlSection>
      <ControlSection>
        <Heading>Global</Heading>
        <ContentContainer>
          <Content
            paramName={"Animation Speed Scale"}
            value={cycloid.animationSpeedScale}
          ></Content>
          <Content
            paramName={"Nested Level"}
            value={cycloidControls.nestedLevel}
          ></Content>
          <ContentArray
            paramName={"Current Cycloid"}
            values={cycloidControls.cycloids.map((_, i) => i)}
            index={cycloidControls.currentCycloid}
          ></ContentArray>
        </ContentContainer>
        <ContentContainer>
          <Heading>Mode</Heading>
          <div>
            {/* <button className="px-3 py-2 bg-purple-dull text-purple-dark rounded mr-2 hover-no-blur transition-all">
              "Animated"
            </button>
            <button className="px-3 py-2 bg-purple-dull text-purple-dark rounded mr-2 hover-no-blur transition-all">
              "Animated"
            </button> */}
          </div>
        </ContentContainer>
      </ControlSection>
    </div>
  );
};

export default Controls;
