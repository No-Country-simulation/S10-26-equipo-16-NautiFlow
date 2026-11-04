import { Test, TestingModule } from '@nestjs/testing';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { ConfigService } from '@nestjs/config';

describe('StorageController', () => {
  let controller: StorageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StorageController],
      providers: [
        StorageService,
        { provide: ConfigService, useValue: { get: () => undefined } },
      ],
    }).compile();

    controller = module.get<StorageController>(StorageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
