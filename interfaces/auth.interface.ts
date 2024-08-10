import { ApiProperty } from '@nestjs/swagger';

export class AuthInterface {
  @ApiProperty()
  accessToken: string;
}
