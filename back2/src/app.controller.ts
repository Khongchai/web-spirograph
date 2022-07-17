import { Body, Controller, Delete, Post, Put, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LocalAuthguard } from 'src/auth/local-auth.guard';
import { LoginOrRegisterRequest } from 'src/models/requestDTOs/LoginOrRegisterRequest';
import { SaveConfigurationRequest } from 'src/models/requestDTOs/UpdateConfigurationRequest';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UserService } from './user/user.service';
import DecoratorUtils from './utils/decoratorUtils';

@Controller()
export class Appcontroller {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  /**
   *
   * If user doesn't exist, create one, else log in and update the user's config.
   */
  @UseGuards(LocalAuthguard)
  @Post('auth')
  async loginOrRegister(
    @Body() body: LoginOrRegisterRequest,
  ): Promise<LoginOrRegisterResponse> {
    const jwt: { accessToken: string } = await this.authService.generateJwt(
      body.email,
    );

    const { serializedConfiguration: newConfig, email } = body;
    const queriedUser = await this.userService.findOne({
      email,
    });

    // We will also update the configuration if the user exists
    if (queriedUser) {
      if (newConfig) {
        await this.userService.update({
          newConfig,
          email,
        });
      }
    } else {
      await this.userService.createUser(body);
    }

    return {
      ...jwt,
      email: body.email,
      processType: queriedUser ? 'login' : 'register',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('config')
  async saveConfiguration(
    @Body() body: SaveConfigurationRequest,
    @DecoratorUtils.user.authUser() email: string,
  ) {
    return await this.userService.update({ email, newConfig: body.newConfig });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('config')
  async deleteconfiguration(@Body() body: SaveConfigurationRequest) {
    throw new Error('Method not implemented.');
  }
}
