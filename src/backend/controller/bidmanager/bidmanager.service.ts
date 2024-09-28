import { Injectable } from '@nestjs/common';
import { CreateBidmanagerDto } from './dto/create-bidmanager.dto';
import { UpdateBidmanagerDto } from './dto/update-bidmanager.dto';

@Injectable()
export class BidmanagerService {
  create(createBidmanagerDto: CreateBidmanagerDto) {
    return 'This action adds a new bidmanager';
  }

  findAll() {
    return `This action returns all bidmanager`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bidmanager`;
  }

  update(id: number, updateBidmanagerDto: UpdateBidmanagerDto) {
    return `This action updates a #${id} bidmanager`;
  }

  remove(id: number) {
    return `This action removes a #${id} bidmanager`;
  }
}
