import { Controller, Get, Post, Body, UseGuards, Param, Req, HttpStatus, HttpException, ConflictException } from '@nestjs/common';
import { TradeService } from './trade.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Connection, Model,Schema } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';       

import { CreateCollectDto, CreateTradeDto } from './dto/create-trade.dto';
import { BidService } from '../bid/bid.service';
import { BaseMemberDto } from '../member/dto/create-member.dto';
import { SysService } from 'src/backend/controller/sys/sys.service';
import { TransactionHelper } from 'src/common/modules/transaction/transaction.helper';
import { DepositLogService } from '../deposit-log/deposit-log.service';
import { MemberService } from '../member';
import { CreateDepositLogDto } from '../deposit-log/dto/create-deposit-log.dto';

/**创建出价需求订单 */
const bailList = [
  {cname:"第一档次",labelvalue:10,checked:true},
  {cname:"第二档次",labelvalue:50,checked:false},
  {cname:"第三档次",labelvalue:100,checked:false},
  {cname:"第四档次",labelvalue:200,checked:false},
  {cname:"第五档次",labelvalue:500,checked:false},
  {cname:"第六档次",labelvalue:1000,checked:false},
  {cname:"第七档次",labelvalue:2000,checked:false},
  {cname:"第八档次",labelvalue:3000,checked:false},
]

/**创建购买交易订单 */

@Controller('trade')
export class TradeController {
  constructor(
    private readonly tradeService: TradeService,
    private readonly bidService: BidService,
    private readonly sysService: SysService, 
    private readonly transactionHelper: TransactionHelper,
    private readonly sepositLogService: DepositLogService,
    private readonly memberService: MemberService,  
    @InjectConnection() private connection: Connection,
    ) {}
  private TransactionModel: Model<unknown>;


 /*单一需求列表--VCHAT使用*/
 @Post('sigleNeedList')
 public async sigleNeedList(@Req() request:Request){
	const {fromTradeId} = request.body;
	const findorder = await this.tradeService.findorderById(fromTradeId) 
	let items = await this.bidService.getSingleNeeds(findorder.fromBidId as string,findorder._id)
	let pushItem = {...items,needData:findorder,ctype:1}
	return pushItem;
 }
 
  /**需求列表 */
  @UseGuards(AuthGuard('jwt'))
  @Post('getNeedLists')
  public async getNeedLists(@Req() request:Request){
    let user = request.user as BaseMemberDto
    let {pageSize,page,listType} = request.body;
    let limits = {
      limit:pageSize,
      skip:pageSize * (parseInt(page) - 1)
    }    
    let returnJson = await this.tradeService.findNewOrders(user.id,listType,limits);
    let returnData =[] ;
      if(returnJson.selfJson.length>0){
        await Promise.all(
          returnJson.selfJson.map(async(res)=>{         
              let items = await this.bidService.getSingleNeeds(res.fromBidId as string,res._id)             
              if(items){
                let pushItem = {...items,needData:res,ctype:1}
                returnData.push(pushItem)
              }             
          })
        )
      }
      if(returnJson.toJson.length>0){ 
        await Promise.all(
          returnJson.toJson.map(async(res)=>{         
              let items = await this.bidService.getSingleNeeds(res.fromBidId as string,res._id)             
              if(items){
              let pushItem = {...items,needData:res,ctype:2}
              returnData.push(pushItem)
              }             
          })
      )
   }   
   return returnData;   
  }

