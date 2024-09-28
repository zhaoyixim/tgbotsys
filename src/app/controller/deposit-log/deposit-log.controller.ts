import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DepositLogService } from './deposit-log.service';
import { CreateDepositLogDto } from './dto/create-deposit-log.dto';
import { UpdateDepositLogDto } from './dto/update-deposit-log.dto';

@Controller('deposit-log')
export class DepositLogController {
  constructor(private readonly depositLogService: DepositLogService) {}

}
