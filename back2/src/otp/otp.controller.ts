import { Body, Controller, Get, Post } from '@nestjs/common';
import { GenerateOtpRequest } from 'src/requestsDTO/GenerateOtpRequest';
import { OtpService } from './otp.service';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Get()
  async getOtp(@Body() body: GenerateOtpRequest) {
    await this.otpService.generateOtp(body.email);

    return;
  }
}
