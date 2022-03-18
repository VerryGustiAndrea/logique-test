import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsOptional,
  IsMobilePhone,
  IsDateString,
  IsEthereumAddress,
  IsBtcAddress,
  ValidateNested,
  IsAlphanumeric,
  IsAlpha,
  MinLength,
  MaxLength,
} from 'class-validator';
import { PasswordConfirmation } from '@/library/password-confirmation.validation';

export default class UpdateProfileRequestDto {
  @ApiProperty()
  @IsOptional()
  name: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty()
  email: string;

  @IsOptional()
  @ApiPropertyOptional({ required: false })
  @IsString()
  @MinLength(6)
  oldPassword?: string;

  @IsOptional()
  @ApiPropertyOptional({ required: false })
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @ApiPropertyOptional({ required: false })
  @PasswordConfirmation('password', {
    message: 'Invalid password confirmation',
  })
  @IsString()
  @MinLength(6)
  passwordConfirmation?: string;

}
