import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { User } from 'src/models/User';
import { LoginOrRegisterRequest } from 'src/requestsDTO/LoginOrRegisterRequest';
import { SaveConfigurationRequest } from 'src/requestsDTO/UpdateConfigurationRequest';
import { UserService } from './user.service';

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
   * If user doesn't exist, create one, else log in and update the user's config.
   */
  @Post('/user')
  async loginOrRegister(@Body() body: LoginOrRegisterRequest) {
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
      //TODO

      // To login, we just check if the token in the header is the same as the current user's authentication session.
      // We assume that the user has already gone through the otp step before arriving here.

      // The otp step is how we obtain the token.
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
