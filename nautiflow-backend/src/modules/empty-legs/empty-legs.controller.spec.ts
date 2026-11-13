import { Test, TestingModule } from '@nestjs/testing';
import { EmptyLegsController } from './empty-legs.controller';
import { EmptyLegsService } from './empty-legs.service';

describe('EmptyLegsController', () => {
  let controller: EmptyLegsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmptyLegsController],
      providers: [EmptyLegsService],
    }).compile();

    controller = module.get<EmptyLegsController>(EmptyLegsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
