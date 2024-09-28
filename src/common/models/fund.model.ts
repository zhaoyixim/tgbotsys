import {  ModelDefinition,  Prop,  raw,  Schema,  SchemaFactory,} from '@nestjs/mongoose';
import { Document } from 'mongoose';
/** exchange--交换资产文档 */
/** fund--正在进行的资产操作 */
/** deposit-- 充值资产文档 */
/** withdraw-- 提现资产文档 */
export type FundDocument = Fund & Document;

let timedata = new Date();
let localctime = timedata.toLocaleString();
@Schema({ versionKey: false })
export class Fund {
  /**用户id */
  @Prop({
    required: true,
  })
  userId: String;  
  /**用户名 */
  @Prop({
    required: true,
  })
  username: string;
  /**
   * 网络类型
   * 1--trc20
   * 2--erc20
   */
  @Prop({
    required:true,
    type:String,
    default:""
  })
  netType:string;  
   /**
   * 网络类型
   * 1--trc20
   * 2--erc20
   */
   @Prop({
    required:true,
    type:String,
    default:""
  })
  netTypeLabel:string;  
  /**
   * 充值或者提现数量或者冻结或者解冻数量
   */
  @Prop({
    required:true,
    type:Number,
    default:0
  })
  nums:number;  
  /**
   *地址
   */
  @Prop({
    required:false,
    type:String,
    default:""
  })
  address:string;
  /**是否正在使用 
   * 0--
   * 1--正在使用-提交中
   * 2--计时中
   * 3--付款完成
   * 4--计时完未付款--关闭订单
   * 5--提现中
   * 6--提现完成
   * 7--提现失败
   * 7--冻结状态
   * 8--解冻状态
   * 9--提现取消
   * 10--交换取消
  */
  @Prop({
    required:false,
    type:Number,
    default:1
  })
  paying: number;

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

  /**说明 -比如提现失败说明 */
  @Prop({
    required:false,
    type:String,
    default:""
  })
  desp: string;
  /**
   * 创建时间
   */
  @Prop({
    required:false,
    type:String,
    default:localctime
  })
  ctime:string;  
  /**
   * 订单类型:
   * 0--充值订单
   * 1--提现订单
   * 2--交换订单
   */
  @Prop({
    required:false,
    default:0
  })
  paytype:number;
}
export const FundSchema = SchemaFactory.createForClass(Fund);
export const Fund_MODEL_TOKEN = Fund.name;
export const FundDefinition: ModelDefinition = {
  name: Fund_MODEL_TOKEN,
  schema: FundSchema,
};