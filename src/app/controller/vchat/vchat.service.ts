import { Injectable } from '@nestjs/common';
import { CreateVchatDto,CreateVmessageDto } from './dto/create-vchat.dto';
import { UpdateVchatDto } from './dto/update-vchat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VchatDocument, Vchat_MODEL_TOKEN } from 'src/common/models/vchat.model';
import { VmessageDocument, Vmessage_MODEL_TOKEN } from 'src/common/models/vmessage.model';
import { SearchDto } from '../search/dto/create-search.dto';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class VchatService {
  constructor(
    @InjectModel(Vmessage_MODEL_TOKEN) private readonly vmessageModel:Model<VmessageDocument>,
    @InjectModel(Vchat_MODEL_TOKEN) private readonly vchatModel:Model<VchatDocument>,  
  ){}

  async createClientInstance (createVchatDto: CreateVchatDto){
    return await this.vchatModel.create(createVchatDto);
  }
  async findClientInstanceByUserId(userId:string){
    return  await this.vchatModel.findOne({userId});
  }
  async updateClientInstanceByUserId(userId:string,updateString:{}){
    return  (await this.vchatModel.findOneAndUpdate({userId})).toJSON();
  }
  async createVmessageInstance (createVmessageDto: CreateVmessageDto) {
    return await this.vmessageModel.create(createVmessageDto);
  }
  public async getMessageLists(queryData:any,search: SearchDto,page:number|0){
    const { skip, limit } = search;
    const {userId} = queryData;
    const count = await this.vmessageModel.estimatedDocumentCount().exec();
    const totalPage =Math.ceil(count/limit);
    let limitPage = totalPage - page
    if(totalPage - page<0){
      limitPage = 0
    }
   // console.log(skip,limit,"limitPage")

    //console.log(limitPage*limit,totalPage,skip,"limitPagelimitPage")
    const query = this.vmessageModel.find({$or:[{userId:userId},{touserId:userId}]});   
    const documents = await query.skip(limitPage*limit).limit(limit).exec();
    return {current:limitPage,documents};
  }
  /**后台需要 */

  public async getMessageBackendList(queryData:any,){
    const {userId} = queryData;  
    const query = this.vmessageModel.find({$or:[{userId:userId},{touserId:userId}]});   
    return await query.exec();;
  }


  public async findMessageById(messageId:string){
    return (await this.vmessageModel.findById(messageId)).toJSON();
  }

  public async getMessageGroupByTradeId(userId:string){
    return await this.vmessageModel.find({$or:[{userId:userId},{touserId:userId}]});   
  }
}
