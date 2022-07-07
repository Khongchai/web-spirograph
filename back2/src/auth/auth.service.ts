import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { mockRedis } from 'src/mock_services/redis';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtTokenService: JwtService,
  ) {}

  async validateUserWithOtp(email: string, otpCode: string) {
    const user = await this.userService.findOne({ email });

    if (!user || mockRedis.otp[email] !== otpCode) {
      return null;
    }

    return user;
  }

  async login(email: string) {
    const payload: JwtSignOptions = { issuer: email, subject: email };
    return {
      access_token: this.jwtTokenService.sign(payload),
    };
  }
}
