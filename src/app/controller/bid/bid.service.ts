import { Injectable } from '@nestjs/common';
import { CreateBidDto, bidOrderIndexDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { BIDORDER_MODEL_TOKEN, BidorderDocument } from 'src/common/models/bidorder.model';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SearchDto } from '../search/dto/create-search.dto';
import { MemberService } from '../member';

@Injectable()
export class BidService {

  constructor(
    @InjectModel(BIDORDER_MODEL_TOKEN) private readonly bidorderModel:Model<BidorderDocument>,
    
	private readonly memberService: MemberService
    ){}


  /**添加Collect数据 */
  public async incCollectNums(bidId:string){
     return await this.bidorderModel.findByIdAndUpdate(
      bidId,
      {
        collect: +1
      }
     )
  }

  /**删除Collect数据 */
 public async decCollectNums(bidId:string){
  return await this.bidorderModel.findByIdAndUpdate(
    bidId,
    {
      collect: -1
    }
   )
  }

 /**易次数+1 出价数据单次freezeU 增加	出价数据次数bidTimes -1 */
 public async incTradeNums(bidId:string,usdtCount:number){
 let findBidOrder = await this.bidorderModel.findById(bidId).exec();
 const {bidTimes} =  findBidOrder;
 if(bidTimes >0){
	 return await this.bidorderModel.findByIdAndUpdate(bidId,{tradeNums: +1,freezeU:+usdtCount,bidTimes:- 1,},{new:true})
 }else{
	 return await this.bidorderModel.findByIdAndUpdate(bidId,{tradeNums: +1,freezeU:+usdtCount},{new:true})
 }
}

  public async createBidOrder(bidorder:CreateBidDto){
    return this.bidorderModel.create(bidorder);
  }
  public async declineBidTimes(id:string){
    return await this.bidorderModel.findByIdAndUpdate(id,{$inc: {bidTimes: -1}},{new:true})
  }
 
  public async getList(filter : FilterQuery<BidorderDocument>,search: SearchDto,select:any,userId:string | ""){
    const { skip, limit } = search;
    let query;
    if(userId){
      let filters = {...filter,userId:{$ne:userId}}
       query = await this.bidorderModel.find(filters).select(select).skip(skip).limit(limit).exec();
    }else{
       query = await this.bidorderModel.find(filter).select(select).skip(skip).limit(limit).exec(); 
    }
    const documents = (await query);  
    const memberFieldSelect = "username bailNums nickname avatar creditLevel ctime uptime active -_id"
    let returnjson =await Promise.all(documents.map(async (document) => {
      let documentUint = document?.toJSON();
      let memberUint = await this.memberService.findById(documentUint.userId as string, memberFieldSelect);
      (documentUint as any).memberinfo = memberUint;
      //console.log("memberUint",documentUint,"memberUint")
      return documentUint;
    }))    
   //加入保证金等商家信息
    return returnjson;
  }
  /**单个查找 */
  public async getSingleList(bidId:string,collectId:string){
    let listItem:any = await this.bidorderModel.findById(bidId);
    if(listItem){
      const memberFieldSelect = "username bailNums avatar creditLevel active -_id"
      let memberUint = await this.memberService.findById(listItem.userId as string, memberFieldSelect);   
      let returnJson = {...listItem.toJSON(),memberinfo:memberUint,collectId:collectId}  
      return returnJson;
    }else{ return '';} 
  }

  /**单个查找 */
  public async getSingleNeeds(bidId:string,needId:string){
    let listItem:any = await this.bidorderModel.findById(bidId);
    if(listItem){
      const memberFieldSelect = "username bailNums avatar creditLevel active -_id"
      let memberUint = await this.memberService.findById(listItem.userId as string, memberFieldSelect);   
      let returnJson = {...listItem.toJSON(),memberinfo:memberUint,needId:needId}  
      return returnJson;
    }else{ return '';}    
  }

  /**详情页数据*/

  /**通过ID来查看*/
  public async getDataById(id:string){
     let doc = await  this.bidorderModel.findById(id);
     const memberFieldSelect = "username checkemail bailNums ctime logintime nickname uptime avatar creditLevel active -_id"     
     let documentUint = doc?.toJSON();
     //console.log("memberUint",documentUint,"memberUint")
     let memberUint = await this.memberService.findById(documentUint.userId as string, memberFieldSelect);
      (documentUint as any).memberinfo = memberUint;
    return documentUint;
  }
  /**出价管理列表 */
  public async getBidListByUserId(userId:string){
	//const memberFieldSelect = "username checkemail bailNums usdt ctime logintime nickname uptime avatar creditLevel active -_id"
	  
	//const meminfo = await this.memberService.findById(userId as string, memberFieldSelect);
    let doc = await this.bidorderModel.find({userId});
    return doc;
  }
  /**后台需要 -列表*/
  public async getAllLists(search: SearchDto, select?: any){
    const { skip, limit ,bidType} = search;
    const query = this.bidorderModel.find({bidType}).select(select);
    const documents = await query.skip(skip).limit(limit).exec();     
    const count = await this.bidorderModel.estimatedDocumentCount().exec();
    let returnjson = {
      "data":documents.map((document) => document?.toJSON()),
      "count":count
    } 
    return returnjson;
  }

  /**后台--根据Id 查找数据 */
  public async findBySingleId(bidId:string){
    return await this.bidorderModel.findById(bidId);
  }

  /**后台-更新数据 */
  public async updateDid(updateData:UpdateBidDto){
    const id = updateData.id;
    delete updateData.id;
    return await this.bidorderModel.findByIdAndUpdate(id,updateData,{new:true});
  }
}
