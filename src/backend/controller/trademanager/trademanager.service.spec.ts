import { Test, TestingModule } from '@nestjs/testing';
import { TrademanagerService } from './trademanager.service';

describe('TrademanagerService', () => {
  let service: TrademanagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrademanagerService],
    }).compile();

    service = module.get<TrademanagerService>(TrademanagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
