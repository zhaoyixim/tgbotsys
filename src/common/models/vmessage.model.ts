import {  ModelDefinition,  Prop,  raw,  Schema,  SchemaFactory,} from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VmessageDocument = Vmessage & Document;

let timedata = new Date();
let localctime = timedata.toLocaleString();
@Schema({ versionKey: false })
export class Vmessage {
  @Prop({
    required: true,
  })
  username: string;

  @Prop({
    required: true,
  })
  userId: string;

  @Prop({
    required: true,
  })
  touserId: string;

  @Prop({
    required: false,
  })
  fromBidId: string;

  @Prop({
    required: false,
  })
  fromTradeId: string;

  @Prop({
    required: false,
  })
  content: string;

  /**单独存储数据-上面的字段是组合存储的 */
  @Prop({
    required: false,
  })
  contentBody: string;

  /**类型 1 == 文本 2 == 图片 3==视频 */
  @Prop({
    required: false,
    default:1
  })
  ctype: number;

  /**1--未读 */
  @Prop({
    required: false,
    default:1
  })
  isRead: number;

  /**创建时间 */
  @Prop({
    required:false,
    type:String,
    default:localctime
  })
  ctime:string;  
  
}
export const VmessageSchema = SchemaFactory.createForClass(Vmessage);
export const Vmessage_MODEL_TOKEN = Vmessage.name;
export const VmessageDefinition: ModelDefinition = {
  name: Vmessage_MODEL_TOKEN,
  schema: VmessageSchema,
};