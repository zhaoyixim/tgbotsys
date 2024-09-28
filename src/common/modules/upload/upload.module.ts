import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { UploadimageDefinition } from 'src/common/models/uploadimage.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:[ MongooseModule.forFeature([UploadimageDefinition])],
  controllers: [UploadController],
  providers: [UploadService],
  exports:[UploadService]
})
export class UploadModule {}
