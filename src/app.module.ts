import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MinioClientModule } from './features/minio-client/minio-client.module';
import { ImageUploadModule } from './features/image-upload/image-upload.module';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import * as process from 'node:process';

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
    UsersModule,
    AuthModule,
    MinioClientModule,
    ImageUploadModule,
    ConfigModule.forRoot(),
  ],
})
export class AppModule {}
