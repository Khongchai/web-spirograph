import { BaseConfiguration } from "../Configuration";

export class User {
  private username: string;
  private mobileNo: string;
  private currentConfig: BaseConfiguration;

  constructor(
    username: string,
    mobileNo: string,
    currentConfig: BaseConfiguration
  ) {
    this.username = username;
    this.mobileNo = mobileNo;
    this.currentConfig = currentConfig;
  }

  get getUsername(): string {
    return this.username;
  }

  get getMobileNo(): string {
    return this.mobileNo;
  }

  set saveCurrentConfig(config: BaseConfiguration) {
    this.currentConfig = config;
  }

  get loadCurrentConfig(): BaseConfiguration {
    return this.currentConfig;
  }
}
