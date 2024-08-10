import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from './file.module';
import * as crypto from 'crypto';

@Injectable()
export class MinioClientService {
  private readonly logger: Logger;
  private readonly bucketName = process.env.MINIO_BUCKET_NAME;

  constructor(
    private readonly minio: MinioService,
    // private readonly prisma: PrismaService,
  ) {
    this.logger = new Logger('MinioService');
  }

  public get client() {
    return this.minio.client;
  }

  public async upload(
    file: BufferedFile,
    bucketName: string = this.bucketName,
  ) {
    if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
      throw new HttpException(
        'File type not supported',
        HttpStatus.BAD_REQUEST,
      );
    }
    const timestamp = Date.now().toString();
    const hashedFileName = crypto
      .createHash('md5')
      .update(timestamp)
      .digest('hex');
    const extension = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    );
    // const metaData = {
    //   'Content-Type': file.mimetype,
    // };
    // We need to append the extension at the end otherwise Minio will save it as a generic file
    const fileName = hashedFileName + extension;
    this.client.putObject(bucketName, fileName, file.buffer, function (err) {
      if (err) {
        throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
      }
    });
    return {
      url: `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET_NAME}/${fileName}`,
    };
  }

  async create(file: BufferedFile, bucketName: string = this.bucketName) {
    const timestamp = Date.now().toString();

    const hashedFileName = crypto
      .createHash('md5')
      .update(timestamp)
      .digest('hex');
    const extension = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    );

    const fileName = hashedFileName + extension;
    this.client.putObject(bucketName, fileName, file.buffer, function (err) {
      if (err) {
        throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
      }
    });
    return {
      url: `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET_NAME}/${fileName}`,
    };
  }

  async delete(objectName: string, bucketName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.removeObject(bucketName, objectName, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }
}
