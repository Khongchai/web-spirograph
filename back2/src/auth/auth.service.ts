import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { LoginOrRegisterResponse } from 'src/models/responseDTOs/LoginOrRegisterResponse';
import { UserService } from 'src/user/user.service';
import DecoratorUtils from 'src/utils/decoratorUtils';
import NestJSCache from 'cache-manager';
import { Otp } from 'src/models/Otp';

@Injectable()
export class AuthService {
  private static superOtpPassword = '999999';

  constructor(
    private readonly jwtTokenService: JwtService,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: NestJSCache.Cache,
  ) {}

  async validateUserWithOtp(email: string, otpCode: string) {
    const env = process.env.NODE_ENV;

    if (env === 'development' && AuthService.superOtpPassword === otpCode) {
      return true;
    }

    const otp: Otp | null = await this.cacheManager.get(email);

    if (!otp) return false;

    const {associatedEmail, value} = otp;
    const validated = (value == otpCode) && (associatedEmail == email);

    return validated;
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
  }: {
    email: string;
    newConfiguration?: string;
  }) {
    const jwt: { accessToken: string } = await this.generateJwt(email);

    const queriedUser = await this.userService.findOne({
      email,
      throwErrorIfNotExist: false,
    });

    if (queriedUser) {
      if (newConfiguration) {
        await this.userService.updateConfigurations({
          newConfigs: [newConfiguration],
          email,
          addNewOrReplace: 'replace',
        });
      }
    } else {
      await this.userService.createNewUser({
        email,
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
