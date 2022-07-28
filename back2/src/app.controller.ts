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
import { UpdateConfigurationRequest } from 'src/models/requestDTOs/UpdateConfigurationRequest';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { DeleteConfigurationRequest } from './models/requestDTOs/DeleteConfigurationRequest';
import { LoginOrRegisterResponse } from './models/responseDTOs/LoginOrRegisterResponse';
import { User } from './models/User';
import { UserService } from './user/user.service';
import DecoratorUtils from './utils/decoratorUtils';

@Controller()
export class Appcontroller {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  /**
   * If user doesn't exist, create one, else log in and update the user's config.
   */
  @UseGuards(LocalAuthguard)
  @Post('auth')
  async loginOrRegister(
    @Body() body: LoginOrRegisterRequest,
  ): Promise<LoginOrRegisterResponse> {
    return await this.userService.loginOrRegister({
      email: body.email,
      newConfiguration: body.serializedConfiguration,
      username: body.username,
    });
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
    return await this.userService.updateConfigurations({
      email,
      newConfigs: [body.newConfig],
      addNewOrReplace: 'add',
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('config')
  async deleteconfiguration(
    @Body() body: DeleteConfigurationRequest,
    @DecoratorUtils.user.authUser() email: string,
  ): Promise<User> {
    return await this.userService.deleteConfiguration({
      configurationId: body.configurationId,
      email,
    });
  }
}
