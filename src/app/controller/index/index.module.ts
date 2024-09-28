import { Module } from '@nestjs/common';
import { IndexService } from './index.service';
import { IndexController } from './index.controller';
import { BidModule } from '../bid/bid.module';
import { MemberModule } from '../member';
import { UploadModule } from 'src/common/modules/upload/upload.module';
import { SysModule } from 'src/backend/controller/sys/sys.module';

@Module({
  imports:[BidModule,MemberModule,UploadModule,SysModule],
  controllers: [IndexController],
  providers: [IndexService]
})
export class IndexModule {}
