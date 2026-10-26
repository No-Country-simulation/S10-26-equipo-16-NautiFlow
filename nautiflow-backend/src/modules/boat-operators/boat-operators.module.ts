import { Module } from '@nestjs/common';
import { BoatOperatorsService } from './boat-operators.service';
import { BoatOperatorsController } from './boat-operators.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoatOperator } from './entities/boat-operator.entity';
import { Boat } from './entities/boat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoatOperator, Boat])],
  controllers: [BoatOperatorsController],
  providers: [BoatOperatorsService],
})
export class BoatOperatorsModule {}
