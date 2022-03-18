import { ApiProperty } from '@nestjs/swagger';
class LoginDataInterface {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  pin: string;
}

class LoginMetaInterface { }

export default class LoginAdminResponse {
  @ApiProperty()
  data: LoginDataInterface;

  @ApiProperty({ example: 'Successfully Logged in' })
  message = 'Successfully Logged in';

  @ApiProperty()
  meta: LoginMetaInterface;

  @ApiProperty({ example: 200 })
  statusCode: number;
}
