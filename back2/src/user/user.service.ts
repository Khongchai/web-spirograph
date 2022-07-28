import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { LoginOrRegisterResponse } from 'src/models/responseDTOs/LoginOrRegisterResponse';
import { MongoRepository } from 'typeorm';
import { SavedConfiguration } from '../models/SavedConfiguration';
import { User } from '../models/User';

@Injectable()
export class UserService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
  ) {}

  //TODO move to auth service
  async loginOrRegister({
    email,
    newConfiguration,
    username,
  }: {
    email: string;
    newConfiguration?: string;
    username?: string;
  }) {
    const jwt: { accessToken: string } = await this.authService.generateJwt(
      email,
    );

    const queriedUser = await this.findOne({
      email,
      throwErrorIfNotExist: false,
    });

    // We will also update the configuration if the user exists
    if (queriedUser) {
      if (newConfiguration) {
        await this.updateConfigurations({
          newConfigs: [newConfiguration],
          email,
          addNewOrReplace: 'replace',
        });
      }
    } else {
      if (!username) {
        throw new HttpException(
          'A username is required for a new user',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.createNewUser({
        email,
        username,
        configuration: newConfiguration,
      });
    }

    return new LoginOrRegisterResponse(
      jwt.accessToken,
      email,
      queriedUser ? 'login' : 'register',
    );
  }

  async findOne({
    email,
    throwErrorIfNotExist: checkExist = true,
  }: {
    email: string;
    throwErrorIfNotExist?: boolean;
  }): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user && checkExist) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async getConfigurations(email: string): Promise<SavedConfiguration[]> {
    return await this.userRepository
      .findOne({ where: { email } })
      .then((user) => {
        if (!user) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return user;
      })
      .then((user) => user.savedConfigurations);
  }

  async createNewUser({
    email,
    username,
    configuration,
  }: {
    email: string;
    username: string;
    configuration?: string;
  }): Promise<User> {
    const newUser = new User({
      email,
      username,
      savedConfigurations: configuration
        ? [new SavedConfiguration({ data: configuration })]
        : [],
    });

    return await this.userRepository.save(newUser);
  }

  async updateConfigurations({
    email,
    newConfigs,
    addNewOrReplace,
  }: {
    email: string;
    newConfigs: string[] | SavedConfiguration[];
    addNewOrReplace: 'add' | 'replace';
  }): Promise<User> {
    const previousConfigurations = await this.getConfigurations(email);
    const newData = newConfigs.map((n: string | SavedConfiguration) =>
      n instanceof SavedConfiguration ? n : new SavedConfiguration({ data: n }),
    );

    const updatedConfigs: SavedConfiguration[] =
      addNewOrReplace === 'add'
        ? [...previousConfigurations, ...newData]
        : newData;

    const userToBeUpdated = await this.userRepository.findOne({
      where: { email },
    });

    await this.userRepository.update(userToBeUpdated.id, {
      savedConfigurations: updatedConfigs,
    });

    const updatedUser = await this.userRepository.findOne({
      where: { email },
    });
    return updatedUser;
  }

  async deleteConfiguration({
    email,
    configurationId,
  }: {
    email: string;
    configurationId: string;
  }): Promise<User> {
    const savedConfigurations = await this.getConfigurations(email);
    const updatedConfigs: SavedConfiguration[] = savedConfigurations.filter(
      (config) => config.id !== configurationId,
    );
    if (updatedConfigs.length === savedConfigurations.length) {
      throw new HttpException(
        'Configs of given UUID not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return await this.updateConfigurations({
      email,
      newConfigs: updatedConfigs,
      addNewOrReplace: 'replace',
    });
  }
}
