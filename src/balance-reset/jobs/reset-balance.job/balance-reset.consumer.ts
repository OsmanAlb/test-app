import { Injectable } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PrismaClient } from '@prisma/client';

@Injectable()
@Processor('reset-balance')
export class ResetBalanceConsumer {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  @Process('reset-balance')
  async resetBalance(job: Job) {
    await this.prisma.user.updateMany({
      data: {
        balance: 0,
      },
    });
    console.log(job.data);
    console.log('Баланс всех пользователей обнулен');
  }
}
