import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MinioClientModule } from './features/minio-client/minio-client.module';
import { ImageUploadModule } from './features/image-upload/image-upload.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    MinioClientModule,
    ImageUploadModule,
    ConfigModule.forRoot(),
  ],
})
export class AppModule {}
