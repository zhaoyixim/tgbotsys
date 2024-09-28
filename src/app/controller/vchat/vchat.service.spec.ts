import { Test, TestingModule } from '@nestjs/testing';
import { VchatService } from './vchat.service';

describe('VchatService', () => {
  let service: VchatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VchatService],
    }).compile();

    service = module.get<VchatService>(VchatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
