import { IsEmail, IsInt, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsInt()
  age: number;

  @IsString()
  @MaxLength(1000)
  description: string;
}
