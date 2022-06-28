import React, { useState } from "react";
import { LoginRegisterForm, onFormSubmitType } from "../Auth/LoginRegisterForm";

export function UserModal({
  onBgClicked,
  onFormSubmit,
}: {
  onBgClicked: VoidFunction;
  onFormSubmit: onFormSubmitType;
}) {
  return (
    <RegisterAndLoginModal
      onFormSubmit={onFormSubmit}
      onBgClicked={onBgClicked}
    />
  );
}

export function RegisterAndLoginModal({
  onBgClicked,
  onFormSubmit,
}: {
  onBgClicked: VoidFunction;
  onFormSubmit: onFormSubmitType;
}) {
  return (
    <>
      <ModalBackground onBgClicked={onBgClicked}>
        <div className="space-y-3">
          <div className="space-y-2 text-center">
            <h1 className="text-lg font-bold">
              Enter Your Email to Sign Up / Log In
            </h1>
            <h1 className="text-lg font-bold">
              Leave Username Empty If Already Registered
            </h1>
          </div>
          <LoginRegisterForm onFormSubmit={onFormSubmit} />
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
