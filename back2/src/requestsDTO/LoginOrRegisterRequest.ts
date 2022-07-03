export interface LoginOrRegisterRequest {
  email: string;
  username: string;

  /** No need to de-serialize this as we're just gonna be saving into the db as is. */
  serializedConfiguration: string | null;
}
