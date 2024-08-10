import { Injectable } from '@nestjs/common';
import { MinioClientService } from '../minio-client/minio-client.service';
import { BufferedFile } from '../minio-client/file.module';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ImageUploadService {
  constructor(
    private minioClientService: MinioClientService,
    private readonly prisma: PrismaService,
  ) {}

  async uploadImage(image: BufferedFile) {
    const uploaded_image = await this.minioClientService.upload(image);

    // const saved_image = await this.prisma.image.create({
    //   data: {
    //     imageUrl: uploaded_image.url,
    //     userId,
    //   },
    // });
    return {
      image_url: uploaded_image.url,
      message: 'Image upload successful',
    };
  }

  async saveImage(image: BufferedFile, userId: number) {
    const uploaded_image = await this.minioClientService.upload(image);

    const saved_image = await this.prisma.image.create({
      data: {
        imageUrl: uploaded_image.url,
        userId: userId,
      },
    });
    return {
      image_url: saved_image.imageUrl,
      message: 'Image upload successful',
    };
  }
}
