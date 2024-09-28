import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { OrderDefinition } from 'src/common/models/order.model';
import { SysModule } from 'src/backend/controller/sys/sys.module';


@Module({
  imports: [
    SysModule,
    MongooseModule.forFeature([OrderDefinition])],
  controllers: [SearchController],
  providers: [SearchService],
  exports:[SearchService],
})
export class SearchModule {}
