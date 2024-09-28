import { Module } from '@nestjs/common';
import { DepositLogService } from './deposit-log.service';
import { DepositLogController } from './deposit-log.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DepositlogDefinition } from 'src/common/models/depositlog.model';

@Module({
  imports:[MongooseModule.forFeature([DepositlogDefinition])],
  controllers: [DepositLogController],
  providers: [DepositLogService],
  exports:[DepositLogService]
})
export class DepositLogModule {}
