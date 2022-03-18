import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
   IsEmail,
   IsNotEmpty,
} from 'class-validator';
export default class CreateUserDto {

   @IsNotEmpty()
   @ApiProperty()
   name: string;

   @IsNotEmpty()
   @IsEmail()
   @ApiProperty()
   email: string;

   @IsNotEmpty()
   @ApiProperty()
   password: string;


   @ApiProperty({ type: 'string', format: 'binary' })
   photos: Photos[];


   @IsNotEmpty()
   @ApiProperty()
   address: string;


   @IsNotEmpty()
   @ApiProperty()
   creditcard_type: string;


   @IsNotEmpty()
   @ApiProperty()
   creditcard_number: string;

   @IsNotEmpty()
   @ApiProperty()
   creditcard_name: string;


   @IsNotEmpty()
   @ApiProperty()
   creditcard_expired: string;


   @IsNotEmpty()
   @ApiProperty()
   creditcard_cvv: string;

}

class Photos {
   fieldname: string;
   originalname: string;
   encoding: string;
   mimetype: string;
   buffer: Buffer;
}

export class dataPhotos {
   photos: Photos[];

}