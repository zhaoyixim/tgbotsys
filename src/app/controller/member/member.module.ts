import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { MemberDefinition } from '../../../common/models/member.model';
import { MSGDefinition } from '../../../common/models/msg.model';
import { ResetpasswdGuard } from '../../common/guards/reset-passwd.guard';
import { SysModule } from 'src/backend/controller/sys/sys.module';
@Module({
  imports: [MongooseModule.forFeature([MemberDefinition]),MongooseModule.forFeature([MSGDefinition]),
  SysModule
  ],
  controllers: [MemberController],
  providers: [MemberService,ResetpasswdGuard],
  exports:[MemberService]
})
export class MemberModule {}
