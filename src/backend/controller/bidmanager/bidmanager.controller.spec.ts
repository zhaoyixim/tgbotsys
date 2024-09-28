import { Test, TestingModule } from '@nestjs/testing';
import { BidmanagerController } from './bidmanager.controller';
import { BidmanagerService } from './bidmanager.service';

describe('BidmanagerController', () => {
  let controller: BidmanagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BidmanagerController],
      providers: [BidmanagerService],
    }).compile();

    controller = module.get<BidmanagerController>(BidmanagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
