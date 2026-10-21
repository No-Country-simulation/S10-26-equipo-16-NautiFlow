import { Test, TestingModule } from '@nestjs/testing';
import { EmptyLegsService } from './empty-legs.service';

describe('EmptyLegsService', () => {
  let service: EmptyLegsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmptyLegsService],
    }).compile();

    service = module.get<EmptyLegsService>(EmptyLegsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
