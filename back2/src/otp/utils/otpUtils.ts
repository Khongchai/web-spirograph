export default class OtpUtils {
  static generate(otpLength = 6): string {
    let otpString = '';

    for (let i = 0; i < otpLength; i++) {
      otpString += Math.floor(Math.random() * 10);
    }

    return otpString;
  }
}
