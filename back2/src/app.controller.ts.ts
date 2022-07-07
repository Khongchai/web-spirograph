import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { LocalAuthguard } from 'src/auth/local-auth.guard';
import { User } from 'src/models/User';
import { LoginOrRegisterRequest } from 'src/requestsDTO/LoginOrRegisterRequest';
import { SaveConfigurationRequest } from 'src/requestsDTO/UpdateConfigurationRequest';
import { UserService } from './user/user.service';

@Controller()
export class Appcontroller {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async getUser(): Promise<User[]> {
    //TODO
    throw new Error('Method not implemented.');
  }

  /**
   *
   * If user doesn't exist, create one, else log in and update the user's config.
   */
  @UseGuards(LocalAuthguard)
  @Post('auth')
  async loginOrRegister(@Body() body: LoginOrRegisterRequest) {
    return body.email;
    const { email, serializedConfiguration: newConfig } = body;
    const user = await this.userService.findOne({
      email,
    });

    if (user) {
      if (newConfig) {
        await this.userService.update({
          newConfig,
          email,
        });
      }
      await this.authService.login(user.email);
    } else {
      await this.userService.register(body);
    }

    return await this.userService.findOne({ email });
  }

  // Protected route
  @Post('/config')
  async saveConfiguration(@Body() body: SaveConfigurationRequest) {
    return await this.userService.update(body);
  }
}
