import { Get, Injectable, Logger } from '@nestjs/common';
import DecoratorUtils from 'src/utils/decoratorUtils';
import OtpUtils from 'src/utils/otpUtils';
import { redis } from '../mock_services/redis';

@Injectable()
export class OtpService {
  constructor() {}

  /**
   * Generate new otp and add to redis with key = email
   *
   * Returns the newly generated otp
   */
  @DecoratorUtils.log.debug('Generated Otp is ')
  async generateOtp(email: string) {
    const _redis = redis;
    const newOtp = OtpUtils.generate();

    return (_redis.otp[email] = newOtp);
  }
}
