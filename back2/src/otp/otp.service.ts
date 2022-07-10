import { Injectable } from '@nestjs/common';
import OtpUtils from 'src/otp/utils/otpUtils';
import { redis } from '../mock_services/redis';

@Injectable()
export class OtpService {
  constructor() {}

  /**
   * Generate new otp and add to redis with key = email
   */
  async generateOtp(email: string) {
    const _redis = redis;
    const newotp = OtpUtils.generate();
    _redis.otp[email] = newotp;
  }
}
