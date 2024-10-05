import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TgbotsService } from './tgbots.service';
import { CreateTgbotDto } from './dto/create-tgbot.dto';
import { UpdateTgbotDto } from './dto/update-tgbot.dto';

@Controller('tgbots')
export class TgbotsController {
  constructor(private readonly tgbotsService: TgbotsService) {}

  @Post()
  create(@Body() createTgbotDto: CreateTgbotDto) {
    return this.tgbotsService.create(createTgbotDto);
  }

  @Get()
  findAll() {
    return this.tgbotsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tgbotsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTgbotDto: UpdateTgbotDto) {
    return this.tgbotsService.update(+id, updateTgbotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tgbotsService.remove(+id);
  }
}
