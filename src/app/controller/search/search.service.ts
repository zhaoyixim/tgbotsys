import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { OrderDocument, Order_MODEL_TOKEN } from 'src/common/models/order.model';
import { SearchDto } from './dto/create-search.dto';


@Injectable()
export class SearchService {
  constructor(@InjectModel(Order_MODEL_TOKEN) private readonly orderModel:Model<OrderDocument>) {}

  /**查询订单信息--分页 */

  /*列表查找 */
  public async findOrders(filter: FilterQuery<OrderDocument>,search: SearchDto,select?: any) { 
    const { skip, limit } = search;
    const query = this.orderModel.find(filter).select(select);
    const documents = await query.skip(skip).limit(limit).exec();    
    //const count = await this.orderModel.estimatedDocumentCount().exec();
    let returnjson = {
      "data":documents.map((document) => document?.toJSON()),
      "count":1
    }
    returnjson.count = returnjson.data.length  
    return returnjson;
  }
}