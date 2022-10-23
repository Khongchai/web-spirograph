import { BaseConfiguration } from "../../DTOInterfaces/BaseConfiguration";

export class SaveConfigurationRequest {
  /**
   * JSON-serialized configuration.
   */
  newconfig: BaseConfiguration;

  constructor(newconfig: BaseConfiguration) {
    this.newconfig = newconfig;
  }
}
