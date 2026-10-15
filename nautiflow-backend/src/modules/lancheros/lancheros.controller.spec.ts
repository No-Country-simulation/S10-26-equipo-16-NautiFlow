import { Test, TestingModule } from '@nestjs/testing';
import { LancherosController } from './lancheros.controller';
import { LancherosService } from './lancheros.service';

describe('LancherosController', () => {
  let controller: LancherosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LancherosController],
      providers: [LancherosService],
    }).compile();

    controller = module.get<LancherosController>(LancherosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
