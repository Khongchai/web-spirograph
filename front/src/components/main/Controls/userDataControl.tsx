import { useContext } from "react";
import { userContext } from "../../../contexts/userContext";
import useShowModal from "../../../utils/showModal";
import Button from "../Shared/Button";
import SettingsContainer from "./shared/ControlContainer";
import ControlSection from "./shared/ControlSection";
import Heading from "./shared/heading";

export function UserDataControl({ tooltipText }: { tooltipText: string }) {
  const user = useContext(userContext);

  const { modalControl } = useShowModal({
    buttons: [],
    title: "Test Modal",
  });

  return (
    <ControlSection>
      <SettingsContainer>
        <Heading tooltipText={tooltipText}>Save Config</Heading>
        <Button
          buttonText="Save Config"
          onClick={() => {
            //TODO
            // check if user is logged in
            // if log in, save config to database and show success message
            // else if not logged in, ask if user wants to login or register, or just save to local storage
            modalControl.showModal();
          }}
        ></Button>
      </SettingsContainer>
    </ControlSection>
  );
}
