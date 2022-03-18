import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export default class UserTopupDto {

   @ApiProperty()
   credits: number;
}