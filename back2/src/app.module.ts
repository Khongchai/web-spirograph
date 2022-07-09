import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedConfiguration } from 'src/models/SavedConfiguration';
import { User } from 'src/models/User';
import { Appcontroller } from './app.controller.ts';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      useUnifiedTopology: true,
      //TODO move to .env
      type: 'mongodb',
      host: 'localhost',
      port: 27017,
      entities: [User, SavedConfiguration],

      //TODO remove :)
      synchronize: true,
      database: 'test',
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [Appcontroller],
})
export class AppModule {}
