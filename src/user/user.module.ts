import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommonModule } from 'helpers/common.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [PrismaModule, CommonModule],
  exports: [UserService],
})
export class UserModule {}
