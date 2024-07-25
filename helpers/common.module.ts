import { Module } from '@nestjs/common';
import { ParseStringPipe } from './stringPipe';

@Module({
  providers: [ParseStringPipe],
  exports: [ParseStringPipe],
})
export class CommonModule {}