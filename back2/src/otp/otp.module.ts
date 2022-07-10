import { Module } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { OtpController } from './otp.controller';

@Module({
  controllers: [OtpController],
  providers: [AuthService],
})
export class OtpModule {}
