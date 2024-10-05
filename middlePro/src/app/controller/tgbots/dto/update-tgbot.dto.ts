import { PartialType } from '@nestjs/mapped-types';
import { CreateTgbotDto } from './create-tgbot.dto';

export class UpdateTgbotDto extends PartialType(CreateTgbotDto) {}
