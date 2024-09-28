import { Injectable } from '@nestjs/common';
import { CreateTrademanagerDto } from './dto/create-trademanager.dto';
import { UpdateTrademanagerDto } from './dto/update-trademanager.dto';

@Injectable()
export class TrademanagerService {
  create(createTrademanagerDto: CreateTrademanagerDto) {
    return 'This action adds a new trademanager';
  }

  findAll() {
    return `This action returns all trademanager`;
  }

  findOne(id: number) {
    return `This action returns a #${id} trademanager`;
  }

  update(id: number, updateTrademanagerDto: UpdateTrademanagerDto) {
    return `This action updates a #${id} trademanager`;
  }

  remove(id: number) {
    return `This action removes a #${id} trademanager`;
  }
}
