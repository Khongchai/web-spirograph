import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LocalAuthguard } from 'src/auth/local-auth.guard';
import { LoginOrRegisterRequest } from 'src/models/requestDTOs/LoginOrRegisterRequest';
import { UpdateConfigurationRequest } from 'src/models/requestDTOs/UpdateConfigurationRequest';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { DeleteConfigurationRequest } from './models/requestDTOs/DeleteConfigurationRequest';
import { LoginOrRegisterResponse } from './models/responseDTOs/LoginOrRegisterResponse';
import { SavedConfiguration } from './models/SavedConfiguration';
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
          newConfigs: [new SavedConfiguration({ data: newConfig })],
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
    return await this.userService.getConfigurations(email);
  }

  @UseGuards(JwtAuthGuard)
  @Put('config')
  async saveConfiguration(
    @Body() body: UpdateConfigurationRequest,
    @DecoratorUtils.user.authUser() email: string,
  ) {
    return await this.userService.updateConfiguration({
      email,
      newConfig: body.newConfig,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('config')
  async deleteconfiguration(
    @Body() body: DeleteConfigurationRequest,
    @DecoratorUtils.user.authUser() email: string,
  ) {
    const savedConfigurations = await this.userService.getConfigurations(email);
    const updatedConfigs: SavedConfiguration[] = savedConfigurations.filter(
      (config) => config.id !== body.configurationId,
    );
    if (updatedConfigs.length === savedConfigurations.length) {
      throw new HttpException(
        'Configs of given UUID not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return await this.userService.update({ email, newConfigs: updatedConfigs });
  }
}
