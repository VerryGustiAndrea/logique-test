import { ApiProperty } from '@nestjs/swagger';
import {
    IsIn,
} from 'class-validator';

export default class UserListDto {

    @ApiProperty()
    q: string;

    @ApiProperty()
    ob: string;

    @ApiProperty()
    sb: string;

    @ApiProperty()
    of: string;

    @ApiProperty()
    lt: string;
}