import { Injectable } from '@nestjs/common';
import { CreateDepositLogDto } from './dto/create-deposit-log.dto';
import { UpdateDepositLogDto } from './dto/update-deposit-log.dto';
import { DepositlogDocument, Depositlog_MODEL_TOKEN } from 'src/common/models/depositlog.model';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DepositLogService {
  constructor(
    @InjectModel(Depositlog_MODEL_TOKEN) private readonly depositlogModel:Model<DepositlogDocument>,
    ){}
  public async createLogData(createDepositLogDto: CreateDepositLogDto) {
    return await this.depositlogModel.create(createDepositLogDto);
  }

}
