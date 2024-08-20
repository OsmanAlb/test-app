import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ResetBalanceService } from './balance-reset.service';
import { ResetBalanceController } from './balance-reset.controller';
import { PrismaService } from '../prisma/prisma.service';
import * as process from 'node:process';
import { ResetBalanceConsumer } from './jobs/reset-balance.job/balance-reset.consumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'reset-balance',
      redis: {
        port: parseInt(process.env.REDIS_PORT),
        host: process.env.REDIS_HOST,
      },
    }),
  ],
  controllers: [ResetBalanceController],
  providers: [ResetBalanceService, ResetBalanceConsumer, PrismaService],
})
export class ResetBalanceModule {}
