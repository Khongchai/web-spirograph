import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { UserService } from './app.service';
import { SavedConfiguration } from './models/SavedConfiguration';
import { User } from './models/User';
import './requestsDTO/LoginOrRegisterRequest';
import { LoginOrRegisterRequest } from './requestsDTO/LoginOrRegisterRequest';
import { SaveConfigurationRequest } from './requestsDTO/UpdateConfigurationRequest';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/user')
  async getUser(): Promise<User[]> {
    //TODO
    throw new Error('Method not implemented.');
  }

  /**
   *
   * If user doesn't exist, create one else log in and update the user's config.
   */
  @Post('/user')
  async loginOrRegister(@Body() body: LoginOrRegisterRequest) {
    const { email, serializedConfiguration: newConfig } = body;
    const user = await this.userService.findOne({
      email,
    });

    if (user) {
      if (newConfig) {
        await this.saveConfiguration({
          newConfig,
          email,
        });
      }
      //TODO
      await this.userService.login(user);
    } else {
      await this.userService.register(body);
    }

    return await this.userService.findOne({ email });
  }

  @Post('/config')
  async saveConfiguration(@Body() body: SaveConfigurationRequest) {
    return await this.userService.update(body);
  }
}
