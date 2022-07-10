import { Get, Injectable, Logger } from '@nestjs/common';
import { Otp } from 'src/models/Otp';
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
  @DecoratorUtils.returnLog.debug('Generated Otp object is ')
  async generateOtp(email: string): Promise<Otp> {
    const _redis = redis;
    const newOtp = OtpUtils.generate();

    const newOtpObject = (_redis.otp[email] = new Otp({
      associatedEmail: email,
      value: newOtp,
    }));

    return newOtpObject;
  }
}
