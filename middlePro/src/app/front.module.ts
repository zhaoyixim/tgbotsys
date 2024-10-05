import { Module } from '@nestjs/common';
import { TgbotsModule } from './controller/tgbots/tgbots.module';


@Module({
  imports: [ 
    TgbotsModule,
  ], 
  providers:[]
})
export class FrontModule {}
