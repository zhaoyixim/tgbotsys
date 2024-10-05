import { Test, TestingModule } from '@nestjs/testing';
import { TgbotsService } from './tgbots.service';

describe('TgbotsService', () => {
  let service: TgbotsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TgbotsService],
    }).compile();

    service = module.get<TgbotsService>(TgbotsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
