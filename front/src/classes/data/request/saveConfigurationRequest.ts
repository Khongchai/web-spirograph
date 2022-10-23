import { BaseConfiguration } from "../../DTOInterfaces/BaseConfiguration";

export class SaveConfigurationRequest {
  /**
   * JSON-serialized BaseConfiguration
   */
  newConfig: string;

  constructor(baseConfiguration: BaseConfiguration) {
    this.newConfig = JSON.stringify(baseConfiguration);
  }
}
