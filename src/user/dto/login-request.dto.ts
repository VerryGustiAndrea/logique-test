import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export default class LoginAdminRequestDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'admin@admin.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'admin' })
  password: string;

  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsNotEmpty()
  // @ApiProperty({ example: 'twoFaAuthToken' })
  // token: string;
}
