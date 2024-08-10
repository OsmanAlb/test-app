import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploadService } from './image-upload.service';
import { BufferedFile } from '../minio-client/file.module';

@Controller('image-upload')
export class ImageUploadController {
  constructor(private imageUploadService: ImageUploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() image: BufferedFile) {
    const result = await this.imageUploadService.uploadImage(image);
    return result && this.imageUploadService.saveImage(image);
  }
}
