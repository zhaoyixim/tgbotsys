import { Test, TestingModule } from '@nestjs/testing';
import { TrademanagerController } from './trademanager.controller';
import { TrademanagerService } from './trademanager.service';

describe('TrademanagerController', () => {
  let controller: TrademanagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrademanagerController],
      providers: [TrademanagerService],
    }).compile();

    controller = module.get<TrademanagerController>(TrademanagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
