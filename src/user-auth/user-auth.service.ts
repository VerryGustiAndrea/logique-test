import { Injectable, forwardRef, Inject, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './constants';
import { User } from '../user/user.model';
import { InjectModel, } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { FindAttributeOptions, Op } from 'sequelize';
import { CreateUserDto, UpdateUserDto, LoginUserRequestDto } from '../user/dto/index';
import { dataPhotos } from '@/user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import fs from 'fs';




@Injectable()
export default class UserAuthService {
  constructor(
    @InjectModel(User) public userModel: typeof User,
    public userService: UserService,
    public jwtService: JwtService,
  ) { }
  static saltRounds = 10;

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({
      where: {
        email
      },
      // attributes: { exclude: [, 'pin'] },
    });
  }

  async isUser(email: string): Promise<User | null> {
    return await this.userModel.findOne({
      where: {
        email: email.toLowerCase(),
      },
      attributes: {
        exclude: ['password', 'pin', 'resetPassword', 'twoFaSecret'],
      },
    });
  }

  async findByIdUser(id: number, attributes: FindAttributeOptions,) {
    return await this.userModel.findOne({
      where: { user_id: id }, attributes
    });
  }

  async deleteUser(id: number) {
    return await this.userModel.destroy({
      where: { user_id: id }
    });
  }

  remove(id: number) {
    return `This action removes a #${id} repository`;
  }


  async register(
    param: CreateUserDto,
    autoConfirm = true,
    files: dataPhotos,
  ): Promise<User | false | String> {
    const user = await this.userService.findUserByEmail(
      param.email.toLowerCase(),
    );
    const name = await this.userService.findOneByName(
      param.name.toLowerCase(),
      {
        exclude: ['password', 'pin', 'resetPassword', 'twoFaSecret'],
      },
    );

    const error: string[] = [];
    if (!files) {
      console.log("disini")
      throw new BadRequestException('images is missing.');
    }

    if (!files.photos || !files.photos[0]) {
      error.push('images is missing.');
    }
    const photos = files.photos[0];
    if (photos.mimetype.search('image/') === -1) {
      error.push('image must be an image');
    }
    if (photos.buffer.byteLength > 5e6) {
      error.push('image must be lower than 6Mb');
    }

    if (user) {
      return "Email Already Exist";
    } else if (name) {
      return "Name Already Exist";
    } else {
      let urlPhoto
      if (process.env.SERVER_OS === "WINDOWS") {
        const photosPath = `images\\photos${new Date().valueOf()
          }_${Date.now()}.png`;
        fs.writeFileSync(
          `${process.cwd()}\\${photosPath}`,
          photos.buffer,
        );
        urlPhoto = photosPath;



      } else {
        const photosPath = `images/photos${new Date().valueOf()
          }_${Date.now()}.png`;
        fs.writeFileSync(
          `${process.env.PWD}/${photosPath}`,
          photos.buffer,
        );
        urlPhoto = photosPath;


      }



      const salt = bcrypt.genSaltSync(UserAuthService.saltRounds);
      const hash = bcrypt.hashSync(param.password, salt);
      const newUser = await this.userService.create(
        {
          name: param.name,
          address: param.address,
          email: param.email.toLowerCase(),
          password: hash,
          photos: urlPhoto,
          creditcard_type: param.creditcard_type,
          creditcard_number: param.creditcard_number,
          creditcard_name: param.creditcard_name,
          creditcard_expired: param.creditcard_expired,
          creditcard_cvv: param.creditcard_cvv,
        },
        autoConfirm,
        param.password,
      );
      console.log(newUser)
      delete newUser.password;
      return newUser;
    }
  }


  async update(
    param: UpdateUserDto,
    files: dataPhotos,
  ): Promise<any | String> {
    const user = await this.userService.findOne(
      Number(param.user_id),
    );




    const error: string[] = [];

    let urlPhoto
    if (files) {
      if (!files.photos || !files.photos[0]) {
        error.push('images is missing.');
      }
      const photos = files.photos[0];
      if (photos.mimetype.search('image/') === -1) {
        error.push('image must be an image');
      }
      if (photos.buffer.byteLength > 5e6) {
        error.push('image must be lower than 6Mb');
      }

      if (process.env.SERVER_OS === "WINDOWS") {
        const photosPath = `images\\photos${new Date().valueOf()
          }_${Date.now()}.png`;
        fs.writeFileSync(
          `${process.cwd()}\\${photosPath}`,
          photos.buffer,
        );
        urlPhoto = photosPath;



      } else {
        const photosPath = `images/photos${new Date().valueOf()
          }_${Date.now()}.png`;
        fs.writeFileSync(
          `${process.env.PWD}/${photosPath}`,
          photos.buffer,
        );
        urlPhoto = photosPath;
      }
    }
    console.log(user)


    if (user) {
      if (param.name) {
        user.name = param.name
      }
      if (param.address) {
        user.address = param.address
      }
      if (param.email) {
        const checkEmail = await this.userService.findUserByEmail(
          param.email.toLowerCase(),
        );
        if (checkEmail) {
          return "Email Already Exist";
        }
        user.email = param.email
      }
      if (param.password) {
        const salt = bcrypt.genSaltSync(UserAuthService.saltRounds);
        const hash = bcrypt.hashSync(param.password, salt);
        user.password = hash
      }
      if (files) {
        user.photos = urlPhoto
      }
      if (param.creditcard_type) {
        user.creditcard_type = param.creditcard_type
      }
      if (param.creditcard_number) {
        user.creditcard_number = param.creditcard_number
      }
      if (param.creditcard_name) {
        user.creditcard_name = param.creditcard_name
      }
      if (param.creditcard_expired) {
        user.creditcard_expired = param.creditcard_expired
      }
      if (param.creditcard_cvv) {
        user.creditcard_cvv = param.creditcard_cvv
      }
      await user.save()
      return user
    } else {
      throw new BadRequestException('user not found!');
    }
  }



  async validateUser(
    email: string,
    password: string,
  ): Promise<{ validated: boolean; user: User }> {
    const user = await this.findUserByEmail(email.toLowerCase());
    if (user) {
      return { validated: await bcrypt.compare(password, user.password), user };
    }
    return { validated: false, user };
  }



  async loginUser(
    email: string,
    password: string,
  ): Promise<{ accessToken: string } | false> {
    const validate = await this.validateUser(email, password);
    if (validate.validated) {
      const id = validate.user.user_id

      //activating user
      validate.user.dateConfirmed = new Date()
      validate.user.save()

      //give token
      const payload = { id };
      return {
        accessToken: this.jwtService.sign(payload, {
          secret: jwtConstants.UserSecret,
        }),
      };
    }
    return false;
  }
}
