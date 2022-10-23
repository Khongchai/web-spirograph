import React from "react";
import { LoginRegisterForm, onFormSubmitType } from "../Auth/LoginRegisterForm";
import { OtpVerificationForm } from "../Auth/OtpVerificationForm";

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
            <h1 className="text-lg font-bold">
              Leave Username Empty If Already Registered
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
