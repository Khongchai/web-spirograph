import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { OtpController } from './otp.controller';

// @Module({
//   controllers: [OtpController],
//   providers: [AuthService, UserService],
//   imports: [AuthModule, UserModule],
// })
export class OtpModule {}
