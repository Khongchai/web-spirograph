import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginOrRegisterRequest {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  otpCode: string;

  username?: string;

  /** No need to de-serialize this as we're just gonna be saving into the db as is. */
  serializedConfiguration?: string;
}
