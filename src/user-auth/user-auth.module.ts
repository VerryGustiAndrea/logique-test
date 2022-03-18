import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from '../modules';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UserStrategy } from './user.strategy';
import UserAuthService from './user-auth.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../user/user.model';
import { UserService } from '@/user/user.service';

// import { UserAuthGuard } from './User-auth.guard';

@Module({
  imports: [
    UserModule,
    SequelizeModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.UserSecret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [UserAuthService, UserStrategy, UserService],
  exports: [UserAuthService],
})
export default class UserAuthModule { }
