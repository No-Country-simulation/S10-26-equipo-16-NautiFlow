import { Test, TestingModule } from '@nestjs/testing';
import { LancherosService } from './lancheros.service';

describe('LancherosService', () => {
  let service: LancherosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LancherosService],
    }).compile();

    service = module.get<LancherosService>(LancherosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
