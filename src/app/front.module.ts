import { Module } from '@nestjs/common';
import { MemberModule } from './controller/member';
import { AuthModule, AuthService } from './controller/auth';
import { IndexModule } from './controller/index/index.module';
import { TransModule } from './controller/trans/trans.module';
import { SearchModule } from './controller/search/search.module';
import { BidModule } from './controller/bid/bid.module';
import { TradeModule } from './controller/trade/trade.module';
import { UploadModule } from 'src/common/modules/upload/upload.module';
import { VchatModule } from './controller/vchat/vchat.module';


@Module({
  imports: [   
    AuthModule,
    MemberModule,
    IndexModule, 
    TransModule,
    SearchModule,  
    BidModule,
    TradeModule,
    UploadModule,
    VchatModule,	  
  ], 
  providers:[]
})
export class FrontModule {}
