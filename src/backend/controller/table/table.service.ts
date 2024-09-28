import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MemberService } from 'src/app/controller/member';
import { SysService } from 'src/backend/controller/sys/sys.service';
import { DepositDocument, Deposit_MODEL_TOKEN } from 'src/common/models/deposit.model';
import { ExchangeDocument, Exchange_MODEL_TOKEN } from 'src/common/models/exchange.model';
import { FundDocument, Fund_MODEL_TOKEN } from 'src/common/models/fund.model';
import { OrderDocument, Order_MODEL_TOKEN } from 'src/common/models/order.model';
import { WithdrawDocument, Withdraw_MODEL_TOKEN } from 'src/common/models/withdraw.model';
import { SearchDto } from './dto/search.dto';
@Injectable()
export class TableService {
  constructor(
    @InjectModel(Fund_MODEL_TOKEN) private readonly fundModel:Model<FundDocument>,
    @InjectModel(Deposit_MODEL_TOKEN) private readonly depositModel:Model<DepositDocument>,
    @InjectModel(Order_MODEL_TOKEN) private readonly orderModel:Model<OrderDocument>,  
    @InjectModel(Withdraw_MODEL_TOKEN) private readonly withdrawModel:Model<WithdrawDocument>,
    @InjectModel(Exchange_MODEL_TOKEN) private readonly exchangeModel:Model<ExchangeDocument>,    
    //private readonly sysService: SysService,
    private readonly memberService: MemberService,

  ) {}
  private timedata = new Date();
  private localctime = this.timedata.toLocaleString();
  /**查找DEPOSIT */
  public async findDepositById(id:string){
    return await this.depositModel.findById(id);
  }
  /**查看hash值 */
  public async findDepositHash(hashId:string){
    return await this.depositModel.findOne({payHash:hashId});
  }
  public async findOrderByDepositId(depositId:string){
    return await this.orderModel.findOne({depositId})
  }
  /**通过接口更新接口数据 */
  public async updateFromNetApi(id:string,contractData:any,netType:number,userId:string,orderId:string){
     const updataSts = await this.depositModel.findByIdAndUpdate(
      id,{payedWalletAddress:contractData.fromAddress,
        payedToAddress:contractData.toAddress,
        payedAmount:contractData.amount,
        netverify:1
      },{new:true}
     )    
     let amount =  0
     if(contractData.symbol == 'TRX'){      
       amount =  Math.floor(contractData.amount/1000000);      
     }else if(contractData.symbol == 'USDT'){
       amount =  Math.floor(contractData.amount/10000000);
     }

     await this.orderModel.findByIdAndUpdate(orderId,{orderSts:1,uptime:this.localctime},{new:true});
     
     return await this.memberService.updateDeposits(userId,amount,contractData.symbol,true);
  }

  /**充值部分 deposit */
  public async getDepositTabelData(search: SearchDto, select?: any){
    const { skip, limit } = search;
    const query = this.depositModel.find().select(select);
    const documents = await query.skip(skip).limit(limit).exec();     
    const count = await this.depositModel.estimatedDocumentCount().exec();
    let returnjson = {
      "data":documents.map((document) => document?.toJSON()),
      "count":count
    } 
    return returnjson;
  }
  /**修改depost数据 */
  public async changeDeposit(dtodata:any){
    let {_id} = dtodata;
    return await this.depositModel.findByIdAndUpdate(_id,{...dtodata,uptime:this.localctime});
  }

  /**兑换部分 */
  public async getExchangeTabelData(search: SearchDto, select?: any){
    const { skip, limit } = search;
    const query = this.exchangeModel.find().select(select);
    const documents = await query.skip(skip).limit(limit).exec();     
    const count = await this.exchangeModel.estimatedDocumentCount().exec();
    let returnjson = {
      "data":documents.map((document) => document?.toJSON()),
      "count":count
    } 
    return returnjson;
  }  
  /**修改exchange数据 */
  public async changeExchange(dtodata:any){
    let {_id} = dtodata;
    return await this.exchangeModel.findByIdAndUpdate(_id,{...dtodata,uptime:this.localctime});
  }

  /**资产记录部分 */
  public async getFundTabelData(search: SearchDto, select?: any){
    const { skip, limit } = search;
    const query = this.fundModel.find().select(select);
    const documents = await query.skip(skip).limit(limit).exec();     
    const count = await this.fundModel.estimatedDocumentCount().exec();
    let returnjson = {
      "data":documents.map((document) => document?.toJSON()),
      "count":count
    } 
    return returnjson;
  }  

  /**
   * 订单部分
   */

  public async getOrderTabelData(search: SearchDto, select?: any){
    const { skip, limit } = search;
    const query = this.orderModel.find().select(select);
    const documents = await query.skip(skip).limit(limit).exec();     
    const count = await this.orderModel.estimatedDocumentCount().exec();
    let returnjson = {
      "data":documents.map((document) => document?.toJSON()),
      "count":count
    } 
    return returnjson;
  }  
  /**
   * 提现部分
   */

  public async getWithdrawTabelData(search: SearchDto, select?: any){
    const { skip, limit } = search;
    const query = this.withdrawModel.find().select(select);
    const documents = await query.skip(skip).limit(limit).exec();     
    const count = await this.withdrawModel.estimatedDocumentCount().exec();
    let returnjson = {
      "data":documents.map((document) => document?.toJSON()),
      "count":count
    } 
    return returnjson;
  }  

  public async findWithdrawData(dataId:any){
     return await this.withdrawModel.findById(dataId);
  }


  public async sureWithDrawData(data:any){

    await this.memberService.withdrawDataUsdt(data)
   
    const returnjson = await this.withdrawModel.findByIdAndUpdate(data.withDrawId,{netverify:1})
      
    /**更新order */

    await this.orderModel.findByIdAndUpdate(
      returnjson.orderId,
      {orderSts:12}
    )
    return returnjson;
  } 

}