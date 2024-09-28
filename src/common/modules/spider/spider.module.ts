import { Module } from '@nestjs/common';
import { SpiderService } from './spider.helper';

@Module({
  providers: [SpiderService],
  exports: [SpiderService],
})
export class SpiderModule {}