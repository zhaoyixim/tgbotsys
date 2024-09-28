import { Module } from '@nestjs/common';
import { VchatService } from './vchat.service';
import { VchatGateway } from './vchat.gateway';
import { VchatDefinition } from 'src/common/models/vchat.model';
import { MongooseModule } from '@nestjs/mongoose';
import { VmessageDefinition } from 'src/common/models/vmessage.model';
import { MemberModule } from '../member';
import { VchatController } from './vchat.controller';

@Module({
  imports:[
    MongooseModule.forFeature([VchatDefinition]),
    MongooseModule.forFeature([VmessageDefinition]),
    MemberModule
  ],
  controllers: [VchatController],
  providers: [VchatGateway, VchatService],
  exports:[VchatService]
})
export class VchatModule {}
