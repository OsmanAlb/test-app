import { Module } from '@nestjs/common';
import { UsersService } from './app.service';
import { UsersController } from './app.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommonModule } from 'helpers/common.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [PrismaModule, CommonModule],
  exports: [UsersService]
})
export class UsersModule {}
