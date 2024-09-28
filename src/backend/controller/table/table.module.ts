import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { TableController } from './table.controller';
import { TableService } from './table.service';
import { FundDefinition } from 'src/common/models/fund.model';
import { DepositDefinition } from 'src/common/models/deposit.model';
import { OrderDefinition } from 'src/common/models/order.model';
import { WithdrawDefinition } from 'src/common/models/withdraw.model';
import { ExchangeDefinition } from 'src/common/models/exchange.model';
import { SpiderModule } from 'src/common/modules/spider/spider.module';
import { MemberModule } from 'src/app/controller/member';
import { SysModule } from '../sys/sys.module';

@Module({
  imports: [
    MongooseModule.forFeature([FundDefinition]),
    MongooseModule.forFeature([DepositDefinition]),
    MongooseModule.forFeature([OrderDefinition]),
    MongooseModule.forFeature([WithdrawDefinition]),
    MongooseModule.forFeature([ExchangeDefinition]),
    SpiderModule,
    MemberModule,
    SysModule
  ],
  controllers: [TableController],
  providers: [TableService],
  exports:[TableService],
})
export class TableModule {}
