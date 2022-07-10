import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Controller()
export class OtpController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async getOtp(@Body() body: GenerateOtpRequest) {}
}
