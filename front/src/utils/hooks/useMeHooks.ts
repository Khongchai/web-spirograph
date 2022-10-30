import { useContext, useEffect, useState } from "react";
import { UserAuthenticationRepository } from "../../classes/data/repository/userAuthenticationRepository";
import CycloidControls from "../../classes/domain/cycloidControls";
import { User } from "../../classes/domain/userData/User";
import { setUserContext, userContext } from "../../contexts/userContext";

// Call the me function to findout who the current user is.
export default function useMeHooks(): {
  done: boolean;
} {
  const [done, setDone] = useState(false);
  const setUser = useContext(setUserContext);

  useEffect(() => {
    me();
  }, []);

  async function me() {
    const resp = await UserAuthenticationRepository.me();

    const user = resp
      ? new User({
          email: resp.email,
        })
      : null;
    setUser(user);

    setDone(true);
  }

  return { done };
}
