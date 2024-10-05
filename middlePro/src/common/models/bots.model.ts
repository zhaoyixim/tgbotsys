import {  ModelDefinition,  Prop,  raw,  Schema,  SchemaFactory,} from '@nestjs/mongoose';
import { Document } from 'mongoose';


export type BotsDocument = Bots & Document;

let timedata = new Date();
let localctime = timedata.toLocaleString();
@Schema({ versionKey: false })
export class Bots {
  @Prop({
    required: true,
  })
  userId: String;

  @Prop({
    required: true,
  })
  username: string;
  /**
   * 网络类型
   */
  @Prop({
    required:true,
    type:String,
    default:""
  })
  netType:string; 
 /**
   * 网络类型label
   */
  @Prop({
    required:true,
    type:String,
    default:""
  })
  netTypeLabel:string;  
  /**
   * 提现加减标识
   * 0--加--提现出来加记录 减资产
   * 1--减--取消归还资产 加资产 减记录
   */
  @Prop({
    required:false,
    type:Number,
    default:0
  })
  plus:number;


  /**
   * 创建时间
   */
  @Prop({
    required:false,
    type:String,
    default:localctime
  })
  ctime:string;

}
export const BotsSchema = SchemaFactory.createForClass(Bots);
export const Bots_MODEL_TOKEN = Bots.name;
export const WithdrawDefinition: ModelDefinition = {
  name: Bots_MODEL_TOKEN,
  schema: BotsSchema,
};