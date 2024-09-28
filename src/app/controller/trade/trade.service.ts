import { Injectable } from '@nestjs/common';
import { CreateCollectDto, CreateTradeDto,CreateTradeOrderDto } from './dto/create-trade.dto';
import { UpdateTradeDto } from './dto/update-trade.dto';
import { TradeOrderDocument, TradeOrder_MODEL_TOKEN } from 'src/common/models/trade/tradeorder.model';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { SearchDto } from '../search/dto/create-search.dto';
import { CollectDocument, Collect_MODEL_TOKEN } from 'src/common/models/collect.model';
import { MemberService } from '../member';
import { BidService } from '../bid/bid.service';

@Injectable()
export class TradeService {  
  constructor(
    @InjectModel(TradeOrder_MODEL_TOKEN) private readonly tradeorderModel:Model<TradeOrderDocument>,
    @InjectModel(Collect_MODEL_TOKEN) private readonly collectModel:Model<CollectDocument>,

    private readonly memberService: MemberService,
    private readonly bidService: BidService,
    ){}

  /**collectModel 数据 */
  public async createCollect(collectdata:CreateCollectDto ){
    await this.bidService.incCollectNums(collectdata.fromBidId);
    return await this.collectModel.create(collectdata);
  }
  /**删除数据 */
  public async deleteCollect(collectId: string) { 
    let collectdata = (await this.findDataById(collectId))    
    await this.bidService.decCollectNums(collectdata.fromBidId);   
    return await this.collectModel.findByIdAndDelete(collectId)
  }
  /**查找数据 */
  public async findCollectItem(fromBidId:string){
    return await this.collectModel.findOne({fromBidId});
  }
  public async findCollects(userId:string,search: SearchDto){
    const { skip, limit } = search;
    const query = this.collectModel.find({userId});
    const documents = await query.skip(skip).limit(limit).exec();
    return documents;
  }

  /**trade 数据 */
  
  public async findorderById(orderId:string){
	  return await this.tradeorderModel.findById(orderId);
  }

  /**新创建需求 */
  public async findNewOrders(userId:string,staFlag:number,search: SearchDto){
    const { skip, limit } = search;
    //let staFlag = 1 ;/**新创建 */
    let query:any;
    let toQuery:any;
    let toUserArr:any;
    let UserArr:any;
    if(staFlag == 1){
      query = await this.tradeorderModel.find({userId,staFlag:{$lt:9}}).skip(skip).limit(limit).exec();
      toQuery = await this.tradeorderModel.find({touserId:userId,staFlag:{$lt:9}}).skip(skip).limit(limit).exec();     
    }else{
      query =await this.tradeorderModel.find({userId,staFlag:{$eq:9}}).skip(skip).limit(limit).exec();
      toQuery =await this.tradeorderModel.find({touserId:userId,staFlag:{$eq:9}}).skip(skip).limit(limit).exec();     
    }
    UserArr = query.map((document) => document?.toJSON());
    toUserArr = toQuery.map((document) => document?.toJSON());
    return {selfJson:UserArr,toJson:toUserArr};
  }
  /**已完成需求 */
  /**添加数据 */
  public async createOrder(collectdata:CreateCollectDto ){
    return await this.tradeorderModel.create(collectdata);
  }
  public async findDataById(tradeId:string){
    const doc = await this.tradeorderModel.findById(tradeId);
    return doc;
  }

  /**更新收款截图 */
  public async updataTradeImg(id:string,imageFiles:string,payModel:boolean){    
    if(payModel){
      return await this.tradeorderModel.findByIdAndUpdate(id,{imageFiles:imageFiles},{new:true})
    }else{
      return await this.tradeorderModel.findByIdAndUpdate(id,{payImages:imageFiles},{new:true})
    } 
  }
  /**更新确定订单状态 */
  public async sureBtnOrder(id:string,staFlag:number){
    return await this.tradeorderModel.findByIdAndUpdate(id,{staFlag},{new:true})
  }
  /**更新确定订单状态和原因 */
  public async changeOrderAndReason(id:string,staFlag:number,reason:string){
    return await this.tradeorderModel.findByIdAndUpdate(id,{staFlag,reason},{new:true})
  }
  /**后台 */
  public async getAllLists(search: SearchDto, select?: any){
    const { skip, limit } = search;
    const query = this.tradeorderModel.find({buymodel:search.buymodel}).select(select);
    const documents = await query.skip(skip).limit(limit).exec();     
    const count = await this.tradeorderModel.estimatedDocumentCount().exec();
    let fieldMem = "_id username email unfinishednum freezeOutUsdt freezeUsdt usdt usdtAll ctime logintimes uptime ips ctime checkemail "
    let returnjson = {
      "data":await Promise.all(documents.map(async (document) =>{
        let docUint =  document?.toJSON();
        let findTouser =await this.memberService.findById(docUint.touserId,fieldMem); 
        let bidData = await this.bidService.findBySingleId(docUint.fromBidId);
        return {...docUint,toUser:findTouser,bidData}
      })),
      "count":count
    } 
   
    return returnjson;
  }

   /**后台-更新数据 */
  //  public async updateDid(updateData:UpdateBidDto){
  //   const id = updateData.id;
  //   delete updateData.id;
  //   return await this.tradeorderModel.findByIdAndUpdate(id,{...updateData},{new:true});
  // }
}
