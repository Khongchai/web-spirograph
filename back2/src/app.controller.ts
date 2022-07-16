import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LocalAuthguard } from 'src/auth/local-auth.guard';
import { User } from 'src/models/User';
import { LoginOrRegisterRequest } from 'src/models/requestDTOs/LoginOrRegisterRequest';
import { SaveConfigurationRequest } from 'src/models/requestDTOs/UpdateConfigurationRequest';
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
  async loginOrRegister(
    @Body() body: LoginOrRegisterRequest,
  ): Promise<LoginOrRegisterResponse> {
    const jwt: { accessToken: string } = await this.authService.generateJwt(
      body.email,
    );

    const { email, serializedConfiguration: newConfig } = body;
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

  // TODO distinction between put and post for configuration
  // Protected route
  //TODO protect this with jwt
  @Put('/config')
  async saveConfiguration(@Body() body: SaveConfigurationRequest) {
    return await this.userService.update(body);
  }
}
