import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { mockJwtSecret } from 'src/mock_services/secret';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

describe('AuthService', () => {
  let service: AuthService;
  const env = process.env;
  process.env.NODE_ENV = 'development';
  process.env.JWT_SECRET = 'hello world';

  beforeEach(async () => {
    jest.resetModules();

    process.env = { ...env };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: mockJwtSecret,
          signOptions: { expiresIn: '1d' },
        }),
      ],
      providers: [AuthService, LocalStrategy, JwtStrategy],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(function () {
    process.env = env;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
