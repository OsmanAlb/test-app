import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploadService } from './image-upload.service';
import { BufferedFile } from '../minio-client/file.module';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('image-upload')
export class ImageUploadController {
  constructor(private imageUploadService: ImageUploadService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile() image: BufferedFile,
    @Body() body: any,
    @Request() req: any,
  ) {
    console.log('Request user:', req.user);

    if (!req.user || !req.user.id) {
      throw new BadRequestException('User not authenticated');
    }

    if (!image) {
      throw new BadRequestException('Image is required');
    }

    const result = await this.imageUploadService.uploadImage(image);
    const userId = req.user.id;
    return result && this.imageUploadService.saveImage(image, userId);
  }
}
