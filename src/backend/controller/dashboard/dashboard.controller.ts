import {Body, Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '@nestjs/passport';

  @Controller('v1/dashboard')
  export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}
   
    @UseGuards(AuthGuard('jwt'))
    @Get('console')
    async getConsole(@Body() request:any){
        return {"code":200,"result":{"visits":{"dayVisits":64821.86,"rise":66.65,"decline":57.49038,"amount":631298.35898},
        "saleroom":{"weekSaleroom":65666.38,"amount":367190.32,"degree":95.66542775338},
        "orderLarge":{"weekLarge":71557.37,"rise":55.55,"decline":39.6355,"amount":645559.72},
        "volume":{"weekLarge":67998.39,"rise":23.2280582373,"decline":91.84478071243664,
        "amount":406739.82}},"message":"ok","type":"success"};
    }




  }