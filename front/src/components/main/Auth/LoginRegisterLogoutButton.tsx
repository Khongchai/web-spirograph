import { useContext, useEffect } from "react";
import { UserAuthenticationRepository } from "../../../classes/data/repository/userAuthenticationRepository";
import { setUserContext, userContext } from "../../../contexts/userContext";
import { useLoginModal } from "../Controls/UserModal";
import Button from "../Shared/Button";

export function LoginRegisterLogoutButton() {
  const user = useContext(userContext);
  const setUser = useContext(setUserContext);

  const { UI: LoginModal, trigger, isLoading } = useLoginModal();

  function triggerLoginOrRegisterUI() {
    trigger(true);
  }

  async function logout() {
    try {
      await UserAuthenticationRepository.logout();
    } catch (e) {
      alert("Sorry, something went wrong on our side. Please try again.");
      console.error(e);
      return;
    }

    alert("You are logged out.");
    setUser(null);
  }

  return (
    <div>
      <LoginModal />
      {!user ? (
        isLoading ? (
          <Button buttonText="loading" />
        ) : (
          <Button
            buttonText="Register/Login"
            onClick={triggerLoginOrRegisterUI}
          />
        )
      ) : (
        <Button buttonText="Logout" onClick={logout} />
      )}
    </div>
  );
}
