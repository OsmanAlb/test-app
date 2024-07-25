import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseStringPipe implements PipeTransform<any, string> {
  transform(value: any): string {
    if (typeof value !== 'string') {
      throw new BadRequestException('Validation failed (string is expected)');
    }
    return value;
  }
}