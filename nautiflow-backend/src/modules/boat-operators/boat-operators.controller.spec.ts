import { Test, TestingModule } from '@nestjs/testing';
import { BoatOperatorsController } from './boat-operators.controller';
import { BoatOperatorsService } from './boat-operators.service';

describe('BoatOperatorsController', () => {
  let controller: BoatOperatorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoatOperatorsController],
      providers: [{ provide: BoatOperatorsService, useValue: {} }],
    }).compile();

    controller = module.get<BoatOperatorsController>(BoatOperatorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
