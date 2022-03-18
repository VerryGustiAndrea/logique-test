
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Model,
  Table,
  AutoIncrement,
  DataType,
  CreatedAt,
  UpdatedAt,
  AllowNull,
  HasMany,
  PrimaryKey,
} from 'sequelize-typescript';

@Table
export class User extends Model {

  @ApiProperty()
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.BIGINT })
  user_id: number;

  @ApiProperty()
  @Column({ type: DataType.STRING })
  name: string;

  @ApiProperty()
  @Column({ type: DataType.STRING })
  address: string;


  @ApiProperty()
  @Column({ type: DataType.STRING })
  email: string;

  @ApiProperty()
  @Column({ type: DataType.STRING })
  password: string;

  @ApiProperty()
  @Column({ type: DataType.STRING })
  photos: string;

  @ApiProperty()
  @Column({ type: DataType.STRING })
  resetPassword: string;

  @ApiProperty()
  @Column({ type: DataType.STRING })
  confirmationId: string;

  @ApiProperty()
  @Column({ type: DataType.STRING })
  creditcard_type: string;

  @ApiProperty()
  @Column({ type: DataType.BIGINT })
  creditcard_number: string;

  @ApiProperty()
  @Column({ type: DataType.BIGINT })
  creditcard_name: string;

  @ApiProperty()
  @Column({ type: DataType.BIGINT })
  creditcard_expired: string;


  @ApiProperty()
  @Column({ type: DataType.BIGINT })
  creditcard_cvv: string;

  @ApiProperty()
  @AllowNull(true)
  @Column({ type: DataType.DATE })
  dateConfirmed: Date;

  @ApiProperty()
  @CreatedAt
  @Column({ type: DataType.DATE })
  createdAt!: Date;

  @ApiProperty()
  @UpdatedAt
  @Column({ type: DataType.DATE })
  updatedAt!: Date;
}
