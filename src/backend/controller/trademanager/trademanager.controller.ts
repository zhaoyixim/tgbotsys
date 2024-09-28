import { Controller, Post, Body, Req } from '@nestjs/common';
import { TradeService } from 'src/app/controller/trade/trade.service';
import { BidService } from 'src/app/controller/bid/bid.service';
import { Request } from 'express';
import { VchatService } from 'src/app/controller/vchat/vchat.service';
import { MemberService } from 'src/app/controller/member';

@Controller('v1/trademanager')
export class TrademanagerController {
  constructor( private readonly tradeService: TradeService,
    private readonly bidService: BidService,
    private readonly vchatService:VchatService,
    private readonly memberService:MemberService
    ) {} 

  @Post('getLists')
  public async findAll(@Body() listinfo:any) {
    let pageinfo = {
      buymodel:listinfo.buymodel,
      limit:listinfo.pageSize,
      skip:listinfo.pageSize * (parseInt(listinfo.page) - 1)
    }  
   let userinfo = await this.tradeService.getAllLists(pageinfo);
   let returninfo = {
    "list":userinfo.data,
    "page":listinfo.page,
    "pageSize":listinfo.pageSize,
    "pageCount":Math.ceil(userinfo.count/listinfo.pageSize)
   }
    return returninfo;
  } 
 /*单一需求列表--VCHAT使用*/
 @Post('sigleNeedList')
 public async sigleNeedList(@Req() request:Request){
	const {fromTradeId} = request.body;
	const findorder = await this.tradeService.findorderById(fromTradeId) 
	let items = await this.bidService.getSingleNeeds(findorder.fromBidId as string,findorder._id)
	let pushItem = {...items,needData:findorder,ctype:1}
	return pushItem;
 }


 @Post('getMessageList')
 async getMessageBackendList(@Body() reqData:any){
   let {userId,touserId} = reqData
   const doc = await this.vchatService.getMessageBackendList({userId})
   let returnJson = []  
   const toUser = await this.memberService.findUser({ _id:touserId });
   doc.forEach(res=>{
     let contextTxt = res.content
     if(res.ctype == 2){
       contextTxt = '<img class="image-box" src='+res.contentBody+' />' ;
     }
     if(res.ctype == 3){
       contextTxt = '<video style=\"width:120px;height:120px;object-fit:cover;\"  src=\"' +res.contentBody + '\"></video>';
     }
     let dp = {
       username:res.username,
       context:contextTxt,
       ctype:res.ctype,
       isRead:res.isRead,
       ctime:res.ctime,
       touserId:res.touserId,        
       userId:res.userId,
       contentBody:res.contentBody,
       isActive:false,
       avatar:toUser.avatar
     }
     returnJson.push(dp)
   })   
   return returnJson;
 }
 
  // @Post('updatabid')
  // public async updataBidData(@Body() request:any) {
  //   const res = await this.tradeService.updateDid(request)?true:false;
  //   return res;
  // }
}
