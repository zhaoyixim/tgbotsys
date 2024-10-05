import { Injectable } from '@nestjs/common';
import { CreateTgbotDto } from './dto/create-tgbot.dto';
import { UpdateTgbotDto } from './dto/update-tgbot.dto';

@Injectable()
export class TgbotsService {
  create(createTgbotDto: CreateTgbotDto) {
    return 'This action adds a new tgbot';
  }

  findAll() {
    return `This action returns all tgbots`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tgbot`;
  }

  update(id: number, updateTgbotDto: UpdateTgbotDto) {
    return `This action updates a #${id} tgbot`;
  }

  remove(id: number) {
    return `This action removes a #${id} tgbot`;
  }
}
