import {  ModelDefinition,  Prop,  raw,  Schema,  SchemaFactory,} from '@nestjs/mongoose';
import { Document } from 'mongoose';
/** Depositlog--资产超过文档 */
export type DepositlogDocument = Depositlog & Document;
let timedata = new Date();
let localctime = timedata.toLocaleString();
@Schema({ versionKey: false })
export class Depositlog {
  /**用户id */
  @Prop({
    required: true,
  })
  userId: string;  

  /**用户id */
  @Prop({
    required: false,
    default:""
  })
  touserId: string; 
  /**用户名 */
  @Prop({
    required: true,
  })
  username: string; 

  /**来源Id值 */
  @Prop({
    required: true,
  })
  fromId: string; 
  /**来源Key */
  @Prop({
    required: true,
  })
  fromKey: string;
  @Prop({
    required: false,
    default:1
  })
  buymodel: number;  
  /**来源KValue */
  @Prop({
    required: true,
  })
  fromValue: string;
  /**来源Desp */
  @Prop({
    required: false,
  })
  fromDesp: string;
  /* 创建时间*/
  @Prop({
    required:false,
    type:String,
    default:localctime
  })
  ctime:string;
}
export const DepositlogSchema = SchemaFactory.createForClass(Depositlog);
export const Depositlog_MODEL_TOKEN = Depositlog.name;
export const DepositlogDefinition: ModelDefinition = {
  name: Depositlog_MODEL_TOKEN,
  schema: DepositlogSchema,
};