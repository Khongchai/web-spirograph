import { Body, Controller, Get } from '@nestjs/common';
import { GenerateOtpRequest } from 'src/models/requestDTOs/GenerateOtpRequest';
import { OtpService } from './otp.service';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Get()
  async getOtp(@Body() body: GenerateOtpRequest) {
    await this.otpService.generateOtp(body.email);
  }
}
