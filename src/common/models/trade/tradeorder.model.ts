import {  ModelDefinition,  Prop,  raw,  Schema,  SchemaFactory,} from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TradeOrderDocument = TradeOrder & Document;

let  timedata = new Date();
let localctime = timedata.toLocaleString();

@Schema({ versionKey: false })
export class TradeOrder {
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
  /**买卖 1-买，2--卖 */
  @Prop({
    required: true,
    default:1
  })
  buymodel: number;
  
  /** 输入金额rmb*/
  @Prop({
    required: true,
    default:1
  })
  rmbNums: number;
 /** 输入额度 usdt*/
 @Prop({
  required: true,
  default:1
  })
  usdtNums: number;
/**状态标志 */
/**
 * 1--新创建
 * 2--未付款--商户出售(用户卖出)-商户上传收款码
 * 3--已付款--商户出售(用户卖出)-商户上传收款码之后-(用户付款)-用户上传付款截图之后的状态-商户未确定是否收到款项
 * 4--已付款--用户买入-(用户付款)--用户上传付款截图之后状态
 * 5--
 * 9--已付款--订单完成(3---操作订单完成否则系统后台操作或者自动操作, 3--操作U币入用户账户 )
 * 10-- 订单结束 --后台强制完成
 * 11-- 取消
 **/
 
  @Prop({required: false,default:1})
  staFlag: number;

  /**收款图 */
  @Prop({required: false,default:""})
  imageFiles:string ;

  /**付款截图 */
  @Prop({required: false,default:""})
  payImages:string ;

  /**驳回原因 */
  @Prop({required: false,default:""})
  reason:string ;
  
  
  @Prop({
    required:false,
    type:String,
    default:localctime,
  })
  ctime:string; 
}
export const TradeOrderSchema = SchemaFactory.createForClass(TradeOrder);
export const TradeOrder_MODEL_TOKEN = TradeOrder.name;
export const TradeOrderDefinition: ModelDefinition = {
  name: TradeOrder_MODEL_TOKEN,
  schema: TradeOrderSchema,
};