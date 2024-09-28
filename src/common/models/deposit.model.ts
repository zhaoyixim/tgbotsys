import {  ModelDefinition,  Prop,  raw,  Schema,  SchemaFactory,} from '@nestjs/mongoose';
import { Document } from 'mongoose';
/** exchange--交换资产文档 */
/** fund--正在进行的资产操作 */
/** deposit-- 充值资产文档 */
/** withdraw-- 提现资产文档 */
export type DepositDocument = Deposit & Document;

/**
 * 只保存充值成功的数据
 */
let timedata = new Date();
let localctime = timedata.toLocaleString();
@Schema({ versionKey: false })
export class Deposit {
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
   * 1--trc20
   * 2--erc20
   */
  @Prop({
    required:true,
    type:Number,
    default:""
  })
  netType:number;  
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
  /**虚拟币symbol */
  @Prop({
    required:false,
    type:String,
    default:""
  })
  symbol:string;   
  
  /**
   * 充值数量
   */
  @Prop({
    required:true,
    type:Number,
    default:0
  })
  nums:number;  
  /**
   * 网络验证
   * 0--未验证--等等验证-正在验证
   * 1--验证成功--充值成功
   * 2--验证失败--充值失败
   */
  @Prop({
    required:false,
    type:Number,
    default:0
  })
  netverify:number;  
  /**
     * 付款钱包地址
     */
  @Prop({
    required:false,
    type:String,
    default:""
  })
  walletAddress:string;
  /**
   * 付款HASH值
   */
  @Prop({
    required:false,
    type:String,
    default:""
  })
  payHash:string;

  /**check 字段 */
  /**接口处获得-付款钱包地址 */
  @Prop({
    required:false,
    type:String,
    default:""
  })
  payedWalletAddress:string;
 /**接口处获得-用户付款到的地址 */
  @Prop({
    required:false,
    type:String,
    default:""
  })
  payedToAddress:string;

  /**接口处获得-付款额度 */
  @Prop({
    required:false,
    type:Number,
    default:0
  })
  payedAmount:number;
  /** 说明--比如验证失败原因 */
  @Prop({
    required:false,
    type:String,
    default:"请输入失败原因"
  })
  desp:string;
  /**冻结状态 
   * 
   * 0--未冻结
   * 1--充值冻结
   * 2--充值解冻--等待验证
   * 3--提现冻结
   * 4--提现解冻
   * 5--交换冻结
   * 6--交换解冻
  */
  @Prop({
    required:false,
    type:String,
    default:"0"
  })
  freezeSts:string;
  /** 冻结数量 */  
  @Prop({
    required:false,
    type:String,
    default:"0"
  })
  freezeNums:string;  
  /**剩余可使用数量 */
  @Prop({
    required:false,
    type:String,
    default:"0"
  })
  restNums:string;
  /**剩余总数量 */
  @Prop({
    required:false,
    type:String,
    default:"0"
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
export const DepositSchema = SchemaFactory.createForClass(Deposit);
export const Deposit_MODEL_TOKEN = Deposit.name;
export const DepositDefinition: ModelDefinition = {
  name: Deposit_MODEL_TOKEN,
  schema: DepositSchema,
};