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
import { BlackListedJwtGuard } from './auth/blacklisted-jwt.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { DeleteConfigurationRequest } from './models/requestDTOs/DeleteConfigurationRequest';
import { LoginOrRegisterResponse } from './models/responseDTOs/LoginOrRegisterResponse';
import { SavedConfiguration } from './models/SavedConfiguration';
import { UserService } from './user/user.service';
import DecoratorUtils from './utils/decoratorUtils';

/**
 * Bro, we need to refactor out controllers.
 */

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
    return await this.authService.loginOrRegister({
      email: body.email,
      newConfiguration: body.serializedConfiguration,
    });
  }

  @UseGuards(JwtAuthGuard, BlackListedJwtGuard)
  @Get('config')
  async getConfiguration(@DecoratorUtils.user.email() email: string) {
    return await this.userService.getConfigurations(email);
  }

  @UseGuards(JwtAuthGuard, BlackListedJwtGuard)
  @Post('logout')
  async logout(@DecoratorUtils.user.jwt() jwt: string) {
    await this.authService.logout({
      jwt,
    });

    return {};
  }

  /**
   * We only have 401 and 200 for this.
   * No 404 because if the jwt is invalid or missing, we already know that
   * the jwt, or lack thereof, can be ignored.
   *
   * This method also invalidates the old jwt and send back a new one.
   */
  @UseGuards(JwtAuthGuard, BlackListedJwtGuard)
  @Post('me')
  async me(
    @DecoratorUtils.user.email() email: string,
    @DecoratorUtils.user.jwt() jwt: string,
  ) {
    const result = await this.authService.me({ email, jwt });

    return {
      user: result.user,
      newToken: result.jwt,
    };
  }

  @UseGuards(JwtAuthGuard, BlackListedJwtGuard)
  @Put('config')
  async saveConfiguration(
    @Body() body: UpdateConfigurationRequest,
    @DecoratorUtils.user.email() email: string,
  ): Promise<SavedConfiguration[]> {
    const updatedConfigurations: SavedConfiguration[] =
      await this.userService.updateConfigurations({
        email,
        newConfigs: [body.newConfig],
        addNewOrReplace: 'add',
      });

    return updatedConfigurations;
  }

  @UseGuards(JwtAuthGuard, BlackListedJwtGuard)
  @Delete('config')
  async deleteconfiguration(
    @Body() body: DeleteConfigurationRequest,
    @DecoratorUtils.user.email() email: string,
  ): Promise<SavedConfiguration[]> {
    return await this.userService.deleteConfiguration({
      configurationId: body.configurationId,
      email,
    });
  }
}
