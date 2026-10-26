import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Boat } from './entities/boat.entity';
import { BoatOperator } from './entities/boat-operator.entity';
import { BoatOperatorsService } from './boat-operators.service';

describe('BoatOperatorsService', () => {
  let service: BoatOperatorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoatOperatorsService,
        { provide: getRepositoryToken(BoatOperator), useValue: {} },
        { provide: getRepositoryToken(Boat), useValue: {} },
      ],
    }).compile();

    service = module.get<BoatOperatorsService>(BoatOperatorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
