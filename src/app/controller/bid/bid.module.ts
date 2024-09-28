import { Module } from '@nestjs/common';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BidorderDefinition } from 'src/common/models/bidorder.model';
import { MemberModule } from '../member';
import { InitModule } from 'src/common/modules/transaction/init.module';
import { DepositLogModule } from '../deposit-log/deposit-log.module';

@Module({    
  imports:[
    MongooseModule.forFeature([BidorderDefinition]),
    MemberModule,InitModule,DepositLogModule],
  controllers: [BidController],
  providers: [BidService],
  exports:[BidService]
})
export class BidModule {}
