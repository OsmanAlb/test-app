import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MinioClientModule } from './features/minio-client/minio-client.module';
import { ImageUploadModule } from './features/image-upload/image-upload.module';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import * as process from 'node:process';
import { BalanceModule } from './features/balance-transfer/balance.module';
import { ResetBalanceModule } from './balance-reset/balance-reset.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      ttl: 30, // cache lifetime
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    MinioClientModule,
    ImageUploadModule,
    BalanceModule,
    ConfigModule.forRoot(),
    ResetBalanceModule,
  ],
})
export class AppModule {}
