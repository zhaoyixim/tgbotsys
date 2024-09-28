import { Test, TestingModule } from '@nestjs/testing';
import { DepositLogController } from './deposit-log.controller';
import { DepositLogService } from './deposit-log.service';

describe('DepositLogController', () => {
  let controller: DepositLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepositLogController],
      providers: [DepositLogService],
    }).compile();

    controller = module.get<DepositLogController>(DepositLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
