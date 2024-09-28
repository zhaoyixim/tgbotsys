import {  ModelDefinition,  Prop,  raw,  Schema,  SchemaFactory,} from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

let  timedata = new Date();
let localctime = timedata.toLocaleString();
/*默认为30分钟 */
let plusTime = timedata.getTime() + 1000*60*30;
let plusTimedata = new Date(plusTime)
let plusTimedataString = plusTimedata.toLocaleString()
@Schema({ versionKey: false })
export class Order {
  @Prop({
    required: true,
  })
  userId: String;
  @Prop({
    required: true,
  })
  username: string;
  /**充值Id */
  @Prop({
    required: false,
  })
  depositId: string;
  
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
   * 价值数量
   */
  @Prop({
    required:true,
    type:Number,
    default:0
  })
  nums:number;  
  
  /**
   * 地址数量
   */
  @Prop({
    required:false,
    type:String,
    default:""
  })
  address:string;

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

  
 /**订单抬头信息 */
  @Prop({
    required:true,
    type:String,
    default:""
  })
  orderTitle:string;   
  /**
   * 订单状态
   * 1--支付成功
   * 2--转账验证
   * 3--等待支付
   * 4--验证超时
   * 5--订单取消
   * 11--提现中
   * 12--提现成功
   * 13--提现失败
   * 21--兑换中
   * 22--兑换成功
   * 23--兑换失败
   * 24--兑换取消  
   */
  @Prop({
    required:true,
    type:Number,
    default:""
  })
  orderSts:number; 
  /**提现Id */
  @Prop({
    required:false,
    type:String,
    default:""
  })
  withdrawId:string; 

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

  @Prop({
    required:false,
    type:String,
    default:localctime,
  })
  ctime:string;
  

  /**expiretime 过期时间--由配置项决定 */
  @Prop({
    required:false,
    type:String,
    default:plusTimedataString,
  })
  expireTime:string;


  @Prop({
    required:false
  })
  uptime:string;

}
export const OrderSchema = SchemaFactory.createForClass(Order);
export const Order_MODEL_TOKEN = Order.name;
export const OrderDefinition: ModelDefinition = {
  name: Order_MODEL_TOKEN,
  schema: OrderSchema,
};