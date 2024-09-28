import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports:[DashboardService],
})
export class DashboardModule {}
