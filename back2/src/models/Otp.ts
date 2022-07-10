import { randomUUID } from 'crypto';

export class Otp {
  /**
   * The generated otp value
   */
  value: string;

  associatedEmail: string;

  timeUTC: string;

  refCode: string;

  static date = new Date();

  constructor(otp: Omit<Otp, 'timeUTC' | 'refCode'>) {
    Object.assign(this, {
      ...otp,
      refcode: randomUUID(),
      timeUTC: Otp.date.toUTCString(),
    });
  }
}
