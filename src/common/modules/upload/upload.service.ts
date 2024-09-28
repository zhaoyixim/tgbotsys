import { Injectable } from '@nestjs/common';
import { UploadimageDocument, Uploadimage_MODEL_TOKEN } from 'src/common/models/uploadimage.model';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateUploadDto } from './dto/create-upload.dto';

@Injectable()
export class UploadService {
    constructor(
        @InjectModel(Uploadimage_MODEL_TOKEN) private readonly uploadimgModel: Model<UploadimageDocument>
    ) {}
   
    public async createUpload(params:CreateUploadDto) {
        return await this.uploadimgModel.create(params);
    }

    public async deleteUpload(id:string){
        return await this.uploadimgModel.findByIdAndDelete(id);
    }

    public async getStsImages(ctype:number,ctype2:number){
        return await this.uploadimgModel.find({ctype,ctype2}).exec();
    }
    /**获得轮播图 */
    public async getTurnImgs(){
        return await this.uploadimgModel.find({ctype:1}).exec()
    }
    /**获得系统收款码 */
    public async getReceiveQrcode(){
        return await this.uploadimgModel.findOne({ctype:2}).sort({ctime:-1}).exec()
    }

    /**客服 */
    public async updateKefu(data:any){
        return await this.uploadimgModel.findByIdAndUpdate(data.uploadId,{account: data.account})
    }

    /**前台获取客服数据 */
    public async frontGetKefu(){
        return await this.uploadimgModel.find({
            ctype:3
        }).exec()
    }
}
