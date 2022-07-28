import { useContext, useState } from "react";
import { UserAuthenticationRepository } from "../../../classes/data/repository/userAuthenticationRepository";
import CycloidControls from "../../../classes/domain/cycloidControls";
import { userContext } from "../../../contexts/userContext";
import { onFormSubmitType } from "../Auth/LoginRegisterForm";
import Button from "../Shared/Button";
import SettingsContainer from "./shared/ControlContainer";
import ControlSection from "./shared/ControlSection";
import Heading from "./shared/heading";
import { UserModal } from "./UserModal";

export function UserDataControl({
  tooltipText,
  cycloidControls,
}: {
  tooltipText: string;
  cycloidControls: CycloidControls;
}) {
  const [isLogInRegisterModalOpen, setIsLogInRegisterModalOpen] =
    useState(false);

  const user = useContext(userContext);

  function onModalBackgroundClicked() {
    setIsLogInRegisterModalOpen(false);
  }

  const onFormSubmit: onFormSubmitType = async ({ email, username }) => {
    const user = await UserAuthenticationRepository.loginOrRegisterOtpRequest({
      email,
      username,
      cycloidControls,
    });

    return Promise.resolve(false);
  };

  const onSaveConfigButtonClicked = () => {
    //check the status of the user first
    if (user) {
      //TODO save data
    } else {
      setIsLogInRegisterModalOpen(true);
    }
  };

  return (
    <_UserDataControl
      onFormSubmit={onFormSubmit}
      onModalBackgroundClicked={onModalBackgroundClicked}
      onSaveConfigButtonClicked={onSaveConfigButtonClicked}
      state={{ isModalOpen: isLogInRegisterModalOpen, tooltipText }}
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
  onFormSubmit: onFormSubmitType;
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
