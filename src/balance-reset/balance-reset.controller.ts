import { Controller, Post } from '@nestjs/common';
import { ResetBalanceService } from './balance-reset.service';

@Controller('balance-reset')
export class ResetBalanceController {
  constructor(private readonly resetBalanceService: ResetBalanceService) {}

  @Post()
  async resetBalance() {
    await this.resetBalanceService.addResetBalanceJob();
    return 'Job запущен';
  }
}
