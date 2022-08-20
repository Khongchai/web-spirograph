import { useContext, useState } from "react";
import { ClientError } from "../../../classes/customEvents";
import { UserAuthenticationRepository } from "../../../classes/data/repository/userAuthenticationRepository";
import CycloidControls from "../../../classes/domain/cycloidControls";
import { userContext } from "../../../contexts/userContext";
import { onFormSubmitType } from "../Auth/LoginRegisterForm";
import Button from "../Shared/Button";
import SettingsContainer from "./shared/ControlContainer";
import ControlSection from "./shared/ControlSection";
import Heading from "./shared/heading";
import { UserModal, UserModalType } from "./UserModal";

export function UserDataControl({
  tooltipText,
  cycloidControls,
}: {
  tooltipText: string;
  cycloidControls: CycloidControls;
}) {
  const [isLogInRegisterModalOpen, setIsLogInRegisterModalOpen] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userModalType, setUserModalType] =
    useState<UserModalType>("OtpRequest");
  const [userCredentails, setUserCredentials] = useState<{
    email: string;
    username?: string;
  }>();

  const user = useContext(userContext);

  function onModalBackgroundClicked() {
    setIsLogInRegisterModalOpen(false);
    setUserModalType("OtpRequest");
  }

  const onOtpRequestFormSubmit: onFormSubmitType = async ({
    email,
    username,
  }) => {
    setIsLoading(true);

    await UserAuthenticationRepository.otpRequest({ email })
      .then(() => {
        setUserModalType("OtpVerify");
        setUserCredentials({ email, username });
      })
      .catch(() => {
        alert("Sorry, something went wrong on our side.");
      });

    setIsLoading(false);
  };

  const onOtpVerificatonFormSubmit = async ({ otp }: { otp: string }) => {
    setIsLoading(true);

    await UserAuthenticationRepository.loginOrRegisterRequest({
      email: userCredentails!.email,
      username: userCredentails?.username,
      cycloidControls,
      enteredOtp: otp,
    })
      .then((user) => {
        alert("Login success!");
      })
      .catch((e) => {
        if (e instanceof ClientError) {
          alert("Wrong otp, please try again.");
        } else {
          alert("Sorry, something went wrong on our side.");
        }
      });

    setIsLoading(false);
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
      isLoading={isLoading}
      onOtpVerificationFormSubmit={onOtpVerificatonFormSubmit}
      onOtpRequestFormSubmit={onOtpRequestFormSubmit}
      onModalBackgroundClicked={onModalBackgroundClicked}
      onSaveConfigButtonClicked={onSaveConfigButtonClicked}
      state={{
        isModalOpen: isLogInRegisterModalOpen,
        tooltipText,
        userModalType,
      }}
    />
  );
}

interface _UserDataControlsUIEvents {
  isLoading: boolean;
  onOtpVerificationFormSubmit: ({ otp }: { otp: string }) => Promise<void>;
  state: {
    isModalOpen: boolean;
    tooltipText: string;
    userModalType: UserModalType;
  };
  onSaveConfigButtonClicked: () => void;
  onModalBackgroundClicked: () => void;
  onOtpRequestFormSubmit: onFormSubmitType;
}

function _UserDataControl({
  onOtpRequestFormSubmit,
  onModalBackgroundClicked,
  onSaveConfigButtonClicked,
  onOtpVerificationFormSubmit,
  state: { isModalOpen, tooltipText, userModalType },
  isLoading,
}: _UserDataControlsUIEvents) {
  return (
    <ControlSection>
      <SettingsContainer>
        {isModalOpen ? (
          <UserModal
            type={userModalType}
            onBgClicked={onModalBackgroundClicked}
            onRequestOtpFormSubmit={onOtpRequestFormSubmit}
            onOtpVerificationFormSubmit={onOtpVerificationFormSubmit}
            isLoading={isLoading}
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
