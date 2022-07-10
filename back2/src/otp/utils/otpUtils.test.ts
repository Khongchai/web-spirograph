import { group } from 'console';
import 'jest';
import OtpUtils from './otpUtils';

group('otp', () => {
  test('otp default length', () => {
    const otp = OtpUtils.generate();
    expect(otp.length).toBe(6);
  });

  test('otp custom length', () => {
    const otp = OtpUtils.generate(5);
    expect(otp.length).toBe(5);

    const otp2 = OtpUtils.generate(3);
    expect(otp2.length).toBe(3);

    const otp3 = OtpUtils.generate(10);
    expect(otp3.length).toBe(10);
  });
});
