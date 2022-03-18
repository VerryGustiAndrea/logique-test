import { ApiProperty } from '@nestjs/swagger';

export default class InvalidLoginAdminResponse {
  @ApiProperty({ example: 400 })
  statusCode: 400;

  @ApiProperty({ example: 'Invalid email or password' })
  message: 'Invalid email or password';
}
