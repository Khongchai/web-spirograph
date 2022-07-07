import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedConfiguration } from 'src/models/SavedConfiguration';
import { User } from 'src/models/User';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from './auth/auth.module';

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
    AuthModule,
  ],
})
export class AppModule {}
