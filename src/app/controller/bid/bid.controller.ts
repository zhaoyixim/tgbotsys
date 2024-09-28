import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { BidService } from './bid.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { BaseMemberDto } from '../member/dto/create-member.dto';
import { Connection, Model,Schema } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';       
import { TransactionHelper } from 'src/common/modules/transaction/transaction.helper';
import { DepositLogService } from '../deposit-log/deposit-log.service';
import { CreateDepositLogDto } from '../deposit-log/dto/create-deposit-log.dto';
import { MemberService } from '../member';

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
@Controller('bid')
export class BidController {
  constructor(private readonly bidService: BidService,
    private readonly transactionHelper: TransactionHelper,
    private readonly sepositLogService: DepositLogService,
    private readonly memberService: MemberService,    
    @InjectConnection() private connection: Connection
    ) {}
  private TransactionModel: Model<unknown>;

  /*发布交易出价-购买时候*/ 
  //要求保证金
  @Get("getbailList")
  needBail(){    
    return bailList;
  }
  /**买入 售出的初始值设置 */

  @Get("bidinitPrice")
  public async bidinitPrice(){
    return {bidpriceInit:"6.20",bidpriceSellInit:"6.45",
      initdata:{
        step:1,
        bidprice:-5, //默认交易单价
        realPrice:0,//计算出来的价格
        bidlimit:{ lowprice:69,higherprice:6900 },       
        withdrawaddress:{ labelvalue:"",checked:false },
        bidmethod:[
            {cname:"QQ支付",labelvalue:1,key:"qq",checked:false},
            {cname:"微信支付",labelvalue:2,key:"weixin",checked:true},
            {cname:"支付宝",labelvalue:3,key:"alipay",checked:false},
        ],
        setbid:[
          {cname:"我要购买泰达币",checked:true,labelvalue:1, labelname:"您的出价将公布于出售USDT页面"},
          {cname:"我要出售泰达币",checked:false,labelvalue:2, labelname:"您的出价将公布于购买USDT页面"},          
        ],
        bidtype:[
          {cname:"动态价格",checked:true,cvalue:0, labelvalue:1, labelname:"购买价格将根据泰达币市价变动"},
          {cname:"固定价格",checked:false,cvalue:0,labelvalue:2, labelname:"锁定购买价格，不会根据市价变动"},          
        ]
      }
    };
  }

  /**第二部步始值 */
 @Post("countSetting")
public async countSetting(@Body() datainfo: any){   
    const realPrice :number = parseFloat(datainfo.realPrice) * 100;
    const sellCount = 10;
    const bidLimitLow = Math.floor(sellCount *realPrice)/100
    const bidLimitHight = bidLimitLow *10
    const returnJson =  {
      step:2,
      ValidPeriod:40, /**默认有效期 */
      times:0,/**默认次数 */
      imageFiles:[],
      sellCount:sellCount,
      bidlimit:{lowprice:bidLimitLow,higherprice:bidLimitHight},  
      bidUsdtLimit:{lowprice:10,higherprice:100},
      baitdata:0,/**最低要求缴纳保证金 */
    }
    return returnJson;
}

  //第四步需要的默认数据
 @Post("getStep4Data")
 getStep4Data(@Body() datainfo: any){
   //console.log("datainfo",datainfo.buyModel)
   const data ={
    step:4,
    title:'千万白资可验流水 司法双赔 千万白资可验流水 司法双赔', 
    priceTitle:[
        {cname:"不接受议价",labelIndex:1, checked:false},
        {cname:"无需身份验证",labelIndex:2,checked:false},  
        {cname:"需要提供流水证明",labelIndex:3,checked:false}, 
    ],
    despcontent:" 温馨提示：《南山币胜客》不会和任何易优以外的平台或商家合作！请各位老板注意！！！ ",
  }
   return data;
 }


 /**创建出价 */
  @UseGuards(AuthGuard('jwt'))
  @Post('createBidOrder')
  public async createBidOrder(@Body() createBidDtoData: CreateBidDto,@Req() request:Request) {
    let bidData = createBidDtoData
    let user = request.user as BaseMemberDto   
    bidData.userId = user.id
    bidData.username = user.username 	
	if(bidData.bidTimes>0){
		 bidData.freezeTotal =  bidData.sellCount * bidData.bidTimes;
	}	
	if(bidData.bidType ==1){
		bidData.sellCount = 0;
	}
    /*事务部分开始*/
    if(this.TransactionModel == null) {
      this.TransactionModel = this.connection.model('transactionDepositLog', new Schema({ name: String, createTime: Number }));
     }	 
     //开启事务
     const session = await this.transactionHelper.startTransaction();
     try{
       const createSuccessData = await this.bidService.createBidOrder(bidData)
	   let desp = "买入出价冻结金额"+bidData.freezeTotal+",单价"+createSuccessData.sellCount;	   
	   if(bidData.bidType ==2){
			desp = "售出出价冻结金额"+bidData.freezeTotal+",单价"+createSuccessData.sellCount;		
		}
	   let logCreateData :CreateDepositLogDto= {
          userId: bidData.userId,
          username: bidData.username,
          fromId:createSuccessData._id,
          touserId:"",
          buymodel:0,
          fromKey:'bidService',
          fromValue:createSuccessData.sellCount.toString() ,
		  fromValueTotal:bidData.freezeTotal,//冻结总金额
          fromDesp:desp,
       }
       await this.sepositLogService.createLogData(logCreateData);        
       let updateMemData = {
        userId: bidData.userId,
        nums:bidData.freezeTotal
       }
	   if(bidData.bidType ==2){
		   await this.memberService.freezeUsdt(updateMemData);
	   }       
        //提交事务
        await this.transactionHelper.commitTransaction(session);
     }catch(err) {
      console.log(err)
      //回滚事务
       await this.transactionHelper.rollbackTransaction(session);
     } 
    /**冻结资金 */
   
   
    return {result:"ok"}
  }

 /**出价管理列表 */
  @UseGuards(AuthGuard('jwt'))
  @Get("getbidlists")
  public async getBidLists(@Req() request:Request){
    let user = request.user as BaseMemberDto 
    let data = await this.bidService.getBidListByUserId(user.id)
    return data;
  }
}
