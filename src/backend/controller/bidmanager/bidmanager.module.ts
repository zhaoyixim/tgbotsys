import { Module } from '@nestjs/common';
import { BidmanagerService } from './bidmanager.service';
import { BidmanagerController } from './bidmanager.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BidorderDefinition } from 'src/common/models/bidorder.model';
import { BidModule } from 'src/app/controller/bid/bid.module';
import { MemberModule } from 'src/app/controller/member';
import { TradeModule } from 'src/app/controller/trade/trade.module';

@Module({
  imports:[MongooseModule.forFeature([BidorderDefinition]),BidModule,TradeModule,MemberModule],
  controllers: [BidmanagerController],
  providers: [BidmanagerService]
})
export class BidmanagerModule {}
