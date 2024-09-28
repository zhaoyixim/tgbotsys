import {  ModelDefinition,  Prop,  raw,  Schema,  SchemaFactory,} from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WebconfigDocument = Webconfig & Document;

let timedata = new Date();
let localctime = timedata.toLocaleString();
@Schema({ versionKey: false })
export class Webconfig {
    /**配置名称 */
  @Prop({
    required: true,
    type:String,
  })
  cname: String;

 /**配置key */
 @Prop({
    required: true,
    type:String,
  })
  ckey: String;

  /**配置value */
  @Prop({
    required: true,
    type:String,
  })
  cvalue: String;

  /**说明 */
  @Prop({
    required: false,
    type:String,
  })
  desp: String;
 /**是否启用 */
 @Prop({
    required: false,
    type:Boolean,
    default:true
  })
  cenable: boolean; 

 /**是否允许删除 */
  @Prop({
    required: false,
    type:Boolean,
    default:true
  })
  cdelete: boolean;   

  /**创建时间 */
  @Prop({
    required:false,
    type:String,
    default:localctime
  })
  ctime:string;
}
export const WebconfigSchema = SchemaFactory.createForClass(Webconfig);
export const Webconfig_MODEL_TOKEN = Webconfig.name;
export const WebconfigDefinition: ModelDefinition = {
  name: Webconfig_MODEL_TOKEN,
  schema: WebconfigSchema,
};