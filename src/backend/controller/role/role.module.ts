import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [],
  controllers: [RoleController],
  providers: [RoleService],
  exports:[RoleService],
})
export class RoleModule {}