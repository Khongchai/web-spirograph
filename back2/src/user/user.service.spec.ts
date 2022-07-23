import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { SavedConfiguration } from 'src/models/SavedConfiguration';
import { MongoRepository } from 'typeorm';
import { User } from '../models/User';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let mockRepository: MongoRepository<User>;
  const mockedUser = new User({
    email: 'mock@email.com',
    savedConfigurations: [
      new SavedConfiguration({
        data: '',
      }),
    ],
    username: '',
  });

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          database: ':memory:',
          dropSchema: true,
          synchronize: true,
          logging: false,
        }),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UserService],
    }).compile();

    mockRepository = await moduleRef.resolve(getRepositoryToken(User));
    userService = await moduleRef.resolve(UserService);
  });

  describe('Querying user', () => {
    const mockEmail = 'mock@email.com';
    jest
      .fn(() => userService.findOne({ email: mockEmail }))
      .mockReturnValueOnce(Promise.resolve(mockedUser));
    it('Should returned the queried user', async () => {
      const user = await userService.findOne({ email: mockEmail });
      expect(user).toBe(mockedUser);
    });
  });
});
