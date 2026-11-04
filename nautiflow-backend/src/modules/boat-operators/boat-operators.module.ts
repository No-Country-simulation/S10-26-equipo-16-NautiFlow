import { Module } from '@nestjs/common';
import { BoatOperatorsService } from './boat-operators.service';
import { BoatOperatorsController } from './boat-operators.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoatOperator } from './entities/boat-operator.entity';
import { Boat } from './entities/boat.entity';
import { StorageModule } from '../storage/storage.module';
import { BoatsController } from './boats.controller';
import { BoatOperatorFilesController } from './boat-operator-files.controller';
import { BoatFilesService } from './boat-files.service';

@Module({
  imports: [TypeOrmModule.forFeature([BoatOperator, Boat]), StorageModule],
  controllers: [
    BoatOperatorsController,
    BoatsController,
    BoatOperatorFilesController,
  ],
  providers: [BoatOperatorsService, BoatFilesService],
})
export class BoatOperatorsModule {}
