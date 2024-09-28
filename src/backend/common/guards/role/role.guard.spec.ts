import { AuthorizationService } from '../../modules/authorization';
import { RoleGuard } from './role.guard';
import { Test, TestingModule } from '@nestjs/testing';

describe('RoleGuard', () => {
  let service: AuthorizationService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthorizationService],
    }).compile();

    service = module.get<AuthorizationService>(AuthorizationService);
  });

  it('should be defined', () => {
    expect(new RoleGuard(service)).toBeDefined();
  });
});

