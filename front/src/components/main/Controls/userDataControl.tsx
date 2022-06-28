import { useState } from "react";
import Button from "../Shared/Button";
import SettingsContainer from "./shared/ControlContainer";
import ControlSection from "./shared/ControlSection";
import Heading from "./shared/heading";
import { UserModal } from "./UserModal";

export function UserDataControl({ tooltipText }: { tooltipText: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <ControlSection>
      <SettingsContainer>
        {isModalOpen ? (
          <UserModal onBgClicked={() => setIsModalOpen(false)} />
        ) : null}
        <Heading tooltipText={tooltipText}>Save Config</Heading>
        <Button
          buttonText="Save Config"
          onClick={() => {
            setIsModalOpen(true);
          }}
        ></Button>
      </SettingsContainer>
    </ControlSection>
  );
}
