import { BaseConfiguration } from "../../DTOInterfaces/ConfigurationInterface";

export class User {
  readonly username: string;
  readonly email: string;
  readonly currentConfigs: [BaseConfiguration];

  constructor(user: User) {
    Object.assign(this, user);
  }
}
