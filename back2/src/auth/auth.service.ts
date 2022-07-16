import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { redis } from 'src/mock_services/redis';
import DecoratorUtils from 'src/utils/decoratorUtils';

@Injectable()
export class AuthService {
  private static superOtpPassword = '999999';

  constructor(private jwtTokenService: JwtService) {}

  async validateUserWithOtp(email: string, otpCode: string) {
    const env = process.env.NODE_ENV;

    if (
      env === 'development' &&
      AuthService.superOtpPassword === otpCode &&
      redis.otp[email]
    ) {
      return true;
    }
    return redis.otp[email]?.value === otpCode;
  }

  @DecoratorUtils.returnLog.debug('Generated JWT object: ')
  async generateJwt(email: string) {
    const payload: JwtSignOptions = { issuer: email, subject: email };
    //TODO store jwt for later use
    return {
      accessToken: this.jwtTokenService.sign(payload),
    };
  }
}
