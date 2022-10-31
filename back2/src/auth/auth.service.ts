import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import NestJSCache from 'cache-manager';
import { Otp } from 'src/models/Otp';
import { LoginOrRegisterResponse } from 'src/models/responseDTOs/LoginOrRegisterResponse';
import { User } from 'src/models/User';
import { UserService } from 'src/user/user.service';
import DecoratorUtils from 'src/utils/decoratorUtils';

@Injectable()
export class AuthService {
  private static superOtpPassword = '999999';
  static blackListedKey = 'black-listed';

  constructor(
    private readonly jwtTokenService: JwtService,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: NestJSCache.Cache,
  ) {}

  async logout({ jwt }: { jwt: string }): Promise<void> {
    // If not yet expired, store it in a black-list cache.
    const now = Date.now();
    const nowDate = new Date(now);

    // exp is in seconds, not milliseconds.
    const exp: number = this.jwtTokenService.decode(jwt)['exp'] * 1000;
    const expiryDate = new Date(exp);
    if (expiryDate > nowDate) {
      await this.cacheManager.set(jwt + AuthService.blackListedKey, jwt, {
        ttl: exp - now,
      });
    }

    return;
  }

  async validateUserWithOtp(email: string, otpCode: string) {
    const env = process.env.NODE_ENV;

    if (env === 'development' && AuthService.superOtpPassword === otpCode) {
      return true;
    }

    const otp: Otp | null = await this.cacheManager.get(email);

    if (!otp) return false;

    const { associatedEmail, value } = otp;
    const validated = value == otpCode && associatedEmail == email;

    return validated;
  }

  async me({ email, jwt }: { email: string; jwt: string }): Promise<{
    user: User | null;
    jwt: string | null;
  }> {
    const user = await this.userService.findOne({
      email,
      throwErrorIfNotExist: true,
    });

    const newJwt = await this.generateJwt(email);

    if (user) {
      await this.logout({ jwt });

      return {
        user,
        jwt: newJwt.accessToken,
      };
    }

    return { user: null, jwt: null };
  }

  async validateUserNotInBlackList(jwt: string) {
    return !!(await this.cacheManager.get(jwt + AuthService.blackListedKey));
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
          addNewOrReplace: 'add',
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
