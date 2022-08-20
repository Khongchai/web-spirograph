import CycloidControls from "../cycloidControls";

export class User {
  readonly username: string;
  readonly email: string;
  readonly currentConfigs: CycloidControls[];

  constructor(user: User) {
    Object.assign(this, user);
  }
}
