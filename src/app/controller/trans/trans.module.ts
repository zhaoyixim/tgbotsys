import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { TransController } from './trans.controller';
import { TransService } from './trans.service';
import { FundDefinition } from 'src/common/models/fund.model';
import { DepositDefinition } from 'src/common/models/deposit.model';
import { OrderDefinition } from 'src/common/models/order.model';
import { SysModule } from 'src/backend/controller/sys/sys.module';
import { WithdrawDefinition } from 'src/common/models/withdraw.model';
import { MemberModule } from '../member';
import { InitModule } from 'src/common/modules/transaction/init.module';
import { ExchangeDefinition } from 'src/common/models/exchange.model';
import { UploadModule } from 'src/common/modules/upload/upload.module';

@Module({
  imports: [
    MongooseModule.forFeature([FundDefinition]),
    MongooseModule.forFeature([DepositDefinition]),
    MongooseModule.forFeature([OrderDefinition]),
    MongooseModule.forFeature([WithdrawDefinition]),
    MongooseModule.forFeature([ExchangeDefinition]),
    InitModule,
    SysModule,
    MemberModule,  
    UploadModule  
  ],
  controllers: [TransController],
  providers: [TransService],
  exports:[TransService],
})
export class TransModule {}
