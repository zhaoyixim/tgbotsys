import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { SysController } from './sys.controller';
import { SysService } from './sys.service';
import { WebconfigDefinition } from 'src/common/models/webconfig.model';


@Module({
  imports: [MongooseModule.forFeature([WebconfigDefinition])],
  controllers: [SysController],
  providers: [SysService],
  exports:[SysService],
})
export class SysModule {}
