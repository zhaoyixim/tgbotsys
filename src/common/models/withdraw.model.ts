import {  ModelDefinition,  Prop,  raw,  Schema,  SchemaFactory,} from '@nestjs/mongoose';
import { Document } from 'mongoose';
/** exchange--交换资产文档 */
/** Withdraw--正在进行的资产操作 */
/** deposit-- 充值资产文档 */
/** withdraw-- 提现资产文档 */
export type WithdrawDocument = Withdraw & Document;

let timedata = new Date();
let localctime = timedata.toLocaleString();
@Schema({ versionKey: false })
export class Withdraw {
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
   * 提现数量
   */
  @Prop({
    required:true,
    type:Number,
    default:0
  })
  nums:number;
  
  /**
   * 提现地址
   */
  @Prop({
    required:true,
    type:String,
    default:""
  })
  address:string;
  
  /**
   * 网络验证
   * 0--未验证--等等验证-正在验证
   * 1--验证成功--提现成功
   * 2--验证失败--提现失败
   */
  @Prop({
    required:false,
    type:Number,
    default:0
  })
  netverify:number;
  
  /** 说明--比如验证失败原因 */
  @Prop({
    required:false,
    type:String,
    default:""
  })
  desp:string;


  /**剩余可使用数量 */
  @Prop({
    required:false
  })
  restNums:string;
 
  /**orderId 提现ORderId */
  @Prop({
    required:false
  })
  orderId:string;

  /**剩余总数量 */
  @Prop({
    required:false
  })
  restAllNums:string;

  
   /**
   * 最新更新时间
   */
   @Prop({
    required:false,
    type:String,
    default:""
  })
  uptime:string;

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
export const WithdrawSchema = SchemaFactory.createForClass(Withdraw);
export const Withdraw_MODEL_TOKEN = Withdraw.name;
export const WithdrawDefinition: ModelDefinition = {
  name: Withdraw_MODEL_TOKEN,
  schema: WithdrawSchema,
};