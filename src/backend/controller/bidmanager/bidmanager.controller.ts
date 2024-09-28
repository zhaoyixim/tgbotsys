import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, Req } from '@nestjs/common';
import { CreateBidmanagerDto } from './dto/create-bidmanager.dto';
import { UpdateBidmanagerDto } from './dto/update-bidmanager.dto';
import { BidService } from 'src/app/controller/bid/bid.service';
import { MemberService } from 'src/app/controller/member';
import { TradeService } from 'src/app/controller/trade/trade.service';
import { Request } from 'express';

@Controller('v1/bidmanager')
export class BidmanagerController {
  constructor( private readonly bidService: BidService,
    private readonly memberService: MemberService, 
    private readonly tradeService: TradeService,
    ) {}
  

  @Post('getLists')
  public async findAll(@Body() listinfo:any) {
    let pageinfo = {
      bidType:listinfo.bidType,
      limit:listinfo.pageSize,
      skip:listinfo.pageSize * (parseInt(listinfo.page) - 1)
    }  
   let userinfo = await this.bidService.getAllLists(pageinfo);
   let returninfo = {
    "list":userinfo.data,
    "page":listinfo.page,
    "pageSize":listinfo.pageSize,
    "pageCount":Math.ceil(userinfo.count/listinfo.pageSize)
   }
    return returninfo;
  }

  @Post('updatabid')
  public async updataBidData(@Body() request:any) {
    const res = await this.bidService.updateDid(request)?true:false;
    return res;
  }

 /**后台操作强制完成 */
 @Post('forcesure')
 public async forcesureBuy(@Req() request:Request){
   let {needId,force} = request.body   
   let findTrandOrder = await this.tradeService.findDataById(needId)  
   if(findTrandOrder){
     let updataSts = 10
     if(findTrandOrder.buymodel == 2 && findTrandOrder.staFlag == 3){
       //updataSts == 9  商户确定部分
         /**买-完成 */
       const suresellorder = await this.memberService.sellFuncSureOver(findTrandOrder)       
     }  
     if(findTrandOrder.buymodel == 1 && findTrandOrder.staFlag == 4){
       //updataSts == 9  商户确定部分
         /**卖-完成 */
       const sureselloutorder = await this.memberService.sellOutFuncSureOver(findTrandOrder)       
     }       
     const sureorder = await this.tradeService.sureBtnOrder(needId,updataSts);
     return sureorder;      
   }else{
     throw new ConflictException('该需求订单状态出错');
   }    
 }
}
