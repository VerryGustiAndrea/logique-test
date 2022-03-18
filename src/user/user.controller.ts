import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Logger,
  Get,
  Request,
  Param,
  Put,
  Patch,
  Delete,
  forwardRef,
  Inject,
  BadRequestException,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor
} from '@nestjs/platform-express';
import { UserService } from './user.service';
import UserAuthService from '../user-auth/user-auth.service';
import { ApiResponse, ApiBearerAuth, ApiTags, ApiConsumes, } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto, LoginUserRequestDto, InboxRequest, UpdateStatusTiketRequest, UserListDto } from './dto/index';
import { dataPhotos } from '@/user/dto/create-user.dto';
import {
  LoginUserResponse,
  InvalidLoginUserResponse
} from './response/index';
import { Response, ErrorResponse } from '../library';
import { UserAuthGuard } from '@/user-auth/user-auth.guard';
import { spliceStr } from 'sequelize/types/lib/utils';
// import { TransactionService } from '@/transaction/transaction.service';
import axios from 'axios';


@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
    private userAuthService: UserAuthService,
    // public transactionService: TransactionService,
  ) { }

  @Post('/register')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photos', maxCount: 5 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @HttpCode(201)
  async register(@Body() body: CreateUserDto, @UploadedFiles() files: dataPhotos) {
    console.log(files)
    const response = await this.userAuthService.register(body, false, files);

    if (response !== "Email Already Exist" && response
      !== "User Name Already Exist") {
      const user = JSON.stringify(response);
      const userData = JSON.parse(user) as any;
      delete userData.password;
      return Response({ user_id: userData.user_id }, 'User created', 200);
    } else if (response === "Email Already Exist") {
      return ErrorResponse('Email Already exist', HttpStatus.BAD_REQUEST);
    } else {
      return ErrorResponse('User Name Already exist', HttpStatus.BAD_REQUEST);
    }
  }


  @Get('/list')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  async listUser(@Query() param: UserListDto) {
    const data = await this.userService.listUser(param,
      {
        exclude: ['password', 'resetPassword'],
      }
    );
    return Response(data, 'OK', 200);
  }

  @Get('/:id')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  async userDetail(@Param('id') id: number) {
    const data = await this.userService.detail(id);
    return Response(data, 'OK', 200);
  }


  @Post('/login')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Successfully login',
    type: LoginUserResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid email or password',
    type: InvalidLoginUserResponse,
  })
  async login(@Body() body: LoginUserRequestDto) {
    const response = await this.userAuthService.loginUser(
      body.email,
      body.password,
    );
    if (response !== false) {
      return Response(response, 'Successfully Logged in', 200);
    } else {
      return ErrorResponse('Invalid email or password', 400);
    }
  }


  @Patch()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photos', maxCount: 5 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @HttpCode(201)
  async update(@Body() body: UpdateUserDto, @UploadedFiles() files: dataPhotos) {
    const response = await this.userAuthService.update(body, files);

    if (response !== "Email Already Exist" && response
      !== "User Name Already Exist") {
      const user = JSON.stringify(response);
      const userData = JSON.parse(user) as any;
      delete userData.password;
      return Response({ succes: true }, 'User created', 200);
    } else if (response === "Email Already Exist") {
      return ErrorResponse('Email Already exist', HttpStatus.BAD_REQUEST);
    } else {
      return ErrorResponse('User Name Already exist', HttpStatus.BAD_REQUEST);
    }
  }




  // @Delete('/delete/:id')
  // @HttpCode(201)
  // async delete(@Param('id') id: number) {
  //   const response = await this.userAuthService.deleteAdmin(id);
  //   // if (response !== false) {
  //   if (response) {
  //     return Response({}, 'OK', 201);
  //   } else {
  //     return ErrorResponse('Error Delete Staff', HttpStatus.BAD_REQUEST);
  //   }
  // }




  //   @Post('/updateStatus/:id')
  //   @UseGuards(UserAuthGuard)
  //   @ApiBearerAuth()
  //   @HttpCode(200)
  //   async updateStatus(@Body() body: UpdateStatusTiketRequest, @Request() req: any, @Param('id') id: number) {

  //     let checkTiket = await this.tiketService.findOne(id);

  //     //validator
  //     if (body.status == 'resend format') {
  //       if (checkTiket.status !== 'waiting approval') {
  //         throw new BadRequestException("Only ticket with waiting approval status can be update!");
  //       }
  //     }
  //     if (body.status == 'waiting evidence') {
  //       if (checkTiket.status !== 'waiting approval') {
  //         throw new BadRequestException("Only ticket with waiting approval status can be update!");
  //       }
  //     }
  //     if (body.status == 'approved') {
  //       if (checkTiket.status !== 'evidence available') {
  //         throw new BadRequestException("Only ticket with evidence available status can be update!");
  //       }
  //     }
  //     if (body.status == 'rejected') {
  //       if (checkTiket.status !== 'evidence available') {
  //         throw new BadRequestException("Only ticket with evidence available status can be update!");
  //       }
  //     }

  //     //handle tiket assign
  //     if (checkTiket.id_admin) {
  //       if (checkTiket.id_admin !== req.user.id) {
  //         throw new BadRequestException("Tiket Already Assign to antoher admin");
  //       }
  //     }

  //     checkTiket.status = body.status
  //     await checkTiket.save()

  //     let message = ''
  //     if (checkTiket.status == 'approved' || checkTiket.status == 'rejected' || checkTiket.status == 'waiting evidence' || checkTiket.status == 'resend format') {
  //       if (checkTiket.status == 'approved') {
  //         message = `Foto evidence penggunaan material telah diapprove.

  // Salam,
  // Tri`
  //       } else if (checkTiket.status == 'rejected') {
  //         message = `Evidence telah di Reject! Mohon kirim ulang dari awal.`
  //       } else if (checkTiket.status == 'waiting evidence') {
  //         message =
  //           `Terima kasih. Laporan Anda sudah sesuai format. 

  // Silahkan mengirimkan foto penggunaan material.`
  //       } else if (checkTiket.status == 'resend format') {
  //         message = `Format Salah! Mohon sesuaikan Format yang sudah diberikan`
  //       }


  //       //send telegram bo message
  //       try {
  //         const url = "http://8.214.18.134:4002/sendText";
  //         const data = {
  //           telegramId: checkTiket.teknisi.telegramId,
  //           text: message
  //         }
  //         const sendMessage = await axios({
  //           method: "post",
  //           url: url,
  //           data: data
  //         });
  //       } catch (error) {
  //         console.log("error send message telegram")
  //       }

  //     }


  //     return Response(checkTiket, 'OK', 200);
  //     // if (data) {
  //     //   return Response(data, 'OK', 200);
  //     // } else {
  //     //   throw new BadRequestException(data);
  //     // }
  //   }



  // @Get()
  // @UseGuards(UserAuthGuard)
  // @ApiBearerAuth()
  // @HttpCode(200)
  // async findAll() {
  //   const data = await this.adminService.findAll(
  //     {
  //       exclude: ['password', 'resetPassword'],
  //     }
  //   );
  //   return Response(data, 'OK', 200);
  // }


  // @Post('profile/update')
  // @UseGuards(UserAuthGuard)
  // @ApiBearerAuth()
  // @HttpCode(200)
  // async updateProfile(
  //   @Body() body: UpdateProfileRequestDto,
  //   @Request() req: any,
  // ) {
  //   const response = await this.adminService.updateProfile(body, req.user);
  //   if (response.message.length) {
  //     return Response(
  //       { admin: response.admin },
  //       `${response.message.join(', ')} has been updated successfully`,
  //       201,
  //     );
  //   }
  //   return ErrorResponse('Nothing updated', HttpStatus.BAD_REQUEST);
  // }

  // @Post('/password/forgot')
  // @HttpCode(200)
  // @ApiResponse({
  //   status: 200,
  //   description:
  //     'We`ll send you a reset password link if your email found or our system',
  // })
  // async forgotPassword(@Body() params: ResendConfirmationDto) {
  //   await this.adminService.forgotPassword(params.email);
  //   return Response(
  //     {},
  //     'We`ll send you a reset password link if your email found or our system', 200
  //   );
  // }

  // @Post('/password/reset')
  // @HttpCode(200)
  // @ApiResponse({
  //   status: 200,
  //   description: 'Password has been updated successfully',
  // })
  // async resetPassword(@Body() params: ResetPasswordDto) {
  //   await this.adminService.resetPassword(params.secret, params.password);
  //   return Response({}, 'Password has been updated successfully', 200);
  // }


}
