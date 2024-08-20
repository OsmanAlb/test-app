import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BalanceService {
  constructor(private readonly prisma: PrismaService) {}

  async transferBalance(
    fromUserId: number,
    toUserId: number,
    amount: number,
  ): Promise<void> {
    // Округление суммы до двух знаков после запятой
    amount = parseFloat(amount.toFixed(2));

    if (amount <= 0) {
      throw new BadRequestException('Transfer amount must be positive');
    }

    await this.prisma.$transaction(async (prisma) => {
      // Получение данных пользователя-отправителя
      const fromUser = await prisma.user.findUnique({
        where: { id: fromUserId },
      });

      if (!fromUser) {
        throw new BadRequestException(`User with ID ${fromUserId} not found`);
      }

      // Округление баланса отправителя до двух знаков после запятой
      const fromUserBalance = parseFloat(fromUser.balance.toFixed(2));

      if (fromUserBalance < amount) {
        throw new BadRequestException(
          `Insufficient balance for user ID ${fromUserId}`,
        );
      }

      // Обновление баланса отправителя
      await prisma.user.update({
        where: { id: fromUserId },
        data: { balance: parseFloat((fromUserBalance - amount).toFixed(2)) },
      });

      // Получение данных пользователя-получателя
      const toUser = await prisma.user.findUnique({
        where: { id: toUserId },
      });

      if (!toUser) {
        throw new BadRequestException(`User with ID ${toUserId} not found`);
      }

      // Округление баланса получателя до двух знаков после запятой
      const toUserBalance = parseFloat(toUser.balance.toFixed(2));

      // Обновление баланса получателя
      await prisma.user.update({
        where: { id: toUserId },
        data: { balance: parseFloat((toUserBalance + amount).toFixed(2)) },
      });
    });
  }
}
