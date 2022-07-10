import { Otp } from 'src/models/Otp';

export const redis = {
  otp: {
    'john_doe@email.com': new Otp({
      associatedEmail: 'john_doe@email.com',
      value: '123456',
    }),
    'jane_doe@email.com': new Otp({
      associatedEmail: 'jane_doe@email.com',
      value: '654321',
    }),
  } as Record<string, Otp>,
};
