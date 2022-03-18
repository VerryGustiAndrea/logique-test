import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { jwtConstants } from './constants';
import UserAuthService from './user-auth.service';

@Injectable()
export class UserStrategy extends PassportStrategy(Strategy, 'user') {
  constructor(private userAuthService: UserAuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.UserSecret,
    });
  }

  async validate(payload: any) {
    // Logger.log(payload, 'payload');
    console.log(payload)
    const checkuser = await this.userAuthService.findByIdUser(payload.id, {
      exclude: [
        'password',
        'resetPassword',
      ],
    });
    console.log(checkuser)
    if (checkuser) {
      return checkuser;
    }
    throw new UnauthorizedException();
  }
}
