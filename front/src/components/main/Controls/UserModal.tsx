import React, { useState } from "react";
import { LoginRegisterForm } from "../Auth/LoginRegisterForm";

export function UserModal({ onBgClicked }: { onBgClicked: VoidFunction }) {
  return (
    <RegisterAndLoginModal onFormSubmit={() => {}} onBgClicked={onBgClicked} />
  );
}

export function RegisterAndLoginModal({
  onBgClicked,
  onFormSubmit,
}: {
  onBgClicked: VoidFunction;
  onFormSubmit: VoidFunction;
}) {
  return (
    <>
      <ModalBackground onBgClicked={onBgClicked}>
        <h1>Enter Your Email to Sign Up / Log In</h1>
        <h1>Leave Username Empty If Already Registered</h1>
        <LoginRegisterForm onFormSubmit={onFormSubmit} />
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
