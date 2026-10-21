import { Module } from '@nestjs/common';
import { EmptyLegsService } from './empty-legs.service';
import { EmptyLegsController } from './empty-legs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmptyLeg } from './entities/empty-leg.entity';
import { Boat } from '../lancheros/entities/boat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmptyLeg, Boat])],
  controllers: [EmptyLegsController],
  providers: [EmptyLegsService],
})
export class EmptyLegsModule {}
