import CycloidControls from "../cycloidControls";

export class User {
  readonly username: string;
  readonly email: string;

  constructor(user: User) {
    Object.assign(this, user);
  }
}
