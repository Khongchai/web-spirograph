import { Body, Controller, Post } from '@nestjs/common';
import { GenerateOtpRequest } from 'src/requestsDTO/GenerateOtpRequest';
import { OtpService } from './otp.service';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('/generate')
  async getOtp(@Body() body: GenerateOtpRequest) {
    await this.otpService.generateOtp(body.email);

    return;
  }
}
