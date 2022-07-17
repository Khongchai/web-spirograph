import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SavedConfiguration } from 'src/models/SavedConfiguration';
import { User } from 'src/models/User';
import { LoginOrRegisterRequest } from 'src/models/requestDTOs/LoginOrRegisterRequest';
import { SaveConfigurationRequest } from 'src/models/requestDTOs/UpdateConfigurationRequest';
import { MongoRepository, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
  ) {}

  async findOne({ email }: { email: string }): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
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

  async update(body: { email: string; newConfig: string }): Promise<User> {
    const { email, newConfig } = body;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.update(user.id, {
      savedConfigurations: [
        ...user.savedConfigurations,
        new SavedConfiguration({ data: newConfig }),
      ],
    });

    const updatedUser = await this.userRepository.findOne({
      where: { id: user.id },
    });

    return updatedUser;
  }
}

@Injectable()
export class SavedConfigurationService {
  constructor(
    @InjectRepository(SavedConfiguration)
    private readonly savedConfigurationRepository: MongoRepository<SavedConfiguration>,
  ) {}
}
