import { PartialType } from '@nestjs/mapped-types';
import { CreateDepositLogDto } from './create-deposit-log.dto';

export class UpdateDepositLogDto extends PartialType(CreateDepositLogDto) {}
