import {  ModelDefinition,  Prop,  raw,  Schema,  SchemaFactory,} from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IpDocument = Ip & Document;

let timedata = new Date();
let localctime = timedata.toLocaleString();
@Schema({ versionKey: false })
export class Ip {
  @Prop({
    required: true,
  })
  ip: String;

  /**创建时间 */
  @Prop({
    required:false,
    type:String,
    default:localctime
  })
  ctime:string;
  
  
  /**最新触发时间 --禁止后最新触发时间*/
  @Prop({
    required:false,
    type:String,
    default:localctime
  })
  uptime:string;

  
  
  /**触发次数 */
  @Prop({
    required:false,
    type:String,
    default:"0"
  })
  emittimes:string;
  
  /**触发账号Id-可能不止一个，用英文逗号隔开 */
  @Prop({
    required:false,
    type:String,
    default:""
  })
  emituserId:string;

  /**封锁状态 */
  @Prop({
    required:false,
    type:Boolean,
    default:true
  })
  blockSts:Boolean;
  
  /**解封时间 */
  @Prop({
    required:false,
    type:String,
    default:""
  })
  unblockTime:string;


}
export const IpSchema = SchemaFactory.createForClass(Ip);
export const Ip_MODEL_TOKEN = Ip.name;
export const IpDefinition: ModelDefinition = {
  name: Ip_MODEL_TOKEN,
  schema: IpSchema,
};