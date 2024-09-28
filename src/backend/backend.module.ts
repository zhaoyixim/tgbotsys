import { Module } from '@nestjs/common';
import { UserModule, UserService } from './controller/user';
import { DashboardModule } from './controller/dashboard/dashboard.module';
import { RoleModule } from './controller/role/role.module';
import { MenudModule } from './controller/menu/menu.module';
import { TableModule } from './controller/table/table.module';
import { SysModule } from './controller/sys/sys.module';
import { BidmanagerModule } from './controller/bidmanager/bidmanager.module';
import { TrademanagerModule } from './controller/trademanager/trademanager.module';

@Module({
  imports: [         
    UserModule,
    DashboardModule,
    MenudModule,
    RoleModule,
    TableModule,
    SysModule,  
    BidmanagerModule,
    TrademanagerModule,    
  ],
  //providers:[AuthService,UserService],
})
export class BackendModule {}
