import { Test, TestingModule } from '@nestjs/testing';
import { VchatGateway } from './vchat.gateway';
import { VchatService } from './vchat.service';

describe('VchatGateway', () => {
  let gateway: VchatGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VchatGateway, VchatService],
    }).compile();

    gateway = module.get<VchatGateway>(VchatGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
