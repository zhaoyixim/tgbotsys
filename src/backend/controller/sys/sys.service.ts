import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { WebconfigDocument, Webconfig_MODEL_TOKEN } from 'src/common/models/webconfig.model';
import { SearchDto } from '../user/dto/search.dto';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
@Injectable()
export class SysService {
  constructor(
    @InjectModel(Webconfig_MODEL_TOKEN) private readonly webconfigModel: Model<WebconfigDocument>,
    ) {}  

  public async clearData(){
    return await this.webconfigModel.deleteMany({})
  }

  /**初始化的时候批量插入 */

  public async initManyInsert(datas:any){
    return await this.webconfigModel.insertMany(datas);
  }
  /**提取所有配置选项 */

  /*列表查找 */
  public async getAllconfig(search: SearchDto, select?: any) { 
    const { skip, limit } = search;
    const query = this.webconfigModel.find().select(select);
    const documents = await query.skip(skip).limit(limit).exec();     
    const count = await this.webconfigModel.estimatedDocumentCount().exec();
    let returnjson = {
      "data":documents.map((document) => document?.toJSON()),
      "count":count
    } 
    return returnjson;
  }

    /**添加配置项 */
  async createConfig(createDtodata: CreateConfigDto){
    return await this.webconfigModel.create(createDtodata);
  }

    /**更新配置项 */
  async updateConfig(updateDtodata: UpdateConfigDto){
    return await this.webconfigModel.findByIdAndUpdate(updateDtodata.id,{cenable:updateDtodata.cenable},{new:true});
  }
    /**更新值 */
  async updateValueConfig(updateDtodata: any){
    return await this.webconfigModel.findByIdAndUpdate(updateDtodata.configId,{cvalue:updateDtodata.cvalue,desp:updateDtodata.cvalue},{new:true});
  }

  /**删除配置项 */
  async deleteConfig(updateDtodata: UpdateConfigDto){
    return await this.webconfigModel.findByIdAndDelete(updateDtodata.id);
  }
  /**按照key 提取value */

  public async getConfig(key:string){
     const returnjson = await this._findByKey({ckey:key});
     return returnjson.cvalue;
  }
  public async _findByKey(filter: FilterQuery<WebconfigDocument>, select?: any) {
    const query = this.webconfigModel.findOne(filter).select(select);
    const document = await query.exec();
    return document?.toJSON();
  }
}