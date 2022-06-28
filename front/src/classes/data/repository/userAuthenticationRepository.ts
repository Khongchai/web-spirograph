import { BaseConfiguration } from "../../interfaces/ConfigurationInterface";

//TODO
export class UserAuthenticationRepository {
  static async loginOrRegister({
    email,
    password,
    baseConfiguration,
  }: {
    email: string;
    password: string;
    baseConfiguration: BaseConfiguration;
  }) {
    //TODO call endpoint and make APIResponse object
  }
}
