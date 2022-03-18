import { PasswordConfirmation } from '@/library/password-confirmation.validation';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export default class ResetPasswordDto {
  @MinLength(6)
  @IsNotEmpty()
  @ApiProperty({ required: true })
  @IsOptional()
  password: string;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  @PasswordConfirmation('password', {
    message: 'Invalid password confirmation',
  })
  passwordConfirmation: string;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  secret: string;
}
