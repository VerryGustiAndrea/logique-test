import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
   IsEmail,
   IsNotEmpty,
   IsOptional,
} from 'class-validator';
export default class CreateUserDto {

   @IsNotEmpty()
   @ApiProperty()
   user_id: string;

   @IsOptional()
   @ApiProperty()
   name: string;

   @IsOptional()
   @IsEmail()
   @ApiProperty()
   email: string;

   @IsOptional()
   @ApiProperty()
   password: string;


   @ApiProperty({ type: 'string', format: 'binary' })
   photos: Photos[];


   @IsOptional()
   @ApiProperty()
   address: string;


   @IsOptional()
   @ApiProperty()
   creditcard_type: string;


   @IsOptional()
   @ApiProperty()
   creditcard_number: string;

   @IsOptional()
   @ApiProperty()
   creditcard_name: string;


   @IsOptional()
   @ApiProperty()
   creditcard_expired: string;


   @IsOptional()
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