import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../models/User';
import { UserService } from './user.service';
jest.mock('./user.service');

interface MockUser extends User {}
class MockUser {}

describe('UserService', () => {
  let userService: UserService;
  const mockUser = new MockUser();

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([User])],
      providers: [UserService],
      exports: [UserService],
    }).compile();

    userService = await moduleRef.resolve(UserService);
  });

  describe('Querying user', () => {
    const mockEmail = 'mock@email.com';
    jest
      .fn(() => userService.findOne({ email: mockEmail }))
      .mockReturnValueOnce(Promise.resolve(mockUser));

    it('Should returned the queried user', async () => {
      const user = await userService.findOne({ email: mockEmail });
      expect(user).toBe(mockUser);
    });
  });
});
