export class User {
  readonly email: string;

  constructor(user: User) {
    Object.assign(this, user);
  }
}
