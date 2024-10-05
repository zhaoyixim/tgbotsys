import { Module } from '@nestjs/common';
import { TgbotsService } from './tgbots.service';
import { TgbotsController } from './tgbots.controller';

@Module({
  controllers: [TgbotsController],
  providers: [TgbotsService]
})
export class TgbotsModule {}
