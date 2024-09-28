import {  ModelDefinition,  Prop,  raw,  Schema,  SchemaFactory,} from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UploadimageDocument = Uploadimage & Document;

let timedata = new Date();
let localctime = timedata.toLocaleString();
@Schema({ versionKey: false })
export class Uploadimage {
  /**
   * 图片:路径数据
   * 
   */
  @Prop({
    required: true,
    type:String,
    default:""
  })
  photo: String;
  /**类型
   * 1--轮播图
   * 2--收款码
   * 3--客服
   */
  @Prop({
    required: false,
    type:Number,
    default:1
  })
  ctype: number; 

   /**类型
   * 0--微信
   * 1--QQ
   * 2--telegram
   * 3--whatsapp
   * 4--Lines
   * 5--discord
   */

  @Prop({
    required: false,
    type:Number,
    default:0
  })
  ctype2: number; 
  @Prop({
    required: false,
    type:String,
    default:""
  })
  ctype2Lable: string;
  
  @Prop({
    required: false,
    type:String,
    default:""
  })
  account: string;
  
  @Prop({
    required: false,
    type:String,
  })
  desp: String;

 /**
  * 状态:
  * 0--删除
  * 1--正常
  *  
  */
 @Prop({
    required: false,
    type:Number,
    default:1
  })
  sts: number;  

  /**创建时间 */
  @Prop({
    required:false,
    type:String,
    default:localctime
  })
  ctime:string;
}
export const UploadimageSchema = SchemaFactory.createForClass(Uploadimage);
export const Uploadimage_MODEL_TOKEN = Uploadimage.name;
export const UploadimageDefinition: ModelDefinition = {
  name: Uploadimage_MODEL_TOKEN,
  schema: UploadimageSchema,
};