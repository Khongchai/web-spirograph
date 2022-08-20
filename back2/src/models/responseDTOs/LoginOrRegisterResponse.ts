export class LoginOrRegisterResponse {
  constructor(
    public accessToken: string,
    public email: string,
    public processType: 'login' | 'register',
    public username: string,
  ) {}
}
