import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { UserAuthModule } from '../modules';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    forwardRef(() => UserAuthModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export default class UserModule { }
