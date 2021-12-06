import React, { MutableRefObject, useState } from "react";
import CycloidControls from "../../types/cycloidControls";
import useForceUpdate from "../../utils/hooks/useForceUpdate";
import Content from "./content";
import ContentArray from "./contentArray";
import ContentContainer from "./ContentContainer";
import ControlSection from "./ControlSection";
import Heading from "./heading";
import SelectionButton from "./SelectionButton";
import "./style.css";

interface ControlsProps {
  cycloidControls: MutableRefObject<CycloidControls>;
}

/*
  Everything should be ref to avoid re-rendering.
*/
//TODO => split all three control sections into their own file
const Controls: React.FC<ControlsProps> = ({ cycloidControls }) => {
  const i = cycloidControls.current.currentCycloid;
  const cycloid = cycloidControls.current.cycloids[i];

  const forceUpdate = useForceUpdate();

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
            paramName={"Move Outside of Parent"}
            value={cycloid.moveOutSideOfParent}
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
              }}
            />
            <SelectionButton
              blur={cycloid.rotationDirection !== "counterclockwise"}
              innerHTML="Counter Clockwise"
              onClick={() => {
                cycloid.rotationDirection = "counterclockwise";
                forceUpdate();
              }}
            />
          </div>
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
            value={cycloidControls.current.nestedLevel}
          ></Content>
          <ContentArray
            paramName={"Current Cycloid"}
            values={cycloidControls.current.cycloids.map((_, i) => i)}
            index={i}
          ></ContentArray>
        </ContentContainer>
      </ControlSection>
      <ControlSection>
        <ContentContainer>
          <Heading>Mode</Heading>
          <SelectionButton
            blur={cycloidControls.current.mode !== "Animated"}
            innerHTML="Animated"
            onClick={() => {
              cycloidControls.current.mode = "Animated";
              forceUpdate();
            }}
          />
          <SelectionButton
            blur={cycloidControls.current.mode !== "Instant"}
            innerHTML="Instant"
            onClick={() => {
              cycloidControls.current.mode = "Instant";
              forceUpdate();
            }}
          />
        </ContentContainer>
        <ContentContainer>
          <Heading>Show Scaffold</Heading>
          <SelectionButton
            blur={cycloidControls.current.scaffold !== "Show"}
            onClick={() => {
              cycloidControls.current.scaffold = "Show";
              forceUpdate();
            }}
            innerHTML="Show"
          />
          <SelectionButton
            blur={cycloidControls.current.scaffold !== "Hide"}
            onClick={() => {
              cycloidControls.current.scaffold = "Hide";
              forceUpdate();
            }}
            innerHTML="Hide"
          />
        </ContentContainer>
      </ControlSection>
    </div>
  );
};

export default Controls;
