import { Configuration } from "../Configuration";

export class User {
  private username: string;
  private mobileNo: string;
  private currentConfig: Configuration;

  constructor(
    username: string,
    mobileNo: string,
    currentConfig: Configuration
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

  set saveCurrentConfig(config: Configuration) {
    this.currentConfig = config;
  }

  get loadCurrentConfig(): Configuration {
    return this.currentConfig;
  }
}
