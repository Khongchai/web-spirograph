import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginOrRegisterRequest } from '../models/requestDTOs/LoginOrRegisterRequest';
import { SavedConfiguration } from '../models/SavedConfiguration';
import { User } from '../models/User';
import { MongoRepository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
  ) {}

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

  async updateConfiguration({
    email,
    newConfig,
  }: {
    email: string;
    newConfig: string;
  }): Promise<User> {
    const savedConfigurations = await this.getConfigurations(email);
    const updatedConfigs: SavedConfiguration[] = [
      ...savedConfigurations,
      new SavedConfiguration({ data: newConfig }),
    ];
    const updatedUser = await this.update({
      email,
      newConfigs: updatedConfigs,
    });

    return updatedUser;
  }

  async createUser(body: LoginOrRegisterRequest): Promise<User> {
    if (!body.username) {
      throw new HttpException(
        'A username is required for a new user',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newUser = new User({
      email: body.email,
      savedConfigurations: [
        new SavedConfiguration({ data: body.serializedConfiguration }),
      ],
      username: body.username,
    });

    return await this.userRepository.save(newUser);
  }

  async update(body: {
    email: string;
    newConfigs: SavedConfiguration[];
  }): Promise<User> {
    const { email, newConfigs } = body;
    let user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.update(user.id, {
      savedConfigurations: newConfigs,
    });

    user = await this.userRepository.findOne({
      where: { email },
    });

    return user;
  }
}
