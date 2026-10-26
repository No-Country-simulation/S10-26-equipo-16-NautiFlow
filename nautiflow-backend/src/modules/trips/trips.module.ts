import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { Trip } from './entities/trip.entity';
import { Boat } from '../boat-operators/entities/boat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, Boat])],
  controllers: [TripsController],
  providers: [TripsService],
})
export class TripsModule {}
