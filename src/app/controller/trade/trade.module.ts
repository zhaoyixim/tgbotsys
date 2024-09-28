import { Module } from '@nestjs/common';
import { TradeService } from './trade.service';
import { TradeController } from './trade.controller';
import { MemberModule } from '../member';
import { BidModule } from '../bid/bid.module';
import { SysModule } from 'src/backend/controller/sys/sys.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TradeOrderDefinition } from 'src/common/models/trade/tradeorder.model';
import { InitModule } from 'src/common/modules/transaction/init.module';
import { DepositLogModule } from '../deposit-log/deposit-log.module';
import { CollectDefinition } from 'src/common/models/collect.model';

@Module({
  imports:[BidModule,
    InitModule,
    DepositLogModule,
    MemberModule,
    SysModule,
    MongooseModule.forFeature([TradeOrderDefinition]),
    MongooseModule.forFeature([CollectDefinition]),
    
  ],
  controllers: [TradeController],
  providers: [TradeService],
  exports:[TradeService]
})
export class TradeModule {}
