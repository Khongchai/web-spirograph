import { useContext, useState } from "react";
import { userContext } from "../../../contexts/userContext";
import Button from "../Shared/Button";
import SettingsContainer from "./shared/ControlContainer";
import ControlSection from "./shared/ControlSection";
import Heading from "./shared/heading";
import { UserModal } from "./UserModal";

export function UserDataControl({ tooltipText }: { tooltipText: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useContext(userContext);

  const onModalBackgroundClicked = () => {
    setIsModalOpen(false);
  };

  const onFormSubmit = ({
    email,
    username,
  }: {
    email: string;
    username: string;
  }) => {
    console.log(email, username);
  };

  const onSaveConfigButtonClicked = () => {
    //check the status of the user first
    if (user) {
      //TODO save data
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <_UserDataControl
      onFormSubmit={onFormSubmit}
      onModalBackgroundClicked={onModalBackgroundClicked}
      onSaveConfigButtonClicked={onSaveConfigButtonClicked}
      state={{ isModalOpen, tooltipText }}
    />
  );
}

interface _UserDataControlsUIEvents {
  state: {
    isModalOpen: boolean;
    tooltipText: string;
  };
  onSaveConfigButtonClicked: () => void;
  onModalBackgroundClicked: () => void;
  onFormSubmit: ({
    email,
    username,
  }: {
    email: string;
    username: string;
  }) => void;
}

function _UserDataControl({
  onFormSubmit,
  onModalBackgroundClicked,
  onSaveConfigButtonClicked,
  state: { isModalOpen, tooltipText },
}: _UserDataControlsUIEvents) {
  return (
    <ControlSection>
      <SettingsContainer>
        {isModalOpen ? (
          <UserModal
            onBgClicked={onModalBackgroundClicked}
            onFormSubmit={onFormSubmit}
          />
        ) : null}
        <Heading tooltipText={tooltipText}>Save Config</Heading>
        <Button
          buttonText="Save Config"
          onClick={onSaveConfigButtonClicked}
        ></Button>
      </SettingsContainer>
    </ControlSection>
  );
}
