import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class ResetBalanceService {
  constructor(@InjectQueue('reset-balance') private readonly queue: Queue) {}

  async addResetBalanceJob() {
    await this.queue.add('reset-balance', {});
    // console.log(this.queue.add('reset-balance', {}));
  }
}
