import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import Decimal from 'decimal.js';

export class UserEntity implements User {
  @ApiProperty()
  id: number;
  @ApiProperty()
  balance: Decimal;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  deletedAt: Date;
  @ApiProperty()
  name: string;
  @ApiProperty()
  age: number;
  @ApiProperty()
  description: string;
  @ApiProperty()
  email: string;
  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  toJSON() {
    return {
      ...this,
      balance: this.balance.toString(), // Преобразование Decimal в строку
    };
  }
}

/** {
 "email": "noctis@example.com",
 "password": "nightfall",
 } */
