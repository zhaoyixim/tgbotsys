import { Module } from '@nestjs/common';
import { TrademanagerService } from './trademanager.service';
import { TrademanagerController } from './trademanager.controller';
import { TradeModule } from 'src/app/controller/trade/trade.module';
import { BidModule } from 'src/app/controller/bid/bid.module';
import { VchatModule } from 'src/app/controller/vchat/vchat.module';
import { MemberModule } from 'src/app/controller/member';

@Module({
  imports:[TradeModule,BidModule,VchatModule,MemberModule],
  controllers: [TrademanagerController],
  providers: [TrademanagerService],  
})
export class TrademanagerModule {}
