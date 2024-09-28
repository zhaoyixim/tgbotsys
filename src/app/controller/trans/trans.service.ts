import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SysService } from 'src/backend/controller/sys/sys.service';
import { DepositDocument, Deposit_MODEL_TOKEN } from 'src/common/models/deposit.model';
import { ExchangeDocument, Exchange_MODEL_TOKEN } from 'src/common/models/exchange.model';
import { OrderDocument, Order_MODEL_TOKEN } from 'src/common/models/order.model';
import { WithdrawDocument, Withdraw_MODEL_TOKEN } from 'src/common/models/withdraw.model';
import { MemberService } from '../member';
import { CreateDepositDto, CreateOrderDto } from './dto/create-trans.dto';
import { SearchItemDto } from './dto/search-trans.dto';

const timedata = new Date();
const localctime = timedata.toLocaleString();

@Injectable()
export class TransService {
  constructor(
    @InjectModel(Deposit_MODEL_TOKEN) private readonly depositModel:Model<DepositDocument>,
    @InjectModel(Order_MODEL_TOKEN) private readonly orderModel:Model<OrderDocument>,  
    @InjectModel(Withdraw_MODEL_TOKEN) private readonly withdrawModel:Model<WithdrawDocument>,
    @InjectModel(Exchange_MODEL_TOKEN) private readonly exchangeModel:Model<ExchangeDocument>,    
    private readonly sysService: SysService,
    private readonly memberService: MemberService,
    ) {}
 
  /**仅仅用于充值提交入口来源数据 */
  public async createDeposit(depositData:CreateDepositDto){
    const { userId,netType } = depositData;
    // const findByUserIdAndNetType = await  this._findByUseridDeposit({userId,netType});
    // if(findByUserIdAndNetType){
    //   let  savaFunddata = {
    //     nums: findByUserIdAndNetType.nums+ depositData.nums,
    //     freezeNums: parseInt(findByUserIdAndNetType.freezeNums)+parseInt(depositData.freezeNums),
    //     restAllNums: parseInt(findByUserIdAndNetType.restAllNums)+parseInt(depositData.restAllNums)
    //   }
    //   const document = await this.depositModel.findByIdAndUpdate(findByUserIdAndNetType._id,savaFunddata);
    //   return document?.toJSON();
    // }else {
      const document = await this.depositModel.create(depositData);
      return document?.toJSON();
    //}
  } 
  public async _findByUseridDeposit(searchDto:SearchItemDto){
      return await this.depositModel.findOne({...searchDto});
  }
  /**
   * @param 创建订单
   * @returns 
   */
  public async createOrder(orderData:CreateOrderDto){ 
    
    let findTimeLimit = await this.sysService.getConfig("orderTimeLimit");    
    let timeLimit:number  = findTimeLimit as unknown as number
    if(timeLimit !== 30 ){      
      /*默认为30分钟 */   
      let timedata = new Date() 
      let plusTime = timedata.getTime() + 1000*60*timeLimit;
      let plusTimedata = new Date(plusTime);
      let plusTimedataString = plusTimedata.toLocaleString(); 
      orderData.ctime = timedata.toLocaleString();
      orderData.expireTime = plusTimedataString 
    }
    const document = await this.orderModel.create(orderData);
    return document?.toJSON();
  } 

  /**
   * 取消订单
   */
  public async cancelOrderBill(orderId:string){  
    await this.orderModel.findByIdAndUpdate(orderId,{orderSts:5,uptime:localctime});
    return "";
  }
   /**
   * 超时订单
   */
   public async expireOrderBill(orderId:string){  
    await this.orderModel.findByIdAndUpdate(orderId,{orderSts:4,uptime:localctime});
    return "";
  }

  /**
   * 点击我已支付-确定支付-等待验证
   */
  public async confirmOrderBill(orderId:string,depositId:string,walletHash:{}){
    const returnJson = await this.depositModel.findByIdAndUpdate(depositId,walletHash)
    await this.orderModel.findByIdAndUpdate(orderId,{orderSts:2,walletHash,uptime:localctime});
    return returnJson;
  }

  /**通过orderid查找order信息 */
  public async findOrderById(orderId:string){
    const document = await this.orderModel.findById(orderId);
    return document?.toJSON();
  }
  /**通过depositId查找 */
  public async findDepositById(id:string){
    return await this.depositModel.findById(id);
  }
  public async findDataByHash(hashedvalue:string){
    return await this.depositModel.findOne({payHash:hashedvalue});
  }
  /**提现数据导入 */
  public async createWithdraw(withdrawdata : any){
    const document = await this.withdrawModel.create(withdrawdata);
    return document?.toJSON();
  }

  /**更改用户资产 */
  public async updateMemberFunds(updateData:any){
    const document = await this.memberService.updateUsdtFundings(updateData);
    return document?.toJSON();
  }

  /**
   * 取消提现
   */
  public async cancelWithdrawOrderBill(orderId:string){  
    await this.orderModel.findByIdAndUpdate(orderId,{orderSts:14,uptime:localctime});
    return "取消成功";
  }


  /**交换数据导入 */
  public async createExchange(saveExchange : any){
    const document = await this.exchangeModel.create(saveExchange);
    return document?.toJSON();
  }

    /**
   * 取消兑换
   */
  public async cancelExchangeOrderBill(orderId:string){  
      const cu =  await this.orderModel.findByIdAndUpdate(orderId,{orderSts:24,uptime:localctime});
      return "取消成功";
  }


}