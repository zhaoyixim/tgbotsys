import {  ModelDefinition,  Prop,  raw,  Schema,  SchemaFactory,} from '@nestjs/mongoose';
import { Double } from 'mongodb';
import { Document } from 'mongoose';

export type BidorderDocument = Bidorder & Document;

let timedata = new Date();
let localctime = timedata.toLocaleString();

@Schema({ versionKey: false })
export class Bidorder {
  @Prop({required: true})
  userId: String;
  @Prop({required: true})
  username: String;

  /** 交易手续费 */
  @Prop({required: false,default:0})
  fee: number; 

  /**图片base64 */
  @Prop({required: false,default:""})
  imageFiles: string;  
  
  /** 1 -- 买入  2--售出 */
  @Prop({required: true,default:0})
  bidType: number;  
 /** 1 -- 动态价格  2--固定价格 */
  @Prop({required: true,default:0})
  bidPriceType: number;
  /** 交易单价 */
  @Prop({required: true,default:0})
  bidPrice: number;   
  /** 交易单价计算出来之后的价格 */
  @Prop({required: true,default:""})
  realPrice: string; 
  /** 单次售卖额度 */
  @Prop({required: true,default:0})
  sellCount: number;  
  /** 交易方式 */
  @Prop({required: true,default:""})
  bidMethod: string;  
  /** 交易方式-数字代号 */
  @Prop({required: true,default:0})
  bidMethodNum: number;
  /**交易限额-最大 */
  @Prop({required: true,default:0})
  bidRmbMax: number;
  /**交易限额-最小 */
  @Prop({required: true,default:0})
  bidRmbMin: number;
  /**交易限额-USDT最大 */
  @Prop({required: true,default:0})
  bidUsdtMax: number;
  /**交易限额-USDT最小 */
  @Prop({required: true,default:0})
  bidUsdtMin: number;
  /**交易时限-0表示无限 */
  @Prop({required: false,default:0})
  validPeriod: number;
   /**交易次数-0表示无限 */
  @Prop({required: false,default:0})
  bidTimes: number;
  /**要求保证金数量-保存的是序号 -后续需要从数据库取出来*/
  @Prop({required: false,default:0})
  askBailNums: number;
  /**订单开始作用日期 */
  @Prop({required: false,default:0})
  orderStartDate: string;
  /**订单开始作用时间 */
  @Prop({required: false,default:0})
  orderStartTime: string;
  /**订单结束作用日期 */
  @Prop({required: false,default:0})
  orderEndDate: string;
  /**订单结束作用时间 */
  @Prop({required: false,default:0})
  orderEndTime: string;
 /**订单标题 */
  @Prop({required: false,default:0})
  bidTitle: string;
  /**选择出价标题-Json 数据 */
  @Prop({required: false,default:0})
  bidPriceTitle: string;
   /**交易说明文字*/
  @Prop({required: false,default:0})
  bidDesp: string;
  /**是否过时订单 */
  @Prop({required:false,default:false})
  passedOrder:boolean;
  /**状态字段 1--正常-默认 2--删除  剩余的待定义*/
  @Prop({required:false,default:1})
  sta:number;
  /**收藏的数据*/
  @Prop({required:false,default:1})
  collect:number;

  /**交易的数据*/
  @Prop({required:false,default:1})
  tradeNums:number;
  
  /*总体每次消耗的总额度+*/
  @Prop({required:false,default:0})
  freezeU:number;
  
  /*需要冻结的总额度*/
  @Prop({required:false,default:0})
  freezeTotal:number;
  
  /**
   * 后台处理部分 
   * 
  */
  /**是否推送到首页-- 0 -未操作 1--同意 2 --拒绝 --后台操作*/
  @Prop({required:false,default:1})
  indexShow:number;
  /**是否申请推送到首页-- 后台操作-结果*/
  @Prop({required:false,default:false})
  recommentIndex:boolean;
  /**是否申请推送到首页时间-- 后台操作*/
  @Prop({required:false,default:""})
  recommentIndexTime:string; 
  /**拒绝申请推送到首页原因- 后台操作*/
  @Prop({required:false,default:""})
  disaggreeReason:string;
  /**排序 -- 后台操作 */
  @Prop({required:false,default:false})  
  sort:number;

  /**统计数据 */
  /**成交总额度 */
  @Prop({required:false,default:1})  
  totalUsdt:number;
 /**成交次数 */
  @Prop({required:false,default:1})  
  totalTimes:number;

  @Prop({required:false,default:localctime})
  ctime:string;  
  @Prop({required:false})
  uptime:string;
}
export const BidorderSchema = SchemaFactory.createForClass(Bidorder);
export const BIDORDER_MODEL_TOKEN = Bidorder.name;
export const BidorderDefinition: ModelDefinition = {
  name: BIDORDER_MODEL_TOKEN,
  schema: BidorderSchema,
};