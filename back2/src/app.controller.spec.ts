import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './app.controller';
import { UserService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      // const appController = app.get<UserController>(UserController);
      // expect(appController.getUser()).toBe('Hello World!');
    });
  });
});
