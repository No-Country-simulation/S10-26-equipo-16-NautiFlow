import { Module } from '@nestjs/common';
import { LancherosService } from './lancheros.service';
import { LancherosController } from './lancheros.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lanchero } from './entities/lanchero.entity';
import { Boat } from './entities/boat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lanchero, Boat])],
  controllers: [LancherosController],
  providers: [LancherosService],
})
export class LancherosModule {}
