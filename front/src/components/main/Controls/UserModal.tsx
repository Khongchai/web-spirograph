import React, { useContext, useState } from "react";
import { ClientError } from "../../../classes/customEvents";
import { UserAuthenticationRepository } from "../../../classes/data/repository/userAuthenticationRepository";
import CycloidControls from "../../../classes/domain/cycloidControls";
import { UITrigger } from "../../../classes/domain/UITrigger";
import { setUserContext } from "../../../contexts/userContext";
import { LoginRegisterForm, onFormSubmitType } from "../Auth/LoginRegisterForm";
import { OtpVerificationForm } from "../Auth/OtpVerificationForm";

export function useLoginModal(
  props: { defaultShowState?: boolean; cycloidControls?: CycloidControls } = {
    defaultShowState: false,
  }
): UITrigger & { isLoading: boolean } {
  const [isModalShown, setIsModalShown] = useState(!!props.defaultShowState);
  const [isLoading, setIsLoading] = useState(false);
  const [userModalType, setUserModalType] =
    useState<UserModalType>("OtpRequest");
  const [userCredentails, setUserCredentials] = useState<{
    email: string;
  }>();
  const setUser = useContext(setUserContext);

  const onOtpRequestFormSubmit: onFormSubmitType = async ({ email }) => {
    setIsLoading(true);

    await UserAuthenticationRepository.otpRequest({ email })
      .then(() => {
        setUserModalType("OtpVerify");
        setUserCredentials({ email });
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
      cycloidControls: props.cycloidControls,
      enteredOtp: otp,
    })
      .then((user) => {
        setUser(user);
        alert("You are now logged in");
        setIsModalShown(false);
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

  return {
    UI: () =>
      isModalShown ? (
        <UserModal
          onOtpVerificationFormSubmit={onOtpVerificatonFormSubmit}
          onRequestOtpFormSubmit={onOtpRequestFormSubmit}
          type={userModalType}
          isLoading={isLoading}
          onBgClicked={() => {
            setIsModalShown(false);
          }}
        />
      ) : (
        <></>
      ),
    trigger: (show) => {
      setIsModalShown(show);
    },
    isLoading,
  };
}

export type UserModalType = "OtpRequest" | "OtpVerify";

export function UserModal({
  onBgClicked,
  onRequestOtpFormSubmit,
  onOtpVerificationFormSubmit,
  isLoading,
  type,
}: {
  onBgClicked: VoidFunction;
  onRequestOtpFormSubmit: onFormSubmitType;
  onOtpVerificationFormSubmit: ({ otp }: { otp: string }) => Promise<void>;
  isLoading: boolean;
  type: UserModalType;
}) {
  if (type === "OtpVerify") {
    return (
      <OtpVerificationModal
        isLoading={isLoading}
        onFormSubmit={onOtpVerificationFormSubmit}
        onBgClicked={onBgClicked}
      />
    );
  }

  return (
    <RegisterAndLoginModal
      isLoading={isLoading}
      onFormSubmit={onRequestOtpFormSubmit}
      onBgClicked={onBgClicked}
    />
  );
}

export function OtpVerificationModal({
  onBgClicked,
  onFormSubmit,
  isLoading,
}: {
  onBgClicked: VoidFunction;
  onFormSubmit: ({ otp }: { otp: string }) => Promise<void>;
  isLoading: boolean;
}) {
  return (
    <ModalBackground onBgClicked={onBgClicked}>
      <div className="space-y-3">
        <div className="space-y-2 text-left">
          <h1 className="text-lg font-bold">
            An Otp has been sent to your email.{" "}
          </h1>
          <h1 className="text-lg font-bold">
            Plese check your email and enter the otp.
          </h1>
        </div>
        <OtpVerificationForm
          isSubmitting={isLoading}
          onFormSubmit={onFormSubmit}
        />
      </div>
    </ModalBackground>
  );
}

export function RegisterAndLoginModal({
  onBgClicked,
  onFormSubmit,
  isLoading,
}: {
  onBgClicked: VoidFunction;
  onFormSubmit: onFormSubmitType;
  isLoading: boolean;
}) {
  return (
    <>
      <ModalBackground onBgClicked={onBgClicked}>
        <div className="space-y-3">
          <div className="space-y-2 text-left">
            <h1 className="text-lg font-bold">
              Enter Your Email to Sign Up / Log In
            </h1>
          </div>
          <LoginRegisterForm
            onFormSubmit={onFormSubmit}
            isSubmitting={isLoading}
          />
        </div>
      </ModalBackground>
    </>
  );
}

interface ModalBackgroundProps {
  children: React.ReactNode;
  onBgClicked: () => void;
}

function ModalBackground({ children, onBgClicked }: ModalBackgroundProps) {
  return (
    <div className="fixed w-full h-full grid place-items-center top-0 left-0">
      <div className="z-20">{children}</div>
      <div
        className="fixed w-full h-full bg-purple-dark opacity-80 top-0 left-0 z-1"
        onClick={onBgClicked}
      />
    </div>
  );
}
