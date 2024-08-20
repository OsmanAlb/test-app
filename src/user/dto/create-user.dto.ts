import { ApiProperty } from '@nestjs/swagger';
import {
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import Decimal from 'decimal.js';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty()
  password: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  age: number;

  @IsDecimal()
  @IsNotEmpty()
  @ApiProperty()
  @Transform(({ value }) => value.toString())
  balance: Decimal;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  @ApiProperty()
  description: string;
}
