import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsIn
} from 'class-validator';

export default class InboxRequest {

    @ApiProperty()
    page: number;

    @ApiProperty()
    perPage: number;
}