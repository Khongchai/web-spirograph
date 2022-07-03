import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository, Repository } from 'typeorm';
import { SavedConfiguration } from './models/SavedConfiguration';
import { User } from './models/User';
import { LoginOrRegisterRequest } from './requestsDTO/LoginOrRegisterRequest';
import { SaveConfigurationRequest } from './requestsDTO/UpdateConfigurationRequest';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
  ) {}

  async findOne({ email }: { email: string }): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async register(body: LoginOrRegisterRequest): Promise<User> {
    const newUser = new User({
      email: body.email,
      savedConfigurations: [
        new SavedConfiguration({ data: body.serializedConfiguration }),
      ],
      username: body.username,
    });

    return await this.userRepository.save(newUser);
  }

  async update(body: SaveConfigurationRequest): Promise<User> {
    const { email, newConfig } = body;
    const user = await this.userRepository.findOne({ where: { email } });
    await this.userRepository.update(user.id, {
      savedConfigurations: [
        ...user.savedConfigurations,
        new SavedConfiguration({ data: newConfig }),
      ],
    });

    return user;
  }
}

@Injectable()
export class SavedConfigurationService {
  constructor(
    @InjectRepository(SavedConfiguration)
    private readonly savedConfigurationRepository: Repository<SavedConfiguration>,
  ) {}
}
