import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { redis } from 'src/mock_services/redis';

@Injectable()
export class AuthService {
  constructor(private jwtTokenService: JwtService) {}

  async validateUserWithOtp(email: string, otpCode: string) {
    return redis.otp[email].value === otpCode;
  }

  async login(email: string) {
    const payload: JwtSignOptions = { issuer: email, subject: email };
    return {
      accessToken: this.jwtTokenService.sign(payload),
    };
  }
}