  /**收藏部分 */
  @UseGuards(AuthGuard('jwt'))
  @Post('collectitem')
  public async collectItem(@Req() request:Request){
    let user = request.user as BaseMemberDto
    let {fromBidId} = request.body
    const saveData:CreateCollectDto = {
      userId:user.id,
      username:user.username,
      fromBidId:fromBidId
    }
    return await this.tradeService.createCollect(saveData);
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Post('collectDelete')
  public async collectDelete(@Req() request:Request){
    let user = request.user as BaseMemberDto
    let {collectId} = request.body    
    return await this.tradeService.deleteCollect(collectId);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('checkCollect')
  public async checkCollect(@Req() request:Request){
    let user = request.user as BaseMemberDto
    let {fromBidId} = request.body  
    let returnJson = await this.tradeService.findCollectItem(fromBidId);
    return {data:returnJson};    
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('getCollectLists')
  public async getCollectLists(@Req() request:Request){    
    let {pageSize,page} = request.body;
    let limits = {
      limit:pageSize,
      skip:pageSize * (parseInt(page) - 1)
    }
    let user = request.user as BaseMemberDto
    let returnJson = await this.tradeService.findCollects(user.id,limits);
    let returnData =[] ;
    if(returnJson.length>0){
       await Promise.all(
          returnJson.map(async(res)=>{
              let items = await this.bidService.getSingleList(res.fromBidId as string,res._id)
              if(items){
                items.show = true
                returnData.push(items)
              }              
          })
        )
    }   
    return returnData;
  }
  /**通过交易的ID获取交易的数据 */
  @UseGuards(AuthGuard('jwt'))
  @Post("dtl")
  public async getTradeDataByid(@Body() datainfo: any,@Req() request: Request) {   
    let dataId = datainfo.id
    if(datainfo.trade){      
      //整合-通过创建的trade交易来获得Bid出价数据
      dataId = await this.findBidIdByTradId(dataId)
    }
    if(undefined == dataId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    let returnjson = await this.bidService.getDataById(dataId)   
    const desptitle:string = "微信支付宝、骗子黑资小白勿扰、安全快速、欢迎长期合作！";
    let returnLists:any = returnjson as unknown
    returnLists.askNums = bailList[returnLists.askBailNums].labelvalue
     return {...returnLists,desptitle};
  }
 /**通过tradeIDc查找formBidId */
 public async findBidIdByTradId(tradeId:string){ 
    const data = await this.tradeService.findDataById(tradeId);
    return  data.fromBidId;
 }
  /**创建交易需求 */
 @UseGuards(AuthGuard('jwt'))
 @Post('createTradeOrder')
 public async createTradeOrder(@Body() CreateTradeDto: CreateTradeDto,@Req() request:Request){
  let transData = CreateTradeDto
  let user = request.user as BaseMemberDto
  let defaultUnitPrice = (await this.sysService.getConfig("unitprice")) as any ; 
  if(undefined == defaultUnitPrice || null == defaultUnitPrice){defaultUnitPrice = 6.56;}
  let countnum = defaultUnitPrice*transData.usdtCount  
  const findBidOrder = await this.bidService.getDataById(transData.fromBidId)
  let toUserId = findBidOrder.userId as string; 
  const saveData = {
    userId:user.id,
    username:user.username,
    rmbNums: (Math.ceil(countnum*100)/100).toFixed(2),
    usdtNums:transData.usdtCount,
    buymodel:transData.buymodel,
    touserId:toUserId,
    fromBidId:transData.fromBidId
  } 
  
  /**查询是否商户冻结资金足够 */
  let toUserInfo = await this.memberService.findById(toUserId,{})
  let returnJson :any ;
 
  if(transData.buymodel ==1){
	  if(toUserInfo.freezeUsdt < transData.usdtCount){
		  throw new ConflictException('商户出价冻结金额不足');
	  }
	  if(findBidOrder.bidTimes >0 && findBidOrder.freezeTotal>0){
		  //有次数限制
		 if(findBidOrder.freezeU +transData.usdtCount> findBidOrder.freezeTotal){
		 		throw new ConflictException('商户出价冻结金额不足');		  
		  }	 
	  }	  
  }  
  if(transData.buymodel ==2 && toUserInfo.usdt < transData.usdtCount){
    throw new ConflictException('您账户USDT数额不足');
  }  
  /*事务部分开始*/
  if(this.TransactionModel == null) {
    this.TransactionModel = this.connection.model('transactiontrade', new Schema({ name: String, createTime: Number }));
   }
   //开启事务
   const session = await this.transactionHelper.startTransaction();  
   try{
	let desp = "购买USDT-入账"+findBidOrder.freezeTotal+",单价"+findBidOrder.sellCount;
	if(findBidOrder.bidType ==2){
	   	desp = "售出USDT-出账"+findBidOrder.freezeTotal+",单价"+findBidOrder.sellCount;		
	}
		
	//交易次数+1 出价数据单次freezeU 增加	出价数据次数bidTimes -1
	returnJson =await this.tradeService.createOrder(saveData)
    let logCreateData :CreateDepositLogDto= {
      userId: saveData.userId,
      username: saveData.username,
      fromId:returnJson._id,
      touserId:toUserId,
      buymodel:transData.buymodel,
      fromKey:'tradeService',
      fromValue:saveData.usdtNums.toString() ,
	  fromValueTotal:findBidOrder.freezeTotal,
      fromDesp:"购买USDT-入账",
   }
   let updateMemData = {userId: saveData.userId,touserId:toUserId,usdtNums:transData.usdtCount}
    if(findBidOrder.bidTimes >0){
      await this.bidService.declineBidTimes(transData.fromBidId)
    }   
    if(transData.buymodel ==1){
    /**butmodel == 1 前台买 */
      
    }
    if(transData.buymodel ==2){
      /**butmodel == 2 前台卖 */
      logCreateData.fromDesp = "售出USDT-出账";      
      await this.memberService.sellOutFunc(updateMemData);
    } 
    /**日志 */
    await this.sepositLogService.createLogData(logCreateData)
    //提交事务
    await this.transactionHelper.commitTransaction(session);
   }catch(err) {
    console.log(err)
    //回滚事务
     await this.transactionHelper.rollbackTransaction(session);
   } 
   return returnJson;  
 }

 /**出售的需求 */
  @Post("sellDtl")
  public async getTradesellDtlById(@Body() datainfo: any) {
    if(undefined == datainfo.id) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    let returnjson = await this.bidService.getDataById(datainfo.id)
    const desptitle:string = "微信支付宝、骗子黑资小白勿扰、安全快速、欢迎长期合作！";
    return {...returnjson,desptitle};
  }
  
  /*用户取消*/
  @UseGuards(AuthGuard('jwt'))
  @Post('cancelRq')
  public async cancelRq(@Req() request:Request){
	 const {needId,reason,ctype} = request.body;
	 const user = request.user as BaseMemberDto;
	 const findTrandOrder = await this.tradeService.findDataById(needId);
	 let  updataSts:number= 11;
	 
	 await this.memberService.DecresementUnfinishNum(findTrandOrder.userId as string)
	 await this.memberService.DecresementUnfinishNum(findTrandOrder.touserId)
	 
	 
	 if(ctype ==1 &&findTrandOrder.staFlag == 1 && findTrandOrder.buymodel ==2){
		 //取消--无原因
		 const sureorder = await this.tradeService.sureBtnOrder(needId,updataSts);
		 //取回入账的U
		 
		 return sureorder;  
	 }
	 if(ctype ==2 &&findTrandOrder.staFlag == 4 && findTrandOrder.buymodel ==2){
	 		 //取消--无原因
	 	const sureorder = await this.tradeService.changeOrderAndReason(needId,updataSts,reason);
	 		 //取回入账的U
		await this.memberService.sellOutFuncBack(findTrandOrder)
	 	return sureorder;  
	 }
	 if(ctype ==2 &&findTrandOrder.staFlag == 2 && findTrandOrder.buymodel ==1){
	 		 //取消--无原因
	 	const sureorder = await this.tradeService.changeOrderAndReason(needId,updataSts,reason);
	 		 //取回入账的U
	 	await this.memberService.sellFuncBack(findTrandOrder)
	 	return sureorder;  
	 }
	 
  }

  /**用户确定购买完成 */
  @UseGuards(AuthGuard('jwt'))
  @Post('sureBuy')
  public async sureBuy(@Req() request:Request){
    const {needId} = request.body
    const findTrandOrder = await this.tradeService.findDataById(needId)  
    if(findTrandOrder.staFlag == 9){
      throw new ConflictException('该订单已经完成');
    }    
    if(findTrandOrder){
      let updataSts = 9
      if(findTrandOrder.staFlag == 3){
        //updataSts == 9  商户确定部分
          /**买-完成 */
		  console.log("1")
        const suresellorder = await this.memberService.sellFuncSureOver(findTrandOrder)       
      }  
      if(findTrandOrder.staFlag == 4 ||findTrandOrder.staFlag == 5 ){
        //updataSts == 9  商户确定部分
          /**卖-完成 */
		   console.log("2")
        const sureselloutorder = await this.memberService.sellOutFuncSureOver(findTrandOrder)       
      } 
      if(findTrandOrder.buymodel == 2 && findTrandOrder.staFlag == 2){//updataSts == 9  商户确定部分        
          updataSts == 5		   
       } 
	   if(findTrandOrder.buymodel == 1){
		if( findTrandOrder.staFlag == 2){
			 console.log("3")
		   	await this.memberService.sellFuncSureOver(findTrandOrder);
		}		   
	   }
	  if(updataSts == 9){
		await this.bidService.incTradeNums(findTrandOrder.fromBidId,findTrandOrder.usdtNums);
	  }
      const sureorder = await this.tradeService.sureBtnOrder(needId,updataSts);
      return sureorder;      
    }else{
      throw new ConflictException('该需求订单状态出错');
    }    
  }
  /**更新上传付款截图 */
  @Post('uploadTradeImg')
  public async uploadTradeImg(@Body() datainfo: any){
    let imageFiles = JSON.stringify(datainfo.imageFiles)   
    let findTrandOrder  = await this.tradeService.findDataById(datainfo.tradeId)  
    if(findTrandOrder && findTrandOrder.staFlag <9){
      let staFlg = 2;//商户出售-用户未付款-商户上传收款码
      if(findTrandOrder.staFlag ==2 && datainfo.detailpayModel){
        staFlg = 3;//商户出售--已付款---商户上传收款码--用户上传付款截图之后的状态
      }else if(findTrandOrder.staFlag ==1 && datainfo.detailpayModel){
        staFlg = 4;//用户买入-(用户付款)--用户上传付款截图之后状态
      }
	  if(findTrandOrder.staFlag ==4){
		staFlg = 5; //还需要最后一部确认  
		await this.memberService.IncresementUnfinishNum(findTrandOrder.touserId)
	  }
      if(staFlg == 2 ){
        //商户出售-用户未付款-商户上传收款码 --- 卖-初入----商户上传收款码时候 usdt 扣除 并且并入freezeOutUsdt  未完成+1
        //const suresellorder = await this.memberService.sellOutFunc(findTrandOrder);
      }

      if(staFlg == 4 ){
		
        //用户买入-用户付款-(商户已有收款码) --买-初入-用户冻结金额增加-商户冻结金额减少 未完成+1
       // const suresellorder = await this.memberService.sellFunc(findTrandOrder);
      }
	  let updateMemData = {userId: findTrandOrder.userId,touserId:findTrandOrder.touserId,usdtNums:findTrandOrder.usdtNums}
	  
	  
	  if(!datainfo.detailpayModel &&findTrandOrder.buymodel == 1 && findTrandOrder.staFlag ==1 ){
		  /**从toUserId 冻结金额里面减少freezeUsdt数量，在userId 加入freezeUsdt数量 */
		  await this.memberService.sellFunc(updateMemData);
	  }
	
	  

      await this.tradeService.sureBtnOrder(datainfo.tradeId,staFlg);
      const res = await this.tradeService.updataTradeImg(datainfo.tradeId,imageFiles,datainfo.detailpayModel)
      return res;
    }else{
      throw new ConflictException('该需求订单状态出错');
    }   
  }
}
