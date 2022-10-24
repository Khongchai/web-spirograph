import { useContext } from "react";
import { UserAuthenticationRepository } from "../../../classes/data/repository/userAuthenticationRepository";
import { setUserContext, userContext } from "../../../contexts/userContext";
import { useLoginModal } from "../Controls/UserModal";
import Button from "../Shared/Button";

export function LoginRegisterLogoutButton() {
  const user = useContext(userContext);
  const setUser = useContext(setUserContext);

  const { UI: LoginModal, trigger } = useLoginModal();

  function triggerLoginOrRegisterUI() {
    trigger(true);
  }

  async function logout() {
    try {
      await UserAuthenticationRepository.logout();
    } catch (e) {
      alert("Sorry, something went wrong on our side. Please try again.")
      console.error(e);
      return;
    }

    setUser(null);
  }

  return (
    <div>
      <LoginModal />
      {!user ? (
        <Button
          buttonText="Register/Login"
          onClick={triggerLoginOrRegisterUI}
        />
      ) : (
        <Button buttonText="Logout" onClick={logout} />
      )}
    </div>
  );
}
