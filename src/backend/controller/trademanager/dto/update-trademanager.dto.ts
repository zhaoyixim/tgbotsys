import { PartialType } from '@nestjs/mapped-types';
import { CreateTrademanagerDto } from './create-trademanager.dto';

export class UpdateTrademanagerDto extends PartialType(CreateTrademanagerDto) {}
