import { Test, TestingModule } from '@nestjs/testing';
import { DepositLogService } from './deposit-log.service';

describe('DepositLogService', () => {
  let service: DepositLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DepositLogService],
    }).compile();

    service = module.get<DepositLogService>(DepositLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
