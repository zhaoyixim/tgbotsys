import {  ModelDefinition,  Prop,  raw,  Schema,  SchemaFactory,} from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UfreezeNumDocument = UfreezeNum & Document;

let  timedata = new Date();
let localctime = timedata.toLocaleString();

@Schema({ versionKey: false })
export class UfreezeNum {
  @Prop({
    required: true,
  })
  userId: String;
  @Prop({
    required: true,
  })
  username: string;
  @Prop({
    required: false,
    default:""
  })
  touserId: string;  
  /**bid id */
  @Prop({
    required: true,
  })
  fromBidId: string;
 /** 输入额度 usdt*/
 @Prop({
  required: true,
  default:0
  })
  freezeU: number;
  @Prop({
    required:false,
    type:String,
    default:localctime,
  })
  ctime:string; 
}
export const UfreezeNumSchema = SchemaFactory.createForClass(UfreezeNum);
export const UfreezeNum_MODEL_TOKEN = UfreezeNum.name;
export const UfreezeNumDefinition: ModelDefinition = {
  name: UfreezeNum_MODEL_TOKEN,
  schema: UfreezeNumSchema,
};