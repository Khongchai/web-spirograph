export interface LoginOrRegisterRequest {
  /**
   * JSON-serialized configuration.
   *
   * Optional because this is only valid when the user hits the save button and is at that moment, not logged in.
   */
  serializedConfiguration?: string;

  email: string;

  otpCode: string;
}
