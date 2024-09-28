import { Test, TestingModule } from '@nestjs/testing';
import { BidmanagerService } from './bidmanager.service';

describe('BidmanagerService', () => {
  let service: BidmanagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BidmanagerService],
    }).compile();

    service = module.get<BidmanagerService>(BidmanagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
