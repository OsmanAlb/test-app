import { Module } from '@nestjs/common';
import { MinioClientModule } from '../minio-client/minio-client.module';
import { ImageUploadController } from './image-upload.controller';
import { ImageUploadService } from './image-upload.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [MinioClientModule],
  controllers: [ImageUploadController],
  providers: [ImageUploadService, PrismaService],
})
export class ImageUploadModule {}
