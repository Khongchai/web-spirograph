import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LocalAuthguard } from 'src/auth/local-auth.guard';
import { LoginOrRegisterRequest } from 'src/models/requestDTOs/LoginOrRegisterRequest';
import { SaveConfigurationRequest } from 'src/models/requestDTOs/UpdateConfigurationRequest';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LoginOrRegisterResponse } from './models/responseDTOs/LoginOrRegisterResponse';
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
      throwErrorIfNotExist: false,
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
  @Get('config')
  async getConfiguration(@DecoratorUtils.user.authUser() email: string) {
    const user = await this.userService.findOne({ email });

    return {
      savedConfigurations: user.savedConfigurations,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('config')
  async saveConfiguration(
    @Body() body: SaveConfigurationRequest,
    @DecoratorUtils.user.authUser() email: string,
  ) {
    await this.userService.update({ email, newConfig: body.newConfig });
    const updatedUser = await this.userService.findOne({ email: email });

    return updatedUser;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('config')
  async deleteconfiguration(@Body() body: SaveConfigurationRequest) {
    throw new Error('Method not implemented.');
  }
}
