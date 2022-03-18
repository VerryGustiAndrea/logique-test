import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, LoginUserRequestDto, UpdateProfileRequestDto, UserListDto } from './dto/index';
import { Sequelize } from 'sequelize-typescript';
import { User } from './user.model';
import { InjectModel } from '@nestjs/sequelize';
import { FindAttributeOptions, Op } from 'sequelize';
import * as randomstring from 'randomstring';
import { RegisterRequest } from './entities/register-request.entity';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) public userModel: typeof User,
    public readonly mailerService: MailerService,
    public sequelize: Sequelize,

  ) {
  }

  static saltRounds = 10;

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({
      where: {
        email
      },
    });
  }


  async findOneByName(
    name: string,
    attributes: FindAttributeOptions,
  ): Promise<User | null> {
    return await this.userModel.findOne({
      where: {
        name
      },
      attributes,
    });
  }



  async create(
    param: RegisterRequest,
    autoConfirm = false,
    plainPassword = '',
  ): Promise<User> {
    const createdUser = new this.userModel({
      email: param.email,
      password: param.password,
      address: param.address,
      name: param.name,
      photos: param.photos,
      creditcard_type: param.creditcard_type,
      creditcard_number: param.creditcard_number,
      creditcard_name: param.creditcard_name,
      creditcard_expired: param.creditcard_expired,
      creditcard_cvv: param.creditcard_cvv,
      confirmationId: randomstring.generate({
        length: 45,
        charset: 'alphabetic',
      }),
      dateConfirmed: new Date(),
    });
    const user = await createdUser.save();

    return user;
  }

  async findAll(attributes: FindAttributeOptions,
  ): Promise<User[] | null> {
    return await this.userModel.findAll({
      attributes,
    });
  }


  async listUser(
    param: UserListDto,
    attributes: FindAttributeOptions
  ): Promise<{ count: number, rows: User[] }> {
    let whereParam = {};
    if (param.q) {
      Object.assign(whereParam, {
        [Op.or]: [
          { name: { [Op.like]: `%${param.q}%` } },
          { email: { [Op.like]: `%${param.q}%` } },
        ]
      });
    }

    // if (param.role) {
    //   Object.assign(whereParam, { role: param.role });
    // }
    console.log(whereParam)
    const list = await this.userModel.findAndCountAll(
      {
        where: whereParam,
        offset: (Number(param.of)),
        limit: Number(param.lt),
        order: [[param.ob, param.sb]],
        attributes
      });
    console.log(list.rows.length)

    let dataFinal = []
    for (let index = 0; index < list.rows.length; index++) {
      const e = list.rows[index];
      const data = {
        user_id: e.user_id,
        name: e.name,
        email: e.email,
        address: e.address,
        photos: e.photos,
        creditcard: {
          type: e.creditcard_type,
          number: e.creditcard_number,
          name: e.creditcard_name,
          expired: e.creditcard_expired,
        }
      }
      dataFinal.push(data)
    }

    return { count: list.count, rows: dataFinal };
  }


  async updateProfile(
    param: UpdateProfileRequestDto,
    user: User,
    iAmAdmin = false,
  ): Promise<{ user: User; message: string[] }> {
    const message = [];

    if (param.email) {
      user.email = param.email;
      message.push('email');
    }

    if (param.password) {
      if (!iAmAdmin) {
        if (!param.oldPassword) {
          throw new HttpException('Previous password is required!', HttpStatus.BAD_REQUEST);
        }
        const user2 = await this.userModel.findOne({
          where: { id: user.id },
        });
        const passwordCompare = await bcrypt.compare(
          param.oldPassword,
          user2.password,
        );
        if (!passwordCompare)
          throw new HttpException('Invalid current password!', HttpStatus.BAD_REQUEST);

      }
      const salt = bcrypt.genSaltSync(UserService.saltRounds);
      const hash = bcrypt.hashSync(param.password, salt);
      user.password = hash;
      message.push('password');


    }

    if (message.length) {
      await user.save();
    }
    // console.log(user)

    return { user, message };
  }



  async forgotPassword(email: string) {
    new Promise(async (resolve, reject) => {
      const user = await this.userModel.findOne({
        where: { email: email.toLowerCase(), },

      });
      console.log(user, 'user');
      if (user) {
        user.resetPassword = randomstring.generate({
          length: 255,
          charset: 'alphabetic',
        });
        await user.save();
        let link = `${process.env.FRONT_END_USER_URL}/auth/change-password?secret=${user.resetPassword}`
        if (process.env.PRODUCTION == "false") {
          link = `${process.env.FRONT_END_PROD_USER_URL}/auth/change-password?secret=${user.resetPassword}`
        }
        await this.mailerService
          .sendMail({
            to: user.email,
            from: process.env.SMPT_NOREPLY,
            subject: 'Reset your password',
            template: './forgot-password',
            context: {
              // Data to be sent to template engine.
              name: user.name,
              resetPassword: user.resetPassword,
              link: link,
            },
          })


          // .then(() => {})
          .catch((err) => {
            console.error(err, 'resendEmailConfirmationEmailError');
            reject(err);
          });
      }
      resolve(true);
    });
    return true;
  }

  async resetPassword(secret: string, newPassword: string) {
    const user = await this.userModel.findOne({
      where: {
        resetPassword: secret,
      },
    });
    console.log(user)
    if (!user) {
      throw new HttpException('Invalid secret : user not found!', HttpStatus.BAD_REQUEST);
    }
    const salt = bcrypt.genSaltSync(UserService.saltRounds);
    const hash = bcrypt.hashSync(newPassword, salt);
    user.password = hash;
    await user.save();
    return user;
  }



  async findOne(id: number) {

    return await this.userModel.findOne({
      where: {
        user_id: id
      },
    });
  }


  async detail(id: number) {

    const get = await this.userModel.findOne({
      where: {
        user_id: id
      },
    });
    const data = {
      user_id: get.user_id,
      name: get.name,
      email: get.email,
      address: get.address,
      photos: get.photos,
      creditcard: {
        type: get.creditcard_type,
        number: get.creditcard_number,
        name: get.creditcard_name,
        expired: get.creditcard_expired,
      }
    }
    return data
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
