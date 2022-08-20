import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { redis } from 'src/mock_services/redis';
import { LoginOrRegisterResponse } from 'src/models/responseDTOs/LoginOrRegisterResponse';
import { UserService } from 'src/user/user.service';
import DecoratorUtils from 'src/utils/decoratorUtils';

@Injectable()
export class AuthService {
  private static superOtpPassword = '999999';

  constructor(
    private readonly jwtTokenService: JwtService,
    private readonly userService: UserService,
  ) {}

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
    const payload: JwtSignOptions = {
      issuer: email,
      subject: email,
    };

    const jwt = {
      accessToken: this.jwtTokenService.sign(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };

    return jwt;
  }

  async loginOrRegister({
    email,
    newConfiguration,
    username,
  }: {
    email: string;
    newConfiguration?: string;
    username?: string;
  }) {
    const jwt: { accessToken: string } = await this.generateJwt(email);

    const queriedUser = await this.userService.findOne({
      email,
      throwErrorIfNotExist: false,
    });

    // We won't use the provided username if the user already exists.
    // We will also update the configuration if the user exists.
    if (queriedUser) {
      if (newConfiguration) {
        await this.userService.updateConfigurations({
          newConfigs: [newConfiguration],
          email,
          addNewOrReplace: 'replace',
        });
      }
    } else {
      if (!username) {
        throw new HttpException(
          'A username is required for a new user',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.userService.createNewUser({
        email,
        username,
        configuration: newConfiguration,
      });
    }

    return new LoginOrRegisterResponse(
      jwt.accessToken,
      email,
      queriedUser ? 'login' : 'register',
    );
  }
}
