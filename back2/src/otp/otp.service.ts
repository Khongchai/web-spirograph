import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import NestJSCache from 'cache-manager';
import { Otp } from 'src/models/Otp';
import DecoratorUtils from 'src/utils/decoratorUtils';
import OtpUtils from 'src/utils/otpUtils';

@Injectable()
export class OtpService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: NestJSCache.Cache) {}

  /**
   * Generate new otp and add to redis with key = email
   *
   * Returns the newly generated otp
   */
  @DecoratorUtils.returnLog.debug('Generated Otp object is ')
  async generateOtp(email: string): Promise<Otp> {
    const newOtpCode = OtpUtils.generate();
    const newOtpObject = new Otp({
      associatedEmail: email,
      value: newOtpCode,
    });
    await this.cacheManager.set(email, newOtpObject);

    return newOtpObject;
  }
}
