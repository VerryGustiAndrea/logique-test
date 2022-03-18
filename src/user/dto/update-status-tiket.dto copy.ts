import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsIn
} from 'class-validator';

export default class UpdateStatusTiketRequest {

    @ApiProperty({ example: 'waiting approval', enum: ['waiting approval', 'resend format', 'waiting evidence', 'evidence available', 'approved', 'rejected'] })
    @IsNotEmpty()
    @IsIn(['waiting approval', 'resend format', 'waiting evidence', 'evidence available', 'approved', 'rejected'])
    status: 'waiting approval' | 'resend format' | 'waiting evidence' | 'evidence available' | 'approved' | 'rejected';
}