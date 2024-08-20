import { Body, Controller, Post } from '@nestjs/common';
import { BalanceService } from './balance.service';

@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}
  @Post('transfer')
  async transferBalance(
    @Body() body: { toUserId: number; fromUserId: number; amount: number },
  ) {
    await this.balanceService.transferBalance(
      body.fromUserId,
      body.toUserId,
      body.amount,
    );
    return { message: 'Transfer successfully' };
  }
}
