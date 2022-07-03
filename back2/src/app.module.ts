import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './app.controller';
import { UserService } from './app.service';
import { SavedConfiguration } from './models/SavedConfiguration';
import { User } from './models/User';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  controllers: [UserController],
})
class UserModule {}

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
    UserModule,
  ],
})
export class AppModule {}
