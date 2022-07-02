import { BaseConfiguration } from "../../DTOInterfaces/ConfigurationInterface";

export class User {
  readonly username: string;
  readonly email: string;
  readonly currentConfigs: BaseConfiguration;

  constructor(
    username: string,
    email: string,
    currentConfigs: BaseConfiguration
  ) {
    this.username = username;
    this.email = email;
    this.currentConfigs = currentConfigs;
  }
}
