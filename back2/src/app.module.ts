import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedConfiguration } from 'src/models/SavedConfiguration';
import { User } from 'src/models/User';
import { Appcontroller } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { OtpModule } from './otp/otp.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      useUnifiedTopology: true,
      type: 'mongodb',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      entities: [User, SavedConfiguration],
      dropSchema: true,
      synchronize: true,
      database: process.env.DB_NAME,
    }),
    //TODO for production, use Nest's config module
    ConfigModule.forRoot({
      envFilePath: '.env.development',
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    OtpModule,
    CacheModule.register({
      ttl: 60 * 5,
      isGlobal: true,
    }),
  ],
  controllers: [Appcontroller],
})
export class AppModule {}
