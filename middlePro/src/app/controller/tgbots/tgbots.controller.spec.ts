import { Test, TestingModule } from '@nestjs/testing';
import { TgbotsController } from './tgbots.controller';
import { TgbotsService } from './tgbots.service';

describe('TgbotsController', () => {
  let controller: TgbotsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TgbotsController],
      providers: [TgbotsService],
    }).compile();

    controller = module.get<TgbotsController>(TgbotsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
