import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'otpCode',
    });
  }

  async validate(username: string, password: string): Promise<any> {
    const result = await this.authService.validateUserWithOtp(
      username,
      password,
    );
    return result;
  }
}
